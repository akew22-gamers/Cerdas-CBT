# DEPLOYMENT CONFIGURATION - Cerdas-CBT

**Versi:** 2.1.0
**Tanggal:** 31 Maret 2026
**Fase:** 1 - Online Mode (Vercel + Supabase)

---

## 1. Deployment Architecture (Fase 1)

### 1.1. Online Mode - Vercel + Supabase

```
┌─────────────────────────────────────────────────────────────┐
│  FASE 1: ONLINE MODE (Production)                            │
│                                                             │
│  GitHub Repository                                          │
│  ┌─────────────────┐                                        │
│  │ cerdas-cbt/     │ ──────► Vercel Auto-deploy             │
│  │ ├── src/        │         ┌─────────────────┐            │
│  │ ├── app/        │         │ Vercel Server   │            │
│  │ ├── prisma/     │         │ (Edge/Serverless│            │
│  │ └── ...         │         │ + Supabase)     │            │
│  └─────────────────┘         │ https://cbt...  │            │
│         │                    └────────┬────────┘            │
│         │                             │                      │
│         │         ┌───────────────────┼───────────────────┐  │
│         │         │                   │                   │  │
│         ▼         ▼                   ▼                   ▼  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  │ Supabase DB     │  │ Supabase Storage│  │ Supabase Auth   │
│  │ (PostgreSQL)    │  │ (1GB free)      │  │ (50K users)     │
│  │ 512MB free      │  │ Gambar soal     │  │ Login/Signup    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘
└─────────────────────────────────────────────────────────────┘

Access: https://cbt-xxx.vercel.app
```

### 1.2. Tech Stack

| Component | Service | Free Tier |
|-----------|---------|-----------|
| **Frontend** | Next.js 14+ (Vercel) | Free (Hobby) |
| **Styling** | Tailwind CSS + Shadcn UI | Free |
| **Math Rendering** | KaTeX (CDN) | Free |
| **Database** | Supabase PostgreSQL | 512MB |
| **Storage** | Supabase Storage | 1GB |
| **Auth** | Supabase Auth | 50K users/month |
| **Realtime** | Supabase Realtime | 200 concurrent |
| **CDN** | Vercel Edge Network | 100GB bandwidth |

### 1.3. Timeline

| Phase | Description | Timeline |
|-------|-------------|----------|
| **Setup** | Supabase project + Vercel config | 1-2 hari |
| **Development** | Core features (auth, CRUD, ujian) | 4-6 minggu |
| **Testing** | UAT dengan guru & siswa | 1-2 minggu |
| **Deployment** | Production launch | 1 hari |

---

## 2. Supabase Setup

### 2.1. Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Login
3. Create new project:
   - **Project name:** `cerdas-cbt`
   - **Database password:** (save to password manager)
   - **Region:** `Asia Pacific (Singapore)` - closest to Indonesia
   - **Pricing plan:** Free tier

4. Wait for provisioning (~2 menit)

### 2.2. Database Setup

**Option A: Run SQL directly in Supabase SQL Editor**

```sql
-- Copy all SQL from database_schema.md Section 2
-- Run in Supabase SQL Editor
```

**Option B: Use Prisma Migrate**

```bash
# Install Prisma
npm install prisma @prisma/client --save-dev

# Initialize Prisma
npx prisma init

# Configure schema.prisma
# Run migration
npx prisma migrate dev --name init

# Deploy to production
npx prisma migrate deploy
```

### 2.3. Create Storage Bucket

Go to Supabase Dashboard → Storage → Create new bucket

```
Bucket name: soal-images
Public: true
File size limit: 5242880 (5MB)
```

**Storage Policy (RLS):**

```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'soal-images');

-- Allow public to read
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'soal-images');
```

### 2.4. Configure Auth

Go to Supabase Dashboard → Authentication → Providers

**Email/Password:** Enabled by default

**Additional settings:**
- Disable email confirmation (for faster onboarding):
  - Authentication → Settings →Disable email confirmations
- Rate limiting: 30 requests per hour per IP

---

## 3. Vercel Setup

### 3.1. Connect GitHub to Vercel

1. Go to https://vercel.com
2. Login with GitHub
3. Import project:
   - Select repository: `akew22-gamers/Cerdas-CBT`
   - Framework Preset: Next.js
   - Root Directory: `./`

### 3.2. Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://xyz.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# App Configuration
NEXT_PUBLIC_APP_URL="https://cbt-xxx.vercel.app"

