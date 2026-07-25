import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Webhook, Plus, Copy, Trash2, RefreshCw, Check, Link2, Key, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Endpoint {
  id: string;
  url: string;
  events: string[] | null;
  is_active: boolean | null;
  created_at: string | null;
  project_id: string;
}

const EVENT_TYPES = [
  "auth.user.created",
  "auth.user.login",
  "auth.user.logout",
  "otp.sent",
  "otp.verified",
  "maintenance.created",
  "quotation.created",
  "conversation.started",
];

const SUPABASE_URL = "https://bxuhcbfdoaflsgbxiqei.supabase.co";
const EDGE_HOOKS = [
  { name: "AzaBot Chat", path: "azabot-chat", desc: "استقبال رسائل الشات بوت" },
  { name: "ElevenLabs Token", path: "elevenlabs-token", desc: "توليد توكن ElevenLabs" },
  { name: "ElevenLabs TTS", path: "elevenlabs-tts", desc: "تحويل النص إلى صوت" },
];

const genSecret = () => {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return "whsec_" + Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
};

const WebhooksAdminPage = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({
    url: "",
    events: [] as string[],
    is_active: true,
    secret: genSecret(),
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("webhook_endpoints")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "خطأ في التحميل", description: error.message, variant: "destructive" });
    setEndpoints((data as Endpoint[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const copy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const toggleEvent = (ev: string) => {
    setForm((f) => ({
      ...f,
      events: f.events.includes(ev) ? f.events.filter((e) => e !== ev) : [...f.events, ev],
    }));
  };

  const create = async () => {
    if (!form.url) {
      toast({ title: "الرابط مطلوب", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { data: userRes } = await supabase.auth.getUser();
    const { error } = await supabase.from("webhook_endpoints").insert({
      url: form.url,
      events: form.events,
      is_active: form.is_active,
      project_id: userRes.user?.id ?? crypto.randomUUID(),
    });
    setSaving(false);
    if (error) {
      toast({ title: "فشل الإنشاء", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "تم إنشاء الهوك", description: "احفظ السر — لن يُعرض مرة أخرى" });
    setForm({ url: "", events: [], is_active: true, secret: genSecret() });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف هذا الهوك؟")) return;
    const { error } = await supabase.from("webhook_endpoints").delete().eq("id", id);
    if (error) return toast({ title: "فشل الحذف", description: error.message, variant: "destructive" });
    load();
  };

  const toggleActive = async (ep: Endpoint) => {
    await supabase.from("webhook_endpoints").update({ is_active: !ep.is_active }).eq("id", ep.id);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-3xl flex items-center gap-3">
          <Webhook className="w-8 h-8 text-primary" />
          إدارة الهوكات (Webhooks)
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          توليد وإدارة نقاط الاستقبال لتلقي أحداث النظام في الخدمات الخارجية.
        </p>
      </div>

      {/* Edge Function Hooks */}
      <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="p-5 border-b border-border/50 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="font-heading font-bold text-lg">Edge Functions الجاهزة</h3>
        </div>
        <ul className="divide-y divide-border/50">
          {EDGE_HOOKS.map((h) => {
            const url = `${SUPABASE_URL}/functions/v1/${h.path}`;
            return (
              <li key={h.path} className="p-4 flex items-center gap-3 hover:bg-muted/30">
                <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{h.name}</p>
                  <p className="text-xs text-muted-foreground truncate font-mono">{url}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => copy(url, h.path)} className="gap-1.5 shrink-0">
                  {copied === h.path ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  نسخ
                </Button>
              </li>
            );
          })}
        </ul>
      </motion.section>

      {/* Create new endpoint */}
      <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-bold text-lg">توليد هوك جديد</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>عنوان الاستقبال (URL)</Label>
            <Input
              placeholder="https://your-service.com/webhooks/alazab"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2">
              <Key className="w-4 h-4" />السر (Signing Secret)
            </Label>
            <div className="flex gap-2">
              <Input readOnly value={form.secret} className="font-mono text-xs" />
              <Button variant="outline" size="icon" onClick={() => copy(form.secret, "secret")}>
                {copied === "secret" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => setForm({ ...form, secret: genSecret() })}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">استخدم هذا السر للتحقق من صحة التوقيع في الخادم الخاص بك.</p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>الأحداث المُشترك بها</Label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((ev) => {
                const active = form.events.includes(ev);
                return (
                  <button
                    key={ev}
                    type="button"
                    onClick={() => toggleEvent(ev)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {ev}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
            <Label>مُفعّل عند الإنشاء</Label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={create} disabled={saving} className="gap-2">
            <Plus className="w-4 h-4" />إنشاء الهوك
          </Button>
        </div>
      </motion.section>

      {/* Existing endpoints */}
      <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="p-5 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg">الهوكات المُسجَّلة ({endpoints.length})</h3>
          <Button variant="ghost" size="sm" onClick={load} className="gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />تحديث
          </Button>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">جارٍ التحميل...</div>
        ) : endpoints.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">لا توجد هوكات مسجّلة بعد.</div>
        ) : (
          <ul className="divide-y divide-border/50">
            {endpoints.map((ep) => (
              <li key={ep.id} className="p-4 flex items-start gap-3 hover:bg-muted/30">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${ep.is_active ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm truncate">{ep.url}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(ep.events ?? []).map((e) => (
                      <Badge key={e} variant="secondary" className="text-[10px] font-mono">{e}</Badge>
                    ))}
                    {(!ep.events || ep.events.length === 0) && (
                      <span className="text-xs text-muted-foreground">لا توجد أحداث محددة</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={!!ep.is_active} onCheckedChange={() => toggleActive(ep)} />
                  <Button size="icon" variant="ghost" onClick={() => copy(ep.url, ep.id)}>
                    {copied === ep.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(ep.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.section>
    </div>
  );
};

export default WebhooksAdminPage;
