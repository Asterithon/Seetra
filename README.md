# Seetra - Image Processing Sandbox

Seetra adalah aplikasi *Computer Vision* interaktif yang berfokus pada edukasi dan eksplorasi. Aplikasi ini berfungsi sebagai kotak pasir (*sandbox*) komprehensif bagi pengguna untuk memahami bagaimana operasi-operasi dasar pengolahan citra (*image processing*) bekerja hingga ke level matematika dan piksel.

Aplikasi ini menggunakan perpaduan antarmuka modern yang sangat interaktif dan *backend* yang berkinerja tinggi untuk memvisualisasikan data rumit menjadi lebih memukau.

## Fitur Utama Saat Ini

*   **Single Image Pipeline:** Fitur eksperimen komprehensif untuk satu gambar.
    *   **Global Settings:** Mengonversi gambar ke *Grayscale* untuk manipulasi warna abu-abu atau membiarkannya berwarna (RGB).
    *   **Operasi Geometri:** Menjelajahi logika translasi X/Y, rotasi sudut, penskalaan (*scaling*), dan pencerminan (*flipping*).
    *   **Operasi Titik:** Mengubah pencerahan (*brightness*), kekontrasan (*contrast*), negasi (warna terbalik), hingga *thresholding* (binerisasi gambar).
    *   **Operasi Spasial:** Bereksperimen dengan konvolusi kernel, mulai dari penghalusan (*Mean / Median Filter*) hingga deteksi tepi (*Edge Detection* seperti Sobel, Prewitt, dan Canny).
*   **Pipeline Snapshot Berurut:** Setiap modifikasi yang dilakukan akan terangkum sebagai jejak tahapan (*pipeline snapshot*). Ini membuat pengguna bisa melihat perbandingan gambar di tahap 1, tahap 2, hingga hasil akhir.
*   **Visualisasi Histogram Dinamis:** Aplikasi menampilkan representasi histogram yang indah, ditenagai oleh **Matplotlib**, dengan format gabungan untuk **RGB** (Merah, Hijau, Biru) maupun **HSV** (Hue, Saturation, Value), yang secara lincah merespons perubahan secara langsung.
*   **Pusat Operasi Matematika 9x9:** Bagian edukasional unggulan! Pengguna bisa menekan *grid* (kumpulan kotak piksel pusat) yang menyajikan komparasi intensitas piksel sebelum dan sesudah diproses. Aplikasi secara ajaib membeberkan perhitungan / formula matematikanya secara tepat di bawah piksel tersebut.

## Teknologi yang Digunakan

*   **Frontend (Antarmuka Pengguna):**
    *   [React](https://react.dev/) dengan inisialisasi [Vite](https://vitejs.dev/)
    *   [Tailwind CSS (v4)](https://tailwindcss.com/) untuk desain antarmuka berbasis utilitas, responsif, dan bernuansa premium.
*   **Backend (Pengolahan Citra):**
    *   [Flask (Python)](https://flask.palletsprojects.com/) sebagai kerangka server REST API.
    *   [OpenCV (`cv2`)](https://opencv.org/) sebagai perpustakaan tulang punggung dalam pengolahan piksel serta pengaplikasian matriks kernel.
    *   [NumPy](https://numpy.org/) untuk manipulasi *array*.
    *   [Matplotlib](https://matplotlib.org/) untuk me-*render* grafik kurva histogram secara presisi dan tanpa membebani peramban (*browser*).

## Struktur Repositori
- `frontend/` - Folder yang berisi seluruh komponen antarmuka web, berkas *styling*, *React components*, dan konfigurasi Vite.
- `backend/` - Berisi logika API Flask, algoritma *computer vision* di `single_processor.py`, serta pengaturan *virtual environment*.

## Cara Menjalankan Aplikasi

Aplikasi dibangun menggunakan model arsitektur terpisah (*Client-Server*).

### 1. Menjalankan Backend (Server OpenCV)
1. Buka terminal lalu arahkan ke direktori `backend`.
2. Aktifkan *virtual environment*:
   * Windows: `.\venv\Scripts\activate`
   * Mac/Linux: `source venv/bin/activate`
3. Pasang semua pustaka yang dibutuhkan jika belum (Flask, opencv-python, numpy, matplotlib, flask-cors).
4. Jalankan `python app.py`. Server akan berjalan di `http://127.0.0.1:5000`.

### 2. Menjalankan Frontend (Antarmuka React)
1. Buka terminal baru dan arahkan ke direktori `frontend`.
2. Lakukan instalasi pustaka pertama kali dengan `npm install`.
3. Jalankan server lokal Vite dengan perintah `npm run dev`.
4. Buka peramban (*browser*) pada tautan yang diberikan Vite (biasanya `http://localhost:5173`) untuk melihat aplikasi Seetra berjalan.
