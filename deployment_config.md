# DEPLOYMENT CONFIGURATION - Cerdas-CBT

**Versi:** 1.1.0
**Tanggal:** 31 Maret 2026
**Development Priority:** Online-first (Vercel + Neon), then Offline (Docker)

---

## 1. Deployment Architecture

### Development Phases

| Phase | Mode | Status | Priority |
|-------|------|--------|----------|
| **Phase 1** | Online (Vercel + Neon) | Active | High |
| **Phase 2** | Offline (Docker + PostgreSQL) | Future | Medium |

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: ONLINE (Vercel + Neon) - PRIORITY                 │
│                                                             │
│  GitHub Repository                                          │
│  ┌─────────────────┐                                        │
│  │ cerdas-cbt/     │ ──────► Vercel Auto-deploy             │
│  │ ├── src/        │         ┌─────────────────┐            │
│  │ ├── prisma/     │         │ Vercel Server   │            │
│  │ └── ...         │         │ + Neon Postgres │            │
│  └─────────────────┘         │ https://cbt... │            │
│                              └─────────────────┘            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: OFFLINE (Windows Server + Docker) - FUTURE        │
│                                                             │
│  Windows PC (Guru)                                          │
│  ┌─────────────────┐                                        │
│  │ Docker Desktop  │ (Installed via setup.exe)              │
│  └─────────────────┘                                        │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ PostgreSQL      │  │ Next.js App     │                   │
│  │ (Container)     │◄─│ (Container)     │                   │
│  │ Port: 5432      │  │ Port: 3000      │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                             │                               │
│                             ▼                               │
│                  http://192.168.x.x:3000                     │
│                             │                               │
│  ┌─────────────────┬─────────────────┬─────────────────┐   │
│  │ Siswa 1         │ Siswa 2         │ Siswa 3         │   │
│  │ (Browser)       │ (Browser)       │ (Browser)       │   │
│  └─────────────────┴─────────────────┴─────────────────┘   │
│  Access via local network (WiFi/LAN)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Docker Compose Configuration

