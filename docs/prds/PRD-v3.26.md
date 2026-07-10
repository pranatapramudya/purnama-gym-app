# PRD-v3.26.md
**Status:** Phase 3.26 - Fixing Broken Modern Delete Modal State
**PERINGATAN KERAS:** Fokus pada logika State React! Jangan merusak UI yang sudah ada. 

---

## 1. Analisis Bug: Tombol Delete Mati Setelah Migrasi ke Modal Modern
**Masalah:** Saat mengganti `window.confirm` menjadi modal/dialog modern, tombol hapus (ikon tempat sampah) tidak lagi memicu penghapusan data.
**Akar Masalah:** Logika eksekusi *Server Action* (`deletePT`) tidak diikat dengan benar ke dalam tombol konfirmasi di dalam modal.

## 2. Instruksi Arsitektur State untuk Agen (Wajib Diikuti!):
Buka komponen *Client* Admin Anda. Perbaiki alur logika *Delete Modal* dengan struktur *state* berikut:

1. **Siapkan State Manajemen:**
   - Anda harus memiliki *state* untuk mengontrol visibilitas modal (misal: `isModalOpen`).
   - Anda WAJIB memiliki *state* untuk menyimpan ID jadwal yang akan dihapus (misal: `selectedIdToDelete`).

2. **Perbaiki Tombol Ikon Tempat Sampah (Trigger):**
   - Ikon tempat sampah pada baris tabel **TIDAK BOLEH** mengeksekusi fungsi hapus ke *database*.
   - Saat ikon diklik, tugasnya HANYA DUA:
     a. Set `selectedIdToDelete` dengan ID jadwal pada baris tersebut.
     b. Set `isModalOpen` menjadi `true` (untuk memunculkan modal modern).

3. **Perbaiki Tombol "Konfirmasi/Yakin" di DALAM Modal Modern:**
   - Tombol eksekusi yang ada di *dalam* pop-up modal Anda-lah yang harus memegang fungsi aslinya.
   - Buat fungsi `onClick` *asynchronous* pada tombol ini yang memanggil `deletePT(selectedIdToDelete)`.
   - Setelah eksekusi berhasil, tutup kembali modalnya (`isModalOpen` menjadi `false`) dan bersihkan ID-nya.

**ATURAN EKSEKUSI:**
Terapkan logika *state* di atas ke dalam kode Anda SEKARANG JUGA tanpa mengubah estetika desain modal modern yang sudah dibuat! Berikan kembali kodenya dengan logika *state* yang sudah terhubung dengan benar!