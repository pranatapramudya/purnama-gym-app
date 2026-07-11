# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.7  
**Status:** Phase 3.7 - UX Refinement & Authentication Routing Fix  
**Target Pasar:** Khusus Wanita (Sumedang)  

---

## 1. Perbaikan Bug Rute Autentikasi (Clerk Single-Session Error)
**Analisis:** Muncul error `cannot_render_single_session_enabled` saat pengguna masuk ke halaman otentikasi ketika sesi login masih aktif.
**Tugas Agen:** 
- Perbaiki logika pengalihan (*redirect*) pada file halaman publik atau halaman otentikasi Anda (misal `app/sign-in/page.tsx`, `app/sign-up/page.tsx`, atau `app/page.tsx`).
- Tambahkan pengecekan server (`auth().userId`). Jika `userId` sudah ada, SEGERA alihkan pengguna ke rute yang sesuai (`/admin/dashboard` jika admin, atau `/member/dashboard` jika member) SEBELUM komponen `<SignIn />` atau `<SignUp />` sempat di- *render* oleh React.

## 2. Refaktor UI Navigasi Bawah Admin (Mobile View)
**Analisis:** Menu *Bottom Navigation* pada layar *mobile* terlalu sesak karena berisi 7 item, membuat teks saling tumpang tindih.
**Tugas Agen:**
- Buka komponen *Bottom Navigation* Admin.
- Ubah *container* pembungkus menu tersebut agar mendukung *horizontal scrolling* dengan kelas Tailwind: `flex overflow-x-auto whitespace-nowrap hide-scrollbar`.
- Pastikan setiap item menu memiliki lebar minimal (`min-w-[80px]` atau sejenisnya) agar ikon dan teksnya memiliki ruang bernapas yang cukup dan tidak mengecil secara otomatis (*flex-shrink-0*).
- *(Opsional: Tambahkan CSS kustom di `globals.css` untuk menyembunyikan scrollbar visual agar terlihat lebih elegan seperti aplikasi *native*).*

## 3. Peningkatan UX Form Input Harga (Paket VIP)
**Analisis:** Elemen input `<input type="number">` menimbulkan perilaku *scrolling* angka yang mengganggu dan kurang intuitif untuk nominal mata uang yang besar.
**Tugas Agen:**
- Buka file *Client Component* untuk form pembuatan/pengeditan Paket VIP (`app/admin/packages/...`).
- Ganti input harga dari tipe `number` menjadi tipe teks standar, namun gunakan atribut `inputMode="numeric"`.
- Tambahkan elemen visual statis "Rp" di sebelah kiri dalam satu *container* input yang sama (menggunakan *absolute positioning* atau flex).
- Pastikan logika *state* di React menangani penghapusan karakter non-angka saat pengguna mengetik, dan mengonversinya kembali menjadi `Number` sebelum dikirim ke *Server Action* Prisma.

**ATURAN WAJIB:**
Tetap gunakan Bahasa Indonesia untuk seluruh komentar kode dan respon balasan Anda. Eksekusi sekarang!