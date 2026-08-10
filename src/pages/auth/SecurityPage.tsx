import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck, Monitor, LogOut, Loader2, ArrowLeft, ArrowRight,
  Smartphone, Clock, KeyRound, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";
import { fetchMyAuthAudit, logAuthEvent, type AuthAuditRow } from "@/lib/audit";
import { getMfaPrefs, setMfaEnabled } from "@/lib/mfa";
import { toast } from "sonner";

const eventLabels: Record<string, { ar: string; en: string }> = {
  login: { ar: "تسجيل دخول", en: "Login" },
  logout: { ar: "تسجيل خروج", en: "Logout" },
  failed_login: { ar: "محاولة دخول فاشلة", en: "Failed login" },
  otp_requested: { ar: "طلب رمز تحقق", en: "OTP requested" },
  otp_verified: { ar: "تأكيد رمز التحقق", en: "OTP verified" },
  password_reset: { ar: "إعادة تعيين كلمة المرور", en: "Password reset" },
  provider_used: { ar: "دخول عبر مزوّد", en: "Provider used" },
  mfa_enabled: { ar: "تفعيل التحقق الثنائي", en: "2FA enabled" },
  mfa_disabled: { ar: "تعطيل التحقق الثنائي", en: "2FA disabled" },
  session_revoked: { ar: "إنهاء جلسة", en: "Session revoked" },
};

const SecurityPage = () => {
  const { lang, dir } = useLanguage();
  const navigate = useNavigate();
  const ar = lang === "ar";
  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const [user, setUser] = useState<SupaUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfa, setMfa] = useState(true);
  const [savingMfa, setSavingMfa] = useState(false);
  const [events, setEvents] = useState<AuthAuditRow[]>([]);
  const [revoking, setRevoking] = useState<"others" | "all" | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) {
        navigate("/auth/login");
        return;
      }
      setUser(u);
      const [prefs, log] = await Promise.all([getMfaPrefs(u.id), fetchMyAuthAudit(u.id, 30).catch(() => [])]);
      setMfa(prefs.email_otp_required);
      setEvents(log);
      setLoading(false);
    })();
  }, [navigate]);

  const toggleMfa = async (value: boolean) => {
    if (!user) return;
    setSavingMfa(true);
    try {
      await setMfaEnabled(user.id, value);
      setMfa(value);
      toast.success(ar ? "تم حفظ إعداد التحقق الثنائي" : "2FA preference saved");
    } catch {
      toast.error(ar ? "تعذر حفظ الإعداد" : "Could not save preference");
    } finally {
      setSavingMfa(false);
    }
  };

  const revoke = async (scope: "others" | "global") => {
    setRevoking(scope === "others" ? "others" : "all");
    try {
      await logAuthEvent({
        event: "session_revoked",
        email: user?.email,
        description: scope === "others" ? "Signed out other devices" : "Signed out all devices",
      });
      const { error } = await supabase.auth.signOut({ scope });
      if (error) throw error;
      toast.success(ar ? "تم إنهاء الجلسات" : "Sessions revoked");
      if (scope === "global") navigate("/auth/login");
    } catch {
      toast.error(ar ? "تعذر إنهاء الجلسات" : "Could not revoke sessions");
    } finally {
      setRevoking(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const currentDevice = navigator.userAgent;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-6 py-10 space-y-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Arrow className="w-4 h-4" />
          {ar ? "العودة للوحة" : "Back to dashboard"}
        </Link>

        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {ar ? "الأمان والجلسات" : "Security & Sessions"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {ar ? "إدارة التحقق الثنائي والأجهزة وسجل نشاط حسابك" : "Manage 2FA, devices and your account activity"}
          </p>
        </div>

        {/* MFA */}
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border/60 bg-card p-6 space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg">{ar ? "التحقق الثنائي (Email OTP)" : "Two-factor (Email OTP)"}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {ar
                    ? "عند تفعيله يُطلب رمز تحقق يُرسل لبريدك بعد كل تسجيل دخول بكلمة مرور."
                    : "When enabled, a one-time code is emailed after every password sign-in."}
                </p>
              </div>
            </div>
            <Switch checked={mfa} disabled={savingMfa} onCheckedChange={toggleMfa} />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
            <KeyRound className="w-3.5 h-3.5" />
            {ar
              ? "الدخول عبر Google أو Microsoft يعتمد على التحقق الثنائي لدى المزوّد نفسه."
              : "Google / Microsoft sign-in relies on the provider's own 2FA."}
          </div>
        </motion.section>

        {/* Sessions */}
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-2xl border border-border/60 bg-card p-6 space-y-4"
        >
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 grid place-items-center shrink-0">
              <Monitor className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg">{ar ? "الجلسات والأجهزة" : "Sessions & devices"}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {ar ? "الجهاز الحالي وإنهاء الجلسات الأخرى" : "Current device and revoking other sessions"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Smartphone className="w-4 h-4 text-primary" />
              {ar ? "الجهاز الحالي" : "Current device"}
              <span className="ms-auto text-xs text-emerald-500">{ar ? "نشط" : "Active"}</span>
            </div>
            <p className="text-xs text-muted-foreground break-all" dir="ltr">{currentDevice}</p>
            <p className="text-xs text-muted-foreground" dir="ltr">{user?.email}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="gap-2" disabled={revoking !== null} onClick={() => revoke("others")}>
              {revoking === "others" ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              {ar ? "إنهاء الجلسات الأخرى" : "Sign out other devices"}
            </Button>
            <Button variant="destructive" className="gap-2" disabled={revoking !== null} onClick={() => revoke("global")}>
              {revoking === "all" ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
              {ar ? "إنهاء جميع الجلسات" : "Sign out everywhere"}
            </Button>
          </div>
        </motion.section>

        {/* Activity */}
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border/60 bg-card p-6 space-y-4"
        >
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 grid place-items-center shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg">{ar ? "نشاط الحساب" : "Account activity"}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {ar ? "آخر أحداث المصادقة على حسابك" : "Your latest authentication events"}
              </p>
            </div>
          </div>

          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">{ar ? "لا يوجد نشاط مسجل بعد." : "No recorded activity yet."}</p>
          ) : (
            <ul className="divide-y divide-border/50">
              {events.map((e) => (
                <li key={e.id} className="py-3 flex items-center gap-3 text-sm">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${e.status === "success" ? "bg-emerald-500" : "bg-destructive"}`} />
                  <span className="font-medium">
                    {eventLabels[e.event_type]?.[ar ? "ar" : "en"] ?? e.event_type}
                  </span>
                  <span className="text-xs text-muted-foreground ms-auto" dir="ltr">
                    {new Date(e.created_at).toLocaleString(ar ? "ar-EG" : "en-GB")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default SecurityPage;
