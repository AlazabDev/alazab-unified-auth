import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, Shield, Loader2, Lock, Sparkles, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { captureSsoTarget, fetchSsoApps, getSsoTarget, resolveSsoApp } from "@/lib/sso";
import { toast } from "sonner";
import logoDark from "@/assets/az-s.png.asset.json";
import logoLight from "@/assets/az-w.png.asset.json";

const particles = Array.from({ length: 12 }, (_, i) => ({
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 4,
  duration: Math.random() * 4 + 6,
}));

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#25D366">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
  </svg>
);

const AuthLoginPage = () => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [azureLoading, setAzureLoading] = useState(false);
  const [targetApp, setTargetApp] = useState<string | null>(null);
  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  useEffect(() => {
    captureSsoTarget(window.location.search);
    const target = getSsoTarget();
    if (!target) return;
    fetchSsoApps()
      .then((apps) => {
        const app = resolveSsoApp(target, apps);
        if (app) setTargetApp(app.name_ar);
      })
      .catch(() => undefined);
  }, []);

  const handleAzureLogin = async () => {
    setAzureLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: {
          redirectTo: `${window.location.origin}/auth/success`,
          scopes: "email openid profile",
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Azure login failed");
      setAzureLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      navigate(`/auth/check-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      toast.error(err.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setPhoneLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      navigate(`/auth/verify?phone=${encodeURIComponent(phone)}`);
    } catch (err: any) {
      toast.error(err.message || "Error sending SMS");
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth/success`,
      });
      if (result.error) {
        toast.error("Google login failed");
        return;
      }
      if (result.redirected) return;
      navigate("/auth/success");
    } catch {
      toast.error("Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDisabledProvider = () => {
    toast.info(t("auth.providerDisabled"));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Side Panel */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden items-center justify-center gradient-hero">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] animate-glow-pulse" />
          <div className="absolute bottom-20 left-20 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20 pointer-events-none"
            style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
            animate={{ y: [0, -25, -10, -30, 0], opacity: [0.2, 0.5, 0.3, 0.4, 0.2] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 text-center text-white px-12 max-w-lg"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-40 h-40 mx-auto mb-10"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-primary/20 blur-2xl animate-glow-pulse" />
            <div className="relative w-full h-full rounded-[2rem] bg-white/[0.06] backdrop-blur-md border border-white/[0.12] shadow-2xl flex items-center justify-center p-5">
              <img src={logoLight.url} alt="Alazab" className="w-full h-full object-contain drop-shadow-2xl" />
            </div>
          </motion.div>
          <h2 className="font-heading text-4xl font-extrabold mb-5 leading-tight">{t("otp.login.title")}</h2>
          <p className="text-white/45 text-lg leading-relaxed mb-10">{t("otp.login.subtitle")}</p>

          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] text-white/60 text-xs">
              <Shield className="w-3.5 h-3.5 text-primary" />
              {t("auth.encrypted")}
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] text-white/60 text-xs">
              <Lock className="w-3.5 h-3.5 text-primary" />
              SSL 256-bit
            </div>
          </div>
        </motion.div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
        <div className="p-6 relative z-10">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 px-4 py-2.5 rounded-xl hover:bg-muted group">
            <Arrow className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t("auth.back")}
          </a>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 pb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md space-y-6"
          >
            {/* Logo */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative w-20 h-20 mx-auto mb-5"
              >
                <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl" />
                <img src={logoDark.url} alt="Alazab" className="relative w-20 h-20 object-contain dark:hidden drop-shadow-md" />
                <img src={logoLight.url} alt="Alazab" className="relative w-20 h-20 object-contain hidden dark:block drop-shadow-md" />
              </motion.div>
              <h1 className="font-heading text-2xl font-extrabold text-foreground">{t("otp.login.title")}</h1>
              <p className="text-muted-foreground text-sm mt-2">{t("otp.login.subtitle")}</p>
            </div>

            {/* Social row */}
            <div className="grid grid-cols-4 gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="h-12 rounded-xl border-2 hover:border-primary/30 hover:bg-muted/50 transition-all"
                title="Google"
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleAzureLogin}
                disabled={azureLoading}
                className="h-12 rounded-xl border-2 hover:border-primary/30 hover:bg-muted/50 transition-all"
                title="Microsoft Azure"
              >
                {azureLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDisabledProvider}
                className="relative h-12 rounded-xl border-2 opacity-60 hover:opacity-80 cursor-not-allowed"
                title={`Facebook - ${t("auth.comingSoon")}`}
              >
                <FacebookIcon />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDisabledProvider}
                className="relative h-12 rounded-xl border-2 opacity-60 hover:opacity-80 cursor-not-allowed"
                title={`WhatsApp - ${t("auth.comingSoon")}`}
              >
                <WhatsAppIcon />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-xs text-muted-foreground font-medium">{t("auth.or_email")}</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Email / Phone Tabs */}
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid grid-cols-2 w-full h-11 rounded-xl">
                <TabsTrigger value="email" className="gap-2 rounded-lg"><Mail className="w-4 h-4" /> {t("auth.tabEmail")}</TabsTrigger>
                <TabsTrigger value="phone" className="gap-2 rounded-lg"><Smartphone className="w-4 h-4" /> {t("auth.tabPhone")}</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="mt-5">
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div className="space-y-2.5">
                    <Label htmlFor="email" className="text-sm font-semibold">{t("auth.email")}</Label>
                    <div className="relative group">
                      <Mail className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="ps-11 h-13 rounded-xl text-base border-2 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full h-13 text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-bold bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> {t("otp.login.sending")}</>
                    ) : (
                      <>{t("otp.login.btn")} <Sparkles className="w-4 h-4" /></>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone" className="mt-5">
                <form onSubmit={handlePhoneOtp} className="space-y-5">
                  <div className="space-y-2.5">
                    <Label htmlFor="phone" className="text-sm font-semibold">{t("auth.phone")}</Label>
                    <div className="relative group">
                      <Smartphone className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t("auth.phone.placeholder")}
                        className="ps-11 h-13 rounded-xl text-base border-2 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={phoneLoading || !phone}
                    className="w-full h-13 text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-bold bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                  >
                    {phoneLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> {t("otp.login.sending")}</>
                    ) : (
                      <>{t("auth.phone.send")} <Sparkles className="w-4 h-4" /></>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="pt-5 mt-1 border-t border-border/50 text-center">
              <a
                href="/auth/forgot-password"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <Lock className="w-3.5 h-3.5" />
                {t("auth.forgot") || "نسيت كلمة المرور؟"}
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AuthLoginPage;
