'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { AlertTriangle, Maximize2 } from 'lucide-react'

interface FullscreenWarningProps {
  open: boolean
  onReenterFullscreen: () => void
}

export function FullscreenWarning({ open, onReenterFullscreen }: FullscreenWarningProps) {
  return (
    <Dialog open={open} modal onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
            Peringatan!
          </DialogTitle>
          <DialogDescription className="text-base">
            Anda keluar dari mode fullscreen. Ini tercatat sebagai pelanggaran.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Keluar dari fullscreen tidak diperbolehkan
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Ujian harus dikerjakan dalam mode fullscreen untuk mencegah kecurangan. 
                Semua kejadian keluarnya fullscreen akan dicatat dalam sistem.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="default"
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            onClick={onReenterFullscreen}
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            Kembali ke Fullscreen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
