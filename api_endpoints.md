# API ENDPOINTS - Cerdas-CBT

**Framework:** Next.js 14+ (App Router)
**API Style:** REST + WebSocket for real-time
**Versi:** 1.1.0
**Tanggal:** 31 Maret 2026

---

## 1. API Structure Overview

```
/api
├── /auth
│   ├── /login              POST    - Login (super_admin, guru, siswa)
│   ├── /logout             POST    - Logout
│   ├── /me                 GET     - Get current user info
│   └── /change-password    POST    - Change password (guru, siswa)
│
├── /admin
│   ├── /guru
│   │   ├── /               GET     - List all guru
│   │   ├── /               POST    - Create new guru
│   │   ├── /[id]           GET     - Get guru detail
│   │   ├── /[id]           PUT     - Update guru
│   │   ├── /[id]           DELETE  - Delete guru
│   │   └── /reset-password POST    - Reset guru password
│   ├── /audit-log
│   │   ├── /               GET     - Get audit log (with filters)
│   └── /sekolah
│       ├── /               GET     - Get identitas sekolah
│       └── /               PUT     - Update identitas sekolah
│
├── /guru
│   ├── /kelas
│   │   ├── /               GET     - List kelas (owned by guru)
│   │   ├── /               POST    - Create kelas
│   │   ├── /[id]           GET     - Get kelas detail
│   │   ├── /[id]           PUT     - Update kelas
│   │   ├── /[id]           DELETE  - Delete kelas
│   │
│   ├── /siswa
│   │   ├── /               GET     - List siswa (all or by kelas)
│   │   ├── /               POST    - Create siswa (manual)
│   │   ├── /import         POST    - Import siswa from Excel
│   │   ├── /[id]           GET     - Get siswa detail
│   │   ├── /[id]           PUT     - Update siswa
│   │   ├── /[id]           DELETE  - Delete siswa
│   │   ├── /[id]/reset-password POST - Reset siswa password
│   │
│   ├── /ujian
│   │   ├── /               GET     - List ujian (owned by guru)
│   │   ├── /               POST    - Create ujian
│   │   ├── /[id]           GET     - Get ujian detail
│   │   ├── /[id]           PUT     - Update ujian
│   │   ├── /[id]           DELETE  - Delete ujian (if no active sessions)
│   │   ├── /[id]/duplicate POST    - Duplicate ujian
│   │   ├── /[id]/toggle    POST    - Toggle aktif/nonaktif
│   │   ├── /[id]/kelas     GET/POST/DELETE - Manage ujian_kelas
│   │
│   ├── /soal
│   │   ├── /               GET     - List soal (by ujian_id)
│   │   ├── /               POST    - Create soal
│   │   ├── /import         POST    - Import soal from Excel
│   │   ├── /[id]           GET     - Get soal detail
│   │   ├── /[id]           PUT     - Update soal (ujian must be nonaktif)
│   │   ├── /[id]           DELETE  - Delete soal (ujian must be nonaktif)
│   │
│   ├── /hasil
│   │   ├── /               GET     - List hasil (by ujian_id)
│   │   ├── /[ujian_id]/export GET  - Export hasil (Excel/PDF)
│   │   ├── /[ujian_id]/stats GET  - Get statistik per soal
│   │
│   └── /dashboard
│       ├── /               GET     - Dashboard summary
│       ├── /realtime       WS      - WebSocket for real-time monitoring
│
├── /siswa
│   ├── /ujian
│   │   ├── /join           POST    - Join ujian by code
│   │   ├── /[id]/start     POST    - Start ujian (timer begins)
│   │   ├── /[id]/soal      GET     - Get soal (randomized for siswa)
│   │   ├── /[id]/jawaban   POST    - Save jawaban (auto-save)
│   │   ├── /[id]/submit    POST    - Submit ujian (final)
│   │   ├── /[id]/status    GET     - Get ujian status + timer
│   │   ├── /[id]/hasil     GET     - Get hasil (if show_result=true)
│   │
│   └── /riwayat
│       ├── /               GET     - List riwayat ujian siswa
│
└── /upload
    ├── /image              POST    - Upload image for soal
    └── /excel              POST    - Upload Excel file (siswa/soal import)

└── /public
    ├── /sekolah            GET     - Get identitas sekolah (public, for login page)
    └── /logo-kemendikdasmen GET    - Get logo kemendikdasmen URL (public)
```

---

## 2. Authentication Endpoints

### 2.1. POST `/api/auth/login`

