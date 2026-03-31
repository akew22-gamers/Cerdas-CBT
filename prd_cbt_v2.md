# PRODUCT REQUIREMENTS DOCUMENT (PRD) - v2.1

**Nama Aplikasi:** Cerdas-CBT (Computer Based Test)
**Penulis:** EAS Creative Studio
**Kontak Developer:** eas.creative.studio@gmail.com
**Versi:** 2.3.0
**Tanggal:** 31 Maret 2026
**Status:** Final (Audit + Deployment Complete)

---

## 1. Ringkasan Proyek

**Cerdas-CBT** adalah aplikasi ujian berbasis web (Next.js) untuk memfasilitasi guru dalam manajemen soal, manajemen data siswa, dan pelaksanaan ujian pilihan ganda secara *real-time*. Aplikasi ini mendukung **mobile-first** design dengan target **200 concurrent users**.

### 1.1. Prioritas Development
1. **Fase 1 (Online):** Development dan deployment versi online di Vercel + Neon PostgreSQL.
2. **Fase 2 (Offline):** Setelah versi online stabil, development versi offline dengan Docker + PostgreSQL local.

---

## 2. Role & Autentikasi

### 2.1. Role Pengguna

| Role | Deskripsi |
|------|-----------|
| **Super-admin** | Akun predefined (fix) di sistem. Full access ke semua data: guru, siswa, ujian, audit log. Bertugas membuat akun guru baru. |
| **Guru** | Akun dibuat oleh super-admin. Dapat mengelola kelas, siswa, soal, dan ujian. |
| **Siswa** | Akun dibuat oleh guru. Dapat mengikuti ujian dengan kode ujian. |

### 2.2. Autentikasi Guru & Super-admin
- **Login:** Menggunakan username dan password.
- **Super-admin:** Akun predefined di `.env` atau konfigurasi sistem (single akun).
- **Guru:** Akun dibuat oleh super-admin melalui dashboard admin.

### 2.3. Autentikasi Siswa
- **Login:** Menggunakan NISN (username) dan password.
- **Password Awal:** Dibuat oleh guru saat registrasi siswa.
- **Ganti Password:** Siswa dapat mengganti password sendiri setelah login.
- **Reset Password:** Jika siswa lupa password, guru atau super-admin dapat mereset password.

---

## 3. Fitur Utama (Kebutuhan Fungsional)

### 3.1. Modul Manajemen Kelas
* Guru dapat **membuat, mengubah, dan menghapus** kelas.
* Atribut Kelas: Nama Kelas (contoh: "X IPA 1").
* Siswa dapat di-assign ke satu kelas.

### 3.2. Modul Manajemen Siswa
* **Atribut Data Siswa:** Nama, NISN (Primary Key), Kelas, Password.
* **Input Data:**
  * Penambahan data secara manual melalui formulir antarmuka.
  * Impor data massal melalui berkas Excel (.xlsx).
* **Logika Impor Data Siswa:**
  * **Option 1 (Menimpa):** Update data siswa yang sudah ada (berdasarkan NISN) + tambah siswa baru yang belum ada.
  * **Option 2 (Skip existing):** Hanya tambah siswa baru, siswa dengan NISN yang sudah ada di-skip.
* **Manajemen Akun:** Guru dapat melihat daftar siswa, mengubah informasi, atau menghapus akun siswa.
* **Reset Password:** Guru dapat mereset password siswa yang lupa.

### 3.3. Modul Guru - Manajemen Soal
* **Pengaturan Format Soal:** Guru menetapkan jumlah opsi jawaban per ujian (contoh: 4 opsi, 5 opsi). Jumlah opsi **konsisten** untuk semua soal dalam satu ujian.
* **Format Soal:**
  * Soal dapat mengandung **teks, gambar, dan rumus matematika** (LaTeX/MathJax).
  * Guru dapat upload gambar untuk soal.
* **Input Soal Manual:** Formulir dengan kolom: Teks Soal (rich text + gambar + LaTeX), Jawaban Benar, dan Pengecoh (sesuai jumlah opsi).
* **Impor Soal Excel (.xlsx):**
  * **Format Kolom:** `Soal`, `Gambar_URL`, `Jawaban Benar`, `Pengecoh 1`, `Pengecoh 2`, `Pengecoh 3`, `Pengecoh 4`.
  * Kolom `Gambar_URL` opsional (isi dengan URL gambar atau kosong).
  * Kolom `Pengecoh` yang tidak digunakan (misal: Pengecoh 4 untuk ujian 4 opsi) dapat dikosongkan.
* **Revisi Soal:** Guru dapat mengubah soal **hanya jika ujian dalam status nonaktif**.

