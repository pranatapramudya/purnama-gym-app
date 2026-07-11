# PRD-v3.73.md
**Status:** Phase 3.73 - Kasir POS Refinement (Manual Member Entry & Custom Expiry)
**TUGAS ANDA:** Merombak antarmuka (UI) Modal Input Transaksi Kasir agar mendukung penginputan biodata member baru secara manual (tanpa harus registrasi via aplikasi), serta memberikan fitur penentuan tanggal kedaluwarsa (Expired Date) paket secara manual oleh Kasir.

---

## 1. UI/UX Form Kasir: Mode Input Member (Conditional Rendering)
**Lokasi:** Modal "Input Transaksi Kasir" di `app/admin/transactions/TransactionsClient.tsx` (atau file terkait).
**Instruksi Eksekusi UI:**
- Ubah dropdown "Member (Opsional)" menjadi sebuah sistem Pilihan/Toggle (misalnya Radio Button atau Switch):
  - **Opsi A: "Member Terdaftar"** (Menampilkan dropdown pencarian nama member yang sudah ada di database, seperti yang ada saat ini).
  - **Opsi B: "Pendaftaran Manual / Walk-in"** (Menyembunyikan dropdown, lalu memunculkan form input teks manual: `Nama Lengkap`, `No. WhatsApp/HP`, `Email (Opsional)`, dan `Alamat`).
- Jika Opsi B dipilih, pastikan form terlihat rapi dan tidak terlalu panjang (gunakan grid 2 kolom jika perlu).

## 2. UI/UX Form Kasir: Custom Rentang Waktu (Expired Date)
**Lokasi:** Bagian dropdown "Jenis Paket" di dalam Modal yang sama.
**Instruksi Eksekusi UI:**
- Tambahkan logika *Conditional Rendering* saat Kasir memilih Jenis Paket langganan berdurasi (seperti "Bulanan (Regular)", "Bulanan (VIP)").
- Jika paket berdurasi dipilih, munculkan field baru: **"Tanggal Berakhir (Expired Date)"** dengan elemen `<input type="date">`.
- Kasir dibebaskan untuk mengisi manual tanggal, bulan, dan tahun berapa paket tersebut akan habis (tidak dikunci oleh sistem). 
- Jika paket yang dipilih adalah "Harian" atau "Lainnya / Minuman", sembunyikan field input tanggal tersebut.

## 3. Integrasi Server Action (Database Logic)
**Lokasi:** Fungsi submit transaksi di `app/actions/admin.ts`.
**Instruksi Pemrosesan Data:**
- **Skenario Member Manual:** Jika form dikirim dari "Pendaftaran Manual", fungsi backend harus membuat baris data pengguna (User/Member) baru terlebih dahulu di database menggunakan data Nama, No HP, Alamat yang diinput kasir.
- **Skenario Update Expired:** Setelah transaksi berhasil disimpan, ambil nilai dari field "Tanggal Berakhir" yang diinput manual tadi, lalu timpa (update) field `endDate` pada tabel `User` milik member tersebut.
- Pastikan hak akses untuk melakukan ini terbuka dengan baik untuk `role === 'admin'` dan `role === 'superadmin'`.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Lakukan perombakan form secara langsung di dalam proyek dengan gaya Tailwind yang rapi dan responsif. Pastikan transisi muncul/hilangnya form (conditional rendering) berjalan sangat mulus (smooth) di sisi klien.