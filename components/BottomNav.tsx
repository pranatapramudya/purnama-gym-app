"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, BookOpen, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/member/dashboard", label: "Beranda", icon: Home },
    { href: "/member/schedule", label: "Jadwal", icon: Calendar },
    { href: "/member/guide", label: "Panduan", icon: BookOpen },
    { href: "/member/profile", label: "Profil", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white border-t border-slate-200 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors
                ${isActive ? "text-rose-500" : "text-slate-400 hover:text-slate-700"}
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? "fill-rose-500/10" : ""}`} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
