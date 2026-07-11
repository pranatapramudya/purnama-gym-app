import { SignIn } from "@clerk/nextjs";

export default function AdminSignInPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Sisi Kiri: Branding Admin */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:p-16 bg-slate-900 text-white">
        <h1 className="text-3xl lg:text-5xl font-extrabold mb-4">PURNAMA GYM</h1>
        <p className="text-lg lg:text-xl font-semibold mb-2 text-emerald-400">Portal Internal (Super User, Admin, Personal Trainer)</p>
        <p className="text-sm lg:text-base opacity-75">Sistem internal terintegrasi khusus untuk Super User, Admin Kasir, dan Personal Trainer Purnama Gym.</p>
      </div>

      {/* Sisi Kanan: Clerk Auth Khusus Admin */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 relative">
        <SignIn 
          routing="path" 
          path="/admin/sign-in" 
          forceRedirectUrl="/admin/dashboard" 
        />
      </div>
    </div>
  );
}
