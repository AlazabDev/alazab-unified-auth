import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Pencil, Trash2, RefreshCw, CheckCircle2, XCircle, AlertTriangle,
  Loader2, Shield, ExternalLink, Save, Wifi, WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Provider = {
  id: string;
  key: string;
  label: string;
  type: string;
  enabled: boolean;
  client_id: string | null;
  client_secret: string | null;
  extra: Record<string, unknown>;
  status: string;
  last_checked_at: string | null;
  notes: string | null;
};

type FormState = {
  id?: string;
  key: string;
  label: string;
  type: string;
  enabled: boolean;
  client_id: string;
  client_secret: string;
  notes: string;
};

const emptyForm: FormState = {
  key: "", label: "", type: "oauth", enabled: false,
  client_id: "", client_secret: "", notes: "",
};

const statusMeta = (s: string) => {
  switch (s) {
    case "active": return { icon: CheckCircle2, label: "متصل", cls: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" };
    case "inactive": return { icon: XCircle, label: "معطّل", cls: "text-muted-foreground bg-muted border-border" };
    case "error": return { icon: AlertTriangle, label: "خطأ", cls: "text-destructive bg-destructive/10 border-destructive/20" };
    case "checking": return { icon: Loader2, label: "جارٍ الفحص", cls: "text-amber-600 bg-amber-500/10 border-amber-500/20" };
    default: return { icon: AlertTriangle, label: "غير معروف", cls: "text-muted-foreground bg-muted border-border" };
  }
};

const AuthAdminPage = () => {
  const [rows, setRows] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [checkingId, setCheckingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("auth_providers")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      toast({ title: "تعذّر التحميل", description: error.message, variant: "destructive" });
    } else {
      setRows((data ?? []) as Provider[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (p: Provider) => {
    setForm({
      id: p.id, key: p.key, label: p.label, type: p.type, enabled: p.enabled,
      client_id: p.client_id ?? "", client_secret: p.client_secret ?? "", notes: p.notes ?? "",
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.key.trim() || !form.label.trim()) {
      toast({ title: "بيانات ناقصة", description: "المفتاح والاسم مطلوبان", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      key: form.key.trim(), label: form.label.trim(), type: form.type, enabled: form.enabled,
      client_id: form.client_id || null, client_secret: form.client_secret || null,
      notes: form.notes || null,
    };
    const q = form.id
      ? supabase.from("auth_providers").update(payload).eq("id", form.id)
      : supabase.from("auth_providers").insert(payload);
    const { error } = await q;
    setSaving(false);
    if (error) {
      toast({ title: "فشل الحفظ", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: form.id ? "تم التحديث" : "تم الإنشاء" });
    setDialogOpen(false);
    load();
  };

  const toggleEnabled = async (p: Provider, v: boolean) => {
    const { error } = await supabase.from("auth_providers").update({ enabled: v }).eq("id", p.id);
    if (error) return toast({ title: "فشل التحديث", description: error.message, variant: "destructive" });
    setRows((r) => r.map((x) => x.id === p.id ? { ...x, enabled: v } : x));
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("auth_providers").delete().eq("id", deleteId);
    setDeleteId(null);
    if (error) return toast({ title: "فشل الحذف", description: error.message, variant: "destructive" });
    toast({ title: "تم الحذف" });
    load();
  };

  const checkStatus = async (p: Provider) => {
    setCheckingId(p.id);
    await supabase.from("auth_providers").update({ status: "checking" }).eq("id", p.id);
    setRows((r) => r.map((x) => x.id === p.id ? { ...x, status: "checking" } : x));

    let status = "inactive";
    try {
      if (!p.enabled) {
        status = "inactive";
      } else if (p.type === "oauth") {
        status = p.client_id && p.client_secret ? "active" : "error";
      } else if (p.type === "otp") {
        status = "active";
      } else {
        status = "unknown";
      }
    } catch { status = "error"; }

    const { error } = await supabase.from("auth_providers")
      .update({ status, last_checked_at: new Date().toISOString() })
      .eq("id", p.id);
    setCheckingId(null);
    if (error) return toast({ title: "فشل الفحص", description: error.message, variant: "destructive" });
    setRows((r) => r.map((x) => x.id === p.id ? { ...x, status, last_checked_at: new Date().toISOString() } : x));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading font-extrabold text-3xl">مزوّدو المصادقة</h1>
          <p className="text-muted-foreground mt-2 text-sm">إنشاء وتعديل وحذف المزوّدين ومراقبة حالة الاتصال.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} className="gap-2">
            <RefreshCw className="w-4 h-4" />تحديث
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <a href="https://supabase.com/dashboard/project/bxuhcbfdoaflsgbxiqei/auth/providers" target="_blank" rel="noreferrer">
              <ExternalLink className="w-4 h-4" />Supabase
            </a>
          </Button>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" />مزوّد جديد
          </Button>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border/50 overflow-hidden"
      >
        <div className="p-5 border-b border-border/50 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-bold text-lg">القائمة</h3>
          <span className="text-xs text-muted-foreground ms-2">{rows.length} مزوّد</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-muted-foreground text-sm">
            <Loader2 className="w-5 h-5 animate-spin inline me-2" />جارٍ التحميل...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">
            لا يوجد مزوّدون. اضغط "مزوّد جديد" للبدء.
          </div>
        ) : (
          <ul className="divide-y divide-border/50">
            {rows.map((p) => {
              const meta = statusMeta(checkingId === p.id ? "checking" : p.status);
              const I = meta.icon;
              return (
                <li key={p.id} className="p-4 flex items-center gap-4 hover:bg-muted/30">
                  <div className="w-11 h-11 rounded-xl grid place-items-center bg-muted/50 border border-border/50">
                    {p.enabled ? <Wifi className="w-5 h-5 text-primary" /> : <WifiOff className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{p.label}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">{p.key}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">{p.type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {p.last_checked_at ? `آخر فحص: ${new Date(p.last_checked_at).toLocaleString("ar-EG")}` : "لم يتم الفحص بعد"}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.cls}`}>
                    <I className={`w-3 h-3 ${checkingId === p.id ? "animate-spin" : ""}`} />
                    {meta.label}
                  </span>
                  <Switch checked={p.enabled} onCheckedChange={(v) => toggleEnabled(p, v)} />
                  <Button size="icon" variant="ghost" onClick={() => checkStatus(p)} title="فحص الاتصال">
                    <RefreshCw className={`w-4 h-4 ${checkingId === p.id ? "animate-spin" : ""}`} />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)} title="تعديل">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(p.id)} title="حذف">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </motion.section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.id ? "تعديل مزوّد" : "مزوّد جديد"}</DialogTitle>
            <DialogDescription>حدّد مفتاح ونوع المزوّد وأدخل بيانات الاعتماد إن وُجدت.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>المفتاح</Label>
                <Input
                  placeholder="google"
                  value={form.key}
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                  disabled={!!form.id}
                />
              </div>
              <div className="space-y-1.5">
                <Label>الاسم الظاهر</Label>
                <Input placeholder="Google" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>النوع</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oauth">OAuth</SelectItem>
                    <SelectItem value="otp">OTP</SelectItem>
                    <SelectItem value="saml">SAML</SelectItem>
                    <SelectItem value="custom">مخصص</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>مفعّل</Label>
                <div className="h-10 flex items-center px-3 rounded-md border border-input">
                  <Switch checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} />
                  <span className="ms-3 text-sm text-muted-foreground">{form.enabled ? "نعم" : "لا"}</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Client ID</Label>
              <Input value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Client Secret</Label>
              <Input type="password" value={form.client_secret} onChange={(e) => setForm({ ...form, client_secret: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>ملاحظات</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button onClick={save} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المزوّد؟</AlertDialogTitle>
            <AlertDialogDescription>لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="rounded-xl p-4 border border-amber-500/30 bg-amber-500/5 text-sm text-muted-foreground flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <p>تفعيل المزوّد فعليّاً في تدفّق المصادقة يتطلّب أيضاً ضبطه في لوحة Supabase Dashboard.</p>
      </div>
    </div>
  );
};

export default AuthAdminPage;
