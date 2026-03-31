# DATABASE SCHEMA - Cerdas-CBT

**Database:** Supabase PostgreSQL (Managed)
**Storage:** Supabase Storage (1GB free tier)
**Versi:** 2.2.0
**Tanggal:** 31 Maret 2026
**Fase:** 1 - Online Mode (Vercel + Supabase)

---

## 1. Entity Relationship Diagram (ERD)

```
┌─────────────────┐       ┌─────────────────┐
│   super_admin   │       │      guru       │
│─────────────────│       │─────────────────│
│ id (PK)         │──────▶│ id (PK)         │
│ username        │       │ username        │
│ password_hash   │       │ password_hash   │
│ created_at      │       │ nama            │
└─────────────────┘       │ created_by (FK) │
                          │ created_at      │
                          └─────────────────┘
                                 │
                                 │ 1:N
                                 ▼
┌─────────────────┐       ┌─────────────────┐
│      kelas      │       │      ujian      │
│─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │
│ nama_kelas      │       │ kode_ujian (UQ) │
│ created_by (FK) │◀──────│ judul           │
│ created_at      │   N:M │ durasi          │
└─────────────────┘       │ jumlah_opsi     │
      │                   │ status          │
      │ 1:N               │ show_result     │
      ▼                   │ created_by (FK) │
┌─────────────────┐       │ created_at      │
│      siswa      │       └─────────────────┘
│─────────────────│             │
│ id (PK)         │             │ 1:N
│ nisn (UQ)       │             ▼
│ nama            │       ┌─────────────────┐
│ password_hash   │       │      soal       │
│ kelas_id (FK)   │       │─────────────────│
│ created_by (FK) │       │ id (PK)         │
│ created_at      │       │ ujian_id (FK)   │
└─────────────────┘       │ teks_soal       │
      │                   │ gambar_url      │
      │                   │ jawaban_benar   │
      │                   │ pengecoh_1      │
      │                   │ pengecoh_2      │
      │                   │ pengecoh_3      │
      │                   │ pengecoh_4      │
      │                   │ urutan_seed     │
      │                   └─────────────────┘
      │                         │
      │ 1:N                     │ 1:N
      ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│   hasil_ujian   │       │ jawaban_siswa   │
│─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │
│ siswa_id (FK)   │       │ siswa_id (FK)   │
│ ujian_id (FK)   │       │ ujian_id (FK)   │
│ nilai           │       │ soal_id (FK)    │
│ jumlah_benar    │       │ jawaban_pilihan │
│ jumlah_salah    │       │ urutan_soal     │
│ waktu_mulai     │       │ urutan_opsi     │
│ waktu_selesai   │       │ created_at      │
│ seed_soal       │       └─────────────────┘
│ seed_opsi       │
│ created_at      │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│   ujian_kelas   │       │    audit_log    │
│─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │
│ ujian_id (FK)   │       │ user_id (FK)    │
│ kelas_id (FK)   │       │ role            │
│ created_at      │       │ action          │
└─────────────────┘       │ entity_type     │
                          │ entity_id       │
                          │ details (JSONB) │
                          │ created_at      │
                          └─────────────────┘

┌─────────────────────────────────────────┐
│         identitas_sekolah               │
│─────────────────────────────────────────│
│ id (PK)                                 │
│ nama_sekolah                            │
│ npsn                                    │
│ alamat                                  │
│ logo_url                                │
│ telepon                                 │
│ email                                   │
│ website                                 │
│ kepala_sekolah                          │
│ tahun_ajaran                            │
│ updated_by (FK → guru/super_admin)      │
│ updated_at                              │
└─────────────────────────────────────────┘
```

---

## 2. SQL Schema (Supabase/PostgreSQL)

### 2.1. Tables

