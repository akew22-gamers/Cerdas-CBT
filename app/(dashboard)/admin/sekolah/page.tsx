import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { DashboardLayout } from '@/components/layout'
import { SekolahForm } from '@/components/sekolah/SekolahForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SekolahDisplay } from '@/components/sekolah/SekolahDisplay'

export default async function AdminSekolahPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'super_admin') {
    redirect('/login')
  }

  const supabase = createAdminClient()

  const { data: sekolahData } = await supabase
    .from('identitas_sekolah')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  const sekolah = sekolahData || null

  return (
    <DashboardLayout
      user={{
        nama: session.user.nama,
        username: session.user.username,
        role: 'super_admin'
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur-xl opacity-20" />
            <h1 className="relative text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Identitas Sekolah
            </h1>
          </div>
          <p className="text-gray-600 mt-2">Kelola informasi sekolah</p>
        </div>

        <Tabs defaultValue="edit" className="space-y-4">
          <TabsList className="grid w-full md:w-auto grid-cols-2 bg-slate-100/50 p-1 rounded-xl">
            <TabsTrigger value="edit" className="data-[state=active]:bg-white data-[state=active]:shadow-md">Edit Data</TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-white data-[state=active]:shadow-md">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <Card className="border-slate-200/80 shadow-lg shadow-slate-200/50">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-xl">Form Identitas Sekolah</CardTitle>
                <CardDescription className="text-slate-500">
                  Lengkapi informasi sekolah Anda. Field bertanda * wajib diisi.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <SekolahForm initialData={sekolah || undefined} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {sekolah ? (
              <SekolahDisplay data={sekolah} />
            ) : (
              <Card className="border-slate-200/80 shadow-lg shadow-slate-200/50">
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Belum ada data sekolah untuk ditampilkan. Silakan isi form pada tab &quot;Edit Data&quot;.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}