import { NextResponse } from 'next/server'
import type { ApiSuccessResponse, ApiErrorResponse } from '@/types/api'

export async function POST() {
  try {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    
    let supabase
    try {
      supabase = createAdminClient()
    } catch (clientError) {
      console.error('Failed to create Supabase client:', clientError)
      return NextResponse.json<ApiErrorResponse>({
        success: false,
        error: {
          code: 'CONNECTION_ERROR',
          message: 'Gagal terhubung ke database. Periksa konfigurasi environment variables.'
        }
      }, { status: 500 })
    }

    const { data: existing, error: checkError } = await supabase
      .from('identitas_sekolah')
      .select('id')
      .limit(1)

    if (checkError) {
      if (checkError.code === '42P01') {
        return NextResponse.json<ApiErrorResponse>({
          success: false,
          error: {
            code: 'TABLES_NOT_FOUND',
            message: 'Tabel database belum dibuat. Buka Supabase Dashboard > SQL Editor dan jalankan SQL schema dari file database_schema.md'
          }
        }, { status: 400 })
      }

      console.error('Database check error:', checkError)
      return NextResponse.json<ApiErrorResponse>({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: `Gagal memeriksa database: ${checkError.message}`
        }
      }, { status: 500 })
    }

    if (existing && existing.length > 0) {
      return NextResponse.json<ApiErrorResponse>({
        success: false,
        error: {
          code: 'DATABASE_NOT_EMPTY',
          message: 'Database sudah memiliki data, tidak perlu inisialisasi'
        }
      }, { status: 400 })
    }

    const { error: insertError } = await supabase
      .from('identitas_sekolah')
      .insert({
        nama_sekolah: 'Sekolah Baru',
        tahun_ajaran: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        setup_wizard_completed: false
      })

    if (insertError) {
      console.error('Database init error:', insertError)
      return NextResponse.json<ApiErrorResponse>({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: `Gagal menginisialisasi database: ${insertError.message}`
        }
      }, { status: 500 })
    }

    return NextResponse.json<ApiSuccessResponse<{ message: string }>>({
      success: true,
      data: {
        message: 'Database berhasil diinisialisasi'
      }
    })
  } catch (error) {
    console.error('Database init error:', error)
    return NextResponse.json<ApiErrorResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Terjadi kesalahan saat inisialisasi database'
      }
    }, { status: 500 })
  }
}