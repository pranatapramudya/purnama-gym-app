"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";

export function RoleToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      setShow(true);
      // Clean up the URL
      const newUrl = pathname;
      window.history.replaceState({}, "", newUrl);
      
      const timer = setTimeout(() => {
        setShow(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, pathname]);

  if (!show) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-red-50 border border-red-200 shadow-xl rounded-xl p-4 flex items-start gap-3 max-w-sm">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-red-800 font-bold text-sm">Akses Ditolak</p>
          <p className="text-red-600 text-xs mt-1">Anda tidak memiliki izin ke halaman ini.</p>
        </div>
        <button 
          onClick={() => setShow(false)}
          className="text-red-400 hover:text-red-600 transition-colors ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