**Purpose:** Login untuk super_admin, guru, dan siswa

**Request:**
```json
{
  "username": "admin",       // atau NISN untuk siswa
  "password": "password123",
  "role": "super_admin"      // "super_admin", "guru", atau "siswa"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "admin",
      "nama": "Super Admin",
      "role": "super_admin"
    },
    "token": "jwt_token",
    "expires_at": "2026-03-31T12:00:00Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Username atau password salah"
  }
}
```

---

### 2.2. POST `/api/auth/logout`

**Purpose:** Logout user

**Request:** (empty body, use Authorization header)

**Response:**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

### 2.3. GET `/api/auth/me`

**Purpose:** Get current logged-in user info

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "guru1",
    "nama": "Ahmad Guru",
    "role": "guru",
    "created_at": "2026-03-31T10:00:00Z"
  }
}
```

---

### 2.4. POST `/api/auth/change-password`

**Purpose:** Change password (guru atau siswa)

**Request:**
```json
{
  "old_password": "old123",
  "new_password": "new456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password berhasil diubah"
}
```

---

## 3. Admin Endpoints (Super Admin Only)

### 3.1. GET `/api/admin/guru`

**Purpose:** List all guru

**Query Params:**
- `page` (default: 1)
- `limit` (default: 20)
- `search` (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "guru": [
      {
        "id": "uuid",
        "username": "guru1",
        "nama": "Ahmad Guru",
        "created_at": "2026-03-31T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "total_pages": 1
    }
  }
}
```

---

### 3.2. POST `/api/admin/guru`

**Purpose:** Create new guru

**Request:**
```json
{
  "username": "guru2",
  "password": "password123",
  "nama": "Budi Guru"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "guru2",
    "nama": "Budi Guru",
    "created_at": "2026-03-31T11:00:00Z"
  }
}
```

---

### 3.3. PUT `/api/admin/guru/[id]`

**Purpose:** Update guru info

**Request:**
```json
{
  "nama": "Budi Guru Updated"
}
```

---

### 3.4. DELETE `/api/admin/guru/[id]`

**Purpose:** Delete guru

**Response:**
```json
{
  "success": true,
  "message": "Guru berhasil dihapus"
}
```

---

### 3.5. POST `/api/admin/guru/reset-password`

**Purpose:** Reset guru password

**Request:**
```json
{
  "guru_id": "uuid",
  "new_password": "newpass123"
}
```

---

### 3.6. GET `/api/admin/audit-log`

**Purpose:** Get audit log (all activities)

