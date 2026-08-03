import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildHandoffUrl, clearSsoTarget, fetchSsoApps, getSsoTarget, resolveSsoApp } from "@/lib/sso";

const SuccessPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [appName, setAppName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let destination: string | null = null;

    (async () => {
      const target = getSsoTarget();
      if (!target) return;
      try {
        const apps = await fetchSsoApps();
        const app = resolveSsoApp(target, apps);
        if (!app || cancelled) return;
        setAppName(app.name_ar);
        destination = await buildHandoffUrl(app);
      } catch {
        /* fall back to dashboard */
      }
    })();

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          if (destination) {
            clearSsoTarget();
            window.location.replace(destination);
          } else {
            navigate("/dashboard");
          }
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [navigate]);


  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center relative">
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center space-y-6 relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="relative mx-auto w-28 h-28"
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
          <div className="relative w-28 h-28 rounded-full bg-primary flex items-center justify-center shadow-lg glow-primary">
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Check className="w-14 h-14 text-accent" strokeWidth={3} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h1 className="font-heading text-3xl font-bold text-white">
            {t("otp.success.title")}
          </h1>
          <p className="text-white/60 text-lg mt-2">
            {t("otp.success.subtitle")}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-white/40 text-sm"
        >
          {appName ? `جارٍ تحويلك إلى ${appName}` : t("otp.success.redirect")} ({countdown})
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SuccessPage;