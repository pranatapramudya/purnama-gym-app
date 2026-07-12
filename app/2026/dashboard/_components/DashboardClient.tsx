"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Users, TrendingUp, CalendarDays, Activity, Download, Calendar, ChevronDown, RefreshCw } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

type ChartData = { name: string; amount: number }[];

type DashboardProps = {
  userRole?: string;
  activeFilter?: string;
  activeMembers: number;
  nonMembers: number;
  classesToday: number;
  checkinsToday: number;
  revenue: {
    today: number;
    week: number;
    month: number;
    last_month?: number;
    year: number;
  };
  charts: {
    today: ChartData;
    week: ChartData;
    month: ChartData;
    last_month?: ChartData;
    year: ChartData;
  };
  recentCheckins: any[];
};

export default function DashboardClient({
  userRole = "member",
  activeMembers,
  nonMembers,
  classesToday,
  checkinsToday,
  revenue,
  charts,
  recentCheckins,
}: DashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter") || "today";
  
  // The active filter used for the charts (if we want to keep them local) or everything
  // Wait, the PRD says to connect it to URL parameter so it is persistent.
  const revenueFilter = filterParam as "today" | "week" | "month" | "last_month" | "year";
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Polling data every 30 seconds invisibly
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [router]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000); // Visual spin duration
  };

  const getRevenueValue = () => {
    switch (revenueFilter) {
      case "today": return revenue.today;
      case "week": return revenue.week;
      case "month": return revenue.month;
      case "last_month": return revenue.last_month || 0;
      case "year": return revenue.year;
      default: return revenue.today;
    }
  };

  const getRevenueLabel = () => {
    switch (revenueFilter) {
      case "today": return "Pendapatan Hari Ini";
      case "week": return "Pendapatan Minggu Ini";
      case "month": return "Pendapatan Bulan Ini";
      case "last_month": return "Pendapatan Bulan Lalu";
      case "year": return "Pendapatan Tahun Ini";
      default: return "Pendapatan Hari Ini";
    }
  };

  const getChartData = () => {
    switch (revenueFilter) {
      case "today": return charts.today;
      case "week": return charts.week;
      case "month": return charts.month;
      case "last_month": return charts.last_month || charts.month;
      case "year": return charts.year;
      default: return charts.today;
    }
  };

  const stats = [
    ...(userRole === 'superadmin' ? [{
      label: "Member Aktif",
      value: activeMembers.toString(),
      change: "Real-time",
      subtext: `${nonMembers} Non-Member`,
      trend: "neutral" as const,
      icon: Users,
      gradient: "from-violet-500 to-purple-500",
      shadow: "shadow-violet-500/20",
    }] : []),
    ...(userRole === 'superadmin' ? [{
      label: getRevenueLabel(),
      value: `Rp ${getRevenueValue().toLocaleString("id-ID")}`,
      change: "Real-time",
      trend: "neutral" as const,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
    }] : []),
    {
      label: `Sesi PT ${revenueFilter === 'today' ? 'Hari Ini' : revenueFilter === 'month' ? 'Bulan Ini' : revenueFilter === 'week' ? 'Minggu Ini' : 'Tahun Ini'}`,
      value: `${classesToday} Sesi`,
      change: "Real-time",
      trend: "neutral" as const,
      icon: CalendarDays,
      gradient: "from-rose-500 to-pink-500",
      shadow: "shadow-rose-500/20",
    },
    {
      label: `Check-in ${revenueFilter === 'today' ? 'Hari Ini' : revenueFilter === 'month' ? 'Bulan Ini' : revenueFilter === 'week' ? 'Minggu Ini' : 'Tahun Ini'}`,
      value: checkinsToday.toString(),
      change: "Real-time",
      trend: "neutral" as const,
      icon: Activity,
      gradient: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/20",
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Ringkasan operasional Purnama Gym.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-2" />
              <span className="text-xs font-bold text-slate-600">Live</span>
            </div>
            
            <button 
              onClick={handleManualRefresh}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-emerald-600 border border-transparent hover:border-slate-200"
              title="Refresh Manual"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {(userRole === 'superadmin' || userRole === 'admin') && (
            <Link
              href={`/api/export?filter=${revenueFilter}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Unduh Laporan (Excel)
            </Link>
          )}
        </div>
      </div>

      {/* Filter and Stats */}
      <div className="space-y-4">
        <div className="flex justify-end relative" ref={dropdownRef}>
          {userRole === 'superadmin' ? (
            <>
              {/* Custom Dropdown */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>
                  {revenueFilter === "today" && "Hari Ini"}
                  {revenueFilter === "week" && "Minggu Ini"}
                  {revenueFilter === "month" && "Bulan Ini"}
                  {revenueFilter === "last_month" && "Bulan Lalu"}
                  {revenueFilter === "year" && "Tahun Ini"}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-10">
                  <div className="p-1">
                    {(["today", "month", "last_month", "year"] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          router.push(`?filter=${filter}`);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          revenueFilter === filter 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {filter === "today" && "Hari Ini"}
                        {filter === "month" && "Bulan Ini"}
                        {filter === "last_month" && "Bulan Lalu"}
                        {filter === "year" && "Tahun Ini"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Hari Ini</span>
            </div>
          )}
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                  {(stat as any).subtext && (
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {(stat as any).subtext}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {/* Charts & Activity */}
      <section className={`grid grid-cols-1 ${userRole === 'superadmin' ? 'xl:grid-cols-5' : 'xl:grid-cols-1'} gap-6`}>
        {/* Revenue Chart */}
        {userRole === 'superadmin' && (
          <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Grafik Pendapatan</h3>
                <p className="text-xs text-slate-500 mt-0.5">Berdasarkan rentang waktu yang dipilih</p>
              </div>
            </div>
            
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    dy={10} 
                    minTickGap={20}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}k`}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value: any) => {
                      const numericValue = Number(value) || 0;
                      return [`Rp ${numericValue.toLocaleString('id-ID')}`, 'Pendapatan'];
                    }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className={`${userRole === 'superadmin' ? 'xl:col-span-2' : 'xl:col-span-1'} bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm`}>
          <h3 className="text-sm font-bold text-slate-900 mb-4">Check-in Terkini</h3>
          <div className="space-y-3">
            {recentCheckins.map((item) => (
              <div key={item.id} className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors shrink-0">
                  {item.user.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{item.user.name}</p>
                  <p className="text-[10px] text-slate-500">Check-in</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-medium text-slate-500">
                    {new Date(item.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.user.role === "MEMBER"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-blue-50 text-blue-600"
                  }`}>
                    {item.user.role === "MEMBER" ? "VIP" : "Regular"}
                  </span>
                </div>
              </div>
            ))}
            {recentCheckins.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">Belum ada check-in.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
