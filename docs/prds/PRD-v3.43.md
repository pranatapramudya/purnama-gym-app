# PRD-v3.43.md
**Status:** Phase 3.43 - Registration Data Sync & Digital E-Card UI (QR)
**TUGAS ANDA:** Memperbarui skema database untuk sinkronisasi formulir offline (No HP & Alamat) dan merombak UI halaman QR Code menjadi Kartu Member Digital yang menampilkan detail anggota.

---

## 1. UPDATE DATABASE (Prisma Schema)
**Instruksi:** Buka file `prisma/schema.prisma`.
- Cari model yang menyimpan data *User/Member*.
- Tambahkan 2 kolom baru:
  `phoneNumber String?`
  `address     String?`
- *Catatan untuk Tech Lead:* Ingat untuk menjalankan `npx prisma db push` setelah agen selesai mengubah skema ini.

## 2. FORMULIR ONBOARDING / LENGKAPI PROFIL (Sync Formulir Tradisional)
**Instruksi:** - Karena Clerk secara default hanya meminta Email/Nama, buatkan mekanisme agar setelah user berhasil Sign Up, mereka diminta melengkapi `phoneNumber` dan `address` (bisa diletakkan di halaman *Profil* atau form *Onboarding* khusus sebelum masuk ke Dashboard).
- Pastikan form ini terhubung dengan *Server Action* untuk menyimpan data ke database Prisma.

## 3. ROMBAK UI QR CODE (Digital Member Card)
**Instruksi:** Buka file halaman QR Code (contoh: `app/member/qr/page.tsx` atau komponen terkait).
- **Logika Data (Server-Side):** - Ambil data *user* yang sedang login dari Clerk/Prisma.
  - Ambil informasi: `Nama`, `Member ID` (bisa pakai ID dari DB yang dipotong/di-format pendek, contoh: `PG-8472`), dan status `Paket` (VIP atau Non-VIP).
- **Desain UI (E-Card):**
  - Di dalam *container* kartu warna putih (tempat QR berada), tambahkan elemen teks di atas atau di bawah gambar QR Code.
  - **Nama:** Gunakan font tebal (`font-bold text-xl text-gray-800`).
  - **Member ID:** Tampilkan dengan warna sekunder (`text-sm text-gray-500 mb-4`).
  - **Badge Status:** Tampilkan status keanggotaan (Misal: "VIP Member" dengan background emas/hijau, atau "Non-VIP / Reguler" dengan background abu-abu).
  - *Contoh Struktur UI di dalam Card Putih:*
    ```tsx
    <div className="text-center mb-4 border-b pb-4">
      <h2 className="font-extrabold text-2xl text-slate-800">{user.name}</h2>
      <p className="text-sm font-mono text-slate-500">ID: {memberId}</p>
      <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full uppercase tracking-wider">
        {isVip ? 'VIP Member' : 'Reguler'}
      </span>
    </div>
    {/* QR CODE GAMBAR DI SINI */}
    ```

**ATURAN KETAT:**
Gunakan Bahasa Indonesia baku pada UI. Desain harus tetap rapi di perangkat Mobile (kartu tidak boleh melebar/keluar layar). Eksekusi sekarang!