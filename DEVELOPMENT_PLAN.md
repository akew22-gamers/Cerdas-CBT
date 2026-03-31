# DEVELOPMENT PLAN - Cerdas-CBT

**Versi:** 1.0.0
**Tanggal:** 31 Maret 2026
**Timeline:** 4-6 minggu (Fase 1 - Online Mode)

---

## Ringkasan Project

**Cerdas-CBT** adalah aplikasi ujian berbasis web (Computer Based Test) untuk sekolah dengan fitur:
- 3 role: Super-admin, Guru, Siswa
- Manajemen soal dengan support gambar dan rumus matematika (KaTeX)
- Ujian real-time dengan anti-cheating
- Import/export data Excel
- Mobile-first design

---

## Fase Development

### Timeline Overview

```
Minggu 1: Foundation Setup (Authentication, Layout, Database)
Minggu 2: Guru Module (Kelas, Siswa, Soal, Ujian CRUD)
Minggu 3: Siswa Module (Ujian, Submit, Hasil)
Minggu 4: Advanced Features (Real-time, Anti-cheating, Export)
Minggu 5-6: Testing, Bug Fix, Polish
```

---

## Phase 1: Foundation Setup (Minggu 1)

### Sprint 1.1: Project Initialization (2 hari)

#### Tasks

1. **Initialize Next.js Project**
   - [ ] Create Next.js 14+ project dengan App Router
   - [ ] Setup TypeScript configuration
   - [ ] Install dependencies:
     ```bash
     npm install @supabase/supabase-js @supabase/ssr
     npm install katex react-katex
     npm install sonner
     npm install lucide-react
     npm install tailwindcss postcss autoprefixer
     npm install class-variance-authority clsx tailwind-merge
     npm install xlsx file-saver jspdf
     ```

2. **Setup Tailwind CSS + Shadcn UI**
   - [ ] Configure Tailwind dengan Inter font
   - [ ] Install Shadcn UI components:
     - sonner, alert, alert-dialog, button, input, select, table, badge
     - card, dialog, dropdown-menu, form, label, textarea
     - tabs, toast, avatar, separator, scroll-area

3. **Setup Project Structure**
   ```
   cerdas-cbt/
   ├── app/
   │   ├── (auth)/
   │   │   ├── login/
   │   │   └── setup/
   │   ├── (dashboard)/
   │   │   ├── admin/
   │   │   ├── guru/
   │   │   └── siswa/
   │   ├── api/
   │   ├── layout.tsx
   │   └── page.tsx
   ├── components/
   │   ├── ui/              # Shadcn components
   │   ├── layout/          # Layout components
   │   ├── forms/           # Form components
   │   └── exam/            # Exam-specific components
   ├── lib/
   │   ├── supabase/        # Supabase client setup
   │   ├── utils/           # Utility functions
   │   ├── hooks/           # React hooks
   │   └── constants/       # App constants
   ├── types/               # TypeScript types
   └── public/
       └── images/
           └── logo_kemendikdasmen.svg
   ```

4. **Setup Supabase Client**
   - [ ] Create `lib/supabase/client.ts` (client component)
   - [ ] Create `lib/supabase/server.ts` (server component)
   - [ ] Create `middleware.ts` untuk session handling
   - [ ] Setup environment variables

5. **Copy Logo Asset**
   - [ ] Place `logo_kemendikdasmen.svg` in `/public/images/`

---

### Sprint 1.2: Authentication System (3 hari)

#### Tasks

1. **Setup Wizard (First-Run)**
   - [ ] Create `/app/(auth)/setup/page.tsx`
   - [ ] Create `/app/api/setup/status/route.ts`
   - [ ] Create `/app/api/setup/validate/route.ts`
   - [ ] Create `/app/api/setup/complete/route.ts`
   - [ ] Implement token validation (`SETUP_TOKEN`)
   - [ ] Create super-admin form
   - [ ] Create identitas sekolah form
   - [ ] Redirect logic if setup already completed

2. **Login Pages**
   - [ ] Create `/app/(auth)/login/page.tsx` - unified login
   - [ ] Create role selector (tabs: Super-admin, Guru, Siswa)
   - [ ] Create `/app/api/auth/login/route.ts`
   - [ ] Create `/app/api/auth/logout/route.ts`
   - [ ] Create `/app/api/auth/me/route.ts`
   - [ ] Create `/app/api/auth/change-password/route.ts`
   - [ ] Create `/app/api/auth/refresh/route.ts`
   - [ ] Display logo Kemendikdasmen + nama sekolah

