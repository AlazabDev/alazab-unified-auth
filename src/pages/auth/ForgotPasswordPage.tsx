import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const { lang, dir } = useLanguage();
  const ar = lang === "ar";
  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      toast.error(err.message || (ar ? "تعذر إرسال الرابط" : "Could not send link"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-card rounded-2xl border border-border/60 p-8 space-y-6"
      >
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Arrow className="w-4 h-4" />
          {ar ? "العودة لتسجيل الدخول" : "Back to login"}
        </Link>

        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto">
            {sent ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <KeyRound className="w-6 h-6 text-primary" />}
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {sent ? (ar ? "تم إرسال الرابط" : "Link sent") : ar ? "نسيت كلمة المرور؟" : "Forgot password?"}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {sent
              ? ar
                ? `أرسلنا رابط إعادة تعيين كلمة المرور إلى ${email}. افتح البريد واضغط على الرابط لمتابعة التغيير.`
                : `We sent a password reset link to ${email}. Open your inbox and follow the link.`
              : ar
                ? "أدخل بريدك الإلكتروني وسنرسل لك رابطًا آمنًا لإعادة تعيين كلمة المرور."
                : "Enter your email and we'll send you a secure reset link."}
          </p>
        </div>

        {!sent && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-semibold">
                {ar ? "البريد الإلكتروني" : "Email"}
              </Label>
              <div className="relative group">
                <Mail className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="ps-11 h-12 rounded-xl border-2 focus:border-primary transition-all"
                  dir="ltr"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full h-12 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {ar ? "جارٍ الإرسال..." : "Sending..."}</>
              ) : (
                <>{ar ? "إرسال رابط الاستعادة" : "Send reset link"}</>
              )}
            </Button>
          </form>
        )}

        {sent && (
          <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => setSent(false)}>
            {ar ? "إرسال مرة أخرى" : "Send again"}
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
