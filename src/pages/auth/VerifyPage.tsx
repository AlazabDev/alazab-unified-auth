import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const VerifyPage = () => {
  const { t, dir } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const target = email || phone;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (!target) navigate("/auth/login", { replace: true });
  }, [target, navigate]);

  const handleVerify = async () => {
    if (otp.length !== 6 || !target) return;
    setLoading(true);
    setError(false);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp(
        phone
          ? { phone, token: otp, type: "sms" }
          : { email, token: otp, type: "email" }
      );
      if (verifyError) throw verifyError;
      navigate("/auth/success");
    } catch {
      setError(true);
      setOtp("");
      toast.error(t("otp.verify.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!target) return;
    try {
      const { error } = await supabase.auth.signInWithOtp(
        phone
          ? { phone }
          : { email, options: { emailRedirectTo: `${window.location.origin}/auth/success` } }
      );
      if (error) throw error;
      toast.success(t("otp.check.resent"));
    } catch {
      toast.error("Error resending code");
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
        {/* Logo */}
        <div>
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{t("otp.verify.title")}</h1>
          <p className="text-muted-foreground mt-2">{phone ? t("otp.verify.subtitle.phone") : t("otp.verify.subtitle")}</p>
          <p className="text-primary font-semibold mt-1" dir="ltr">{target}</p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center" dir="ltr">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(val) => { setOtp(val); setError(false); }}
          >
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className={`w-12 h-14 text-xl font-bold rounded-xl border-2 ${
                    error ? "border-destructive" : "border-border"
                  } focus-within:border-primary transition-colors`}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-destructive text-sm"
          >
            {t("otp.verify.error")}
          </motion.p>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleVerify}
            disabled={otp.length !== 6 || loading}
            className="w-full h-12 text-base rounded-xl shadow-md"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {t("otp.verify.verifying")}</>
            ) : (
              t("otp.verify.btn")
            )}
          </Button>

          <Button variant="ghost" onClick={handleResend} className="w-full gap-2">
            <RefreshCw className="w-4 h-4" />
            {t("otp.verify.resend")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyPage;
