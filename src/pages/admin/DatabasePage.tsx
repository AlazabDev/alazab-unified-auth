import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Database, RefreshCw, Table2, ShieldCheck, ShieldAlert, Columns3, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type TableRow = {
  table_name: string;
  columns_count: number;
  rls_enabled: boolean;
  policies_count: number;
  row_estimate: number;
  total_size: string;
};

type ColumnRow = {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
  column_default: string | null;
  is_primary_key: boolean;
};

const DatabasePage = () => {
  const [tables, setTables] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [openTable, setOpenTable] = useState<string | null>(null);
  const [columns, setColumns] = useState<Record<string, ColumnRow[]>>({});
  const [loadingCols, setLoadingCols] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_tables" as never);
    if (error) {
      toast({ title: "تعذر تحميل الجداول", description: error.message, variant: "destructive" });
    } else {
      setTables((data as unknown as TableRow[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleTable = async (name: string) => {
    if (openTable === name) {
      setOpenTable(null);
      return;
    }
    setOpenTable(name);
    if (columns[name]) return;
    setLoadingCols(true);
    const { data, error } = await supabase.rpc("admin_table_columns" as never, { _table: name } as never);
    if (error) {
      toast({ title: "تعذر تحميل الأعمدة", description: error.message, variant: "destructive" });
    } else {
      setColumns((prev) => ({ ...prev, [name]: (data as unknown as ColumnRow[]) || [] }));
    }
    setLoadingCols(false);
  };

  const filtered = useMemo(
    () => tables.filter((t) => t.table_name.toLowerCase().includes(query.trim().toLowerCase())),
    [tables, query]
  );

  const stats = useMemo(() => {
    const totalRows = tables.reduce((s, t) => s + Number(t.row_estimate || 0), 0);
    const unprotected = tables.filter((t) => !t.rls_enabled || t.policies_count === 0).length;
    const totalCols = tables.reduce((s, t) => s + t.columns_count, 0);
    return { totalRows, unprotected, totalCols };
  }, [tables]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            جداول قاعدة البيانات
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            عرض شامل لكل جداول مخطط <span className="font-mono">public</span> مع حالة الحماية والأعمدة.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          تحديث
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "عدد الجداول", value: tables.length, icon: Table2 },
          { label: "إجمالي الأعمدة", value: stats.totalCols, icon: Columns3 },
          { label: "صفوف (تقريبي)", value: stats.totalRows.toLocaleString("en-US"), icon: Database },
          { label: "جداول بدون حماية", value: stats.unprotected, icon: ShieldAlert },
        ].map((s) => (
          <Card key={s.label} className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <s.icon className="w-3.5 h-3.5" />
                {s.label}
              </div>
              <div className="text-2xl font-bold font-numbers mt-1 text-foreground">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">قائمة الجداول</CardTitle>
          <Input
            placeholder="ابحث باسم الجدول..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-2"
          />
        </CardHeader>
        <CardContent className="space-y-2">
          {loading && <div className="text-sm text-muted-foreground py-6 text-center">جارٍ التحميل...</div>}
          {!loading && filtered.length === 0 && (
            <div className="text-sm text-muted-foreground py-6 text-center">لا توجد جداول مطابقة.</div>
          )}
          {filtered.map((t) => {
            const isOpen = openTable === t.table_name;
            const secure = t.rls_enabled && t.policies_count > 0;
            return (
              <div key={t.table_name} className="rounded-xl border border-border/50 bg-background/40 overflow-hidden">
                <button
                  onClick={() => toggleTable(t.table_name)}
                  className="w-full flex items-center gap-3 p-3 text-start hover:bg-muted/40 transition-colors"
                >
                  <Table2 className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="font-mono text-sm text-foreground flex-1 truncate">{t.table_name}</span>
                  <Badge variant="secondary" className="font-numbers text-[11px]">
                    {t.columns_count} عمود
                  </Badge>
                  <Badge variant="secondary" className="font-numbers text-[11px] hidden sm:inline-flex">
                    ~{Number(t.row_estimate).toLocaleString("en-US")} صف
                  </Badge>
                  <Badge variant="outline" className="font-numbers text-[11px] hidden md:inline-flex">
                    {t.total_size}
                  </Badge>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md",
                      secure ? "text-emerald-500 bg-emerald-500/10" : "text-destructive bg-destructive/10"
                    )}
                  >
                    {secure ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                    {secure ? `${t.policies_count} سياسة` : "غير محمي"}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                  <div className="border-t border-border/50 p-3 bg-muted/20">
                    {loadingCols && !columns[t.table_name] ? (
                      <div className="text-xs text-muted-foreground py-3 text-center">جارٍ تحميل الأعمدة...</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-muted-foreground">
                              <th className="text-start font-medium py-1.5 px-2">العمود</th>
                              <th className="text-start font-medium py-1.5 px-2">النوع</th>
                              <th className="text-start font-medium py-1.5 px-2">Null</th>
                              <th className="text-start font-medium py-1.5 px-2">الافتراضي</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(columns[t.table_name] || []).map((c) => (
                              <tr key={c.column_name} className="border-t border-border/30">
                                <td className="py-1.5 px-2 font-mono text-foreground">
                                  {c.column_name}
                                  {c.is_primary_key && (
                                    <span className="ms-1.5 text-[10px] text-primary">PK</span>
                                  )}
                                </td>
                                <td className="py-1.5 px-2 font-mono text-muted-foreground">{c.data_type}</td>
                                <td className="py-1.5 px-2 text-muted-foreground">{c.is_nullable ? "نعم" : "لا"}</td>
                                <td className="py-1.5 px-2 font-mono text-muted-foreground truncate max-w-[220px]">
                                  {c.column_default || "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabasePage;
