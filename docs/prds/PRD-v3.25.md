# PRD-v3.25.md
**Status:** Phase 3.25 - Hard Wiring Delete Action & Exact String Matching for Filter
**TUGAS ANDA:** Lakukan perbaikan HANYA pada dua titik ini. DILARANG MERUBAH elemen UI lainnya.

---

## 1. Analisis & Perbaikan: Tombol Delete Admin Tidak Merespons
**Masalah:** Mengklik ikon tempat sampah di Dasbor Admin tidak memicu tindakan apa pun (tidak ada *alert*, tidak terhapus).
**Instruksi Eksekusi untuk Agen:**
- Buka komponen *Client* Admin Anda (tempat merender tabel PT).
- Pastikan tombol hapus memiliki properti `onClick` yang benar. Jangan hanya melempar referensi fungsi, bungkus dalam *arrow function*.
- **Wajib gunakan struktur ini pada tombol hapus:**
  ```tsx
  onClick={async () => {
    if (window.confirm("Yakin ingin menghapus jadwal PT ini?")) {
      try {
        await deletePT(pt.id); // Pastikan deletePT di-import dari server action
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  }}

  Pastikan Server Action (deletePT) benar-benar memiliki revalidatePath('/admin/classes') (atau rute yang sesuai) agar tabel langsung ter-refresh otomatis.

2. Analisis & Perbaikan: Filter Kategori Frontend Member Mati
Masalah: Memilih kategori dari Dropdown di halaman Member tidak mengubah daftar jadwal PT yang ditampilkan.
Instruksi Eksekusi untuk Agen:

Buka komponen Client Booking PT (Member).

Periksa dengan teliti nama properti kategori dari database Prisma Anda (apakah namanya pt.category, pt.kategori, atau pt.tipe?).

Perbaiki fungsi deklarasi filter Anda. WAJIB menggunakan standarisasi string (huruf kecil & hapus spasi) untuk menghindari gagal filter karena typo sistem.

Wajib gunakan struktur filter ini:

TypeScript
const filteredPT = ptList.filter((pt) => {
  if (selectedCategory === "Semua") return true;

  // GANTI 'pt.category' di bawah ini dengan nama properti yang BENAR dari database Anda!
  const kategoriDB = String(pt.category || "").trim().toLowerCase();
  const kategoriPilihan = String(selectedCategory).trim().toLowerCase();

  return kategoriDB === kategoriPilihan;
});
Terapkan filteredPT ini ke dalam fungsi .map() yang merender card jadwal.

Aturan Ketat: Berikan KODE REVISI untuk 2 file yang terdampak saja. Jangan berhalusinasi menambahkan fitur lain!