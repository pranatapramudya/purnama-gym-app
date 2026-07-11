# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.23 (Final Bug Bash)  
**Status:** Phase 3.23 - Fixing Prisma Relational Delete & Category Filter
**DILARANG BERHALUSINASI. BACA INSTRUKSI INI DENGAN TELITI!**

---

## 1. Perbaikan Kritis: Fitur Hapus Admin (Prisma Foreign Key)
**Analisis:** Tombol hapus tidak berfungsi karena dua alasan: 1) Belum diikat ke `onClick`, 2) Terjadi *Foreign Key Constraint Error* di Prisma saat mencoba menghapus jadwal PT yang sudah memiliki data *booking* di dalamnya (Kapasitas 1/25).
**Tugas Agen:**
- **Perbaiki Server Action (`app/actions/admin.ts`):** 
  Ubah fungsi `deletePT` Anda agar menghapus data anak (relasi) terlebih dahulu sebelum menghapus data induknya. Gunakan Prisma Transaction jika perlu, atau panggil secara berurutan:
  ```typescript
  // Contoh Logika Wajib
  await prisma.booking.deleteMany({ where: { classId: id } }); // Hapus semua booking terkait jadwal ini dulu
  await prisma.gymClass.delete({ where: { id } }); // Baru hapus jadwal PT-nya
  revalidatePath('/admin/classes');

  2. Perbaikan Kritis: Filter Kategori Frontend Member
Analisis: Saat pengguna memilih kategori di dropdown (misal: "GYM KHUSUS WANITA" atau "Umum"), jadwal PT tidak muncul atau tidak tersaring dengan benar.
Tugas Agen:

Buka komponen Client untuk Member Booking PT (app/member/booking/BookingClient.tsx atau sejenisnya).

Perbaiki logika fungsi filter pada array jadwal PT.

Pastikan logika persis seperti ini:
const filteredPT = ptList.filter((pt) => selectedCategory === 'Semua' || pt.category === selectedCategory);

Pengecekan String: Pastikan tidak ada masalah case-sensitivity atau spasi ekstra (trailing spaces). Jika perlu, gunakan .toLowerCase() saat membandingkan string kategori.

Standar Eksekusi:
Berikan kode perbaikannya secara utuh, jangan terpotong. Selesaikan dua bug UI/UX ini sekarang agar aplikasi siap deploy!