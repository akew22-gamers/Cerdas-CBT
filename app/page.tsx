import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = createAdminClient()
  
  try {
    const { data: identitasSekolah, error } = await supabase
      .from('identitas_sekolah')
      .select('id, setup_wizard_completed')
      .maybeSingle()

    if (error) {
      redirect('/setup')
    }

    if (!identitasSekolah || !identitasSekolah.setup_wizard_completed) {
      redirect('/setup')
    }

    redirect('/login')
  } catch {
    redirect('/setup')
  }
}