"use client";

import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

interface QRRendererProps {
  userId: string;
}

export function QRRenderer({ userId }: QRRendererProps) {
  const [baseUrl, setBaseUrl] = useState<string>("");

  useEffect(() => {
    setBaseUrl(process.env.NEXT_PUBLIC_BASE_URL || window.location.origin);
  }, []);

  if (!baseUrl || !userId) {
    return (
      <div className="w-full h-full aspect-square bg-slate-100/10 rounded-xl flex items-center justify-center animate-pulse">
        <span className="text-sm font-medium text-slate-400">Memuat QR...</span>
      </div>
    );
  }

  const qrValue = `${baseUrl}/verify/${userId}`;

  return (
    <QRCode 
      value={qrValue} 
      size={200}
      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
      viewBox={`0 0 256 256`}
    />
  );
}