```sql
-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('super_admin', 'guru', 'siswa');
CREATE TYPE ujian_status AS ENUM ('aktif', 'nonaktif');

-- ============================================
-- TABLE: super_admin
-- ============================================
CREATE TABLE super_admin (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: guru
-- ============================================
CREATE TABLE guru (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    created_by UUID REFERENCES super_admin(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: kelas
-- ============================================
CREATE TABLE kelas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_kelas VARCHAR(50) NOT NULL,
    created_by UUID REFERENCES guru(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: siswa
-- ============================================
CREATE TABLE siswa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nisn VARCHAR(20) UNIQUE NOT NULL,  -- Primary Key alternatif
    nama VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    kelas_id UUID REFERENCES kelas(id) ON DELETE SET NULL,
    created_by UUID REFERENCES guru(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk pencarian cepat
CREATE INDEX idx_siswa_kelas ON siswa(kelas_id);
CREATE INDEX idx_siswa_nisn ON siswa(nisn);

-- ============================================
-- TABLE: ujian
-- ============================================
CREATE TABLE ujian (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kode_ujian VARCHAR(10) UNIQUE NOT NULL,  -- Join code (misal: "ABC123")
    judul VARCHAR(200) NOT NULL,
    durasi INTEGER NOT NULL,  -- dalam menit
    jumlah_opsi INTEGER NOT NULL DEFAULT 4,  -- 4 atau 5
    status ujian_status NOT NULL DEFAULT 'nonaktif',
    show_result BOOLEAN NOT NULL DEFAULT TRUE,  -- visibility hasil siswa
    created_by UUID REFERENCES guru(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk lookup kode ujian
CREATE INDEX idx_ujian_kode ON ujian(kode_ujian);
CREATE INDEX idx_ujian_status ON ujian(status);

-- ============================================
-- TABLE: ujian_kelas (many-to-many)
-- ============================================
CREATE TABLE ujian_kelas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ujian_id UUID REFERENCES ujian(id) ON DELETE CASCADE,
    kelas_id UUID REFERENCES kelas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ujian_id, kelas_id)  -- prevent duplicate
);

CREATE INDEX idx_ujian_kelas_ujian ON ujian_kelas(ujian_id);
CREATE INDEX idx_ujian_kelas_kelas ON ujian_kelas(kelas_id);

-- ============================================
-- TABLE: soal
-- ============================================
CREATE TABLE soal (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ujian_id UUID REFERENCES ujian(id) ON DELETE CASCADE,
    teks_soal TEXT NOT NULL,
    gambar_url TEXT,  -- opsional
    jawaban_benar TEXT NOT NULL,
    pengecoh_1 TEXT NOT NULL,
    pengecoh_2 TEXT NOT NULL,
    pengecoh_3 TEXT,  -- opsional untuk 4 opsi
    pengecoh_4 TEXT,  -- opsional untuk 4 opsi
    urutan INTEGER NOT NULL DEFAULT 0,  -- urutan soal (untuk display guru)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_soal_ujian ON soal(ujian_id);

-- ============================================
-- TABLE: hasil_ujian
-- ============================================
-- IMPORTANT: seed_soal dan seed_opsi digunakan untuk randomization yang konsisten
-- - seed_soal: Random seed untuk urutan soal per siswa
-- - seed_opsi: Random seed untuk urutan opsi jawaban per siswa
-- - Seed di-generate saat siswa klik "Mulai Ujian" dan disimpan di DB
-- - Jika siswa refresh halaman, seed diambil dari DB untuk urutan yang konsisten
CREATE TABLE hasil_ujian (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    siswa_id UUID REFERENCES siswa(id) ON DELETE CASCADE,
    ujian_id UUID REFERENCES ujian(id) ON DELETE CASCADE,
    nilai DECIMAL(5,2) NOT NULL,  -- 0-100
    jumlah_benar INTEGER NOT NULL DEFAULT 0,
    jumlah_salah INTEGER NOT NULL DEFAULT 0,
    waktu_mulai TIMESTAMP WITH TIME ZONE NOT NULL,
    waktu_selesai TIMESTAMP WITH TIME ZONE,
    seed_soal INTEGER NOT NULL,  -- seed untuk random urutan soal (disimpan untuk recovery)
    seed_opsi INTEGER NOT NULL,  -- seed untuk random urutan opsi (disimpan untuk recovery)
    is_submitted BOOLEAN NOT NULL DEFAULT FALSE,
    tab_switch_count INTEGER NOT NULL DEFAULT 0,  -- anti-cheating counter
    fullscreen_exit_count INTEGER NOT NULL DEFAULT 0,  -- anti-cheating counter
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(siswa_id, ujian_id)  -- 1x submit per siswa per ujian
);

CREATE INDEX idx_hasil_siswa ON hasil_ujian(siswa_id);
CREATE INDEX idx_hasil_ujian ON hasil_ujian(ujian_id);
CREATE INDEX idx_hasil_submitted ON hasil_ujian(is_submitted);

-- ============================================
-- TABLE: jawaban_siswa
-- ============================================
CREATE TABLE jawaban_siswa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    siswa_id UUID REFERENCES siswa(id) ON DELETE CASCADE,
    ujian_id UUID REFERENCES ujian(id) ON DELETE CASCADE,
    soal_id UUID REFERENCES soal(id) ON DELETE CASCADE,
    jawaban_pilihan TEXT NOT NULL,  -- text jawaban yang dipilih
    urutan_soal INTEGER NOT NULL,  -- urutan soal untuk siswa ini (random)
    urutan_opsi TEXT NOT NULL,  -- JSON array urutan opsi untuk siswa ini
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(siswa_id, soal_id)  -- 1 jawaban per soal per siswa
);

CREATE INDEX idx_jawaban_siswa ON jawaban_siswa(siswa_id, ujian_id);
CREATE INDEX idx_jawaban_soal ON jawaban_siswa(soal_id);

-- ============================================
-- TABLE: audit_log
-- ============================================
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,  -- bisa dari super_admin, guru, atau siswa
    role user_role NOT NULL,
    action VARCHAR(50) NOT NULL,  -- 'login', 'logout', 'create', 'update', 'delete', 'submit'
    entity_type VARCHAR(50),  -- 'guru', 'siswa', 'kelas', 'ujian', 'soal', 'jawaban'
    entity_id UUID,
    details JSONB,  -- detail tambahan
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_time ON audit_log(created_at);

-- ============================================
-- TABLE: anti_cheating_log
-- ============================================
CREATE TABLE anti_cheating_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hasil_ujian_id UUID REFERENCES hasil_ujian(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,  -- 'tab_switch', 'fullscreen_exit', 'window_blur'
    event_time TIMESTAMP WITH TIME ZONE NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cheating_hasil ON anti_cheating_log(hasil_ujian_id);

-- ============================================
-- TABLE: identitas_sekolah
-- ============================================
CREATE TABLE identitas_sekolah (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_sekolah VARCHAR(200) NOT NULL DEFAULT 'Nama Sekolah',
    npsn VARCHAR(10),  -- Nomor Pokok Sekolah Nasional
    alamat TEXT,
    logo_url TEXT,  -- URL logo sekolah (opsional)
    telepon VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(200),
    kepala_sekolah VARCHAR(100),
    tahun_ajaran VARCHAR(20) NOT NULL DEFAULT '2025/2026',
    setup_wizard_completed BOOLEAN NOT NULL DEFAULT FALSE,  -- Flag untuk setup wizard
    updated_by UUID,  -- bisa guru atau super_admin
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: Default row akan dibuat saat setup wizard pertama kali dijalankan
-- Tidak ada INSERT default karena setup wizard akan mengisi data sekolah
```

