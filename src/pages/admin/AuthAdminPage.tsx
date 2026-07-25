import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, AlertTriangle, ExternalLink, Mail, Smartphone, Shield, Lock, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Status = "active" | "inactive" | "unsupported" | "comingSoon";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const AzureIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0078D4"><path d="M13.05 4.24L6.56 18.05 2 18l7.09-12.26 3.96-1.5zm.5 1.68l3.6 10.29L8.9 21.35l12.13-2.15L13.55 5.92z"/></svg>
);
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#25D366"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z"/></svg>
);

const StatusBadge = ({ s }: { s: Status }) => {
  const map = {
    active: { i: CheckCircle2, l: "مفعّل", c: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    inactive: { i: XCircle, l: "معطّل", c: "bg-muted text-muted-foreground border-border" },
    unsupported: { i: AlertTriangle, l: "غير مدعوم", c: "bg-destructive/10 text-destructive border-destructive/20" },
    comingSoon: { i: Clock, l: "قريباً", c: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  }[s];
  const I = map.i;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${map.c}`}>
      <I className="w-3 h-3" />{map.l}
    </span>
  );
};

type SettingsRow = { id: string; site_url: string; redirect_urls: string; otp_expiry: number; hibp: boolean };

const AuthAdminPage = () => {
  const [settings, setSettings] = useState<SettingsRow>({
    id: "auth",
    site_url: "https://auth.alazab.com",
    redirect_urls: "https://auth.alazab.com/dashboard\nhttps://auth.alazab.com/auth/verify",
    otp_expiry: 600,
    hibp: true,
  });
  const [providers, setProviders] = useState<Record<string, boolean>>({
    email: true, phone: true, google: true, azure: true, apple: false, facebook: false, whatsapp: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("alazab_auth_admin");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.providers) setProviders(parsed.providers);
      }
    } catch {}
  }, []);

  const save = async () => {
    setSaving(true);
    localStorage.setItem("alazab_auth_admin", JSON.stringify({ settings, providers }));
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    toast({ title: "تم الحفظ", description: "تم حفظ الإعدادات محلياً. طبّق التغييرات على لوحة Supabase." });
  };

  const rows: { key: string; label: string; icon: React.ComponentType; status: Status }[] = [
    { key: "email", label: "البريد الإلكتروني (OTP)", icon: Mail, status: providers.email ? "active" : "inactive" },
    { key: "phone", label: "رقم الهاتف (SMS)", icon: Smartphone, status: providers.phone ? "active" : "inactive" },
    { key: "google", label: "Google", icon: GoogleIcon, status: providers.google ? "active" : "inactive" },
    { key: "azure", label: "Microsoft Azure", icon: AzureIcon, status: providers.azure ? "active" : "inactive" },
    { key: "apple", label: "Apple", icon: AppleIcon, status: providers.apple ? "active" : "inactive" },
    { key: "facebook", label: "Facebook", icon: FacebookIcon, status: providers.facebook ? "comingSoon" : "inactive" },
    { key: "whatsapp", label: "WhatsApp", icon: WhatsAppIcon, status: "unsupported" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading font-extrabold text-3xl">إعدادات المصادقة</h1>
          <p className="text-muted-foreground mt-2 text-sm">إدارة مزوّدي تسجيل الدخول وسياسات الأمان.</p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <a href="https://supabase.com/dashboard/project/bxuhcbfdoaflsgbxiqei/auth/providers" target="_blank" rel="noreferrer">
            <ExternalLink className="w-4 h-4" />فتح Supabase
          </a>
        </Button>
      </div>

      <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="p-5 border-b border-border/50 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-bold text-lg">المزوّدون</h3>
        </div>
        <ul className="divide-y divide-border/50">
          {rows.map((r) => {
            const Icon = r.icon;
            const disabled = r.key === "whatsapp";
            return (
              <li key={r.key} className="flex items-center gap-4 p-4 hover:bg-muted/30">
                <div className="w-11 h-11 rounded-xl grid place-items-center bg-muted/50 border border-border/50">
                  <Icon />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{r.label}</p>
                </div>
                <StatusBadge s={r.status} />
                <Switch
                  disabled={disabled}
                  checked={!!providers[r.key]}
                  onCheckedChange={(v) => setProviders((p) => ({ ...p, [r.key]: v }))}
                />
              </li>
            );
          })}
        </ul>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-bold text-lg">إعدادات عامة</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Site URL</Label>
            <Input value={settings.site_url} onChange={(e) => setSettings({ ...settings, site_url: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>مدة صلاحية OTP (ثانية)</Label>
            <Input type="number" value={settings.otp_expiry} onChange={(e) => setSettings({ ...settings, otp_expiry: Number(e.target.value) })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Redirect URLs (سطر لكل رابط)</Label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono"
              value={settings.redirect_urls}
              onChange={(e) => setSettings({ ...settings, redirect_urls: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between md:col-span-2 p-3 rounded-lg bg-muted/40 border border-border/50">
            <div>
              <p className="font-semibold text-sm">حماية كلمات المرور المسرّبة (HIBP)</p>
              <p className="text-xs text-muted-foreground">فحص كلمات المرور ضد قاعدة HaveIBeenPwned</p>
            </div>
            <Switch checked={settings.hibp} onCheckedChange={(v) => setSettings({ ...settings, hibp: v })} />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button onClick={save} disabled={saving} className="gap-2">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            حفظ الإعدادات
          </Button>
        </div>
      </motion.section>

      <div className="rounded-xl p-4 border border-amber-500/30 bg-amber-500/5 text-sm text-muted-foreground flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <p>تُخزَّن هذه الإعدادات محلياً كواجهة إدارية. يجب تطبيق تغييرات المزوّدين الفعلية من لوحة Supabase Dashboard.</p>
      </div>
    </div>
  );
};

export default AuthAdminPage;
