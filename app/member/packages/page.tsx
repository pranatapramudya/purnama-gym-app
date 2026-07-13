import { Check, Star } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PackagesPage() {
  const dbPackages = await prisma.membershipPackage.findMany({
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
      <header className="flex items-center gap-4">
        <Link href="/member/dashboard" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
          &larr;
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Paket & Visit Harian</h1>
          <p className="text-sm text-slate-500 mt-1">Pilih durasi paket atau kunjungan harian</p>
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
