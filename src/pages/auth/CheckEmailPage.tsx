import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CheckEmailPage = () => {
  const { t, dir } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/success` },
      });
      if (error) throw error;
      setResent(true);
      toast.success(t("otp.check.resent"));
      setTimeout(() => setResent(false), 30000);
    } catch {
      toast.error("Error resending code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-6 start-6 z-10">
        <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted">
          <Arrow className="w-4 h-4" />
          {t("auth.back")}
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-6 text-center space-y-8 relative z-10"
      >
        {/* Mail icon animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto">
            <Mail className="w-12 h-12 text-primary" />
          </div>
        </motion.div>

        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{t("otp.check.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("otp.check.subtitle")}</p>
          <p className="text-primary font-semibold mt-1 text-lg" dir="ltr">{email}</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate(`/auth/verify?email=${encodeURIComponent(email)}`)}
            className="w-full h-12 text-base rounded-xl shadow-md"
          >
            {t("otp.check.btn")}
          </Button>

          <Button
            variant="ghost"
            onClick={handleResend}
            disabled={resending || resent}
            className="w-full gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
            {resent ? t("otp.check.resent") : t("otp.check.resend")}
          </Button>

          <Link to="/auth/login" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("otp.check.wrongEmail")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckEmailPage;
