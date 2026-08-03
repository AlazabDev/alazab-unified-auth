import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Shield, Webhook, LayoutGrid, LogOut, ArrowLeft, ArrowRight, Boxes } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const AdminLayout = () => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth/login");
        return;
      }
      const { data, error } = await supabase.rpc("is_admin");
      if (error || !data) {
        toast({ title: "غير مصرح", description: "تحتاج صلاحيات المسؤول للوصول لهذه الصفحة", variant: "destructive" });
        navigate("/dashboard");
        return;
      }
      setIsAdmin(true);
      setChecking(false);
    })();
  }, [navigate]);

  const items = [
    { to: "/admin", icon: LayoutGrid, label: "نظرة عامة", end: true },
    { to: "/admin/auth", icon: Shield, label: "إعدادات المصادقة" },
    { to: "/admin/apps", icon: Boxes, label: "ربط الأنظمة" },
    { to: "/admin/webhooks", icon: Webhook, label: "الهوكات (Webhooks)" },
  ];

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-muted-foreground text-sm">جارٍ التحقق من الصلاحيات...</div>
      </div>
    );
  }
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-64 flex-col border-e border-border/50 bg-card/40 backdrop-blur">
        <div className="p-5 border-b border-border/50">
          <Link to="/" className="font-heading font-bold text-lg text-foreground">
            لوحة الإدارة
          </Link>
          <p className="text-xs text-muted-foreground mt-1">نظام المصادقة المركزي</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )
              }
            >
              <it.icon className="w-4 h-4" />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border/50 space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
            <Link to="/dashboard"><Arrow className="w-4 h-4" />العودة للوحة</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-destructive"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/");
            }}
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="md:hidden border-b border-border/50 p-3 flex gap-2 overflow-x-auto">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap",
                  isActive ? "bg-primary/15 text-primary" : "text-muted-foreground bg-muted/40"
                )
              }
            >
              <it.icon className="w-3.5 h-3.5" />
              {it.label}
            </NavLink>
          ))}
        </header>
        <div className="p-5 md:p-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
