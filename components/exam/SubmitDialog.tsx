'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface SubmitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => Promise<void>
  totalQuestions: number
  answeredQuestions: number
}

export function SubmitDialog({
  open,
  onOpenChange,
  onSubmit,
  totalQuestions,
  answeredQuestions
}: SubmitDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const unanswered = totalQuestions - answeredQuestions

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Kirim Jawaban?
          </DialogTitle>
          <DialogDescription>
            Pastikan semua jawaban sudah benar sebelum mengirim. Anda tidak dapat mengubah jawaban setelah mengirim.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Soal:</span>
            <span className="font-semibold">{totalQuestions}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Terjawab:</span>
            <span className="font-semibold text-green-600">{answeredQuestions}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Belum Terjawab:</span>
            <span className={`font-semibold ${unanswered > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              {unanswered}
            </span>
          </div>

          {unanswered > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Masih ada {unanswered} soal belum terjawab
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Soal yang tidak terjawab akan dianggap salah.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter showCloseButton={!isSubmitting}>
          <Button
            type="button"
            variant="default"
            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Mengirim...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Ya, Kirim Jawaban
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