# KaTeX CDN (optional, defaults to jsdelivr)
NEXT_PUBLIC_KATEX_CDN="https://cdn.jsdelivr.net/npm/katex@0.16.9"

# Optional: For NextAuth (if not using Supabase Auth)
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://cbt-xxx.vercel.app"
```

**Note:** Super-admin credentials are created via Setup Wizard on first deployment, not via environment variables.

### 3.3. Build Settings

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

### 3.4. vercel.json

```json
{
  "buildCommand": "npx prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    }
  ]
}
```

---

## 4. GitHub Actions (CI/CD)

### 4.1. Create Workflow

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate Prisma Client
        run: npx prisma generate
      
      - name: Run linting
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel (Production)
        if: github.ref == 'refs/heads/main'
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
      
      - name: Deploy to Vercel (Preview)
        if: github.event_name == 'pull_request'
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 4.2. Add GitHub Secrets

Go to GitHub Repository → Settings → Secrets and variables → Actions

| Secret Name | Value |
|-------------|-------|
| `VERCEL_TOKEN` | From Vercel Dashboard → Account → Tokens |
| `VERCEL_ORG_ID` | From Vercel CLI: `vercel whoami` |
| `VERCEL_PROJECT_ID` | From Vercel Project URL |

---

## 5. Image Upload Implementation

### 5.1. API Route: Upload Image

`app/api/upload/image/route.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const formData = await req.formData();
  const file = formData.get('image') as File;
  
  if (!file) {
    return NextResponse.json(
      { error: 'No file provided' },
      { status: 400 }
    );
  }
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type' },
      { status: 400 }
    );
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: 'File size exceeds 5MB' },
      { status: 400 }
    );
  }
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('soal-images')
    .upload(`public/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('soal-images')
    .getPublicUrl(`public/${fileName}`);
  
  return NextResponse.json({
    url: publicUrl,
    fileName: fileName,
    size: file.size
  });
}
```

### 5.2. Frontend: Upload Component

`components/ImageUpload.tsx`:

```typescript
'use client';

import { useState } from 'react';

export function ImageUpload({ onChange }: { onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    
    const formData = new FormData();
    formData.append('image', file);
    
    const res = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });
    
    const data = await res.json();
    
    if (data.url) {
      onChange(data.url);
    }
    
    setUploading(false);
  }
  
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <span>Uploading...</span>}
    </div>
  );
}
```

---

## 6. Cost Estimation

### 6.1. Free Tier Limits

| Resource | Free Tier | Asumsi 500 Soal + Gambar | Status |
|----------|-----------|--------------------------|--------|
| **Database** | 512MB | ~100MB | ✅ Free |
| **Storage** | 1GB | ~250MB (500 × 500KB) | ✅ Free |
| **Bandwidth** | 5GB/bulan | ~1GB/bulan | ✅ Free |
| **Auth Users** | 50K/month | <1K users | ✅ Free |
| **Realtime** | 200 concurrent | 200 concurrent | ✅ Free |
| **Vercel** | 100GB bandwidth | ~10GB/bulan | ✅ Free |

### 6.2. Overage Pricing (If needed)

| Resource | Overage Cost |
|----------|--------------|
| Database | $0.02/GB-month |
| Storage | $0.021/GB-month |
| Bandwidth | $0.05/GB |

**Estimated Cost for 200 users:** $0/bulan (within free tier)

---

## 7. Troubleshooting

### 7.1. Common Issues

| Issue | Solution |
|-------|----------|
| Build fails on Vercel | Check `npx prisma generate` in build command |
| Image upload fails | Check Storage bucket permissions |
| Auth not working | Verify SUPABASE_ANON_KEY |
| Slow image load | Enable CDN caching in Supabase Storage |
| Database connection error | Check DATABASE_URL format |

### 7.2. Support Resources

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Supabase Discord: https://discord.supabase.com
- Vercel Community: https://github.com/vercel/next.js/discussions

---

## 8. Future Plans (Fase 2 - Offline Mode)

Setelah Fase 1 stabil (3-6 bulan):

| Component | Fase 1 (Online) | Fase 2 (Offline) |
|-----------|-----------------|------------------|
| **Hosting** | Vercel | Docker (Windows) |
| **Database** | Supabase PostgreSQL | PostgreSQL (Docker) |
| **Storage** | Supabase Storage | MinIO (S3-compatible) |
| **Auth** | Supabase Auth | Custom bcrypt |
| **Sync** | Real-time | Manual export/import |

---

**Document Status:** ✅ Final v2.1 - Updated with KaTeX CDN, Setup Wizard flow.