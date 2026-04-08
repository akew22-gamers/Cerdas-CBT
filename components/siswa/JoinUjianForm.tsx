"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2Icon, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"

interface JoinUjianFormProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function JoinUjianForm({ open = true, onOpenChange }: JoinUjianFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [kodeUjian, setKodeUjian] = useState("")

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false)
    }
    router.push('/siswa')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!kodeUjian.trim()) {
      toast.error("Kode ujian harus diisi")
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/siswa/ujian/join", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kode_ujian: kodeUjian.trim().toUpperCase(),
          }),
          credentials: 'include'
        })

        const result = await response.json()

        if (!response.ok) {
          const errorMessage = result.error?.message || "Gagal bergabung ke ujian"
          toast.error(errorMessage)
          return
        }

        toast.success("Berhasil bergabung ke ujian")
        router.push(result.data.redirect_url)
        
      } catch (error) {
        console.error("Join ujian error:", error)
        toast.error("Terjadi kesalahan. Silakan coba lagi.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          type="button"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <DialogTitle className="text-center text-lg">Masuk Ujian</DialogTitle>
          <DialogDescription className="text-center text-sm">
            Masukkan kode ujian yang diberikan oleh guru
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="kode_ujian" className="text-sm font-medium text-foreground">
              Kode Ujian
            </label>
            <Input
              id="kode_ujian"
              type="text"
              placeholder="Contoh: ABC123"
              value={kodeUjian}
              onChange={(e) => setKodeUjian(e.target.value.toUpperCase())}
              disabled={isPending}
              className="uppercase tracking-wider text-center text-lg"
              maxLength={10}
              autoComplete="off"
            />
          </div>

          <DialogFooter>
            <Button 
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="w-full"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || !kodeUjian.trim()}
              className="w-full"
            >
              {isPending ? (
                <>
                  <Loader2Icon className="mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk Ujian"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
