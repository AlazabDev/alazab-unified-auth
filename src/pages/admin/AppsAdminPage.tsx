import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ExternalLink, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fetchSsoApps, type SsoApp } from "@/lib/sso";

type Draft = Partial<SsoApp> & { slug?: string };

const emptyDraft: Draft = {
  slug: "",
  name_ar: "",
  name_en: "",
  base_url: "",
  redirect_url: "",
  logo_url: "",
  description_ar: "",
  is_active: true,
  is_default: false,
  sort_order: 0,
};

const AppsAdminPage = () => {
  const [apps, setApps] = useState<SsoApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const load = async () => {
    setLoading(true);
    try {
      setApps(await fetchSsoApps());
    } catch (e: any) {
      toast.error(e.message || "تعذر تحميل الأنظمة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!draft.slug || !draft.name_ar || !draft.base_url) {
      toast.error("المعرّف والاسم والرابط مطلوبة");
      return;
    }
    setSaving(true);
    const payload = {
      slug: draft.slug.trim(),
      name_ar: draft.name_ar!.trim(),
      name_en: (draft.name_en || draft.name_ar)!.trim(),
      description_ar: draft.description_ar || null,
      base_url: draft.base_url!.trim(),
      redirect_url: draft.redirect_url?.trim() || null,
      logo_url: draft.logo_url?.trim() || null,
      is_active: draft.is_active ?? true,
      is_default: draft.is_default ?? false,
      sort_order: Number(draft.sort_order) || 0,
    };
    const { error } = draft.id
      ? await supabase.from("sso_apps").update(payload).eq("id", draft.id)
      : await supabase.from("sso_apps").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("تم الحفظ");
    setOpen(false);
    setDraft(emptyDraft);
    load();
  };

  const remove = async (app: SsoApp) => {
    if (!confirm(`حذف "${app.name_ar}"؟`)) return;
    const { error } = await supabase.from("sso_apps").delete().eq("id", app.id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف");
    load();
  };

  const toggle = async (app: SsoApp, is_active: boolean) => {
    const { error } = await supabase.from("sso_apps").update({ is_active }).eq("id", app.id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">ربط الأنظمة</h1>
          <p className="text-muted-foreground text-sm mt-1">
            الأنظمة المسجّلة هنا فقط يُسمح بتوجيه المستخدم إليها بعد المصادقة.
          </p>
        </div>
        <Button
          onClick={() => {
            setDraft(emptyDraft);
            setOpen(true);
          }}
          className="gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" /> إضافة نظام
        </Button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-4 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">طريقة الربط</p>
        <p dir="ltr" className="font-mono text-xs">
          https://auth.alazab.com/auth/login?app=&lt;slug&gt;
        </p>
        <p className="mt-2">
          بعد نجاح المصادقة يُعاد المستخدم تلقائيًا إلى النظام مع الجلسة في الـ hash
          (access_token / refresh_token) ليقوم النظام باستعادتها عبر <code>setSession</code>.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> جارٍ التحميل...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {apps.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur p-5 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-foreground truncate">{app.name_ar}</h3>
                    {app.is_default && <Star className="w-3.5 h-3.5 text-primary fill-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono truncate" dir="ltr">
                    {app.slug}
                  </p>
                </div>
                <Switch checked={app.is_active} onCheckedChange={(v) => toggle(app, v)} />
              </div>

              <a
                href={app.base_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline truncate"
                dir="ltr"
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                {app.base_url}
              </a>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1.5 rounded-lg"
                  onClick={() => {
                    setDraft(app);
                    setOpen(true);
                  }}
                >
                  <Pencil className="w-3.5 h-3.5" /> تعديل
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 rounded-lg"
                  onClick={() => remove(app)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft.id ? "تعديل النظام" : "إضافة نظام"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>المعرّف (slug)</Label>
                <Input
                  dir="ltr"
                  value={draft.slug || ""}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                  placeholder="erp"
                />
              </div>
              <div className="space-y-2">
                <Label>الترتيب</Label>
                <Input
                  type="number"
                  value={draft.sort_order ?? 0}
                  onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>الاسم بالعربية</Label>
                <Input
                  value={draft.name_ar || ""}
                  onChange={(e) => setDraft({ ...draft, name_ar: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>الاسم بالإنجليزية</Label>
                <Input
                  dir="ltr"
                  value={draft.name_en || ""}
                  onChange={(e) => setDraft({ ...draft, name_en: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>الرابط الأساسي</Label>
              <Input
                dir="ltr"
                value={draft.base_url || ""}
                onChange={(e) => setDraft({ ...draft, base_url: e.target.value })}
                placeholder="https://erp.alazab.com"
              />
            </div>
            <div className="space-y-2">
              <Label>رابط التوجيه بعد المصادقة (اختياري)</Label>
              <Input
                dir="ltr"
                value={draft.redirect_url || ""}
                onChange={(e) => setDraft({ ...draft, redirect_url: e.target.value })}
                placeholder="https://erp.alazab.com/auth/callback"
              />
            </div>
            <div className="space-y-2">
              <Label>رابط الشعار (اختياري)</Label>
              <Input
                dir="ltr"
                value={draft.logo_url || ""}
                onChange={(e) => setDraft({ ...draft, logo_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                value={draft.description_ar || ""}
                onChange={(e) => setDraft({ ...draft, description_ar: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/60 p-3">
              <div>
                <p className="text-sm font-medium">النظام الافتراضي</p>
                <p className="text-xs text-muted-foreground">يُوجَّه إليه المستخدم عند عدم تحديد نظام</p>
              </div>
              <Switch
                checked={!!draft.is_default}
                onCheckedChange={(v) => setDraft({ ...draft, is_default: v })}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/60 p-3">
              <p className="text-sm font-medium">مفعّل</p>
              <Switch
                checked={draft.is_active ?? true}
                onCheckedChange={(v) => setDraft({ ...draft, is_active: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={save} disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppsAdminPage;
