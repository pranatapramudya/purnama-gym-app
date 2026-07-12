"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Receipt,
  QrCode,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Package,
  BookOpen,
  UserCog,
  BarChart3,
  Banknote
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/2026/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin_kasir", "super_admin"] },
  { href: "/2026/members", label: "Member", icon: Users, roles: ["admin_kasir", "super_admin"] },
  { href: "/2026/personal-trainer", label: "Personal Trainer", icon: CalendarDays, roles: ["super_admin", "trainer"] },
  { href: "/2026/transactions", label: "Transaksi", icon: Receipt, roles: ["admin_kasir", "super_admin"] },
  { href: "/2026/scanner", label: "Scanner QR", icon: QrCode, roles: ["admin_kasir", "super_admin"] },
  { href: "/2026/packages", label: "Paket VIP", icon: Package, roles: ["super_admin"] },
  { href: "/2026/guides", label: "Panduan Pemula", icon: BookOpen, roles: ["super_admin"] },
  { href: "/2026/staff", label: "Manajemen Karyawan", icon: UserCog, roles: ["super_admin"] },
  { href: "/2026/kasir", label: "Buku Kas", icon: Banknote, roles: ["admin_kasir", "super_admin"] },
];

interface AdminSidebarProps {
  adminName: string;
  role?: string;
}

export function AdminSidebar({ adminName, role = "member" }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-pink-400 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/25">
            <Sparkles className="w-[18px] h-[18px] text-white" />
          </div>
          <div>
            <h1 className="text-white font-extrabold text-[15px] tracking-tight leading-none">PURNAMA GYM</h1>
            <p className="text-slate-400 text-[10px] font-medium tracking-wider mt-0.5">ADMIN PORTAL</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-slate-700/60 mb-4" />

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          if (!item.roles.includes(role)) return null;
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                active
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                active
                  ? "bg-gradient-to-br from-rose-500 to-pink-500 shadow-sm shadow-rose-500/25"
                  : "bg-slate-800 group-hover:bg-slate-700"
              }`}>
                <Icon className="w-[16px] h-[16px]" />
              </div>
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Admin profile footer */}
      <div className="px-4 pb-5">
        <div className="h-px bg-slate-700/60 mb-4" />
        <div className="flex items-center gap-3 px-2">
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9 rounded-xl shadow-sm",
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold truncate leading-tight">{adminName}</p>
            <p className="text-slate-500 text-[10px] font-medium mt-0.5">Administrator</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[260px] flex-col bg-slate-900 border-r border-slate-800 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="flex md:hidden fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 z-[60] pb-safe">
        <nav className="flex overflow-x-auto whitespace-nowrap hide-scrollbar items-center w-full h-16">
          {navItems.map((item) => {
            if (!item.roles.includes(role)) return null;
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center h-full gap-1 transition-colors min-w-[80px] flex-shrink-0 ${
                  active ? "text-rose-500" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
