// Database types based on database_schema.md

export type UserRole = 'super_admin' | 'guru' | 'siswa'
export type UjianStatus = 'aktif' | 'nonaktif'

// ============================================
// TABLE: super_admin
// ============================================
export interface SuperAdmin {
  id: string
  username: string
  password_hash: string
  created_at: string
}

// ============================================
// TABLE: guru
// ============================================
export interface Guru {
  id: string
  username: string
  password_hash: string
  nama: string
  created_by: string | null
  created_at: string
  updated_at: string
}

// ============================================
// TABLE: kelas
// ============================================
export interface Kelas {
  id: string
  nama_kelas: string
  created_by: string
  created_at: string
  updated_at: string
}

// ============================================
// TABLE: siswa
// ============================================
export interface Siswa {
  id: string
  nisn: string
  nama: string
  password_hash: string
  kelas_id: string | null
  created_by: string
  created_at: string
  updated_at: string
}

// ============================================
// TABLE: ujian
// ============================================
export interface Ujian {
  id: string
  kode_ujian: string
  judul: string
  durasi: number
  jumlah_opsi: number
  status: UjianStatus
  show_result: boolean
  created_by: string
  created_at: string
  updated_at: string
}

// ============================================
// TABLE: ujian_kelas
// ============================================
export interface UjianKelas {
  id: string
  ujian_id: string
  kelas_id: string
  created_at: string
}

// ============================================
// TABLE: soal
// ============================================
export interface Soal {
  id: string
  ujian_id: string
  teks_soal: string
  gambar_url: string | null
  jawaban_benar: string
  pengecoh_1: string
  pengecoh_2: string
  pengecoh_3: string | null
  pengecoh_4: string | null
  urutan: number
  created_at: string
  updated_at: string
}

// ============================================
// TABLE: hasil_ujian
// ============================================
export interface HasilUjian {
  id: string
  siswa_id: string
  ujian_id: string
  nilai: number
  jumlah_benar: number
  jumlah_salah: number
  waktu_mulai: string
  waktu_selesai: string | null
  seed_soal: number
  seed_opsi: number
  is_submitted: boolean
  tab_switch_count: number
  fullscreen_exit_count: number
  created_at: string
}

// ============================================
// TABLE: jawaban_siswa
// ============================================
export interface JawabanSiswa {
  id: string
  siswa_id: string
  ujian_id: string
  soal_id: string
  jawaban_pilihan: string
  urutan_soal: number
  urutan_opsi: string
  is_correct: boolean
  created_at: string
  updated_at: string
}

// ============================================
// TABLE: audit_log
// ============================================
export interface AuditLog {
  id: string
  user_id: string
  role: UserRole
  action: string
  entity_type: string | null
  entity_id: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

// ============================================
// TABLE: anti_cheating_log
// ============================================
export interface AntiCheatingLog {
  id: string
  hasil_ujian_id: string
  event_type: string
  event_time: string
  details: Record<string, unknown> | null
  created_at: string
}

// ============================================
// TABLE: identitas_sekolah
// ============================================
export interface IdentitasSekolah {
  id: string
  nama_sekolah: string
  npsn: string | null
  alamat: string | null
  logo_url: string | null
  telepon: string | null
  email: string | null
  website: string | null
  kepala_sekolah: string | null
  tahun_ajaran: string
  setup_wizard_completed: boolean
  updated_by: string | null
  updated_at: string
  created_at: string
}

// ============================================
// VIEW: v_rekap_nilai
// ============================================
export interface RekapNilai {
  ujian_id: string
  ujian_judul: string
  kode_ujian: string
  siswa_id: string
  nisn: string
  siswa_nama: string
  nama_kelas: string
  nilai: number
  jumlah_benar: number
  jumlah_salah: number
  waktu_mulai: string
  waktu_selesai: string | null
  is_submitted: boolean
  tab_switch_count: number
  fullscreen_exit_count: number
}

// ============================================
// VIEW: v_statistik_soal
// ============================================
export interface StatistikSoal {
  soal_id: string
  teks_soal: string
  ujian_id: string
  ujian_judul: string
  total_jawaban: number
  jumlah_benar: number
  jumlah_salah: number
  persentase_benar: number
}