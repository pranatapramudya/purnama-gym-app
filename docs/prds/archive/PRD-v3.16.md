# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.16  
**Status:** Phase 3.16 - Modern UI Analytics, Recharts Integration & Smart Polling

---

## 1. Objektif Utama
Memodernisasi antarmuka Dasbor Analitik Admin dengan mengganti *dropdown* bawaan HTML menjadi desain kustom yang elegan, mengintegrasikan pustaka grafik dinamis untuk memvisualisasikan data sesuai rentang waktu, dan menerapkan *auto-refresh* 30 detik dengan indikator visual modern.

---

## 2. Integrasi Grafik Dinamis (Recharts)
Tugas Agen: Ubah *placeholder* grafik statis menjadi grafik interaktif.
- Buka terminal dan arahkan pengguna untuk menginstal pustaka grafik: `npm install recharts`.
- Buka komponen *Client* dasbor analitik (`DashboardClient.tsx`).
- Ganti elemen garis statis berwarna pink di bagian "Pendapatan" dengan komponen `<ResponsiveContainer>` dan `<AreaChart>` atau `<BarChart>` dari `recharts`.
- **Data Binding:** Pastikan data yang dimasukkan ke dalam grafik ini bersifat reaktif terhadap pilihan rentang waktu (misalnya, jika "Minggu Ini" dipilih, tampilkan grafik dari hari Senin-Minggu; jika "Tahun Ini" dipilih, tampilkan grafik bulan Jan-Des).

---

## 3. Modernisasi Dropdown & Filter Waktu
Tugas Agen: Buat komponen *dropdown* kustom yang premium.
- **HAPUS** elemen `<select>` bawaan HTML yang terlihat kuno.
- Buat *Custom Dropdown* menggunakan elemen `<div>`, `useState` untuk *toggle* buka/tutup, dan ikon dari `lucide-react` (seperti `<Calendar />` dan `<ChevronDown />`).
- **Pilihan Kalender:** Tambahkan opsi pada *dropdown* untuk: "Hari Ini", "Minggu Ini", "Bulan Ini", dan "Tahun Ini". 
- Pastikan desain *dropdown* memiliki efek *hover* yang lembut, bayangan (*shadow-lg*), dan sudut membulat (*rounded-xl*) agar selaras dengan tema hijau gradasi Purnama Gym.

---

## 4. Auto-Refresh 30 Detik & Indikator Visual
Tugas Agen: Tingkatkan fitur sinkronisasi *real-time*.
- Ubah interval `setInterval` pada `useEffect` yang memanggil `router.refresh()` menjadi 30 detik (30000ms).
- **Indikator Modern:** Tambahkan teks kecil yang elegan di sudut kanan atas dasbor (di dekat tombol "Unduh Laporan CSV") dengan tulisan: *"Diperbarui otomatis setiap 30 detik"*. 
- Tambahkan ikon `<RefreshCcw />` berukuran kecil (size 14 atau 16) yang memiliki efek animasi berputar perlahan (`animate-spin` yang sangat lambat, atau *pulse*) di sebelah teks tersebut agar pengguna tahu sistem sedang bekerja di latar belakang.

---

## 5. Standar Eksekusi
- Pastikan implementasi `recharts` diatur dengan warna tema aplikasi (menggunakan heksadesimal hijau seperti `#10b981` untuk warna garis/grafik).
- Jangan gunakan bahasa Inggris pada antarmuka. Eksekusi perombakan komponen Dasbor Client ini sekarang juga!