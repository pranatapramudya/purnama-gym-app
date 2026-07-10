"use client";

import React from "react";
// Anda bisa menginstall react-qr-code atau memanggil API
// Untuk sementara ini adalah placeholder visual

export function QRCodeGenerator({ userId }: { userId: string }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-inner border-2 border-dashed border-gray-200">
      <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
        <div className="text-center">
          <div className="text-4xl mb-2">🔳</div>
          <span className="text-xs text-gray-400 font-mono break-all">{userId}</span>
        </div>
      </div>
    </div>
  );
}
