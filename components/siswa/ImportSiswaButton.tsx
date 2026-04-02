"use client"

import { useRouter } from "next/navigation"
import { ImportSiswaDialog } from "./ImportSiswaDialog"

export function ImportSiswaButton() {
  const router = useRouter()

  const handleSuccess = () => {
    router.refresh()
  }

  return <ImportSiswaDialog onSuccess={handleSuccess} />
}