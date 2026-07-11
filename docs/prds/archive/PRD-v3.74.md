# PRD-v3.74.md
**Status:** Phase 3.74 - Fast-Track Walk-in POS, Dynamic Packages, & Auto-Currency Formatting
**TUGAS ANDA:** Menghapus opsi "Member Terdaftar" dari Modal Transaksi, mengintegrasikan dropdown "Jenis Paket" secara dinamis dengan database Master VIP/Paket, dan mengotomatiskan pengisian serta format nominal pembayaran IDR tanpa spinner (panah scroll).

---

## 1. UI/UX Simplifikasi: Fokus Jalur "Walk-in"
**Lokasi:** Modal Input Transaksi Kasir (`app/admin/transactions/TransactionsClient.tsx` atau file terkait).
**Instruksi Eksekusi UI:**
- Hapus *Toggle/Switch* pilihan "Data Member (Member Terdaftar vs Walk-in / Baru)".
- Jadikan form ini **Eksklusif untuk Walk-in**.
- Tampilkan form input biodata secara langsung dan permanen di dalam modal ini: `Nama Lengkap` (Wajib), `No. HP` (Wajib), dan `Email` (Opsional).
- **Logika Database:** Saat di-submit, Server Action WAJIB membuat data `User` baru terlebih dahulu berdasarkan inputan walk-in ini, lalu menautkan ID User baru tersebut ke pencatatan `Transaction` dalam satu siklus (gunakan Prisma `$transaction` jika memungkinkan).

## 2. Dynamic Fetching: "Jenis Paket" Terintegrasi
**Lokasi:** Dropdown Jenis Paket pada Modal Transaksi.
**Instruksi Eksekusi:**
- Hapus opsi statis (hardcoded) seperti "Harian (Regular)", "Bulanan (VIP)", dll.
- Lakukan pemanggilan data (fetch) dari tabel *Master Paket* yang dibuat oleh Super User (misalnya dari tabel `VIPPackage`, `MembershipPlan`, atau `PTSetting` untuk harian).
- Tampilkan nama-nama paket hasil fetch tersebut ke dalam dropdown.

## 3. Auto-Calculation & Format IDR (Anti-Scroll)
**Lokasi:** Input "Nominal Pembayaran" pada Modal Transaksi.
**Masalah:** Input angka memunculkan panah scroll up/down (spinner) dan kasir harus mengetik manual yang rawan salah jumlah nol.
**Instruksi Eksekusi UI & Logika:**
- **Auto-Fill:** Tambahkan *event listener* `onChange` pada dropdown "Jenis Paket". Saat kasir memilih sebuah paket, otomatis set *state* Nominal Pembayaran sesuai dengan harga paket tersebut dari database.
- **Format Tampilan:** Ubah elemen `<input type="number">` menjadi `<input type="text">`. 
- Buat fungsi utilitas (utility function) yang secara otomatis memformat angka menjadi format Rupiah saat ditampilkan (contoh: dari `100000` menjadi `100.000`).
- Pastikan saat data dikirim ke Server Action, format tersebut di- *parse* kembali menjadi Integer murni untuk disimpan ke database.
- Hilangkan elemen panah atas-bawah (spinner) sepenuhnya agar UI terlihat bersih seperti form perbankan.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Kerjakan perubahan UI dan koneksi logika database ini secara langsung di *environment* proyek. Pastikan ketika form di-submit, data user walk-in benar-benar terbuat dan transaksinya tercatat akurat.