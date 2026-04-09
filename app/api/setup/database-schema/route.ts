import { NextResponse } from 'next/server'
import type { ApiSuccessResponse, ApiErrorResponse } from '@/types/api'

export async function GET() {
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

    const { error } = await supabase
      .from('identitas_sekolah')
      .select('id')
      .limit(1)

    if (error && error.code === '42P01') {
      const schemaUrl = 'https://raw.githubusercontent.com/akew22-gamers/Cerdas-CBT/main/database_schema.md'
      
      return NextResponse.json<ApiSuccessResponse<{ 
        needsSchema: boolean
        message: string
        schemaUrl: string
        instructions: string[]
      }>>({
        success: true,
        data: {
          needsSchema: true,
          message: 'Database kosong. Anda perlu membuat tabel terlebih dahulu.',
          schemaUrl,
          instructions: [
            '1. Buka Supabase Dashboard > SQL Editor',
            '2. Copy SQL schema dari link di bawah atau file database_schema.md',
            '3. Paste dan jalankan SQL tersebut',
            '4. Refresh halaman ini setelah selesai'
          ]
        }
      })
    }

    return NextResponse.json<ApiSuccessResponse<{ needsSchema: boolean }>>({
      success: true,
      data: { needsSchema: false }
    })

  } catch (error) {
    console.error('Schema check error:', error)
    return NextResponse.json<ApiErrorResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Terjadi kesalahan saat memeriksa schema'
      }
    }, { status: 500 })
  }
}