3. **Profile Management**
   - [ ] Create guru profile (`/api/guru/profile`)
   - [ ] Update profile endpoint

4. **Protected Routes**
   - [ ] Create auth middleware
   - [ ] Redirect unauthenticated users to login
   - [ ] Role-based access control

---

### Sprint 1.3: Layout & Navigation (2 hari)

#### Tasks

1. **Admin Dashboard Layout**
   - [ ] Create sidebar navigation
   - [ ] Create header with user info
   - [ ] Create main content area
   - [ ] Responsive design (mobile-first)

2. **Guru Dashboard Layout**
   - [ ] Reuse shared layout components
   - [ ] Menu items: Dashboard, Kelas, Siswa, Ujian, Soal, Hasil

3. **Siswa Dashboard Layout**
   - [ ] Simplified navigation
   - [ ] Menu items: Ujian, Riwayat

4. **Shared Components**
   - [ ] `<Layout />` - Main layout wrapper
   - [ ] `<Sidebar />` - Navigation sidebar
   - [ ] `<Header />` - Top header
   - [ ] `<PageHeader />` - Page title + description
   - [ ] `<StatsCard />` - Dashboard statistics card

---

## Phase 2: Guru Module (Minggu 2-3)

### Sprint 2.1: Kelas Management (2 hari)

#### Tasks

1. **Kelas CRUD**
   - [ ] Create `/app/(dashboard)/guru/kelas/page.tsx` - list
   - [ ] Create `/app/(dashboard)/guru/kelas/create/page.tsx`
   - [ ] Create `/app/(dashboard)/guru/kelas/[id]/edit/page.tsx`
   - [ ] Create `/app/api/guru/kelas/route.ts` - GET, POST
   - [ ] Create `/app/api/guru/kelas/[id]/route.ts` - GET, PUT, DELETE
   - [ ] Implement delete constraint check (no siswa)

2. **Kelas Table Component**
   - [ ] Create `<KelasTable />` with Shadcn Table
   - [ ] Search, pagination, actions
   - [ ] Delete confirmation with AlertDialog

---

### Sprint 2.2: Siswa Management (3 hari)

#### Tasks

1. **Siswa CRUD**
   - [ ] Create `/app/(dashboard)/guru/siswa/page.tsx` - list
   - [ ] Create `/app/(dashboard)/guru/siswa/create/page.tsx`
   - [ ] Create `/app/(dashboard)/guru/siswa/[id]/edit/page.tsx`
   - [ ] Create `/app/api/guru/siswa/route.ts` - GET, POST
   - [ ] Create `/app/api/guru/siswa/[id]/route.ts` - GET, PUT, DELETE
   - [ ] Create `/app/api/guru/siswa/[id]/reset-password/route.ts`

2. **Import Excel**
   - [ ] Install xlsx package
   - [ ] Create `/app/api/guru/siswa/import/route.ts`
   - [ ] Create import dialog component
   - [ ] Validate Excel format (NISN, Nama, Password, Kelas)
   - [ ] Handle kelas name to UUID mapping
   - [ ] Return import result (imported, updated, skipped, errors)

3. **Siswa Components**
   - [ ] Create `<SiswaTable />` with filter by kelas
   - [ ] Create `<ImportDialog />` for Excel upload
   - [ ] Create `<ResetPasswordDialog />`

---

### Sprint 2.3: Identitas Sekolah (1 hari)

#### Tasks

1. **View School Identity (Guru - Read Only)**
   - [ ] Create `/app/(dashboard)/guru/sekolah/page.tsx`
   - [ ] Create `/app/api/guru/sekolah/route.ts` - GET only

2. **Manage School Identity (Super-admin)**
   - [ ] Create `/app/(dashboard)/admin/sekolah/page.tsx`
   - [ ] Create `/app/api/admin/sekolah/route.ts` - GET, PUT
   - [ ] Form for editing school identity

---

### Sprint 2.4: Soal Management (3 hari)

#### Tasks

1. **Soal CRUD**
   - [ ] Create `/app/(dashboard)/guru/soal/page.tsx` - list (filter by ujian)
   - [ ] Create `/app/(dashboard)/guru/soal/create/page.tsx`
   - [ ] Create `/app/(dashboard)/guru/soal/[id]/edit/page.tsx`
   - [ ] Create `/app/api/guru/soal/route.ts` - GET, POST
   - [ ] Create `/app/api/guru/soal/[id]/route.ts` - GET, PUT, DELETE
   - [ ] Create `/app/api/guru/soal/import/route.ts`