---

## 3. Row Level Security (RLS) Policies

```sql
-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE ujian ENABLE ROW LEVEL SECURITY;
ALTER TABLE soal ENABLE ROW LEVEL SECURITY;
ALTER TABLE hasil_ujian ENABLE ROW LEVEL SECURITY;
ALTER TABLE jawaban_siswa ENABLE ROW LEVEL SECURITY;

-- Guru policies
CREATE POLICY "Guru can view own data" ON guru
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Super admin can manage all guru" ON guru
    FOR ALL USING (
        EXISTS (SELECT 1 FROM super_admin WHERE id = auth.uid())
    );

-- Kelas policies
CREATE POLICY "Guru can manage own kelas" ON kelas
    FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Super admin can manage all kelas" ON kelas
    FOR ALL USING (
        EXISTS (SELECT 1 FROM super_admin WHERE id = auth.uid())
    );

-- Siswa policies
CREATE POLICY "Siswa can view own data" ON siswa
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Guru can manage siswa in own kelas" ON siswa
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM kelas 
            WHERE kelas.id = siswa.kelas_id 
            AND kelas.created_by = auth.uid()
        )
    );

-- Ujian policies
CREATE POLICY "Guru can manage own ujian" ON ujian
    FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Siswa can view active ujian in their kelas" ON ujian
    FOR SELECT USING (
        status = 'aktif' 
        AND EXISTS (
            SELECT 1 FROM ujian_kelas uk
            JOIN siswa s ON s.kelas_id = uk.kelas_id
            WHERE uk.ujian_id = ujian.id AND s.id = auth.uid()
        )
    );

-- Soal policies
CREATE POLICY "Guru can manage soal in own ujian" ON soal
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM ujian 
            WHERE ujian.id = soal.ujian_id 
            AND ujian.created_by = auth.uid()
        )
    );

CREATE POLICY "Siswa can view soal in active ujian" ON soal
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM ujian 
            WHERE ujian.id = soal.ujian_id 
            AND ujian.status = 'aktif'
        )
    );

-- Hasil ujian policies
CREATE POLICY "Siswa can view own hasil" ON hasil_ujian
    FOR SELECT USING (siswa_id = auth.uid());

CREATE POLICY "Guru can view hasil of students in own ujian" ON hasil_ujian
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM ujian 
            WHERE ujian.id = hasil_ujian.ujian_id 
            AND ujian.created_by = auth.uid()
        )
    );

-- Jawaban siswa policies
CREATE POLICY "Siswa can manage own jawaban" ON jawaban_siswa
    FOR ALL USING (siswa_id = auth.uid());

CREATE POLICY "Guru can view jawaban in own ujian" ON jawaban_siswa
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM ujian 
            WHERE ujian.id = jawaban_siswa.ujian_id 
            AND ujian.created_by = auth.uid()
        )
    );
```