**Query Params:**
- `page`, `limit`
- `user_id` (optional)
- `action` (optional: login, logout, create, update, delete, submit)
- `from_date`, `to_date` (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "role": "guru",
        "action": "login",
        "entity_type": null,
        "entity_id": null,
        "details": {},
        "created_at": "2026-03-31T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 3.7. GET `/api/admin/sekolah`

**Purpose:** Get identitas sekolah

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nama_sekolah": "SMA Negeri 1 Jakarta",
    "npsn": "12345678",
    "alamat": "Jl. Pendidikan No. 1, Jakarta",
    "logo_url": "https://storage.../logo.png",
    "telepon": "021-1234567",
    "email": "sekolah@example.com",
    "website": "https://sekolah.sch.id",
    "kepala_sekolah": "Dr. Nama Kepala Sekolah",
    "tahun_ajaran": "2025/2026",
    "updated_at": "2026-03-31T10:00:00Z"
  }
}
```

---

### 3.8. PUT `/api/admin/sekolah`

**Purpose:** Update identitas sekolah (super-admin & guru)

**Request:**
```json
{
  "nama_sekolah": "SMA Negeri 1 Jakarta",
  "npsn": "12345678",
  "alamat": "Jl. Pendidihan No. 1, Jakarta",
  "logo_url": "https://storage.../logo.png",
  "telepon": "021-1234567",
  "email": "sekolah@example.com",
  "website": "https://sekolah.sch.id",
  "kepala_sekolah": "Dr. Nama Kepala Sekolah",
  "tahun_ajaran": "2025/2026"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nama_sekolah": "SMA Negeri 1 Jakarta",
    "npsn": "12345678",
    "alamat": "Jl. Pendidikan No. 1, Jakarta",
    "logo_url": "https://storage.../logo.png",
    "telepon": "021-1234567",
    "email": "sekolah@example.com",
    "website": "https://sekolah.sch.id",
    "kepala_sekolah": "Dr. Nama Kepala Sekolah",
    "tahun_ajaran": "2025/2026",
    "updated_at": "2026-03-31T11:00:00Z"
  }
}
```

---

## 4. Guru Endpoints

### 4.1. Kelas

#### GET `/api/guru/kelas`

**Purpose:** List kelas owned by guru

**Response:**
```json
{
  "success": true,
  "data": {
    "kelas": [
      {
        "id": "uuid",
        "nama_kelas": "X IPA 1",
        "jumlah_siswa": 30,
        "created_at": "2026-03-31T10:00:00Z"
      }
    ]
  }
}
```

---

#### POST `/api/guru/kelas`

**Request:**
```json
{
  "nama_kelas": "X IPA 2"
}
```

---

#### PUT `/api/guru/kelas/[id]`

**Request:**
```json
{
  "nama_kelas": "X IPA 1 Updated"
}
```

---

#### DELETE `/api/guru/kelas/[id]`

**Note:** Hanya bisa hapus jika tidak ada siswa di kelas

---

### 4.2. Siswa

#### GET `/api/guru/siswa`

**Query Params:**
- `kelas_id` (optional, filter by kelas)
- `page`, `limit`, `search`

**Response:**
```json
{
  "success": true,
  "data": {
    "siswa": [
      {
        "id": "uuid",
        "nisn": "1234567890",
        "nama": "Siswa Test",
        "kelas": {
          "id": "uuid",
          "nama_kelas": "X IPA 1"
        },
        "created_at": "2026-03-31T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

#### POST `/api/guru/siswa` (Manual)

**Request:**
```json
{
  "nisn": "1234567891",
  "nama": "Siswa Baru",
  "password": "pass123",
  "kelas_id": "uuid"
}
```

---

#### POST `/api/guru/siswa/import` (Excel Import)

**Request:** (multipart/form-data)
- `file`: Excel file (.xlsx)
- `mode`: "update_existing" atau "skip_existing"
- `kelas_id`: UUID kelas default untuk siswa baru

**Excel Format:**
| NISN | Nama | Password | Kelas |
|------|------|----------|-------|
| 1234567890 | Siswa 1 | pass123 | X IPA 1 |

**Response:**
```json
{
  "success": true,
  "data": {
    "imported": 25,
    "updated": 5,
    "skipped": 3,
    "errors": [
      {
        "row": 10,
        "message": "NISN format invalid"
      }
    ]
  }
}
```

---

#### PUT `/api/guru/siswa/[id]`

**Request:**
```json
{
  "nama": "Siswa Updated",
  "kelas_id": "uuid_new_kelas"
}
```

---

#### DELETE `/api/guru/siswa/[id]`

**Note:** Jika siswa sudah memiliki hasil ujian, hasil tetap tersimpan

---

#### POST `/api/guru/siswa/[id]/reset-password`

**Request:**
```json
{
  "new_password": "newpass123"
}
```

---

### 4.3. Ujian

#### GET `/api/guru/ujian`

**Query Params:**
- `status` (optional: aktif, nonaktif)
- `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "ujian": [
      {
        "id": "uuid",
        "kode_ujian": "ABC123",
        "judul": "Ujian Matematika",
        "durasi": 60,
        "jumlah_opsi": 4,
        "status": "aktif",
        "show_result": true,
        "kelas": [
          { "id": "uuid", "nama_kelas": "X IPA 1" },
          { "id": "uuid", "nama_kelas": "X IPA 2" }
        ],
        "jumlah_soal": 50,
        "jumlah_siswa_selesai": 15,
        "created_at": "2026-03-31T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

#### POST `/api/guru/ujian`

**Request:**
```json
{
  "judul": "Ujian Matematika Bab 1",
  "durasi": 60,
  "jumlah_opsi": 4,
  "show_result": true,
  "kelas_ids": ["uuid1", "uuid2"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "kode_ujian": "ABC123",
    "judul": "Ujian Matematika Bab 1",
    "status": "nonaktif",
    ...
  }
}
```

---

#### PUT `/api/guru/ujian/[id]`

**Note:** Jika status = aktif, hanya bisa update `show_result`. Untuk update lain, harus set status = nonaktif.

---

#### DELETE `/api/guru/ujian/[id]`

**Error Response (locked):**
```json
{
  "success": false,
  "error": {
    "code": "UJIAN_LOCKED",
    "message": "Tidak dapat menghapus ujian yang sedang dikerjakan siswa"
  }
}
```

---

#### POST `/api/guru/ujian/[id]/duplicate`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid_new",
    "kode_ujian": "DEF456",
    "judul": "Ujian Matematika Bab 1 (Copy)",
    "status": "nonaktif",
    "soal_count": 50
  }
}
```

---

#### POST `/api/guru/ujian/[id]/toggle`

**Request:**
```json
{
  "status": "aktif"  // atau "nonaktif"
}
```

---

#### GET `/api/guru/ujian/[id]/kelas`

**Response:**
```json
{
  "success": true,
  "data": {
    "kelas": [
      { "id": "uuid", "nama_kelas": "X IPA 1" }
    ]
  }
}
```

---

#### POST `/api/guru/ujian/[id]/kelas`

**Request:**
```json
{
  "kelas_ids": ["uuid1", "uuid2"]
}
```

---

#### DELETE `/api/guru/ujian/[id]/kelas`

**Request:**
```json
{
  "kelas_id": "uuid"
}
```

---

### 4.4. Soal

#### GET `/api/guru/soal`

**Query Params:**
- `ujian_id` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "soal": [
      {
        "id": "uuid",
        "ujian_id": "uuid",
        "teks_soal": "Berapa hasil dari 2 + 2?",
        "gambar_url": null,
        "jawaban_benar": "4",
        "pengecoh_1": "3",
        "pengecoh_2": "5",
        "pengecoh_3": "6",
        "pengecoh_4": null,
        "urutan": 1
      }
    ]
  }
}
```

---

#### POST `/api/guru/soal`

**Request:**
```json
{
  "ujian_id": "uuid",
  "teks_soal": "Berapa hasil dari $\\sqrt{16}$?",
  "gambar_url": "https://...",
  "jawaban_benar": "4",
  "pengecoh_1": "2",
  "pengecoh_2": "8",
  "pengecoh_3": "16",
  "pengecoh_4": "256"
}
```

---

#### POST `/api/guru/soal/import`

**Request:** (multipart/form-data)
- `file`: Excel file (.xlsx)
- `ujian_id`: UUID

**Excel Format:**
| Soal | Gambar_URL | Jawaban Benar | Pengecoh 1 | Pengecoh 2 | Pengecoh 3 | Pengecoh 4 |
|------|------------|---------------|------------|------------|------------|------------|
| Berapa hasil 2+2? | | 4 | 3 | 5 | 6 | |

---

#### PUT `/api/guru/soal/[id]`

**Error (ujian aktif):**
```json
{
  "success": false,
  "error": {
    "code": "UJIAN_ACTIVE",
    "message": "Soal tidak dapat diubah karena ujian sedang aktif"
  }
}
```

---

#### DELETE `/api/guru/soal/[id]`

**Note:** Sama seperti PUT, harus ujian nonaktif

---

### 4.5. Hasil & Dashboard

#### GET `/api/guru/hasil`

**Query Params:**
- `ujian_id` (required)
- `kelas_id` (optional)
- `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "hasil": [
      {
        "siswa": {
          "id": "uuid",
          "nisn": "1234567890",
          "nama": "Siswa Test"
        },
        "kelas": "X IPA 1",
        "nilai": 85.00,
        "jumlah_benar": 42,
        "jumlah_salah": 8,
        "waktu_mulai": "2026-03-31T09:00:00Z",
        "waktu_selesai": "2026-03-31T09:45:00Z",
        "is_submitted": true,
        "tab_switch_count": 0,
        "fullscreen_exit_count": 1
      }
    ],
    "pagination": { ... }
  }
}
```

---

#### GET `/api/guru/hasil/[ujian_id]/export`

**Query Params:**
- `format`: "xlsx" atau "pdf"
- `kelas_id` (optional)

**Response:** File download (Excel/PDF)

---

#### GET `/api/guru/hasil/[ujian_id]/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": [
      {
        "soal_id": "uuid",
        "teks_soal": "Berapa hasil dari 2 + 2?",
        "urutan": 1,
        "jumlah_benar": 40,
        "jumlah_salah": 10,
        "persentase_benar": 80.00
      }
    ],
    "summary": {
      "total_siswa": 50,
      "nilai_rata_rata": 75.5,
      "nilai_tertinggi": 100,
      "nilai_terendah": 20
    }
  }
}
```

---

#### GET `/api/guru/dashboard`

**Response:**
```json
{
  "success": true,
  "data": {
    "kelas_count": 3,
    "siswa_count": 90,
    "ujian_count": 5,
    "ujian_aktif": 2,
    "recent_hasil": [
      {
        "siswa_nama": "Siswa Test",
        "ujian_judul": "Ujian Matematika",
        "nilai": 85,
        "submitted_at": "2026-03-31T09:45:00Z"
      }
    ]
  }
}
```

---

#### WebSocket `/api/guru/dashboard/realtime`

**Purpose:** Real-time monitoring hasil ujian

**Events:**
```json
// Event: siswa_submit
{
  "event": "siswa_submit",
  "data": {
    "siswa_nama": "Siswa Test",
    "ujian_id": "uuid",
    "nilai": 85.00
  }
}