2. **KaTeX Integration**
   - [ ] Setup react-katex in root layout
   - [ ] Create `<MathRenderer />` component
   - [ ] Support inline `$...$` and block `$$...$$`

3. **Image Upload**
   - [ ] Create `/app/api/upload/image/route.ts`
   - [ ] Create `<ImageUpload />` component
   - [ ] Integrate with Supabase Storage

4. **Soal Components**
   - [ ] Create `<SoalEditor />` - Rich text with math/image
   - [ ] Create `<SoalPreview />` - Preview with KaTeX
   - [ ] Create `<ImportSoalDialog />`

---

### Sprint 2.5: Ujian Management (3 hari)

#### Tasks

1. **Ujian CRUD**
   - [ ] Create `/app/(dashboard)/guru/ujian/page.tsx` - list
   - [ ] Create `/app/(dashboard)/guru/ujian/create/page.tsx`
   - [ ] Create `/app/(dashboard)/guru/ujian/[id]/edit/page.tsx`
   - [ ] Create `/app/api/guru/ujian/route.ts` - GET, POST
   - [ ] Create `/app/api/guru/ujian/[id]/route.ts` - GET, PUT, DELETE

2. **Ujian Operations**
   - [ ] Create `/app/api/guru/ujian/[id]/toggle/route.ts` - activate/deactivate
   - [ ] Create `/app/api/guru/ujian/[id]/duplicate/route.ts` - duplicate ujian + soal
   - [ ] Create `/app/api/guru/ujian/[id]/kelas/route.ts` - manage kelas assignment

3. **Kelas Assignment**
   - [ ] Create `<AssignKelasDialog />`
   - [ ] Multi-select kelas for ujian

4. **Ujian Components**
   - [ ] Create `<UjianTable />` with status badges
   - [ ] Create `<UjianForm />` - create/edit form
   - [ ] Create `<UjianDetailPage />` - soal list + settings

---

### Sprint 2.6: Hasil & Dashboard (2 hari)

#### Tasks

1. **Guru Dashboard**
   - [ ] Create `/app/(dashboard)/guru/page.tsx` - dashboard
   - [ ] Create `/app/api/guru/dashboard/route.ts`
   - [ ] Stats cards: kelas, siswa, ujian count
   - [ ] Recent results list

2. **Hasil Ujian**
   - [ ] Create `/app/(dashboard)/guru/hasil/page.tsx` - filter by ujian
   - [ ] Create `/app/api/guru/hasil/route.ts` - GET
   - [ ] Create `/app/api/guru/hasil/[ujian_id]/stats/route.ts` - stats per soal

3. **Export**
   - [ ] Install file-saver, xlsx, jspdf
   - [ ] Create `/app/api/guru/hasil/[ujian_id]/export/route.ts`
   - [ ] Export to Excel (.xlsx)
   - [ ] Export to PDF

4. **Real-time Monitoring**
   - [ ] Create WebSocket connection with Supabase Realtime
   - [ ] Create `/app/api/guru/dashboard/realtime/route.ts`
   - [ ] Real-time update when siswa submits

---

## Phase 3: Siswa Module (Minggu 3-4)

### Sprint 3.1: Siswa Dashboard (1 hari)

#### Tasks

1. **Dashboard**
   - [ ] Create `/app/(dashboard)/siswa/page.tsx`
   - [ ] Show available ujian list
   - [ ] Show riwayat ujian

---

### Sprint 3.2: Join & Start Ujian (2 hari)

#### Tasks

1. **Join Ujian**
   - [ ] Create `/app/(dashboard)/siswa/ujian/join/page.tsx`
   - [ ] Create `/app/api/siswa/ujian/join/route.ts`
   - [ ] Input kode ujian
   - [ ] Validate siswa is in assigned kelas

2. **Start Ujian**
   - [ ] Create `/app/(dashboard)/siswa/ujian/[id]/page.tsx` - exam page
   - [ ] Create `/app/api/siswa/ujian/[id]/start/route.ts`
   - [ ] Generate seed for randomization
   - [ ] Create hasil_ujian record with start time

3. **Exam UI**
   - [ ] Create `<ExamLayout />` - fullscreen, header with timer
   - [ ] Create `<QuestionNavigator />` - sidebar/bottom bar
   - [ ] Create `<QuestionDisplay />` - current question
   - [ ] KaTeX rendering for math formulas

---

### Sprint 3.3: Answer & Submit (3 hari)

#### Tasks

