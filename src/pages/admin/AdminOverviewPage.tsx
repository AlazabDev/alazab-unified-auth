import { motion } from "framer-motion";
import { Shield, Webhook, Users, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminOverviewPage = () => {
  const [stats, setStats] = useState({ webhooks: 0, users: 0, endpoints: 0 });

  useEffect(() => {
    (async () => {
      const [wh, users] = await Promise.all([
        supabase.from("webhook_endpoints").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        webhooks: wh.count ?? 0,
        users: users.count ?? 0,
        endpoints: 4,
      });
    })();
  }, []);

  const cards = [
    { icon: Shield, label: "مزوّدو المصادقة", value: "4 مفعّلة", to: "/admin/auth", color: "text-primary bg-primary/10" },
    { icon: Webhook, label: "نقاط الهوكات", value: `${stats.webhooks}`, to: "/admin/webhooks", color: "text-amber-500 bg-amber-500/10" },
    { icon: Users, label: "المستخدمون", value: `${stats.users}`, to: "/admin", color: "text-emerald-500 bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-extrabold text-3xl text-foreground">مرحبًا بك في لوحة الإدارة</h1>
        <p className="text-muted-foreground mt-2 text-sm">إدارة إعدادات المصادقة والهوكات والاتصالات لنظام العزب المركزي.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
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
          <li>• <Link to="/admin/auth" className="text-primary hover:underline">ضبط مزوّدي تسجيل الدخول</Link> — Google, Azure, Apple, Facebook.</li>
          <li>• <Link to="/admin/webhooks" className="text-primary hover:underline">توليد وإدارة الهوكات</Link> — لتلقي الأحداث من الخدمات الخارجية.</li>
          <li>• <a href="https://supabase.com/dashboard/project/bxuhcbfdoaflsgbxiqei/auth/providers" target="_blank" rel="noreferrer" className="text-primary hover:underline">لوحة Supabase Auth Providers</a></li>
        </ul>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
