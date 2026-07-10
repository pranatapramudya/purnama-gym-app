# PRD-v3.40.md
**Status:** Phase 3.40 - Global Admin UI/UX Responsive Refactoring (Table-to-Card Pattern)
**TUGAS ANDA:** Merombak seluruh tampilan tabel di halaman Admin agar tidak memerlukan horizontal scroll di perangkat Mobile/iOS. Terapkan pola "Table-to-Card" menggunakan Tailwind CSS.

---

## 1. Analisis UI/UX
**Masalah:** Tabel data di halaman dasbor admin (Member, Personal Trainer, Transaksi, Scanner QR, Paket VIP, Panduan Pemula) memakan ruang terlalu lebar di perangkat seluler sehingga mengharuskan pengguna melakukan *horizontal scroll*.
**Solusi:** Implementasikan *Responsive Rendering*. Gunakan `<table>` standar untuk Desktop, dan tumpukan `<div className="card">` untuk Mobile.

## 2. Instruksi Refactoring (Berlaku untuk semua halaman Admin yang memiliki Tabel)
Terapkan arsitektur Tailwind ini pada setiap file yang memiliki tabel data:

**A. Sembunyikan Tabel di Mobile:**
Tambahkan class `hidden md:table` atau `hidden md:block` pada kontainer `<table>` atau `<Table>` yang sudah ada.

**B. Buat Tampilan "Card" Khusus Mobile:**
Tepat di bawah tabel tersebut, buat kontainer baru khusus mobile dengan class `grid grid-cols-1 gap-4 md:hidden`. Di dalamnya, lakukan *mapping* data yang sama, namun render sebagai kartu.
- *Contoh Struktur Kartu (Sesuaikan dengan properti data masing-masing halaman):*
  ```tsx
  {/* Mobile Card View */}
  <div className="grid grid-cols-1 gap-4 md:hidden">
    {data.map((item) => (
      <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-2">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-bold text-gray-800">{item.nama}</span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{item.status}</span>
        </div>
        <div className="text-sm text-gray-600 flex justify-between">
          <span>Email:</span>
          <span className="font-medium text-gray-800">{item.email}</span>
        </div>
        {/* Tombol Aksi Mobile */}
        <div className="mt-2 flex gap-2">
          <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold">Edit</button>
          <button className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-sm font-semibold">Hapus</button>
        </div>
      </div>
    ))}
  </div>

  3. Lokasi Implementasi Target
Terapkan pola di atas pada halaman-halaman berikut (kerjakan secara bertahap atau berikan komponen wrapper yang dapat digunakan ulang):

Dashboard Utama

Kelola Member

Personal Trainer

Transaksi

Scanner QR

Paket VIP

Panduan Pemula

ATURAN KETAT:

WAJIB menggunakan Bahasa Indonesia untuk semua label, teks, dan status di dalam Card Mobile (misalnya: "Nama", "Status", "Edit", "Hapus") sesuai dengan aturan lokalisasi proyek ini.

DILARANG menggunakan overflow-x-auto untuk membiarkan tabel bisa di- scroll. Harus diubah menjadi Card di layar kecil!