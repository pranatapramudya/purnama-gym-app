# PRD-v3.97.md
**Status:** Phase 3.97 - UX Simplification: Remove Input Placeholders
**TUGAS ANDA:** Menghapus sepenuhnya atribut placeholder dari form input pada modul Tambah Karyawan dan Registrasi Member untuk menghindari kebingungan pengguna (False Affordance).

---

## 1. Hapus Placeholder: Form Tambah Karyawan
**Lokasi:** Komponen UI "Tambah Karyawan Baru" (misal: `components/admin/NewStaffModal.tsx` atau file sejenis).
**Instruksi Eksekusi UI:**
- Cari tag `<input>` untuk field **Nama Lengkap** dan **Email Aktif**.
- Hapus atribut `placeholder="Budi Santoso"` dan `placeholder="budi@purnamagym.com"`.
- Biarkan field tersebut sepenuhnya kosong.

## 2. Hapus Placeholder: Form Registrasi Member
**Lokasi:** Komponen UI "Data Diri Member" pada halaman pendaftaran/kasir (kemungkinan di `app/admin/members/new/page.tsx` atau komponen form registrasi).
**Instruksi Eksekusi UI:**
- Cari tag `<input>` untuk field **Nama Lengkap** dan **Email**.
- Hapus atribut `placeholder` yang menampilkan contoh nama dan email.
- Biarkan field tersebut sepenuhnya kosong.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Cukup hapus atribut `placeholder` pada komponen terkait. Berikan konfirmasi jika form sudah bersih dari teks contoh.