### 3.4. Modul Guru - Manajemen Ujian
* **Pengaturan Sesi Ujian:**
  * Judul ujian.
  * Durasi pengerjaan (dalam menit).
  * Jumlah opsi jawaban ( konsisten untuk semua soal).
  * Assign ke **multiple kelas** (bisa lebih dari satu kelas).
  * Status ujian: **Aktif/Nonaktif** (toggle).
  * Pengaturan visibility hasil siswa: **Tampilkan nilai akhir** atau **Sembunyikan**.
  * **Tidak ada deadline global** - ujian bisa dikerjakan kapan saja selama status aktif.
* **Kode Ujian:** Setiap ujian memiliki kode unik (join code) yang siswa gunakan untuk masuk.
* **Duplikasi Ujian:** Guru dapat duplikat ujian untuk membuat ujian baru dengan soal yang sama.
* **Hapus Ujian:** Tidak bisa hapus ujian jika ada siswa yang sedang mengerjakan (locked).

### 3.5. Modul Guru - Dashboard
* **Dashboard Ujian:** Daftar ujian yang dibuat, statistik hasil, dan riwayat.
* **Dashboard Siswa:** Daftar siswa per kelas, riwayat nilai, statistik.
* **Monitoring Real-time:** Nilai siswa muncul real-time saat siswa submit (WebSocket/polling).
* **Export Hasil:**
  * Export ke **Excel (.xlsx)** - detail per siswa.
  * Export ke **PDF** - untuk cetak.
* **Statistik Per Soal:** Jumlah benar/salah per soal (basic).

### 3.5.1. Modul Konfigurasi Identitas Sekolah (Super-admin & Guru)
* **Akses:** Menu konfigurasi tersedia di dashboard super-admin dan guru.
* **Atribut Identitas Sekolah:**
  * Nama Sekolah (contoh: "SMA Negeri 1 Jakarta")
  * NPSN (Nomor Pokok Sekolah Nasional)
  * Alamat Sekolah
  * Logo Sekolah (upload gambar, opsional)
  * Nomor Telepon (opsional)
  * Email Sekolah (opsional)
  * Website Sekolah (opsional)
  * Kepala Sekolah (nama, opsional)
  * Tahun Ajaran (contoh: "2025/2026")
* **Tampilan:**
  * Identitas sekolah akan ditampilkan di:
    - Header halaman login (siswa, guru, super-admin)
    - Header dashboard (semua role)
    - Halaman ujian siswa (header)
    - Header hasil ujian dan export PDF
  * Logo **Kemendikdasmen** ditampilkan di halaman login dan dashboard (fixed, tidak bisa diubah).
* **Logo Default:**
  * Logo Kemendikdasmen (`logo_kemendikdasmen.svg`) wajib ditampilkan di:
    - Halaman login siswa
    - Halaman login guru/super-admin
    - Header dashboard semua role
    - Halaman ujian siswa

### 3.6. Modul Siswa - Ujian
* **Masuk Ujian:** Siswa memasukkan kode ujian (join code) untuk masuk ke sesi ujian.
* **Timer:**
  * Timer mulai saat siswa klik tombol **"Mulai Ujian"**.
  * Timer berjalan di server-side.
  * Jika siswa refresh halaman, timer tetap berjalan (lanjut).
* **Layout Soal:** Satu soal per halaman dengan navigator.
* **Navigator Soal:**
  * Daftar nomor soal untuk loncat ke soal tertentu.
  * Indikator status: soal sudah dijawab / belum dijawab.
* **Pengacakan:**
  * Urutan soal diacak per siswa (randomized).
  * Urutan opsi jawaban diacak per siswa.
  * Urutan konsisten jika siswa refresh (seed tetap).
* **Auto-save:** Jawaban tersimpan real-time setiap kali siswa memilih jawaban.
* **Offline Mode:** Siswa bisa lanjut mengerjakan jika internet putus, jawaban auto-sync saat online.
* **Warning Waktu:**
  * Popup warning saat waktu hampir habis.
  * Timer berubah warna (merah) saat waktu hampir habis.
* **Pengumpulan:**
  * Submit manual dengan tombol "Kirim Jawaban".
  * Auto-submit jika waktu habis.
  * Siswa hanya bisa submit **1 kali** (tidak bisa submit ulang).
* **Anti-cheating:**
  * **Fullscreen mode:** Ujian harus dalam fullscreen, keluar fullscreen = warning.
  * **Deteksi tab switch:** Sistem mencatat jika siswa switch tab/window.

### 3.7. Modul Siswa - Hasil
* Setelah submit, siswa melihat **nilai akhir** (jika guru mengaktifkan visibility).
* Siswa tidak melihat jawaban benar/salah (hanya nilai).

---