// Event: siswa_join
{
  "event": "siswa_join",
  "data": {
    "siswa_nama": "Siswa Test",
    "ujian_id": "uuid",
    "waktu_mulai": "2026-03-31T09:00:00Z"
  }
}
```

---

## 5. Siswa Endpoints

### 5.1. Ujian

#### POST `/api/siswa/ujian/join`

**Purpose:** Join ujian by code

**Request:**
```json
{
  "kode_ujian": "ABC123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ujian": {
      "id": "uuid",
      "judul": "Ujian Matematika",
      "durasi": 60,
      "jumlah_opsi": 4,
      "jumlah_soal": 50,
      "show_result": true
    },
    "has_started": false,  // apakah siswa sudah mulai
    "has_submitted": false  // apakah sudah submit
  }
}
```

**Error (invalid code):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CODE",
    "message": "Kode ujian tidak valid"
  }
}
```

**Error (not in class):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_IN_CLASS",
    "message": "Anda tidak terdaftar di kelas untuk ujian ini"
  }
}
```

---

#### POST `/api/siswa/ujian/[id]/start`

**Purpose:** Start ujian (timer begins)

**Request:**
```json
{
  "fullscreen": true  // siswa harus dalam fullscreen
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "waktu_mulai": "2026-03-31T09:00:00Z",
    "waktu_selesai_expected": "2026-03-31T10:00:00Z",
    "sisa_waktu": 3600,  // in seconds
    "seed_soal": 12345,  // seed for randomization
    "seed_opsi": 67890
  }
}
```

**Error (already submitted):**
```json
{
  "success": false,
  "error": {
    "code": "ALREADY_SUBMITTED",
    "message": "Anda sudah submit ujian ini"
  }
}
```

---

#### GET `/api/siswa/ujian/[id]/soal`

**Purpose:** Get soal (randomized for this siswa)

**Query Params:**
- `urutan` (optional, get specific soal by urutan)

**Response:**
```json
{
  "success": true,
  "data": {
    "soal": [
      {
        "id": "uuid",
        "urutan": 1,  // urutan untuk siswa ini (random)
        "teks_soal": "Berapa hasil dari 2 + 2?",
        "gambar_url": null,
        "opsi": [
          { "id": "A", "teks": "4" },
          { "id": "B", "teks": "3" },
          { "id": "C", "teks": "5" },
          { "id": "D", "teks": "6" }
        ],
        "jawaban_pilihan": "A",  // null if belum dijawab
        "is_answered": true
      }
    ],
    "total_soal": 50,
    "sisa_waktu": 3500,
    "answered_count": 25
  }
}
```

---

#### POST `/api/siswa/ujian/[id]/jawaban`

**Purpose:** Save jawaban (auto-save)

**Request:**
```json
{
  "soal_id": "uuid",
  "jawaban_pilihan": "A",
  "urutan_soal": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "saved": true,
    "answered_count": 26
  }
}
```

---

#### POST `/api/siswa/ujian/[id]/submit`

**Purpose:** Submit ujian (final)

**Request:**
```json
{
  "confirm": true  // explicit confirmation
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "nilai": 85.00,
    "jumlah_benar": 42,
    "jumlah_salah": 8,
    "waktu_selesai": "2026-03-31T09:45:00Z",
    "show_result": true  // dari ujian settings
  }
}
```

---

#### GET `/api/siswa/ujian/[id]/status`

**Purpose:** Get ujian status + timer for client

**Response:**
```json
{
  "success": true,
  "data": {
    "is_started": true,
    "is_submitted": false,
    "waktu_mulai": "2026-03-31T09:00:00Z",
    "sisa_waktu": 3500,  // seconds, calculated server-side
    "answered_count": 25,
    "total_soal": 50
  }
}
```

---

#### GET `/api/siswa/ujian/[id]/hasil`

**Purpose:** Get hasil (if show_result=true)

**Response:**
```json
{
  "success": true,
  "data": {
    "nilai": 85.00,
    "waktu_selesai": "2026-03-31T09:45:00Z"
  }
}
```

**Error (show_result=false):**
```json
{
  "success": false,
  "error": {
    "code": "RESULT_HIDDEN",
    "message": "Hasil ujian tidak ditampilkan"
  }
}
```

---

### 5.2. Riwayat

#### GET `/api/siswa/riwayat`

**Purpose:** List riwayat ujian siswa

**Response:**
```json
{
  "success": true,
  "data": {
    "riwayat": [
      {
        "ujian": {
          "id": "uuid",
          "judul": "Ujian Matematika",
          "kode_ujian": "ABC123"
        },
        "nilai": 85.00,
        "waktu_selesai": "2026-03-31T09:45:00Z",
        "show_result": true
      }
    ]
  }
}
```

---

## 6. Upload Endpoints

### 6.1. POST `/api/upload/image`

**Purpose:** Upload image for soal

**Request:** (multipart/form-data)
- `file`: Image file (jpg, png, gif)

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://supabase-storage.../image.jpg",
    "filename": "image.jpg"
  }
}
```

