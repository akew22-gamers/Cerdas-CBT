import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, FileText, Play } from "lucide-react"

interface UjianCardProps {
  id: string
  kode_ujian: string
  judul: string
  durasi: number
  jumlah_soal: number
}

export function UjianCard({ id, kode_ujian, judul, durasi, jumlah_soal }: UjianCardProps) {
  return (
    <Card className="hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {kode_ujian}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 truncate" title={judul}>
              {judul}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-blue-500 uppercase font-medium">Durasi</p>
              <p className="text-sm font-semibold text-blue-700">{durasi} menit</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
            <FileText className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-amber-500 uppercase font-medium">Soal</p>
              <p className="text-sm font-semibold text-amber-700">{jumlah_soal}</p>
            </div>
          </div>
        </div>

        <Link href={`/siswa/ujian/${id}`} className="block">
          <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Play className="w-4 h-4" />
            Kerjakan
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}