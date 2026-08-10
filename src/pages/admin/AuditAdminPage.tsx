import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ScrollText, Loader2, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchAuthAudit, type AuthAuditRow } from "@/lib/audit";
import { toast } from "sonner";

const labels: Record<string, string> = {
  login: "تسجيل دخول",
  logout: "تسجيل خروج",
  failed_login: "محاولة دخول فاشلة",
  otp_requested: "طلب رمز تحقق",
  otp_verified: "تأكيد رمز تحقق",
  password_reset: "إعادة تعيين كلمة المرور",
  provider_used: "دخول عبر مزوّد",
  mfa_enabled: "تفعيل التحقق الثنائي",
  mfa_disabled: "تعطيل التحقق الثنائي",
  session_revoked: "إنهاء جلسة",
};

const AuditAdminPage = () => {
  const [rows, setRows] = useState<AuthAuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      setRows(await fetchAuthAudit(200));
    } catch {
      toast.error("تعذر تحميل سجل المصادقة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) =>
      [r.event_type, r.actor_email, r.description, r.status].some((v) => (v ?? "").toLowerCase().includes(term)),
    );
  }, [rows, q]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-foreground">سجل تدقيق المصادقة</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            كل أحداث الدخول والخروج والرموز وإعادة تعيين كلمات المرور — مصدرها الفعلي جدول الأحداث الأمنية في Supabase.
          </p>
        </div>
        <Button variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="w-4 h-4" /> تحديث
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث بالبريد أو نوع الحدث..." className="ps-10" />
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        {loading ? (
          <div className="p-10 grid place-items-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
            <ScrollText className="w-6 h-6" />
            لا توجد أحداث مسجلة بعد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-start p-3 font-medium">الحدث</th>
                  <th className="text-start p-3 font-medium">الحالة</th>
                  <th className="text-start p-3 font-medium">المستخدم</th>
                  <th className="text-start p-3 font-medium">الجهاز</th>
                  <th className="text-start p-3 font-medium">IP</th>
                  <th className="text-start p-3 font-medium">التوقيت</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-border/40">
                    <td className="p-3 font-medium">{labels[r.event_type] ?? r.event_type}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${r.status === "success" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}`}>
                        {r.status === "success" ? "ناجح" : "فاشل"}
                      </span>
                    </td>
                    <td className="p-3" dir="ltr">{r.actor_email ?? "—"}</td>
                    <td className="p-3 text-xs text-muted-foreground" dir="ltr">
                      {(r.detail as { platform?: string; browser?: string } | null)?.browser ?? "—"}
                      {" / "}
                      {(r.detail as { platform?: string } | null)?.platform ?? "—"}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground" dir="ltr">{r.ip_address ?? "—"}</td>
                    <td className="p-3 text-xs text-muted-foreground" dir="ltr">
                      {new Date(r.created_at).toLocaleString("ar-EG")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuditAdminPage;
