# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.4.1 (Hotfix)  
**Status:** Phase 3.4.1 - Syntax Error Resolution & Dynamic Data Enforcement

---

## 1. Penyelesaian Bug Kritis: Syntax Error di Server Actions
**Analisis:** Terdapat duplikasi blok penangkap error (`catch`) pada file *Server Actions* yang menyebabkan gagal kompilasi (*Parsing ecmascript source code failed*).
**Tugas Agen AI:** 
- Buka file `app/actions/admin.ts`.
- Cari baris kode (sekitar baris 142-146) yang memiliki duplikasi `catch (error: any) { ... } catch (error: any) { ... }`.
- Hapus salah satu blok `catch` yang berlebih tersebut. Pastikan struktur `try...catch` kembali valid.

## 2. Pembersihan Data Dummy (Frontend Member)
Karena kompilasi sebelumnya gagal, sinkronisasi antarmuka Member belum sempurna. Lakukan eksekusi wajib berikut:

**A. Kategori Dinamis (`app/member/dashboard` atau komponen Dropdown terkait):**
- **HAPUS** *array* statis yang berisi kategori *dummy* (seperti `['Cardio', 'Flexibility', 'Strength', 'Zumba']`).
- Gunakan Prisma untuk mengambil kategori unik yang benar-benar ada di tabel kelas. (Contoh logika: Ambil semua data kelas `prisma.gymClass.findMany({ select: { category: true } })`, lalu saring agar kategorinya tidak duplikat, dan tambahkan opsi "Semua" di urutan pertama).

**B. Data Jadwal Riil (`app/member/jadwal`):**
- **HAPUS** seluruh objek data tiruan (*mock data*) yang sebelumnya digunakan untuk desain UI.
- Ganti dengan `prisma.gymClass.findMany({ orderBy: { schedule: 'asc' } })`.
- Pastikan informasi nama *coach*, jadwal (jam & tanggal), kuota (*slot*), dan nama kelas memetakan (*mapping*) properti dari objek database secara langsung.

**Aturan Eksekusi:**
Segera perbaiki *Syntax Error* di `admin.ts` terlebih dahulu agar *Next.js compiler* dapat berjalan normal kembali, kemudian bersihkan sisa data statis di *frontend*!