---

## 4. Functions & Triggers

```sql
-- ============================================
-- FUNCTION: Generate random join code
-- ============================================
CREATE OR REPLACE FUNCTION generate_join_code()
RETURNS VARCHAR(10) AS $$
DECLARE
    code VARCHAR(10);
    exists BOOLEAN;
BEGIN
    LOOP
        -- Generate 6 character alphanumeric code
        code := UPPER(substring(md5(random()::text), 1, 6));
        
        -- Check if already exists
        SELECT EXISTS(SELECT 1 FROM ujian WHERE kode_ujian = code) INTO exists;
        
        IF NOT exists THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Auto-generate join code on insert
-- ============================================
CREATE OR REPLACE FUNCTION set_join_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.kode_ujian IS NULL OR NEW.kode_ujian = '' THEN
        NEW.kode_ujian := generate_join_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_join_code
    BEFORE INSERT ON ujian
    FOR EACH ROW
    EXECUTE FUNCTION set_join_code();

-- ============================================
-- FUNCTION: Calculate nilai
-- ============================================
CREATE OR REPLACE FUNCTION calculate_nilai(
    p_jumlah_benar INTEGER,
    p_total_soal INTEGER
) RETURNS DECIMAL(5,2) AS $$
BEGIN
    IF p_total_soal = 0 THEN
        RETURN 0;
    END IF;
    RETURN (p_jumlah_benar::DECIMAL / p_total_soal::DECIMAL) * 100;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Update timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trigger_update_guru
    BEFORE UPDATE ON guru
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_kelas
    BEFORE UPDATE ON kelas
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_siswa
    BEFORE UPDATE ON siswa
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_ujian
    BEFORE UPDATE ON ujian
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_soal
    BEFORE UPDATE ON soal
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================
-- FUNCTION: Log audit
-- ============================================
CREATE OR REPLACE FUNCTION log_audit(
    p_user_id UUID,
    p_role user_role,
    p_action VARCHAR(50),
    p_entity_type VARCHAR(50) DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_log (user_id, role, action, entity_type, entity_id, details)
    VALUES (p_user_id, p_role, p_action, p_entity_type, p_entity_id, p_details);
END;
$$ LANGUAGE plpgsql;
```

---

## 5. Views

