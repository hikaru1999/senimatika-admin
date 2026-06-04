# Senimatika Map Editor & Admin Panel

SenimatikaAdmin merupakan platform manajemen konten dalam ekosistem Senimatika. Platform ini dibangun menggunakan **React**, **Vite**, dan **Firebase** yang bertujuan untuk mengelola (menambahkan, mengedit, dan menghapus) peta eksplorasi, bank soal, kuis, dan data pengguna Senimatika secara real-time.

## Fitur Utama
- **Map Editor**: Membuat, mengubah rancangan peta eksplorasi yang akan ditampilkan pada client app Senimatika.
- **Question Bank**: Manajemen soal kuis dengan dukungan LaTeX dan in-app preview.
- **Quiz Configuration**: Konfigurasi 3 kuis (Online Quiz, Boss Battle, & Station Quiz) yang akan ditampilkan pada client app Senimatika.
- **User Manager**: Pemantauan metrik pengguna Senimatika.
- **Document Export**: Ekspor soal ke format PDF dan Word (.docx).

## Plugin/Framework/Library
- React.js (Vite)
- Firebase (Firestore & Auth)
- KaTeX (Rendering Mathematics Formula)
- EasyMDE (Markdown Editor)

## Instalasi

1. Clone repository:
   ```bash
   git clone https://github.com/username/senimatika-map-editor.git
   ```
2. Instal dependencies:
   ```bash
   npm install
   ```
3. Konfigurasi Environment:
   Salin `.env.example` menjadi `.env` dan isi dengan konfigurasi Firebase Anda sendiri.
4. Jalankan program:
   ```bash
   npm run dev
   ```

## 📄 Lisensi

Proyek ini dibuat untuk tujuan edukasi dan portofolio pribadi. Seluruh aset gambar dan suara adalah milik masing-masing kreator aslinya.

---

© 2026 Senimatika Team