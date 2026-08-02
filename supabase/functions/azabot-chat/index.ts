import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const FOUNDRY_API_KEY = Deno.env.get('FOUNDRY_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

const FOUNDRY_ENDPOINT = 'https://az-ai-resource.services.ai.azure.com/api/projects/az-ai-gateway'
const AGENT_NAME = 'az-agent-auth'
const AGENT_VERSION = '2'

const MAX_MESSAGES = 40
const MAX_CONTENT_LEN = 4000

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function extractText(data: any): string {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) return data.output_text
  const parts: string[] = []
  for (const item of data?.output ?? []) {
    for (const c of item?.content ?? []) {
      if (typeof c?.text === 'string') parts.push(c.text)
      else if (typeof c?.text?.value === 'string') parts.push(c.text.value)
    }
  }
  if (parts.length) return parts.join('\n')
  return data?.choices?.[0]?.message?.content ?? ''
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (!FOUNDRY_API_KEY) {
    console.error('FOUNDRY_API_KEY not configured')
    return json({ error: 'Service unavailable' }, 500)
  }

  // Require authenticated caller
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  })
  const token = authHeader.replace('Bearer ', '')
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData?.user) return json({ error: 'Unauthorized' }, 401)

  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return json({ error: 'messages array required' }, 400)
    }
    if (messages.length > MAX_MESSAGES) {
      return json({ error: `too many messages (max ${MAX_MESSAGES})` }, 400)
    }
    for (const m of messages) {
      if (!m || typeof m.role !== 'string' || typeof m.content !== 'string') {
        return json({ error: 'invalid message shape' }, 400)
      }
      if (!['user', 'assistant', 'system'].includes(m.role)) {
        return json({ error: 'invalid role' }, 400)
      }
      if (m.content.length > MAX_CONTENT_LEN) {
        return json({ error: `message too long (max ${MAX_CONTENT_LEN})` }, 400)
      }
    }

    const input = messages.map((m: { role: string; content: string }) => ({
      type: 'message',
      role: m.role === 'system' ? 'user' : m.role,
      content: m.content,
    }))

    const res = await fetch(`${FOUNDRY_ENDPOINT}/openai/v1/responses`, {
      method: 'POST',
      headers: {
        'api-key': FOUNDRY_API_KEY,
        'Authorization': `Bearer ${FOUNDRY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent: { name: AGENT_NAME, version: AGENT_VERSION, type: 'agent_reference' },
        input,
        store: false,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`Foundry agent error [${res.status}]: ${errorText}`)
      return json({ error: 'Agent service error' }, 502)
    }

    const data = await res.json()
    const reply = extractText(data) || 'عذراً، لم أتمكن من المعالجة.'

    return json({ reply, agent: AGENT_NAME })
  } catch (error) {
    console.error('AzaBot agent error:', error)
    return json({ error: 'An internal error occurred' }, 500)
  }
})
