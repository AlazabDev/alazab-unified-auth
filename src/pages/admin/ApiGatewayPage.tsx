import { useEffect, useState } from "react";
import { Activity, Copy, Play, Plug, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GATEWAY_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api-gateway`;

type Endpoint = {
  method: "GET" | "POST";
  path: string;
  auth: boolean;
  desc: string;
  sample?: string;
};

const ENDPOINTS: Endpoint[] = [
  { method: "GET", path: "/v1/health", auth: false, desc: "فحص حالة البوابة" },
  { method: "GET", path: "/v1/openapi", auth: false, desc: "توثيق كل النقاط" },
  { method: "POST", path: "/v1/auth/otp/request", auth: false, desc: "إرسال رمز تحقق للبريد", sample: '{\n  "email": "user@alazab.com"\n}' },
  { method: "POST", path: "/v1/auth/otp/verify", auth: false, desc: "التحقق من الرمز وإصدار جلسة", sample: '{\n  "email": "user@alazab.com",\n  "token": "123456"\n}' },
  { method: "POST", path: "/v1/auth/password/login", auth: false, desc: "دخول بكلمة المرور مع فحص 2FA", sample: '{\n  "email": "user@alazab.com",\n  "password": "••••••••"\n}' },
  { method: "POST", path: "/v1/auth/password/reset", auth: false, desc: "طلب رابط استعادة كلمة المرور", sample: '{\n  "email": "user@alazab.com"\n}' },
  { method: "POST", path: "/v1/auth/logout", auth: true, desc: "خروج من الجهاز أو كل الأجهزة", sample: '{\n  "scope": "global"\n}' },
  { method: "GET", path: "/v1/me", auth: true, desc: "بيانات المستخدم والأدوار وحالة 2FA" },
  { method: "GET", path: "/v1/apps", auth: true, desc: "الأنظمة المصرح بها حسب الدور" },
  { method: "POST", path: "/v1/sso/authorize", auth: true, desc: "توليد رابط تحويل SSO موثّق", sample: '{\n  "slug": "erp"\n}' },
  { method: "GET", path: "/v1/audit", auth: true, desc: "سجل أحداث المصادقة" },
];

const ApiGatewayPage = () => {
  const [health, setHealth] = useState<"checking" | "up" | "down">("checking");
  const [selected, setSelected] = useState<Endpoint>(ENDPOINTS[0]);
  const [payload, setPayload] = useState("");
  const [response, setResponse] = useState("");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetch(`${GATEWAY_BASE}/v1/health`)
      .then((r) => (r.ok ? setHealth("up") : setHealth("down")))
      .catch(() => setHealth("down"));
  }, []);

  useEffect(() => setPayload(selected.sample ?? ""), [selected]);

  const run = async () => {
    setRunning(true);
    setResponse("");
    try {
      const { data } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (selected.auth && data.session) headers.Authorization = `Bearer ${data.session.access_token}`;
      const res = await fetch(`${GATEWAY_BASE}${selected.path}`, {
        method: selected.method,
        headers,
        body: selected.method === "POST" ? payload || "{}" : undefined,
      });
      const text = await res.json();
      setResponse(`HTTP ${res.status}\n\n${JSON.stringify(text, null, 2)}`);
    } catch (e) {
      setResponse(String(e));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Plug className="w-6 h-6 text-primary" />
            بوابة API
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            نقطة دخول موحّدة لكل أنظمة العزب — مصادقة، أدوار، SSO، وسجل تدقيق.
          </p>
        </div>
        <Badge variant={health === "up" ? "default" : health === "down" ? "destructive" : "secondary"} className="gap-1.5">
          <Activity className="w-3.5 h-3.5" />
          {health === "checking" ? "جارٍ الفحص" : health === "up" ? "البوابة تعمل" : "البوابة متوقفة"}
        </Badge>
      </div>

      <Card className="p-4 flex flex-wrap items-center gap-3">
        <code className="text-xs md:text-sm text-muted-foreground break-all flex-1" dir="ltr">
          {GATEWAY_BASE}
        </code>
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => {
            navigator.clipboard.writeText(GATEWAY_BASE);
            toast.success("تم نسخ عنوان البوابة");
          }}
        >
          <Copy className="w-3.5 h-3.5" />
          نسخ
        </Button>
      </Card>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6">
        <Card className="p-4 space-y-2">
          <h2 className="font-semibold text-sm text-foreground mb-3">النقاط المتاحة</h2>
          {ENDPOINTS.map((ep) => (
            <button
              key={ep.method + ep.path}
              onClick={() => setSelected(ep)}
              className={`w-full text-start px-3 py-2.5 rounded-xl border transition-colors ${
                selected.path === ep.path && selected.method === ep.method
                  ? "border-primary/50 bg-primary/10"
                  : "border-border/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2" dir="ltr">
                <Badge variant={ep.method === "GET" ? "secondary" : "default"} className="text-[10px] font-mono">
                  {ep.method}
                </Badge>
                <code className="text-xs text-foreground">{ep.path}</code>
                {ep.auth && <ShieldCheck className="w-3.5 h-3.5 text-primary ms-auto" />}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{ep.desc}</p>
            </button>
          ))}
        </Card>

        <Card className="p-4 space-y-4">
          <h2 className="font-semibold text-sm text-foreground">تجربة مباشرة</h2>
          {selected.method === "POST" && (
            <div className="space-y-2">
              <Label className="text-xs">جسم الطلب (JSON)</Label>
              <Textarea
                dir="ltr"
                rows={6}
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          )}
          {selected.auth && (
            <p className="text-xs text-muted-foreground">
              تُرسل هذه النقطة مع رمز الجلسة الحالي تلقائيًا.
            </p>
          )}
          <Button onClick={run} disabled={running} className="gap-2">
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            تنفيذ الطلب
          </Button>
          <div className="space-y-2">
            <Label className="text-xs">الاستجابة</Label>
            <pre
              dir="ltr"
              className="text-xs bg-muted/50 rounded-xl p-3 overflow-auto max-h-80 whitespace-pre-wrap break-all text-muted-foreground"
            >
              {response || "—"}
            </pre>
          </div>
        </Card>
      </div>

      <Card className="p-4 space-y-3">
        <h2 className="font-semibold text-sm text-foreground">حدود المعدل (Rate limits)</h2>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc ps-5">
          <li>طلب رمز OTP: 5 لكل دقيقة لكل IP، و3 لكل دقيقة لكل بريد.</li>
          <li>الدخول بكلمة المرور: 10 لكل دقيقة لكل IP، و5 كل 5 دقائق لكل حساب.</li>
          <li>استعادة كلمة المرور: 5 كل 5 دقائق لكل IP (لا تكشف وجود الحساب).</li>
        </ul>
      </Card>

      <Card className="p-4 space-y-2">
        <h2 className="font-semibold text-sm text-foreground">مثال دمج لأي نظام عزب</h2>
        <pre dir="ltr" className="text-xs bg-muted/50 rounded-xl p-3 overflow-auto text-muted-foreground">{`// 1) طلب رمز
await fetch(BASE + "/v1/auth/otp/request", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email })
});

// 2) تحقق + استلام الجلسة
const { data } = await (await fetch(BASE + "/v1/auth/otp/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, token })
})).json();

// 3) الأنظمة المصرح بها + تحويل SSO
const apps = await fetch(BASE + "/v1/apps", {
  headers: { Authorization: "Bearer " + data.session.access_token }
});`}</pre>
      </Card>
    </div>
  );
};

export default ApiGatewayPage;