1. **Auto-save Jawaban**
   - [ ] Create `/app/api/siswa/ujian/[id]/jawaban/route.ts`
   - [ ] Real-time save on every answer change
   - [ ] Track answered count

2. **Timer Implementation**
   - [ ] Server-side timer calculation
   - [ ] Create `/app/api/siswa/ujian/[id]/status/route.ts`
   - [ ] Timer display with warning (10% remaining)
   - [ ] Auto-submit on timeout

3. **Question Randomization**
   - [ ] Seed-based shuffle for soal order
   - [ ] Seed-based shuffle for opsi order
   - [ ] Consistent order on page refresh

4. **Submit Ujian**
   - [ ] Create `/app/api/siswa/ujian/[id]/submit/route.ts`
   - [ ] Calculate nilai
   - [ ] Mark as submitted
   - [ ] Prevent re-submit

5. **Result Display**
   - [ ] Create `/app/(dashboard)/siswa/ujian/[id]/hasil/page.tsx`
   - [ ] Create `/app/api/siswa/ujian/[id]/hasil/route.ts`
   - [ ] Show nilai if show_result = true

---

### Sprint 3.4: Anti-Cheating (2 hari)

#### Tasks

1. **Fullscreen Detection**
   - [ ] Implement fullscreen API
   - [ ] Track fullscreen_exit_count
   - [ ] Show warning dialog

2. **Tab Switch Detection**
   - [ ] Use visibilitychange event
   - [ ] Track tab_switch_count
   - [ ] Create `/app/api/siswa/ujian/[id]/cheating-event/route.ts`

3. **Anti-Cheating Log**
   - [ ] Insert to anti_cheating_log table
   - [ ] Display in guru hasil view

---

## Phase 4: Admin Module (Minggu 4)

### Sprint 4.1: Super-admin Dashboard (2 hari)

#### Tasks

1. **Admin Dashboard**
   - [ ] Create `/app/(dashboard)/admin/page.tsx`
   - [ ] Stats: total guru, total siswa, total ujian

2. **Guru Management**
   - [ ] Create `/app/(dashboard)/admin/guru/page.tsx` - list
   - [ ] Create `/app/(dashboard)/admin/guru/create/page.tsx`
   - [ ] Create `/app/api/admin/guru/route.ts` - GET, POST
   - [ ] Create `/app/api/admin/guru/[id]/route.ts` - GET, PUT, DELETE
   - [ ] Create `/app/api/admin/guru/reset-password/route.ts`

3. **Audit Log**
   - [ ] Create `/app/(dashboard)/admin/audit-log/page.tsx`
   - [ ] Create `/app/api/admin/audit-log/route.ts`
   - [ ] Filter by user, action, date

---

## Phase 5: Public & Utilities (Minggu 4-5)

### Sprint 5.1: Public Endpoints (1 hari)

#### Tasks

1. **Public APIs**
   - [ ] Create `/app/api/public/sekolah/route.ts` - school identity
   - [ ] Create `/app/api/public/logo-kemendikdasmen/route.ts`

---

### Sprint 5.2: Excel Import/Export Utilities (2 hari)

#### Tasks

1. **Excel Parser**
   - [ ] Create `lib/utils/excel-parser.ts`
   - [ ] Parse siswa import format
   - [ ] Parse soal import format
   - [ ] Validate data

2. **Export Generators**
   - [ ] Create `lib/utils/excel-export.ts` - generate XLSX
   - [ ] Create `lib/utils/pdf-export.ts` - generate PDF

---

## Phase 6: Real-time & Advanced Features (Minggu 5)

### Sprint 6.1: Real-time Updates (2 hari)

#### Tasks

1. **Supabase Realtime Setup**
   - [ ] Enable Realtime for hasil_ujian table
   - [ ] Subscribe to INSERT events on hasil_ujian
   - [ ] Subscribe to INSERT events on jawaban_siswa

2. **Guru Dashboard Realtime**
   - [ ] Update dashboard when siswa submits
   - [ ] Show toast notification on new submission

---

### Sprint 6.2: Session Management (1 hari)

#### Tasks

1. **Auto-refresh Token**
   - [ ] Implement middleware token refresh
   - [ ] Check session expiry on each request
   - [ ] Refresh if < TOKEN_REFRESH_THRESHOLD

2. **Exam Session Persistence**
   - [ ] Handle page refresh during exam
   - [ ] Restore timer and answers from DB

---

## Phase 7: Testing & Polish (Minggu 5-6)

### Sprint 7.1: Unit Testing (2 hari)

#### Tasks

