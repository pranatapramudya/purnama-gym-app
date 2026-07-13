import { SignUp } from "@clerk/nextjs";


export default function SignUpPage() {
  return (
    <main className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Kiri - Branding Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:p-16 bg-gradient-to-br from-emerald-500 to-teal-900 text-white">

        <h1 className="text-4xl xl:text-5xl font-black tracking-tight mb-4 leading-tight">
          PURNAMA GYM
        </h1>
        <h2 className="text-xl xl:text-2xl font-bold text-emerald-100 mb-6">
          Fasilitas Gym Khusus Wanita Terbaik di Sumedang.
        </h2>
        <p className="text-emerald-50/80 text-lg leading-relaxed max-w-md">
          Bergabunglah sekarang dan mulai perjalanan sehatmu dengan privasi dan kenyamanan penuh. Daftar sekarang dan jadilah bagian dari komunitas kami.
        </p>
      </div>

      {/* Kanan - Auth Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 relative">
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" forceRedirectUrl="/auth-sync" />
      </div>
    </main>
  );
}
