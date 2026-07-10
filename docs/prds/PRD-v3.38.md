# PRD-v3.38.md
**Status:** Phase 3.38 - Dedicated Admin Authentication Flow (Staff Entrance)
**TUGAS ANDA:** Membuat halaman Sign In khusus untuk Admin/Owner agar tidak perlu melewati rute Member Dashboard setelah login.

---

## 1. Analisis Alur Kerja (Workflow)
**Masalah saat ini:** Link rahasia di *footer* mengarah ke `/admin/dashboard`. Jika belum login, *middleware* melempar *user* ke `/sign-in` (pintu member). Setelah login, Clerk mengembalikan *user* ke `/member/dashboard`, sehingga Admin harus mengetik ulang URL secara manual.
**Solusi:** Buat rute login khusus Admin yang secara paksa mengarahkan (redirect) ke dasbor Admin setelah autentikasi sukses.

## 2. Instruksi Pembuatan Halaman Login Admin (Wajib Eksekusi!)
**Tugas:** Buat struktur folder dan file baru: `app/admin/sign-in/[[...sign-in]]/page.tsx`

- **Desain UI (Admin Vibe):**
  - Buat *layout* yang berbeda dari *login* member agar Admin tahu mereka ada di jalur yang benar.
  - Gunakan *background* gelap profesional (misal: `bg-slate-900`) untuk satu halaman penuh.
  - Tambahkan teks penanda di atas form login: "Purnama Gym - Admin Portal" (dengan warna teks putih/terang).
- **Logika Clerk Redirect:**
  - Panggil komponen `<SignIn />` dari Clerk.
  - **SANGAT PENTING:** Tambahkan properti `forceRedirectUrl="/admin/dashboard"` pada komponen tersebut.
  - *Contoh Kode:* ```tsx
    <SignIn forceRedirectUrl="/admin/dashboard" routing="path" path="/admin/sign-in" />
    ```

## 3. Update Pemicu Footer (Hidden Trigger)
**Tugas:** Buka komponen Footer Anda.
- Ubah tautan pada teks "2026" (atau elemen *copyright* yang dijadikan pemicu rahasia).
- Ganti `href="/admin/dashboard"` menjadi `href="/admin/sign-in"`.

**ATURAN KETAT:**
Pastikan rute `/admin/sign-in` ini dikecualikan (dijadikan *public route*) di dalam konfigurasi `middleware.ts` agar Clerk tidak memblokirnya. Berikan kode lengkap untuk halaman login admin baru ini!