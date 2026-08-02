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

const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const REDIRECT_TO = 'https://auth.alazab.com/auth/verify'

// Simple in-memory throttle (per isolate) to limit code-sending abuse
const otpThrottle = new Map<string, number>()
const OTP_COOLDOWN_MS = 60_000

const TOOL_SYSTEM_PROMPT = `أنت وكيل مصادقة العزب (az-agent-auth).
لديك أداة واحدة: إرسال رمز تحقق (OTP) إلى بريد المستخدم.
عندما يطلب المستخدم رمز دخول/تحقق أو تسجيل الدخول:
1) اطلب بريده الإلكتروني إن لم يذكره.
2) عند توفر البريد، أخرج سطرًا وحيدًا بهذا الشكل بالضبط دون أي نص آخر:
<<SEND_OTP:{"email":"user@example.com"}>>
لا تخترع رمزًا أبدًا ولا تدّعِ معرفته؛ الرمز يصل إلى البريد فقط.`

function isEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254
}

async function sendOtp(email: string, lang: 'ar' | 'en') {
  const now = Date.now()
  const last = otpThrottle.get(email) ?? 0
  if (now - last < OTP_COOLDOWN_MS) {
    return lang === 'ar'
      ? '⏳ تم إرسال رمز لهذا البريد قبل قليل. انتظر دقيقة ثم أعد المحاولة.'
      : '⏳ A code was just sent to this address. Please wait a minute and try again.'
  }
  otpThrottle.set(email, now)

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const { error } = await admin.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo: REDIRECT_TO },
  })
  if (error) {
    console.error('sendOtp error:', error.message)
    return lang === 'ar'
      ? '⚠️ تعذّر إرسال الرمز الآن. تأكد من صحة البريد وحاول لاحقًا.'
      : '⚠️ Could not send the code right now. Check the email and try later.'
  }
  return lang === 'ar'
    ? `✅ أرسلت رمز تحقق مكوّن من 6 أرقام إلى **${email}**.\n\nافتح بريدك وأدخل الرمز في صفحة التحقق — صلاحيته 60 دقيقة.\n\n🔐 لأسباب أمنية لا يمكن عرض الرمز هنا في الدردشة، يصل إلى بريدك فقط.`
    : `✅ I've sent a 6-digit verification code to **${email}**.\n\nOpen your inbox and enter it on the verification page — valid for 60 minutes.\n\n🔐 For security the code is never shown in chat; it only goes to your inbox.`
}


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

  // Public chatbot: authentication is optional. If a real user token is sent,
  // we resolve the user for logging; anonymous visitors are allowed.
  const authHeader = req.headers.get('Authorization')
  let userId: string | null = null
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      const token = authHeader.replace('Bearer ', '')
      const { data: userData } = await supabase.auth.getUser(token)
      userId = userData?.user?.id ?? null
    } catch {
      userId = null
    }
  }
  console.log('azabot-chat caller:', userId ?? 'anonymous')


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
        agent_reference: { type: 'agent_reference', name: AGENT_NAME, version: AGENT_VERSION },
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
