# PRD-v3.42.md
**Status:** Phase 3.42 - Frontend Hyper-Optimization (Millisecond Responsiveness)
**TUGAS ANDA:** Mengaudit dan mengoptimasi seluruh navigasi serta elemen interaktif di sisi Frontend (Landing Page, Navbar, Footer) untuk mencapai responsivitas tingkat milidetik (Zero-Delay UX).

---

## 1. Analisis Performa Frontend
**Masalah:** Terdapat jeda (delay/lag) yang terasa saat pengguna mengklik menu navigasi di sisi frontend. Di aplikasi tingkat Enterprise dengan *traffic* tinggi, ini akan merusak *User Experience* dan menurunkan tingkat konversi.
**Target:** Navigasi instan tanpa *blocking* di Main Thread.

## 2. Instruksi Optimasi (WAJIB DIJALANKAN!):

**A. Audit Navigasi & Prefetching (next/link)**
- Periksa seluruh file komponen di `app/components/frontend` (seperti Navbar, Footer, Hero Button).
- Pastikan **TIDAK ADA** navigasi yang menggunakan `window.location.href` atau tag standar `<a href="...">`.
- Jika terdapat penggunaan `useRouter().push()`, pastikan itu dibungkus dengan `startTransition` dari React untuk mencegah *blocking* UI, ATAU ganti sepenuhnya menggunakan komponen `<Link>` dari Next.js.
- Pastikan semua `<Link>` utama memiliki sifat *prefetch* yang aktif (default Next.js).

**B. Isolasi Client Components ("use client")**
- Jangan meletakkan `"use client"` di tingkat Layout atau halaman *root* secara keseluruhan jika tidak perlu!
- Turunkan `"use client"` hanya ke komponen "daun" (komponen terkecil yang butuh interaktivitas seperti tombol *toggle menu* atau *slider*). Biarkan sisa halamannya tetap menjadi Server Components (RSC) agar ukuran JavaScript yang dikirim ke browser sangat kecil dan ringan.

**C. Optimasi Asset & Layout Shift**
- Pindai semua penggunaan gambar di halaman depan.
- Jika ada tag `<img>` HTML biasa, **UBAH PAKSA** menjadi `<Image>` dari `next/image` dengan properti `priority` untuk gambar utama (Hero) dan ukuran (width/height) yang eksplisit agar tidak terjadi *Cumulative Layout Shift* (CLS) saat halaman dimuat.

**D. Non-blocking UI Interactions**
- Jika ada *dropdown* menu atau animasi pada Navbar frontend, pastikan animasinya menggunakan CSS murni (seperti Tailwind `transition-all duration-200`) dan BUKAN menggunakan *state* React berat yang memicu *re-render* seluruh komponen saat di-klik.

**ATURAN EKSEKUSI:**
Bertindaklah sebagai Senior Performance Engineer. Jangan merusak desain yang sudah rapi. Audit kode Anda dan berikan kode yang sudah di- *refactor* (fokus pada Navbar dan elemen navigasi frontend).