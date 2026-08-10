import { motion } from "framer-motion";
import { Shield, Webhook, Users, ArrowUpRight, Boxes, ScrollText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Stats = {
  providersEnabled: number;
  providersTotal: number;
  apps: number;
  appsActive: number;
  users: number;
  webhooks: number;
  authEvents24h: number;
  failed24h: number;
};

const AdminOverviewPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const [providers, providersOn, apps, appsOn, users, wh, events, failed] = await Promise.all([
        supabase.from("auth_providers").select("*", { count: "exact", head: true }),
        supabase.from("auth_providers").select("*", { count: "exact", head: true }).eq("enabled", true),
        supabase.from("sso_apps").select("*", { count: "exact", head: true }),
        supabase.from("sso_apps").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("adp_profiles").select("*", { count: "exact", head: true }),
        supabase.from("webhook_endpoints").select("*", { count: "exact", head: true }),
        supabase.from("adp_security_events").select("*", { count: "exact", head: true }).eq("category", "auth").gte("created_at", since),
        supabase.from("adp_security_events").select("*", { count: "exact", head: true }).eq("category", "auth").eq("status", "failure").gte("created_at", since),
      ]);
      setStats({
        providersTotal: providers.count ?? 0,
        providersEnabled: providersOn.count ?? 0,
        apps: apps.count ?? 0,
        appsActive: appsOn.count ?? 0,
        users: users.count ?? 0,
        webhooks: wh.count ?? 0,
        authEvents24h: events.count ?? 0,
        failed24h: failed.count ?? 0,
      });
    })();
  }, []);

  if (!stats) {
    return (
      <div className="min-h-[40vh] grid place-items-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    {
      icon: Shield,
      label: "مزوّدو المصادقة المفعّلون",
      value: `${stats.providersEnabled} / ${stats.providersTotal}`,
      to: "/admin/auth",
      color: "text-primary bg-primary/10",
    },
    {
      icon: Boxes,
      label: "الأنظمة المرتبطة (نشطة)",
      value: `${stats.appsActive} / ${stats.apps}`,
      to: "/admin/apps",
      color: "text-sky-500 bg-sky-500/10",
    },
    {
      icon: Users,
      label: "المستخدمون",
      value: `${stats.users}`,
      to: "/admin/audit",
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      icon: ScrollText,
      label: "أحداث مصادقة (24 ساعة)",
      value: `${stats.authEvents24h}`,
      to: "/admin/audit",
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      icon: Shield,
      label: "محاولات فاشلة (24 ساعة)",
      value: `${stats.failed24h}`,
      to: "/admin/audit",
      color: "text-destructive bg-destructive/10",
    },
    {
      icon: Webhook,
      label: "نقاط الهوكات",
      value: `${stats.webhooks}`,
      to: "/admin/webhooks",
      color: "text-violet-500 bg-violet-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-extrabold text-3xl text-foreground">بوابة المصادقة المركزية</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          كل الأرقام أدناه مقروءة مباشرة من قاعدة بيانات Supabase الفعلية لهذا المشروع.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Link
              to={c.to}
              className="block p-5 rounded-2xl border border-border/50 bg-card hover:shadow-lg hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl grid place-items-center ${c.color}`}>
                  <c.icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="font-heading font-bold text-2xl text-foreground mt-1">{c.value}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-6">
        <h3 className="font-heading font-bold text-lg mb-3">اختصارات سريعة</h3>
        <ul className="space-y-2 text-sm">
          <li>• <Link to="/admin/auth" className="text-primary hover:underline">مزوّدو تسجيل الدخول</Link> — Google, Microsoft, Email OTP.</li>
          <li>• <Link to="/admin/apps" className="text-primary hover:underline">سجل التطبيقات (App Registry)</Link> — slug / redirect / الأدوار المصرح لها.</li>
          <li>• <Link to="/admin/audit" className="text-primary hover:underline">سجل تدقيق المصادقة</Link> — الدخول والخروج والرموز.</li>
          <li>• <a href="https://supabase.com/dashboard/project/bxuhcbfdoaflsgbxiqei/auth/providers" target="_blank" rel="noreferrer" className="text-primary hover:underline">لوحة Supabase Auth Providers</a></li>
        </ul>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
