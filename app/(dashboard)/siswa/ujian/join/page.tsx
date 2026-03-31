"use client"

import { JoinUjianForm } from "@/components/siswa/JoinUjianForm"
import Image from "next/image"

export default function JoinUjianPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-md">
        {/* Header with logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
            <Image
              src="/images/logo_kemendikdasmen.svg"
              alt="Logo Kemendikdasmen"
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-indigo-900 font-heading">
            Cerdas-CBT
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Masuk ke ujian dengan kode yang diberikan guru
          </p>
        </div>

        {/* Join Form */}
        <JoinUjianForm />

        {/* Footer info */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Pastikan kode ujian yang Anda masukkan benar
          <br />
          Hubungi guru jika mengalami masalah
        </p>
      </div>
    </div>
  )
}
