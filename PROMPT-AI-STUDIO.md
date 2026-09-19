# PROMPT UNTUK GOOGLE AI STUDIO

Lanjutkan project ini menjadi RUMAH PPM & LKPD AI PRO+.

Pertahankan UI dan identitas utama. Jadikan aplikasi full-stack Node.js di Google AI Studio.

TUJUAN PRODUK
Aplikasi untuk guru Indonesia yang dapat membuat PPM, Modul Ajar, LKPD, Asesmen, Rubrik, Kisi-kisi, dan Bank Soal dengan Gemini.

SUMBER DESAIN
1. Mode "Ikuti Template Saya": pengguna dapat mengunggah DOCX/PDF/PPTX/PNG/JPG. Analisis struktur, teks, tabel, ukuran halaman, warna, logo, header, footer, dan elemen visual.
2. Mode "Desain oleh AI": AI memilih layout yang sesuai isi dokumen.
3. Sediakan kontrol LOCK untuk logo, header, footer, warna, font, tabel, dan layout. Elemen terkunci tidak boleh diubah AI.

MESIN AI
- Gunakan Gemini sebagai engine utama.
- Default text model: gemini-3.8-flash.
- Sediakan model deep/advanced yang dapat dipilih dari Settings.
- Gunakan structured JSON untuk hasil generator.
- API key hanya di server-side Secret GEMINI_API_KEY.
- Jangan pernah menaruh API key di client.
- Tambahkan quality validation.

WORKFLOW
CP -> TP -> ATP -> PPM -> Modul -> LKPD -> Asesmen -> Rubrik.

GENERATOR
PPM, Modul Ajar, LKPD, Asesmen Diagnostik, Formatif, Sumatif, Rubrik, Kisi-kisi, Bank Soal.

IMAGE STUDIO
Gunakan Gemini native image model untuk:
- ilustrasi pembelajaran
- cover
- infografis
- diagram
- visual LKPD
- image editing dengan gambar referensi
Default image model: gemini-3.1-flash-image.

TEMPLATE ENGINE
Buat abstraction layer sehingga parser/rendering DOCX, PDF, PPTX, dan Canva dapat ditambahkan tanpa mengubah generator AI.

CANVA
Buat connector module terpisah untuk integrasi Canva. Jangan mengarang credential. Sediakan interface/service layer yang siap dihubungkan dengan Canva APIs.

DATABASE
Siapkan struktur persistence untuk:
- profil sekolah
- guru
- kelas
- template
- dokumen
- versi dokumen
- riwayat generate
- pengaturan AI.

VERSIONING
Buat AI Engine Version dan Capability Pack Version yang bisa dinaikkan tanpa mengubah UI utama.

RESPONSIVE
PC, laptop, tablet, HP.

SETELAH SELESAI
- Jalankan build.
- Periksa semua error.
- Perbaiki error otomatis.
- Pastikan tombol Generate, Image Studio, Template Analysis, Preview, Print, dan Export berjalan.
- Jangan menghapus fitur yang sudah ada.