### 2.1. docker-compose.yml

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: cbt-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: cbt_local
      POSTGRES_USER: cbt_user
      POSTGRES_PASSWORD: cbt_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cbt_user -d cbt_local"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Next.js Application
  cbt-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: cbt-app
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://cbt_user:cbt_pass@postgres:5432/cbt_local
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: ${NEXTAUTH_URL:-http://localhost:3000}
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
```

### 2.2. Dockerfile (Next.js)

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runner

WORKDIR /app

# Set to production
ENV NODE_ENV=production

# Copy necessary files
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Install only production dependencies
RUN npm ci --only=production

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
```

---

## 3. Windows Installer Files

### 3.1. Directory Structure

```
📁 next-cbt-windows-installer/
├── 📁 src/
│   ├── setup.iss              ← Inno Setup script
│   ├── license.txt            ← License agreement
│   └── README.txt             ← User manual
├── 📁 scripts/
│   ├── start.bat              ← Start app script
│   ├── stop.bat               ← Stop app script
│   ├── reset-admin.bat        ← Reset super admin
│   ├── check-docker.bat       ← Check Docker status
│   └── backup-data.bat        ← Backup database
├── 📁 docker/
│   ├── docker-compose.yml     ← Docker compose config
│   ├── Dockerfile             ← Next.js Dockerfile
│   ├── init-db.sql            ← Initial database setup
│   └── .env.example           ← Environment template
├── 📁 app/
│   └── next-cbt/              ← Pre-built Next.js app
│       ├── .next/
│       ├── public/
│       ├── prisma/
│       ├── package.json
│       └── next.config.js
├── output/
│   └── next-cbt-setup.exe     ← Generated installer
└── build-installer.bat        ← Script to build installer
```

### 3.2. setup.iss (Inno Setup Script)

```iss
; Next-CBT Windows Installer
; Generated with Inno Setup

[Setup]
AppName=Next-CBT
AppVersion=2.1.0
AppPublisher=Eka Ahmad
DefaultDirName={pf}\Next-CBT
DefaultGroupName=Next-CBT
OutputDir=output
OutputBaseFilename=next-cbt-setup
Compression=lzma2
SolidCompression=yes
SetupIconFile=src\icon.ico
WizardImageFile=src\wizard.bmp
WizardSmallImageFile=src\wizard-small.bmp
PrivilegesRequired=admin

[Languages]
Name: "indonesian"; MessagesFile: "compiler:Languages\Indonesian.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
; Copy all app files
Source: "app\next-cbt\*"; DestDir: "{app}\app"; Flags: recursesubdirs
; Copy Docker files
Source: "docker\*"; DestDir: "{app}\docker"; Flags: recursesubdirs
; Copy scripts
Source: "scripts\*"; DestDir: "{app}"; Flags: recursesubdirs
; Copy docs
Source: "src\README.txt"; DestDir: "{app}"
Source: "src\license.txt"; DestDir: "{app}"

[Icons]
Name: "{group}\Start CBT"; Filename: "{app}\start.bat"
Name: "{group}\Stop CBT"; Filename: "{app}\stop.bat"
Name: "{group}\Reset Admin Password"; Filename: "{app}\reset-admin.bat"
Name: "{group}\Backup Data"; Filename: "{app}\backup-data.bat"
Name: "{group}\README"; Filename: "{app}\README.txt"
Name: "{group}\Uninstall"; Filename: "{uninstallexe}"

[Run]
Filename: "{app}\start.bat"; Description: "Start CBT now"; Flags: postinstall nowait skipifdoesntexist

[Registry]
; Add to PATH (optional)
Root: HKCU; Subkey: "Environment"; ValueType: string; ValueName: "PATH"; ValueData: "{app};{olddata}"; Flags: preservestringtype

[Code]
function InitializeSetup(): Boolean;
var
  DockerInstalled: Boolean;
begin
  Result := True;
  
  ; Check if Docker Desktop is installed
  DockerInstalled := RegKeyExists(HKCU, 'Software\Docker Inc.\Docker Desktop');
  
  if not DockerInstalled then
  begin
    if MsgBox('Docker Desktop is required but not installed. Do you want to download it now?', mbConfirmation, MB_YESNO) = IDYES then
    begin
      ; Open Docker download page
      ShellExec('open', 'https://www.docker.com/products/docker-desktop', '', '', SW_SHOW, ewNoWait, ErrorCode);
      Result := False;
    end
    else
    begin
      MsgBox('Docker Desktop is required. Setup cannot continue.', mbError, MB_OK);
      Result := False;
    end;
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    ; Create .env file
    SaveStringToFile(ExpandConstant('{app}\docker\.env'), 
      'DATABASE_URL=postgresql://cbt_user:cbt_pass@postgres:5432/cbt_local' + #13#10 +
      'NEXTAUTH_SECRET=your-secret-key-change-this' + #13#10 +
      'NEXTAUTH_URL=http://localhost:3000' + #13#10 +
      'SUPER_ADMIN_USERNAME=admin' + #13#10 +
      'SUPER_ADMIN_PASSWORD=admin123' + #13#10,
      False);
    
    MsgBox('Setup complete! Please start Docker Desktop and run "Start CBT" to begin.', mbInformation, MB_OK);
  end;
end;
```

### 3.3. start.bat

```batch
@echo off
echo ========================================
echo   Starting Next-CBT...
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Navigate to docker directory
cd /d "%~dp0docker"

REM Start containers
echo [1/3] Starting PostgreSQL database...
docker-compose up -d postgres

REM Wait for PostgreSQL to be ready
echo [2/3] Waiting for database to be ready...
timeout /t 10 /nobreak >nul

REM Run migrations
echo [3/3] Running database migrations...
docker-compose run --rm cbt-app npx prisma migrate deploy

REM Start Next.js app
echo [4/3] Starting Next.js application...
docker-compose up -d cbt-app

echo.
echo ========================================
echo   Next-CBT is running!
echo ========================================
echo.
echo   Local:   http://localhost:3000
echo   Network: http://%COMPUTERNAME%:3000
echo.
echo   Press any key to open browser...
pause >nul
start http://localhost:3000
```

### 3.4. stop.bat

```batch
@echo off
echo ========================================
echo   Stopping Next-CBT...
echo ========================================
echo.

cd /d "%~dp0docker"
docker-compose down

echo.
echo Next-CBT has been stopped.
pause
```

### 3.5. reset-admin.bat

```batch
@echo off
echo ========================================
echo   Reset Super Admin Password
echo ========================================
echo.

set /p NEW_PASSWORD="Enter new password: "

cd /d "%~dp0docker"

REM Run reset script
docker-compose run --rm cbt-app npx prisma db execute --stdin <<< "UPDATE super_admin SET password_hash = crypt('%NEW_PASSWORD%', gen_salt('bf')) WHERE username = 'admin';"

echo.
echo Super admin password has been reset to: %NEW_PASSWORD%
pause
```

### 3.6. backup-data.bat

```batch
@echo off
echo ========================================
echo   Backup Next-CBT Database
echo ========================================
echo.

set BACKUP_DIR=%~dp0backups
set TIMESTAMP=%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_FILE=%BACKUP_DIR%\cbt_backup_%TIMESTAMP%.sql

REM Create backup directory
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

cd /d "%~dp0docker"

REM Create backup
docker-compose exec -T postgres pg_dump -U cbt_user cbt_local > "%BACKUP_FILE%"

echo.
echo Backup created: %BACKUP_FILE%
pause
```

---

## 4. Environment Configuration

### 4.1. .env.example (Offline)

```env
# Database (PostgreSQL Docker)
DATABASE_URL="postgresql://cbt_user:cbt_pass@postgres:5432/cbt_local"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-change-this"
NEXTAUTH_URL="http://localhost:3000"

# Super Admin (Predefined)
SUPER_ADMIN_USERNAME="admin"
SUPER_ADMIN_PASSWORD="admin123"

# App Config
NODE_ENV="production"
```

### 4.2. .env (Online - Vercel Dashboard)

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/cbt?sslmode=require"

# NextAuth (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="generated-secret-key"
NEXTAUTH_URL="https://cbt-xxx.vercel.app"

# Super Admin
SUPER_ADMIN_USERNAME="admin"
SUPER_ADMIN_PASSWORD="secure-password-change-this"

# App Config
NODE_ENV="production"
```

---

## 5. Vercel Configuration

### 5.1. vercel.json

```json
{
  "buildCommand": "npx prisma generate && next build",
  "installCommand": "npm install",
  "devCommand": "next dev",
  "framework": "nextjs",
  "regions": ["sin1", "iad1"],
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

### 5.2. GitHub Actions (CI/CD)

```yaml
# .github/workflows/deploy.yml
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
      
      - name: Run tests
        run: npm test
      
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

---

## 6. Neon PostgreSQL Setup (Online)

### 6.1. Create Neon Project

1. Go to https://neon.tech
2. Sign up / Login
3. Create new project:
   - Project name: `next-cbt`
   - Region: `US East (Ohio)` or `Asia Pacific (Singapore)`
   - PostgreSQL version: `15`
4. Get connection string from dashboard

### 6.2. Add to Vercel

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add:
   - `DATABASE_URL` = Neon connection string
   - `NEXTAUTH_SECRET` = generated secret
   - `NEXTAUTH_URL` = `https://your-app.vercel.app`
   - `SUPER_ADMIN_USERNAME` = `admin`
   - `SUPER_ADMIN_PASSWORD` = secure password

---

## 7. Database Migration Strategy

### 7.1. Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
}

// Models defined in database_schema.md...
```

### 7.2. Migration Commands

```bash
# Create migration
npx prisma migrate dev --name init

# Deploy migration (production)
npx prisma migrate deploy

# Generate client
npx prisma generate

# Seed data
npx prisma db seed
```

### 7.3. Seed Script

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create super admin
  const passwordHash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD!, 10);
  
  await prisma.superAdmin.upsert({
    where: { username: process.env.SUPER_ADMIN_USERNAME! },
    update: {},
    create: {
      username: process.env.SUPER_ADMIN_USERNAME!,
      passwordHash: passwordHash,
    },
  });
  
  console.log('Seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## 8. Troubleshooting

### 8.1. Common Issues

| Issue | Solution |
|-------|----------|
| Docker not running | Start Docker Desktop |
| Port 3000 occupied | Check `netstat -ano | findstr :3000` |
| Port 5432 occupied | Check PostgreSQL native installed? |
| Database connection failed | Check DATABASE_URL in .env |
| Cannot access from network | Check firewall settings |

### 8.2. Firewall Configuration (Windows)

```powershell
# Allow port 3000
netsh advfirewall firewall add rule name="Next-CBT App" dir=in action=allow protocol=TCP localport=3000

# Allow port 5432 (if needed)
netsh advfirewall firewall add rule name="PostgreSQL" dir=in action=allow protocol=TCP localport=5432
```

---

## 9. System Requirements

### 9.1. Server (Offline Mode)

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| OS | Windows 10/11 | Windows 10/11 Pro |
| CPU | Dual-core | Quad-core |
| RAM | 4 GB | 8 GB |
| Storage | 10 GB | 20 GB |
| Docker Desktop | Required | Required |

### 9.2. Client (Siswa)

| Requirement | Minimum |
|-------------|---------|
| Browser | Chrome 90+, Edge 90+, Firefox 88+ |
| Device | Desktop, Laptop, Tablet, Smartphone |
| Network | WiFi/LAN connection to server |

---

**Document Status:** ✅ Complete - Ready for deployment implementation.