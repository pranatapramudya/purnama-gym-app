import { Check, Star } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PackagesPage({ searchParams }: { searchParams: Promise<{ kategori?: string }> }) {
  const { kategori } = await searchParams;

  let whereClause = {};
  let pageTitle = "Paket & Visit Harian";
  let pageSubtitle = "Pilih durasi paket atau kunjungan harian";

  if (kategori === "vip") {
    whereClause = { durationMonths: { gt: 0 } };
    pageTitle = "Paket VIP Membership";
    pageSubtitle = "Pilih durasi paket keanggotaan VIP Anda";
  } else if (kategori === "visit") {
    whereClause = { durationMonths: 0 };
    pageTitle = "Visit Harian";
    pageSubtitle = "Beli tiket kunjungan harian Anda";
  }

  const dbPackages = await prisma.membershipPackage.findMany({
    where: whereClause,
    orderBy: { price: "asc" }
  });

  const packages = dbPackages.map(pkg => {
    let discountPromo = 0;
    if (pkg.originalPrice && pkg.originalPrice > pkg.price) {
      discountPromo = Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
    }
    
    return {
      id: pkg.id,
      duration: pkg.name,
      durationMonths: pkg.durationMonths,
      priceValue: pkg.price,
      price: `Rp ${pkg.price.toLocaleString("id-ID")}`,
      originalPriceValue: pkg.originalPrice,
      originalPrice: pkg.originalPrice ? `Rp ${pkg.originalPrice.toLocaleString("id-ID")}` : null,
      discountPromo,
      description: pkg.description,
      isPopular: pkg.isPopular,
    };
  });

  return (
    <div className="p-4 space-y-6">
      <header className="bg-gradient-to-br from-emerald-200 via-teal-300 to-emerald-400 px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-xl shadow-teal-900/10 border-b border-white/60 mb-6 relative overflow-hidden -mx-4 -mt-4 flex items-center gap-4">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <Link href="/member/dashboard" className="relative z-10 w-10 h-10 rounded-full bg-white/20 border border-slate-800/10 flex items-center justify-center text-slate-900 hover:bg-white/30 transition-colors font-bold text-lg">
          &larr;
        </Link>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
          <p className="text-sm font-medium text-slate-700/90 mt-1">{pageSubtitle}</p>
        </div>
      </header>

      {packages.length === 0 ? (
        <div className="pt-8 text-center text-slate-500">
          <p>Saat ini belum ada paket VIP yang tersedia.</p>
          <p>Silakan hubungi Admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 pt-2">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98] border relative ${
                pkg.isPopular 
                  ? "bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200" 
                  : "bg-white border-slate-100"
              }`}
            >
              <div>
                {pkg.isPopular && pkg.durationMonths > 0 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap">
                    <Star className="w-3 h-3 fill-current" /> BEST SELLER
                  </div>
                )}
                {pkg.durationMonths === 0 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap">
                    VISIT HARIAN
                  </div>
                )}
                <div className="text-sm font-semibold text-slate-900 mt-1">{pkg.duration}</div>
                {pkg.originalPriceValue && pkg.originalPriceValue > pkg.priceValue && (
                  <div className="flex items-center mt-1.5">
                    <div className="text-sm text-slate-400 line-through leading-none">
                      {pkg.originalPrice}
                    </div>
                    {pkg.discountPromo > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded ml-2 animate-pulse">
                        - {pkg.discountPromo}%
                      </span>
                    )}
                  </div>
                )}
                <div className="text-lg font-bold text-rose-500 mt-1">{pkg.price}</div>
                {pkg.description && (
                  <div className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {pkg.description}
                  </div>
                )}
              </div>
              <Link href={`/member/payment?packageId=${pkg.id}`} className={`mt-4 block text-center w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
                pkg.isPopular 
                  ? "bg-rose-500 text-white shadow-md shadow-pink-200/50 hover:bg-rose-600" 
                  : "bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200/50"
              }`}>
                Pilih
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
