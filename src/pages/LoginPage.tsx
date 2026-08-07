import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Building2, Wrench, User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/AuthLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AccountType = "company" | "technician" | "client";

const LoginPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type") as AccountType | null;
  const [selectedType, setSelectedType] = useState<AccountType>(
    typeParam && ["company", "technician", "client"].includes(typeParam) ? typeParam : "client"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/auth/success");
    } catch {
      toast.error(t("auth.login.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/success` },
      });
      if (error) throw error;
    } catch {
      toast.error("Google login failed");
      setGoogleLoading(false);
    }
  };

  const accountTypes: Record<AccountType, { icon: React.ReactNode; title: string; subtitle: string; accent: string; label: string; signupPath: string }> = {
    company: {
      icon: <Building2 className="w-12 h-12 text-white" />,
      title: t("auth.company.title"),
      subtitle: t("auth.company.subtitle"),
      accent: "gradient-hero",
      label: t("accounts.company"),
      signupPath: "/signup/company",
    },
    technician: {
      icon: <Wrench className="w-12 h-12 text-white" />,
      title: t("auth.technician.title"),
      subtitle: t("auth.technician.subtitle"),
      accent: "bg-accent",
      label: t("accounts.technician"),
      signupPath: "/signup/technician",
    },
    client: {
      icon: <User className="w-12 h-12 text-white" />,
      title: t("auth.client.title"),
      subtitle: t("auth.client.subtitle"),
      accent: "gradient-hero-vivid",
      label: t("accounts.client"),
      signupPath: "/signup/client",
    },
  };

  const current = accountTypes[selectedType];

  return (
    <AuthLayout
      title={current.title}
      subtitle={current.subtitle}
      icon={current.icon}
      accentColor={current.accent}
    >
      <div className="space-y-6">
        <div className="text-center lg:text-start">
          <h1 className="font-heading text-2xl font-bold text-foreground">{t("auth.login")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("auth.login.subtitle")}</p>
        </div>

        {/* Account Type Selector */}
        <div className="flex gap-1.5 p-1.5 bg-muted/80 rounded-xl border border-border/50">
          {(Object.keys(accountTypes) as AccountType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedType === type
                  ? "bg-card text-foreground shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {accountTypes[type].label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={selectedType}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
            onSubmit={handleLogin}
          >
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="ps-10 h-11 rounded-xl"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  {t("auth.forgot")}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="ps-10 pe-10 h-11 rounded-xl"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-11 text-base rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("auth.login")}
            </Button>

            <Link
              to="/auth/login"
              className="block text-center text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {t("auth.otp.instead")}
            </Link>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-4 text-muted-foreground">{t("auth.or")}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="flex-1 h-11 gap-2 rounded-xl hover:shadow-sm transition-shadow"
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.info(t("auth.providerDisabled"))}
                className="flex-1 h-11 gap-2 rounded-xl opacity-60 cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </motion.form>
        </AnimatePresence>

        <p className="text-center text-sm text-muted-foreground pt-4">
          {t("auth.no_account")}{" "}
          <Link to={current.signupPath} className="text-primary font-medium hover:underline">
            {t("auth.create_account")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