1. **Setup Testing**
   - [ ] Install Jest, Testing Library
   - [ ] Configure test environment

2. **Component Tests**
   - [ ] Test auth flows
   - [ ] Test CRUD operations
   - [ ] Test exam submission flow

---

### Sprint 7.2: Integration Testing (2 hari)

#### Tasks

1. **E2E Testing**
   - [ ] Setup Playwright or Cypress
   - [ ] Test complete user journeys:
     - Setup wizard → Super-admin creates guru
     - Guru creates kelas → adds siswa
     - Guru creates ujian → adds soal
     - Siswa joins ujian → submits jawaban
     - Guru views hasil

---

### Sprint 7.3: UI/UX Polish (2 hari)

#### Tasks

1. **Responsive Design**
   - [ ] Test on mobile devices
   - [ ] Ensure touch-friendly UI
   - [ ] Test exam page on mobile

2. **Accessibility**
   - [ ] Add ARIA labels
   - [ ] Keyboard navigation
   - [ ] Focus management

3. **Performance**
   - [ ] Optimize images
   - [ ] Lazy loading for components
   - [ ] Database query optimization

---

### Sprint 7.4: Bug Fixes & Documentation (2 hari)

#### Tasks

1. **Bug Fixes**
   - [ ] Fix issues from testing
   - [ ] Edge case handling
   - [ ] Error boundary implementation

2. **Documentation**
   - [ ] Update README.md
   - [ ] Document environment variables
   - [ ] Document deployment steps

---

## Priority Summary

### Critical Path (Must Have)

1. ✅ Database setup (already done via Supabase MCP)
2. 🔲 Authentication system (Super-admin, Guru, Siswa)
3. 🔲 Setup Wizard (first-run)
4. 🔲 Kelas CRUD
5. 🔲 Siswa CRUD + Import
6. 🔲 Soal CRUD + Math + Image
7. 🔲 Ujian CRUD + Kelas Assignment
8. 🔲 Siswa Join → Start → Submit Ujian
9. 🔲 Hasil viewing (Guru + Siswa)

### High Priority (Should Have)

1. 🔲 Real-time monitoring
2. 🔲 Export hasil (Excel, PDF)
3. 🔲 Anti-cheating (fullscreen, tab switch)
4. 🔲 Dashboard statistics

### Medium Priority (Nice to Have)

1. 🔲 Audit log (Super-admin)
2. 🔲 Advanced search/filtering
3. 🔲 Performance optimization

---

## Dependencies Required

### NPM Packages

```json
{
  "dependencies": {
    "next": "^14.2.32",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.100.1",
    "@supabase/ssr": "^0.6.0",
    "katex": "^0.16.44",
    "react-katex": "^3.1.0",
    "sonner": "^1.5.0",
    "lucide-react": "^0.400.0",
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "xlsx": "^0.18.5",
    "file-saver": "^2.0.5",
    "jspdf": "^2.5.1",
    "jspdf-autotable": "^3.8.1"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.2.32"
  }
}
```

### Shadcn UI Components to Install

```bash
npx shadcn@latest add sonner
npx shadcn@latest add alert
npx shadcn@latest add alert-dialog
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add tabs
npx shadcn@latest add avatar
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
```

---

## Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://zttfgvutbvpgeaoehgrd.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# App Configuration
NEXT_PUBLIC_APP_URL="https://cbt-xxx.vercel.app"

# Setup Wizard Security Token
SETUP_TOKEN="[generate with: openssl rand -hex 32]"

# Session Configuration
SESSION_EXPIRY_SECONDS=604800
TOKEN_REFRESH_THRESHOLD=3600
```

---

## Database Status

✅ **Already Completed:**
- 12 tables created (super_admin, guru, kelas, siswa, ujian, ujian_kelas, soal, hasil_ujian, jawaban_siswa, audit_log, anti_cheating_log, identitas_sekolah)
- RLS policies enabled
- Realtime enabled for all tables
- Storage bucket "soal-images" created

---

## Notes

1. **Mobile-first Priority**: Semua UI harus di-design dengan prioritas mobile view
2. **Session Auto-refresh**: Critical untuk mencegah timeout saat ujian
3. **Setup Token Security**: Token harus disimpan aman dan hanya digunakan saat setup pertama kali
4. **Kelas Delete Constraint**: Implementasi validasi sebelum hapus kelas
5. **Duplicate Ujian**: Hanya metadata + soal yang di-copy, tanpa kelas assignment

---

**Document Status:** ✅ Complete - Ready for Development