```sql
-- ============================================
-- VIEW: Rekap nilai per ujian (for guru dashboard)
-- ============================================
CREATE VIEW v_rekap_nilai AS
SELECT 
    u.id AS ujian_id,
    u.judul AS ujian_judul,
    u.kode_ujian,
    s.id AS siswa_id,
    s.nisn,
    s.nama AS siswa_nama,
    k.nama_kelas,
    h.nilai,
    h.jumlah_benar,
    h.jumlah_salah,
    h.waktu_mulai,
    h.waktu_selesai,
    h.is_submitted,
    h.tab_switch_count,
    h.fullscreen_exit_count
FROM hasil_ujian h
JOIN siswa s ON h.siswa_id = s.id
JOIN kelas k ON s.kelas_id = k.id
JOIN ujian u ON h.ujian_id = u.id;

-- ============================================
-- VIEW: Statistik per soal
-- ============================================
CREATE VIEW v_statistik_soal AS
SELECT 
    so.id AS soal_id,
    so.teks_soal,
    so.ujian_id,
    u.judul AS ujian_judul,
    COUNT(j.id) AS total_jawaban,
    SUM(CASE WHEN j.is_correct THEN 1 ELSE 0 END) AS jumlah_benar,
    SUM(CASE WHEN NOT j.is_correct THEN 1 ELSE 0 END) AS jumlah_salah,
    ROUND(
        (SUM(CASE WHEN j.is_correct THEN 1 ELSE 0 END)::DECIMAL / COUNT(j.id)::DECIMAL) * 100, 
        2
    ) AS persentase_benar
FROM soal so
JOIN jawaban_siswa j ON so.id = j.soal_id
JOIN ujian u ON so.ujian_id = u.id
GROUP BY so.id, so.teks_soal, so.ujian_id, u.judul;

-- ============================================
-- VIEW: Ujian aktif for siswa
-- ============================================
CREATE VIEW v_ujian_aktif_siswa AS
SELECT 
    u.id,
    u.kode_ujian,
    u.judul,
    u.durasi,
    u.jumlah_opsi,
    u.show_result,
    k.nama_kelas
FROM ujian u
JOIN ujian_kelas uk ON u.id = uk.ujian_id
JOIN kelas k ON uk.kelas_id = k.id
WHERE u.status = 'aktif';
```

---

## 6. Seed Data (Initial Data)

```sql
-- ============================================
-- SEED: Super admin (predefined)
-- ============================================
-- Note: Password should be hashed with bcrypt
-- This is just placeholder - use proper auth setup
INSERT INTO super_admin (username, password_hash)
VALUES ('admin', '$2b$10$...hashed_password...');

-- ============================================
-- SEED: Sample guru
-- ============================================
INSERT INTO guru (username, password_hash, nama, created_by)
VALUES ('guru1', '$2b$10$...hashed_password...', 'Ahmad Guru', 
    (SELECT id FROM super_admin LIMIT 1));

-- ============================================
-- SEED: Sample kelas
-- ============================================
INSERT INTO kelas (nama_kelas, created_by)
VALUES ('X IPA 1', (SELECT id FROM guru LIMIT 1));

-- ============================================
-- SEED: Sample siswa
-- ============================================
INSERT INTO siswa (nisn, nama, password_hash, kelas_id, created_by)
VALUES ('1234567890', 'Siswa Test', '$2b$10$...hashed_password...', 
    (SELECT id FROM kelas LIMIT 1),
    (SELECT id FROM guru LIMIT 1));
```

---

## 7. Index Strategy Summary

| Table | Index | Purpose |
|-------|-------|---------|
| siswa | idx_siswa_kelas | Filter by kelas |
| siswa | idx_siswa_nisn | Login lookup |
| ujian | idx_ujian_kode | Join code lookup |
| ujian | idx_ujian_status | Filter active |
| soal | idx_soal_ujian | Get soal by ujian |
| hasil_ujian | idx_hasil_siswa | Get hasil by siswa |
| hasil_ujian | idx_hasil_ujian | Get hasil by ujian |
| jawaban_siswa | idx_jawaban_siswa | Get jawaban by siswa+ujian |
| audit_log | idx_audit_time | Time-based queries |

---

**Document Status:** ✅ Complete v2.2 - Consistent with PRD v3.2 and API v1.3.