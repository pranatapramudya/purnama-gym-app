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

const menuCategories = [
  {
    title: "Menu Utama",
    items: [
      { href: "/2026/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin_kasir", "super_admin"] },
      { href: "/2026/scanner", label: "Scanner QR", icon: QrCode, roles: ["admin_kasir", "super_admin"] },
    ]
  },
  {
    title: "Operasional",
    items: [
      { href: "/2026/members", label: "Member", icon: Users, roles: ["admin_kasir", "super_admin"] },
      { href: "/2026/personal-trainer", label: "Personal Trainer", icon: CalendarDays, roles: ["super_admin", "trainer"] },
      { href: "/2026/packages", label: "Paket VIP & Visit Harian", icon: Package, roles: ["super_admin"] },
    ]
  },
  {
    title: "Keuangan",
    items: [
      { href: "/2026/transactions", label: "Transaksi", icon: Receipt, roles: ["admin_kasir", "super_admin"] },
      { href: "/2026/kasir", label: "Buku Kas", icon: Banknote, roles: ["admin_kasir", "super_admin"] },
    ]
  },
  {
    title: "Sistem",
    items: [
      { href: "/2026/guides", label: "Panduan Pemula", icon: BookOpen, roles: ["super_admin"] },
      { href: "/2026/staff", label: "Manajemen Karyawan", icon: UserCog, roles: ["super_admin"] },
    ]
  }
];

const allNavItems = menuCategories.flatMap(c => c.items);

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
      {/* Brand & User Profile */}
      <div className="flex items-center gap-3 px-4 py-6">
        <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: "w-9 h-9 rounded-xl shadow-sm",
            },
          }}
        />
        <div>
          <h1 className="text-white font-extrabold text-[15px] tracking-tight leading-none">PURNAMA GYM</h1>
          <p className="text-slate-400 text-[10px] font-medium tracking-wider mt-0.5 uppercase">
            {role === "super_admin" ? "SUPER USER" : role === "admin_kasir" ? "KASIR" : role === "trainer" ? "TRAINER" : "ADMIN PORTAL"}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-slate-700/60 mb-2" />

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-6 overflow-y-auto hide-scrollbar">
        {menuCategories.map((category) => {
          // Check if category has any visible items for this role
          const visibleItems = category.items.filter((item) => item.roles.includes(role));
          if (visibleItems.length === 0) return null;

          return (
            <div key={category.title} className="mb-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4 mb-2 px-4">
                {category.title}
              </p>
              <div className="space-y-1">
                {visibleItems.map((item) => {
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
                      <span className="flex-1 truncate">{item.label}</span>
                      {active && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </>
  );

  const quickNavItems = allNavItems.filter(item => item.roles.includes(role)).slice(0, 4);

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm z-40 shrink-0 w-full sticky top-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-extrabold text-slate-900 tracking-tight">PURNAMA GYM</span>
        </div>
        <UserButton />
      </header>

      {/* Mobile Drawer (Sheet) Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-[260px] bg-slate-900 z-[80] md:hidden transform transition-transform duration-300 flex flex-col ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
          <span className="text-white font-extrabold tracking-tight text-sm">MENU NAVIGASI</span>
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[260px] flex-col bg-slate-900 border-r border-slate-800 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Bottom Navigation Bar (Quick Actions) */}
      <div className="flex md:hidden fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 z-[60] pb-safe justify-around">
        <nav className="flex w-full px-2 items-center h-16 justify-around">
          {quickNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center h-full gap-1 transition-colors min-w-[70px] ${
                  active ? "text-rose-500" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium truncate w-full text-center px-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
