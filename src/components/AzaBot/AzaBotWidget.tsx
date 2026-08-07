import { useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import AzaBotChat from "./AzaBotChat";

type Status = "online" | "checking" | "offline";

const AzaBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>("checking");
  const { t, lang } = useLanguage();

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (!navigator.onLine) {
        if (!cancelled) setStatus("offline");
        return;
      }
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azabot-chat`;
        // Simple GET (no custom headers) — no CORS preflight needed
        const res = await fetch(url, { method: "GET" });
        if (!cancelled) setStatus(res.ok ? "online" : "offline");
      } catch {
        if (!cancelled) setStatus("offline");
      }
    };

    check();
    const id = setInterval(check, 30000);
    const on = () => check();
    window.addEventListener("online", on);
    window.addEventListener("offline", () => setStatus("offline"));
    return () => {
      cancelled = true;
      clearInterval(id);
      window.removeEventListener("online", on);
    };
  }, []);

  const statusMeta = {
    online: {
      dot: "bg-green-400",
      ring: "bg-green-400/50",
      label: lang === "ar" ? "متصل بالوكيل" : "Agent connected",
    },
    checking: {
      dot: "bg-amber-300",
      ring: "bg-amber-300/50",
      label: lang === "ar" ? "جارٍ الاتصال..." : "Connecting...",
    },
    offline: {
      dot: "bg-red-400",
      ring: "bg-red-400/40",
      label: lang === "ar" ? "غير متصل" : "Offline",
    },
  }[status];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 end-6 z-50 w-14 h-14 rounded-full bg-amber-500 text-white shadow-lg flex items-center justify-center hover:bg-amber-600 transition-colors"
            aria-label="Open AzaBot"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="absolute top-0 end-0 flex h-3.5 w-3.5">
              <span className={`absolute inline-flex h-full w-full rounded-full ${statusMeta.ring} animate-ping`} />
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${statusMeta.dot} ring-2 ring-white`} />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 end-6 z-50 w-[380px] h-[560px] max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-border bg-background"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                  🤖
                  <span className="absolute -bottom-0.5 -end-0.5 flex h-3.5 w-3.5">
                    <span className={`absolute inline-flex h-full w-full rounded-full ${statusMeta.ring} animate-ping`} />
                    <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${statusMeta.dot} ring-2 ring-white`} />
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm">{t("azabot.title")}</h3>
                  <p className="text-xs text-white/85 flex items-center gap-1.5">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                    {statusMeta.label}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Content */}
            <AzaBotChat />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AzaBotWidget;
