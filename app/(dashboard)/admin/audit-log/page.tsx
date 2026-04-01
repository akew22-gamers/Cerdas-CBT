import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import AuditLogPageClient from './AuditLogPageClient'

export default async function AuditLogPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'super_admin') {
    redirect('/login')
  }

  return <AuditLogPageClient userName={session.user.username || 'Administrator'} />
}