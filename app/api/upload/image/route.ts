import { getSession } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { compressImageToFile, needsCompression, formatFileSize } from '@/lib/utils/compress-image'

// POST /api/upload/image - Upload image to Supabase Storage with compression
export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Tidak terautentikasi' } },
        { status: 401 }
      )
    }

    const supabase = createAdminClient()

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'soal-images'
    const oldFilePath = formData.get('oldFilePath') as string | null
    const maxSizeKB = parseInt(formData.get('maxSizeKB') as string) || 100

    if (!file) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'File tidak ditemukan' } },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_FILE_TYPE', message: 'File harus berupa gambar (JPEG, PNG, GIF, atau WebP)' } },
        { status: 400 }
      )
    }

    // Compress image if needed
    let fileToUpload = file
    let compressionMessage = ''
    
    if (needsCompression(file, maxSizeKB)) {
      const originalSize = file.size
      fileToUpload = await compressImageToFile(file, file.name, {
        maxSizeKB,
        maxWidth: 1200,
        maxHeight: 1200
      })
      compressionMessage = `Compressed from ${formatFileSize(originalSize)} to ${formatFileSize(fileToUpload.size)}`
      console.log(compressionMessage)
    }

    // Generate unique filename
    const fileExt = fileToUpload.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Convert file to ArrayBuffer
    const arrayBuffer = await fileToUpload.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    let { error: uploadError } = await supabase.storage
      .from(folder)
      .upload(filePath, buffer, {
        contentType: fileToUpload.type,
        upsert: false
      })

    if (uploadError && uploadError.message.includes('bucket') && uploadError.message.includes('not found')) {
      const { error: createError } = await supabase.storage.createBucket(folder, {
        public: true,
        fileSizeLimit: 5242880
      })

      if (createError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'BUCKET_NOT_FOUND',
              message: `Bucket "${folder}" tidak dapat dibuat. Harap buat bucket di Supabase Storage dashboard.`
            }
          },
          { status: 500 }
        )
      }

      const uploadResult = await supabase.storage
        .from(folder)
        .upload(filePath, buffer, {
          contentType: fileToUpload.type,
          upsert: false
        })

      uploadError = uploadResult.error
    }

    if (uploadError) {
      console.error('Upload error:', uploadError)
      
      if (uploadError.message.includes('bucket') && uploadError.message.includes('not found')) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'BUCKET_NOT_FOUND', 
              message: `Bucket "${folder}" belum dibuat. Harap buat bucket di Supabase Storage terlebih dahulu.` 
            } 
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { success: false, error: { code: 'UPLOAD_ERROR', message: uploadError.message } },
        { status: 500 }
      )
    }

    // Delete old file if provided
    if (oldFilePath) {
      try {
        await supabase.storage
          .from(folder)
          .remove([oldFilePath])
        console.log('Old file deleted:', oldFilePath)
      } catch (deleteError) {
        console.error('Failed to delete old file:', deleteError)
        // Don't fail the upload if delete fails
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(folder)
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename: fileName,
        filePath: filePath,
        size: fileToUpload.size,
        compression: compressionMessage || 'No compression needed'
      }
    })

  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan pada server' } },
      { status: 500 }
    )
  }
}
