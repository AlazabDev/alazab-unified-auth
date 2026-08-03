import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, User, Shield, Globe, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";
import { buildHandoffUrl, fetchSsoApps, type SsoApp } from "@/lib/sso";
import logoLight from "@/assets/az-w.png.asset.json";

const DashboardPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupaUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<SsoApp[]>([]);
  const [launching, setLaunching] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) navigate("/auth/login");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) navigate("/auth/login");
    });

    fetchSsoApps()
      .then((list) => setApps(list.filter((a) => a.is_active)))
      .catch(() => undefined);

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLaunch = async (app: SsoApp) => {
    setLaunching(app.id);
    try {
      const url = await buildHandoffUrl(app);
      window.location.href = url;
    } finally {
      setLaunching(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth/login");
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoLight.url} alt="Alazab" className="w-11 h-11 object-contain drop-shadow-md" />
            <span className="font-heading text-lg font-bold">العزب</span>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-white/70 hover:text-white hover:bg-white/10 gap-2">
            <LogOut className="w-4 h-4" />
            {t("dashboard.logout")}
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="font-heading text-3xl font-bold">{t("dashboard.welcome")}</h1>
            <p className="text-white/60 mt-1">{t("dashboard.subtitle")}</p>
          </div>

          {/* User info card */}
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/50">{t("dashboard.email")}</p>
                <p className="font-semibold text-white mt-1" dir="ltr">{user?.email}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/50">{t("dashboard.auth_method")}</p>
                <p className="font-semibold text-white mt-1">
                  {user?.app_metadata?.provider === "google" ? "Google" : "Email OTP"}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/50">{t("dashboard.platforms")}</p>
                <p className="font-semibold text-white mt-1">5 {t("dashboard.platforms_count")}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;