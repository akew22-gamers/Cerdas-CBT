// Types for Exam Card (Kartu Ujian) feature

import { Siswa } from './database'

/**
 * QR Code data structure embedded in exam cards
 * When scanned, redirects to /ujian with auto-fill capability
 */
export interface QRCardData {
  type: 'exam_login'          // Identifier for QR code type
  u: string                   // ujian_id (shortened)
  s: string                   // siswa_id (shortened)
  k: string                   // kode_ujian
  v: number                   // version (for future compatibility)
}

/**
 * Full exam card data for PDF generation
 */
export interface KartuUjianData {
  siswa: {
    id: string
    nisn: string
    nama: string
    kelas: {
      id: string
      nama_kelas: string
    } | null
  }
  ujian: {
    id: string
    kode_ujian: string
    judul: string
    durasi: number
  }
  sekolah: {
    nama_sekolah: string
    logo_url: string | null
  }
  qrData: string              // Encoded QR data (JSON stringified QRCardData)
  loginUrl: string            // Full URL for QR code redirect
}

/**
 * API Response for fetching exam card data
 */
export interface KartuUjianResponse {
  success: boolean
  data?: KartuUjianData[]
  error?: {
    code: string
    message: string
  }
}

/**
 * Login request for exam-specific login page
 */
export interface UjianLoginRequest {
  nisn: string
  password: string
  kode_ujian: string
}

/**
 * Login response for exam-specific login
 */
export interface UjianLoginResponse {
  success: boolean
  data?: {
    siswa_id: string
    ujian_id: string
    redirect_url: string
  }
  error?: {
    code: string
    message: string
  }
}