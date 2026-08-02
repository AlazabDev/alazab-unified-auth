import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const strength = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error(ar ? "كلمة المرور يجب ألا تقل عن 8 أحرف" : "Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error(ar ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success(ar ? "تم تحديث كلمة المرور بنجاح" : "Password updated successfully");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || (ar ? "تعذر تحديث كلمة المرور" : "Could not update password"));
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
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {ar ? "تعيين كلمة مرور جديدة" : "Set a new password"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {ready
              ? ar
                ? "اختر كلمة مرور قوية لحماية حسابك."
                : "Choose a strong password to protect your account."
              : ar
                ? "افتح هذه الصفحة من رابط الاستعادة المرسل إلى بريدك."
                : "Open this page from the reset link sent to your email."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="password" className="text-sm font-semibold">
              {ar ? "كلمة المرور الجديدة" : "New password"}
            </Label>
            <div className="relative group">
              <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="password"
                type={show ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="ps-11 pe-11 h-12 rounded-xl border-2 focus:border-primary transition-all"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex gap-1.5 pt-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i < strength ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="confirm" className="text-sm font-semibold">
              {ar ? "تأكيد كلمة المرور" : "Confirm password"}
            </Label>
            <div className="relative group">
              <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="confirm"
                type={show ? "text" : "password"}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="ps-11 h-12 rounded-xl border-2 focus:border-primary transition-all"
                dir="ltr"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !ready}
            className="w-full h-12 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {ar ? "جارٍ الحفظ..." : "Saving..."}</>
            ) : (
              <>{ar ? "حفظ كلمة المرور" : "Save password"}</>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