## 4. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Internet putus saat ujian | Offline mode dengan auto-sync ke localStorage, sync saat online |
| Refresh halaman saat ujian | Timer lanjut (server-side), jawaban tersimpan, urutan soal konsisten |
| Submit berkali-kali | Hanya 1x submit diperbolehkan |
| Hapus ujian saat siswa mengerjakan | Locked - tidak bisa hapus |
| Edit soal saat ujian aktif | Tidak bisa edit - ujian harus nonaktif |
| Upload Excel gagal | Tampilkan error detail, data tidak berubah |

---

## 5. Kebutuhan Antarmuka Pengguna (UI/UX)

> **Detail Design System:** Lihat dokumentasi lengkap di `design_system.md`

### 5.1. Tech Stack UI
* **Framework:** Next.js 14+ (App Router)
* **Styling:** Tailwind CSS
* **UI Components:** Shadcn UI
* **Icons:** Lucide React
* **Theme:** Light mode only

### 5.2. Tipografi & Warna
* **Font:** Inter (Google Fonts)
* **Background:** `bg-gray-50` (#F9FAFB)
* **Surface:** `bg-white` (#FFFFFF)
* **Primary:** `bg-blue-600` (#2563EB)
* **Text Primary:** `text-gray-900` (#111827)
* **Text Secondary:** `text-gray-500` (#6B7280)

### 5.3. Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (h-16, bg-white, border-b)                          │
├──────────────┬──────────────────────────────────────────────┤
│  SIDEBAR     │  MAIN CONTENT (bg-gray-50, p-8)              │
│  (w-64)      │                                              │
│  bg-white    │  - Page Header                               │
│  border-r    │  - Stats Grid (4 columns)                    │
│              │  - Content Cards                             │
└──────────────┴──────────────────────────────────────────────┘
```

### 5.4. Responsiveness
* **Mobile-first:** Prioritas tampilan mobile, siswa akan menggunakan ponsel.
* **Responsive:** UI responsif untuk desktop, tablet, dan smartphone.
* **Layout Soal:** Satu soal per halaman dengan navigator nomor soal.

### 5.5. Logo & Branding
* **Logo Kemendikdasmen:** Wajib ditampilkan di:
  - Halaman login siswa (posisi: header atau sidebar)
  - Halaman login guru/super-admin (posisi: header atau sidebar)
  - Header dashboard semua role
  - Halaman ujian siswa (header)
* **File Logo:** `logo_kemendikdasmen.svg` (disertakan dalam project)
* **Logo Sekolah:** Opsional, ditampilkan berdampingan dengan logo Kemendikdasmen jika dikonfigurasi.
* **Penempatan Logo:** Logo berada di sisi kiri header, diikuti dengan nama sekolah.

---

## 6. Spesifikasi Teknis

### 6.1. Framework & Platform
* **Framework:** Next.js 14+ (App Router).
* **Styling:** Tailwind CSS.
* **UI Components:** Shadcn UI.
* **Icons:** Lucide React.
* **Deployment Online:** Vercel (auto-deploy dari GitHub).
* **Deployment Offline:** Windows Server + Docker (portable installer).
* **Database:**
  * **Online:** Neon PostgreSQL (cloud, compatible dengan Vercel).
  * **Offline:** PostgreSQL (Docker container, local).
* **Autentikasi:** Custom auth dengan bcrypt (tidak menggunakan Supabase Auth untuk fleksibilitas offline).

### 6.2. Deployment Modes

#### Mode Online (Vercel + Neon)
```
GitHub Repository → Vercel Auto-deploy → Neon PostgreSQL (Cloud)
```
* Push ke GitHub → Vercel auto-build dan deploy.
* Database: Neon PostgreSQL (free tier 512MB).
* Access: `https://cbt-xxx.vercel.app`

#### Mode Offline (Windows Server + Docker)
```
Windows Installer → Docker Desktop → PostgreSQL Container → Next.js App
```
* Guru run installer `next-cbt-setup.exe`.
* Installer setup Docker Desktop + PostgreSQL container.
* Start app via shortcut atau `start.bat`.
* Access: `http://localhost:3000` atau `http://192.168.x.x:3000` (IP local).
* Siswa akses via browser dari device lain di jaringan lokal.

**Setup Files:**
```
📁 next-cbt-windows-installer/
├── setup.exe           ← Windows installer (NSIS/Inno Setup)
├── docker-compose.yml  ← PostgreSQL + Next.js config
├── start.bat           ← Script start app
├── stop.bat            ← Script stop app
├── reset-admin.bat     ← Reset super admin password
└── README.txt          ← Dokumentasi
```

### 6.3. Database Configuration
| Mode | Database | Connection String |
|------|----------|-------------------|
| Online (Vercel) | Neon PostgreSQL | `DATABASE_URL="postgresql://...@neon.tech/..."` |
| Offline (Windows) | PostgreSQL (Docker) | `DATABASE_URL="postgresql://cbt_user:cbt_pass@localhost:5432/cbt_local"` |

### 6.4. Real-time & Sync
* **Monitoring Guru:** WebSocket atau polling untuk real-time nilai update.
* **Auto-save:** Real-time per jawaban ke server.
* **Offline Mode (Siswa):** LocalStorage backup + auto-sync saat online.

### 6.5. Performance Target
* **Concurrent Users:** Target maksimal **200 siswa** ujian bersamaan.
* **Response Time:** < 500ms untuk API calls.
* **Database:** Connection pooling (PgBouncer atau connection pool driver).

### 6.6. Security
* **Password Hashing:** bcrypt (10 rounds).
* **Anti-cheating:** Fullscreen mode + deteksi tab switch.
* **Audit Log:** Semua aktivitas dicatat (login, CRUD data, submit ujian).
* **CORS:** Whitelist untuk domain Vercel dan local network.

---

## 7. Entity Relationship (ERD Overview)

### 7.1. Entities

| Entity | Atribut Utama |
|--------|---------------|
| **super_admin** | id, username, password_hash |
| **guru** | id, username, password_hash, nama, created_by (super_admin_id) |
| **kelas** | id, nama_kelas, created_by (guru_id) |
| **siswa** | id, nisn (PK), nama, password_hash, kelas_id, created_by (guru_id) |
| **ujian** | id, kode_ujian (unique), judul, durasi, jumlah_opsi, status (aktif/nonaktif), show_result, created_by (guru_id) |
| **ujian_kelas** | id, ujian_id, kelas_id (relasi many-to-many) |
| **soal** | id, ujian_id, teks_soal, gambar_url, jawaban_benar, pengecoh_1, pengecoh_2, pengecoh_3, pengecoh_4 |
| **jawaban_siswa** | id, siswa_id, ujian_id, soal_id, jawaban_pilihan, waktu_submit |
| **hasil_ujian** | id, siswa_id, ujian_id, nilai, jumlah_benar, jumlah_salah, waktu_mulai, waktu_selesai |
| **audit_log** | id, user_id, role, action, timestamp, details |
| **identitas_sekolah** | id, nama_sekolah, npsn, alamat, logo_url, telepon, email, website, kepala_sekolah, tahun_ajaran, updated_by, updated_at |

### 7.2. Relasi
* guru → kelas (1:N, guru membuat kelas)
* kelas → siswa (1:N, siswa di satu kelas)
* guru → ujian (1:N, guru membuat ujian)
* ujian → ujian_kelas → kelas (N:M, ujian di multiple kelas)
* ujian → soal (1:N, soal dalam ujian)
* siswa → hasil_ujian (1:N, siswa ikut multiple ujian)
* siswa → jawaban_siswa (1:N, jawaban per soal)
* soal → jawaban_siswa (1:N, jawaban dari multiple siswa)

---

## 8. Fitur Tambahan (Nice-to-have / Future)

| Fitur | Prioritas | Status |
|-------|-----------|--------|
| Passing grade | Low | Future |
| Bobot per soal (weighted scoring) | Low | Future |
| Waktu rata-rata pengerjaan per soal | Low | Future |
| Backup/restore data | Low | Future |
| Retensi data policy | Low | Future |

---

## 9. Glossary

| Istilah | Definisi |
|---------|----------|
| NISN | Nomor Induk Siswa Nasional - identitas unik siswa |
| NPSN | Nomor Pokok Sekolah Nasional - identitas unik sekolah |
| Join Code | Kode unik untuk siswa masuk ke sesi ujian |
| Pengecoh | Opsi jawaban yang tidak benar (distractor) |
| Proper Case | Format teks dengan huruf kapital di awal kata |
| Seed | Nilai tetap untuk randomization yang konsisten |
| Kemendikdasmen | Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi |

---

## 10. Referensi

### 10.1. External Resources
* Next.js Documentation: https://nextjs.org/docs
* Neon PostgreSQL: https://neon.tech/docs
* Docker Documentation: https://docs.docker.com
* MathJax Documentation: https://docs.mathjax.org
* Inter Font: https://fonts.google.com/specimen/Inter
* Inno Setup (Windows Installer): https://jrsoftware.org/isinfo.php
* Tailwind CSS: https://tailwindcss.com/docs
* Shadcn UI: https://ui.shadcn.com

### 10.2. Project Documentation
* `design_system.md` - UI/UX Design System Specification
* `database_schema.md` - Database Schema & ERD
* `api_endpoints.md` - REST API Specification
* `deployment_config.md` - Deployment Configuration

---

## 11. Asset Files

| File | Deskripsi | Lokasi |
|------|-----------|--------|
| `logo_kemendikdasmen.svg` | Logo Kemendikdasmen untuk header dan login | `/public/images/logo_kemendikdasmen.svg` |

---

**Document Status:** ✅ Final v2.3 - Ready for development (Online-first priority).