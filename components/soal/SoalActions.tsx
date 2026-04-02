"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import { ImportSoalDialog } from "./ImportSoalDialog"

interface SoalActionsProps {
  selectedUjianId: string | null
  ujianStatus: 'aktif' | 'nonaktif'
}

export function SoalActions({ selectedUjianId, ujianStatus }: SoalActionsProps) {
  const router = useRouter()

  const handleImportSuccess = () => {
    router.refresh()
  }

  const handleAddSoal = () => {
    if (selectedUjianId) {
      router.push(`/guru/soal/create?ujian_id=${selectedUjianId}`)
    }
  }

  return (
    <div className="flex gap-2">
      {selectedUjianId ? (
        <ImportSoalDialog 
          ujianId={selectedUjianId} 
          ujianStatus={ujianStatus}
          onSuccess={handleImportSuccess}
        />
      ) : (
        <Button 
          variant="outline" 
          className="gap-2"
          disabled
        >
          <Upload className="h-4 w-4" />
          Import Excel
        </Button>
      )}
      <Button 
        className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
        disabled={!selectedUjianId}
        onClick={handleAddSoal}
      >
        <Plus className="h-4 w-4" />
        Soal Baru
      </Button>
    </div>
  )
}