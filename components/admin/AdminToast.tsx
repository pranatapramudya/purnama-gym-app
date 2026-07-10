"use client";

import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useEffect, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface AdminToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

const toastConfig: Record<ToastType, { icon: typeof CheckCircle2; gradient: string; shadow: string }> = {
  success: {
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/20",
  },
  error: {
    icon: AlertCircle,
    gradient: "from-red-500 to-rose-500",
    shadow: "shadow-red-500/20",
  },
  warning: {
    icon: AlertTriangle,
    gradient: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/20",
  },
  info: {
    icon: Info,
    gradient: "from-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/20",
  },
};

export function AdminToast({ message, type = "success", visible, onDismiss, duration = 3000 }: AdminToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [visible, onDismiss, duration]);

  if (!visible) return null;

  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed top-6 right-6 z-[100] w-80 animate-[slideInRight_0.35s_ease-out]">
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(2rem); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div className={`bg-gradient-to-r ${config.gradient} rounded-2xl p-[1.5px] shadow-xl ${config.shadow}`}>
        <div className="bg-white rounded-[14px] px-4 py-3 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shrink-0`}>
            <Icon className="w-[18px] h-[18px] text-white" />
          </div>
          <p className="text-sm font-semibold text-slate-800 flex-1 leading-tight">{message}</p>
          <button
            onClick={onDismiss}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
