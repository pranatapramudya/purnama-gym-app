# PRD-v3.77.md
**Status:** Phase 3.77 - Unified CRM & POS System (One-Stop Registration & Payment)
**TUGAS ANDA:** Menggabungkan fitur "Input Penjualan/Pembayaran" ke dalam form "Registrasi Member Baru", menghapus tombol dan komponen transaksi yang terpisah, serta memastikan form baru ini terintegrasi langsung dengan database Master Paket dan Pencatatan Transaksi secara simultan (Atomic Transaction).

---

## 1. Hapus Komponen Redundan (Cleanup)
**Lokasi:** `app/admin/members/MembersClient.tsx` (atau lokasi tombol sebelumnya).
**Instruksi Eksekusi:**
- Hapus secara permanen tombol "+ Input Penjualan / Pembayaran".
- Hapus (delete) file komponen Modal Input Transaksi Kasir yang sebelumnya dibuat, karena logikanya akan dilebur ke dalam Registrasi.

## 2. Rombak UI Form "Registrasi Member Baru"
**Lokasi Modal:** `app/admin/members/MembersClient.tsx` (Komponen Modal Registrasi).
**Instruksi Eksekusi UI:**
Rancang form pendaftaran ini agar mengalir (flow) dari atas ke bawah dengan field berikut:
- **Data Diri:** 
  - `Nama Lengkap` (Input text, Wajib)
  - `Email` (Input text, Opsional/Wajib sesuai skema)
  - `Nomor Telepon` (Input text, Wajib)
- **Pemilihan Peran & Paket (Dynamic Fetching):**
  - Buat opsi pemilihan Role/Paket. Gunakan data yang di-fetch secara dinamis dari tabel Master Paket (seperti `VIPPackage` atau pengaturan paket dari Super User).
  - Tampilkan durasi bulan/waktu langsung mengikuti opsi paket yang dipilih (misal: "VIP Member - 1 Bulan", "VIP Member - 3 Bulan").
- **Pembayaran (Auto-Calculation):**
  - `Nominal Pembayaran`: Otomatis terisi dan terformat Rupiah (misal: Rp 150.000) berdasarkan paket yang dipilih di atas. Gunakan teks/input *read-only* agar kasir tidak repot mengetik nominal.
  - `Metode Pembayaran`: Dropdown (Tunai, Transfer Bank, QRIS, dll).

## 3. Server Action: Atomic Transaction (Prisma)
**Lokasi:** Fungsi submit registrasi di `app/actions/admin.ts` (misal: `registerNewMember`).
**Instruksi Eksekusi Logika:**
- Gunakan Prisma `$transaction` (Atomic Transaction) untuk memastikan seluruh proses ini berhasil bersamaan atau batal bersamaan jika ada error.
- **Langkah 1:** Buat record `User` baru (simpan Nama, Email, No HP). Set `role` dan `endDate` secara presisi berdasarkan paket yang dipilih.
- **Langkah 2:** Buat record `Transaction` (atau `CashFlow`) yang ditautkan ke ID `User` baru tersebut, dengan merekam Nominal, Metode Pembayaran, dan status "SUCCESS".
- **Langkah 3:** Berikan *return/response* yang bersih agar UI Modal tertutup otomatis dan memunculkan notifikasi "Member berhasil didaftarkan & Transaksi dicatat".

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Lakukan perombakan form dan Server Action secara langsung pada proyek. Pastikan UI terlihat rapi dan tidak terlalu panjang (gunakan grid 2 kolom untuk memadatkan form jika diperlukan).