---

### 6.2. POST `/api/upload/excel`

**Purpose:** Upload Excel file for validation before import

**Request:** (multipart/form-data)
- `file`: Excel file (.xlsx)
- `type`: "siswa" atau "soal"

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "rows": 50,
    "preview": [
      {
        "row": 1,
        "nisn": "1234567890",
        "nama": "Siswa 1",
        "valid": true
      }
    ],
    "errors": []
  }
}
```

---

## 7. Anti-Cheating Endpoints

### 7.1. POST `/api/siswa/ujian/[id]/cheating-event`

**Purpose:** Log cheating event (tab switch, fullscreen exit)

**Request:**
```json
{
  "event_type": "tab_switch",  // atau "fullscreen_exit", "window_blur"
  "details": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 2
  }
}
```

---

## 8. Public Endpoints (No Authentication Required)

### 8.1. GET `/api/public/sekolah`

**Purpose:** Get identitas sekolah for login page and public display

**Response:**
```json
{
  "success": true,
  "data": {
    "nama_sekolah": "SMA Negeri 1 Jakarta",
    "npsn": "12345678",
    "alamat": "Jl. Pendidikan No. 1, Jakarta",
    "logo_url": "https://storage.../logo.png",
    "telepon": "021-1234567",
    "email": "sekolah@example.com",
    "website": "https://sekolah.sch.id",
    "kepala_sekolah": "Dr. Nama Kepala Sekolah",
    "tahun_ajaran": "2025/2026"
  }
}
```

---

### 8.2. GET `/api/public/logo-kemendikdasmen`

**Purpose:** Get logo Kemendikdasmen URL for login page header

**Response:**
```json
{
  "success": true,
  "data": {
    "logo_url": "/images/logo_kemendikdasmen.svg"
  }
}
```

---

## 9. Error Codes Reference

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Username/password salah |
| `INVALID_CODE` | Kode ujian tidak valid |
| `NOT_IN_CLASS` | Siswa tidak terdaftar di kelas untuk ujian |
| `UJIAN_LOCKED` | Ujian sedang dikerjakan siswa |
| `UJIAN_ACTIVE` | Ujian aktif, tidak bisa edit soal |
| `ALREADY_SUBMITTED` | Siswa sudah submit ujian |
| `ALREADY_STARTED` | Siswa sudah mulai ujian |
| `RESULT_HIDDEN` | Hasil ujian tidak ditampilkan |
| `FILE_INVALID` | File format tidak valid |
| `IMPORT_ERROR` | Error saat import data |
| `UNAUTHORIZED` | Tidak memiliki akses |
| `VALIDATION_ERROR` | Data tidak valid |

---

## 10. WebSocket Events (Real-time)

### Guru Dashboard Events

| Event | Description |
|-------|-------------|
| `siswa_join` | Siswa mulai ujian |
| `siswa_submit` | Siswa submit ujian |
| `siswa_answer` | Siswa menyimpan jawaban (optional) |
| `timer_warning` | Peringatan waktu (5 min left) |
| `cheating_alert` | Siswa melakukan cheating event |

---

## 11. Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/api/auth/login` | 10 req/min |
| `/api/siswa/ujian/*/jawaban` | 100 req/min (auto-save) |
| `/api/upload/*` | 20 req/min |
| Other endpoints | 60 req/min |

---

**Document Status:** ✅ Complete v1.1 - Ready for implementation planning.