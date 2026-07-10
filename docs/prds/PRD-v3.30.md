# PRD-v3.30.md
**Status:** Phase 3.30 - Vercel Build Fix (TypeScript Strict Typing on Recharts)
**TUGAS ANDA:** Memperbaiki tipe data pada properti `formatter` di komponen `Tooltip` Recharts yang menyebabkan kegagalan `npm run build`.

---

## 1. Analisis Bug: Type 'ValueType | undefined' is not assignable to type 'number'
**Masalah:** Kompiler TypeScript Vercel menolak proses *build* karena tipe data `value` pada `formatter` Tooltip dideklarasikan secara eksplisit sebagai `number`, sementara bawaan pustaka Recharts menganggap nilainya bisa `undefined` atau *generic*.

## 2. Instruksi Perbaikan Kode
**Tugas Agen AI:**
- Buka file tempat komponen grafik Recharts berada (kemungkinan di `app/admin/dashboard/DashboardClient.tsx` atau file *Client* grafik Anda).
- Cari baris kode `Tooltip` di sekitar baris 290 yang terlihat seperti ini:
  `formatter={(value: number) => [\`Rp ${value.toLocaleString('id-ID')}\`, '...']}`
- **Ubah baris tersebut menjadi persis seperti ini:**
  ```tsx
  formatter={(value: any) => {
    const numericValue = Number(value) || 0;
    return [`Rp ${numericValue.toLocaleString('id-ID')}`, 'Pendapatan'];
  }}

  Catatan teknis: Mengubah number menjadi any akan membungkam teguran strict typing TypeScript, dan penggunaan Number(value) || 0 akan memastikan bahwa fungsi .toLocaleString() tidak akan pernah pecah meskipun Recharts melempar nilai undefined saat render awal.

ATURAN EKSEKUSI:
Berikan kode revisi HANYA untuk komponen grafik/Tooltip ini. Jangan merusak proporsi UI atau konfigurasi grafik lainnya. Lakukan sekarang!