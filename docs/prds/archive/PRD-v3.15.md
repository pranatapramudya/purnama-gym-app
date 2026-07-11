# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.15  
**Status:** Phase 3.15 - Advanced Financial Analytics & Real-Time Sync  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi:** Next.js 15+, Prisma, Tailwind CSS.

---

## 1. Objektif Utama
Meningkatkan Dasbor Admin dengan fitur Analitik Keuangan yang mampu menghitung pemasukan (Harian, Mingguan, Bulanan, Tahunan) secara dinamis mengikuti waktu saat ini (*current date*). Menambahkan fitur *Export* Laporan Keuangan ke format CSV, dan memastikan pembaruan data terasa instan (*near real-time*) menggunakan teknik sinkronisasi Next.js.

---

## 2. Kalkulasi Pendapatan Dinamis & UI Modern
Tugas Agen: Buka halaman `app/admin/dashboard/page.tsx` (dan komponen *Client* terkait jika ada).
- **Filter Otomatis:** Buat logika Prisma yang mengambil data dari tabel `Transaction` dengan status `SUCCESS`. 
  - Gunakan objek JavaScript `Date` untuk menghitung batas waktu (`gte` dan `lte` di Prisma).
  - Siapkan 4 metrik otomatis: Pendapatan Hari Ini, Minggu Ini, Bulan Ini, dan Tahun Ini.
- **UI Dropdown Modern:** Buat komponen *Dropdown* yang elegan (menggunakan Tailwind dan *state* React) untuk mengganti rentang waktu yang ditampilkan pada grafik utama/tabel.
- **Tampilan Angka:** Format seluruh angka ke mata uang Rupiah (contoh: `Rp 1.500.000`).

---

## 3. Fitur Export Laporan Keuangan (CSV)
Tugas Agen: Buat rute API khusus untuk mengunduh laporan.
- Buat file baru di `app/api/export/route.ts`.
- Fungsi API ini harus mengambil seluruh data transaksi (`Transaction`) yang berstatus `SUCCESS`, termasuk relasi ke nama *Member* dan tanggal transaksi.
- Format data tersebut menjadi *string* CSV (dipisahkan koma).
- Kembalikan respons dengan *header* HTTP yang tepat agar *browser* otomatis mengunduh file (misal: `Content-Type: text/csv` dan `Content-Disposition: attachment; filename="Laporan_Purnama_Gym.csv"`).
- Tambahkan tombol "Download CSV" berdesain modern di Dasbor Admin yang mengarah ke *endpoint* API tersebut.

---

## 4. Sinkronisasi Data Real-Time (Milidetik)
Tugas Agen: Memastikan pembaruan data tanpa *refresh* manual.
- **Sisi Server (Mutasi):** Pastikan setiap kali status `Transaction` diubah menjadi `SUCCESS` di file `app/actions/admin.ts`, Anda memanggil `revalidatePath('/admin/dashboard')` agar *cache* Next.js langsung terhapus.
- **Sisi Client (Auto-Refresh):** Pada komponen *Client* dasbor analitik, implementasikan teknik *polling* ringan. Gunakan `useRouter()` dari `next/navigation` dengan `setInterval` yang menjalankan `router.refresh()` setiap 5-10 detik. Ini akan menciptakan ilusi sinkronisasi "milidetik" ketika ada pesanan masuk dari kasir, layar *owner* akan langsung terbarui secara mulus tanpa mengganggu UI.

---

## 5. Standar Eksekusi
- Pastikan tidak ada kode yang memicu memori bocor (*memory leak*) pada `setInterval`, gunakan `useEffect` dan fungsi `cleanup` (`clearInterval`) dengan benar.
- Gunakan Bahasa Indonesia yang baku dan profesional untuk seluruh elemen UI dasbor. Eksekusi sekarang!