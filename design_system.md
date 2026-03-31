# DESIGN SYSTEM - Cerdas-CBT

**Framework:** Next.js + Tailwind CSS + Shadcn UI
**Versi:** 1.2.0
**Tanggal:** 31 Maret 2026

---

## 1. Design System Overview

### 1.1. Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Icons:** Lucide React
- **Math Rendering:** KaTeX (react-katex package)
- **Notifications:** Sonner (Shadcn UI)
- **Theme:** Light mode only

### 1.2. Shadcn UI Components Used

| Component | Install Command | Usage |
|-----------|-----------------|-------|
| **Sonner** | `npx shadcn@latest add sonner` | Toast notifications |
| **Alert** | `npx shadcn@latest add alert` | Inline alerts/warnings |
| **Alert Dialog** | `npx shadcn@latest add alert-dialog` | Confirmation dialogs |
| **Button** | `npx shadcn@latest add button` | Buttons |
| **Input** | `npx shadcn@latest add input` | Form inputs |
| **Select** | `npx shadcn@latest add select` | Dropdown selects |
| **Table** | `npx shadcn@latest add table` | Data tables |
| **Badge** | `npx shadcn@latest add badge` | Status badges |

### 1.3. Typography

```css
/* Font Family */
font-family: 'Inter', sans-serif;

/* Text Colors */
--text-primary: text-gray-900    /* Headings, important text */
--text-secondary: text-gray-500  /* Descriptions, labels */
--text-brand: text-blue-600      /* Links, brand elements */
```

### 1.4. Color Palette

| Category | Tailwind Class | Hex | Usage |
|----------|----------------|-----|-------|
| **Background** | `bg-gray-50` | #F9FAFB | Page background |
| **Surface** | `bg-white` | #FFFFFF | Cards, sidebar, header |
| **Border** | `border-gray-200` | #E5E7EB | Dividers, borders |
| **Primary** | `bg-blue-600` | #2563EB | Buttons, active states |
| **Primary Light** | `bg-blue-50` | #EFF6FF | Active backgrounds |
| **Text Primary** | `text-gray-900` | #111827 | Headings |
| **Text Secondary** | `text-gray-500` | #6B7280 | Descriptions |
| **Text Brand** | `text-blue-600` | #2563EB | Links, brand |

### 1.5. Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (h-16, bg-white, border-b)                          │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  SIDEBAR     │  MAIN CONTENT (bg-gray-50, p-8)              │
│  (w-64)      │                                              │
│  bg-white    │  ┌────────────────────────────────────────┐  │
│  border-r    │  │ Page Header (title + subtitle)         │  │
│              │  ├────────────────────────────────────────┤  │
│  - Logo      │  │ Stats Grid (4 columns)                 │  │
│  - Nav       │  ├────────────────────────────────────────┤  │
│  - Menu      │  │ Content Cards                          │  │
│              │  └────────────────────────────────────────┘  │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

---

## 2. Component Specifications

### 2.1. Sidebar

```jsx
// Sidebar Container
<aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
  
  // Logo Area
  <div className="flex items-center gap-2 p-4 font-bold text-xl text-gray-900">
    <img src="/images/logo_kemendikdasmen.svg" alt="Logo" className="h-8 w-8" />
    <span>Cerdas-CBT</span>
  </div>
  
  // Navigation Sections
  <nav className="flex-1 py-4">
    
    // Section Title
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2 px-4">
      Menu Utama
    </p>
    
    // Nav Item (Default)
    <a className="flex items-center gap-3 px-4 py-2 mx-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
      <Icon className="w-5 h-5 text-gray-400" />
      <span>Dashboard</span>
    </a>
    
    // Nav Item (Active)
    <a className="flex items-center gap-3 px-4 py-2 mx-2 rounded-md text-sm font-medium bg-blue-50 text-blue-600">
      <Icon className="w-5 h-5 text-blue-600" />
      <span>Ujian</span>
    </a>
    
  </nav>
  
</aside>
```

**Styles:**
| Element | Classes |
|---------|---------|
| Container | `w-64 bg-white border-r border-gray-200` |
| Logo Area | `flex items-center gap-2 p-4 font-bold text-xl text-gray-900` |
| Section Title | `text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2 px-4` |
| Nav Item | `flex items-center gap-3 px-4 py-2 mx-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors` |
| Nav Item Active | `bg-blue-50 text-blue-600` |
| Nav Icon | `w-5 h-5 text-gray-400` |
| Nav Icon Active | `w-5 h-5 text-blue-600` |

---

### 2.2. Header

```jsx
// Header Container
<header className="bg-white border-b border-gray-200 h-16 flex justify-end items-center px-6 w-full">
  
  // User Profile
  <div className="flex items-center gap-3 cursor-pointer">
    
    // Avatar
    <div className="rounded-full w-8 h-8 bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
      EA
    </div>
    
    // User Info
    <div>
      <p className="text-sm font-medium text-gray-900">Eka Ahmad</p>
      <p className="text-xs text-gray-500">admin@sekolah.sch.id</p>
    </div>
    
  </div>
  
</header>
```

**Styles:**
| Element | Classes |
|---------|---------|
| Container | `bg-white border-b border-gray-200 h-16 flex justify-end items-center px-6 w-full` |
| Avatar | `rounded-full w-8 h-8 bg-gray-900 text-white flex items-center justify-center text-sm font-bold` |
| User Name | `text-sm font-medium text-gray-900` |
| User Email | `text-xs text-gray-500` |

---

### 2.3. Main Content

```jsx
// Main Content Container
<main className="flex-1 bg-gray-50 p-8 overflow-auto">
  
  // Page Header
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
    <p className="text-sm text-gray-500">Selamat datang di Cerdas-CBT</p>
  </div>
  
  // Stats Grid
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    
    // Stats Card
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center gap-2">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-blue-500" />
        <span className="text-sm font-medium text-gray-500">Total Siswa</span>
      </div>
      <span className="text-2xl font-bold text-gray-900">1,234</span>
    </div>
    
  </div>
  
  // Content Card
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
    
    // Card Header
    <div className="px-6 py-4 border-b border-gray-200">
      <h2 className="text-lg font-medium text-gray-900">Judul Card</h2>
      <p className="text-sm text-gray-500 mt-1">Deskripsi card</p>
    </div>
    
    // Card Body
    <div className="p-6">
      {/* Content */}
    </div>
    
  </div>
  
</main>
```

**Styles:**
| Element | Classes |
|---------|---------|
| Main Container | `flex-1 bg-gray-50 p-8 overflow-auto` |
| Page Title | `text-2xl font-bold text-gray-900 mb-1` |
| Page Subtitle | `text-sm text-gray-500 mb-6` |
| Stats Grid | `grid grid-cols-1 md:grid-cols-4 gap-4 mb-6` |
| Stats Card | `bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center gap-2` |
| Content Card | `bg-white rounded-lg border border-gray-200 shadow-sm mb-6` |
| Card Header | `px-6 py-4 border-b border-gray-200` |
| Card Title | `text-lg font-medium text-gray-900` |
| Card Subtitle | `text-sm text-gray-500 mt-1` |
| Card Body | `p-6` |

---

### 2.4. Card Variants

#### Input + Copy Group
```jsx
<div className="flex gap-2 items-center w-full">
  <input 
    className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 font-mono"
    value="ABC123"
    readOnly
  />
  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
    <CopyIcon className="w-4 h-4" />
    Salin
  </button>
</div>
```

#### List with Badges
```jsx
<div className="flex flex-col gap-6">
  
  <div className="flex gap-4 items-start">
    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">
      1
    </span>
    <div>
      <p className="text-sm font-medium text-gray-900 mb-1">Judul Item</p>
      <p className="text-sm text-gray-500">Deskripsi item</p>
    </div>
  </div>
  
</div>
```

#### Info Alert Box
```jsx
<div className="bg-blue-50 rounded-md p-4 flex flex-col gap-1">
  <p className="text-sm text-blue-700 font-medium">Informasi penting</p>
  <p className="text-xs text-blue-600 mt-1">Detail informasi tambahan</p>
</div>
```

---

### 2.5. Buttons

```jsx
// Primary Button
<button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
  Simpan
</button>

// Secondary Button
<button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
  Batal
</button>

// Danger Button
<button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
  Hapus
</button>

// Ghost Button
<button className="px-4 py-2 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
  Kembali
</button>
```

---

### 2.6. Form Inputs

```jsx
// Text Input
<div className="space-y-1">
  <label className="text-sm font-medium text-gray-700">Label</label>
  <input 
    type="text"
    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Placeholder"
  />
</div>

// Select
<div className="space-y-1">
  <label className="text-sm font-medium text-gray-700">Label</label>
  <select className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
    <option>Pilih opsi</option>
  </select>
</div>

// Textarea
<div className="space-y-1">
  <label className="text-sm font-medium text-gray-700">Label</label>
  <textarea 
    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    rows={4}
    placeholder="Placeholder"
  />
</div>
```

---

### 2.7. Tables

```jsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="border-b border-gray-200">
        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Nama</th>
        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">NISN</th>
        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Kelas</th>
        <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-gray-100 hover:bg-gray-50">
        <td className="px-4 py-3 text-sm text-gray-900">Siswa Test</td>
        <td className="px-4 py-3 text-sm text-gray-500">1234567890</td>
        <td className="px-4 py-3 text-sm text-gray-500">X IPA 1</td>
        <td className="px-4 py-3 text-sm text-right">
          <button className="text-blue-600 hover:text-blue-700 font-medium">Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### 2.8. Badges & Status

```jsx
// Badge Default
<span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
  Draft
</span>

// Badge Success
<span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
  Aktif
</span>

// Badge Warning
<span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
  Pending
</span>

// Badge Danger
<span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
  Nonaktif
</span>

// Badge Info
<span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
  Baru
</span>
```

---

### 2.9. Timer Component (Exam Page)

```jsx
// Timer Normal State
<div className="flex items-center gap-2 text-sm font-medium text-gray-900">
  <ClockIcon className="w-4 h-4" />
  <span className="font-mono">59:30</span>
</div>

// Timer Warning State (≤10% of duration)
<div className="flex items-center gap-2 text-sm font-medium text-red-600 animate-pulse">
  <ClockIcon className="w-4 h-4" />
  <span className="font-mono font-bold">05:30</span>
</div>
```

**Timer Styles:**
| State | Classes |
|-------|---------|
| Normal | `flex items-center gap-2 text-sm font-medium text-gray-900` |
| Warning | `flex items-center gap-2 text-sm font-medium text-red-600 animate-pulse` |
| Time Display | `font-mono` (normal) / `font-mono font-bold` (warning) |
| Icon | `w-4 h-4` |
| Format | `MM:SS` (e.g., `59:30`, `05:30`) |

---

### 2.10. Warning Popup (Time Warning)

```jsx
// Time Warning Popup (Modal)
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
    {/* Header */}
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        <AlertTriangleIcon className="w-5 h-5 text-red-600" />
      </div>
      <h2 className="text-lg font-bold text-gray-900">Peringatan Waktu</h2>
    </div>
    
    {/* Body */}
    <p className="text-sm text-gray-600 mb-4">
      Waktu ujian Anda hampir habis! Sisa waktu: <span className="font-mono font-bold text-red-600">05:30</span>
    </p>
    
    {/* Action */}
    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
      Lanjutkan Ujian
    </button>
  </div>
</div>
```

**Warning Popup Styles:**
| Element | Classes |
|---------|---------|
| Overlay | `fixed inset-0 bg-black/50 flex items-center justify-center z-50` |
| Modal Container | `bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4` |
| Icon Container | `w-10 h-10 rounded-full bg-red-100 flex items-center justify-center` |
| Icon | `w-5 h-5 text-red-600` |
| Title | `text-lg font-bold text-gray-900` |
| Body Text | `text-sm text-gray-600` |
| Time Highlight | `font-mono font-bold text-red-600` |

---

### 2.11. Toast/Notification (Sonner)

**Menggunakan Shadcn UI Sonner component (package: `sonner`).**

#### Setup di Root Layout

```tsx
// app/layout.tsx
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
```

#### Import dan Penggunaan

```tsx
"use client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function ToastDemo() {
  return (
    <>
      {/* Success Toast */}
      <Button onClick={() => toast.success("Data berhasil disimpan")}>
        Success
      </Button>
      
      {/* Error Toast */}
      <Button onClick={() => toast.error("Gagal menyimpan data")}>
        Error
      </Button>
      
      {/* Warning Toast */}
      <Button onClick={() => toast.warning("Periksa input Anda")}>
        Warning
      </Button>
      
      {/* Info Toast */}
      <Button onClick={() => toast.info("Auto-save jawaban")}>
        Info
      </Button>
      
      {/* Toast with Description */}
      <Button onClick={() => 
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM"
        })
      }>
        With Description
      </Button>
      
      {/* Toast with Action */}
      <Button onClick={() => 
        toast("File deleted", {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo")
          }
        })
      }>
        With Action
      </Button>
      
      {/* Promise Toast */}
      <Button onClick={() => 
        toast.promise(
          fetch('/api/data'),
          {
            loading: 'Memproses...',
            success: 'Berhasil!',
            error: 'Gagal!'
          }
        )
      }>
        Promise
      </Button>
    </>
  )
}
```

#### Sonner API Reference

| Method | Kegunaan |
|--------|----------|
| `toast(message)` | Basic toast |
| `toast.success(message)` | Success toast (hijau) |
| `toast.error(message)` | Error toast (merah) |
| `toast.warning(message)` | Warning toast (kuning) |
| `toast.info(message)` | Info toast (biru) |
| `toast.promise(promise, options)` | Promise-based toast |
| `toast.dismiss(id?)` | Dismiss toast |

#### Toaster Props

| Prop | Type | Default | Kegunaan |
|------|------|---------|----------|
| `position` | string | `"bottom-right"` | Posisi toast |
| `richColors` | boolean | `false` | Warna berbeda per type |
| `closeButton` | boolean | `false` | Tampilkan tombol close |
| `duration` | number | `4000` | Durasi dalam ms |

---

### 2.12. Alert (Inline Notification)

**Menggunakan Shadcn UI Alert component untuk notifikasi inline.**

#### Import

```tsx
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon } from "lucide-react"
```

#### Alert Variants

```tsx
// Default Alert
<Alert>
  <InfoIcon className="h-4 w-4" />
  <AlertTitle>Informasi</AlertTitle>
  <AlertDescription>
    Ini adalah pesan informasi untuk pengguna.
  </AlertDescription>
</Alert>

// Success Alert
<Alert className="border-green-200 bg-green-50 text-green-800">
  <CheckCircle2Icon className="h-4 w-4 text-green-600" />
  <AlertTitle>Berhasil!</AlertTitle>
  <AlertDescription>
    Perubahan Anda telah disimpan.
  </AlertDescription>
</Alert>

// Destructive/Error Alert
<Alert variant="destructive">
  <AlertCircleIcon className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Gagal memproses permintaan Anda. Silakan coba lagi.
  </AlertDescription>
</Alert>

// Warning Alert
<Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
  <AlertTriangleIcon className="h-4 w-4 text-yellow-600" />
  <AlertTitle>Peringatan</AlertTitle>
  <AlertDescription>
    Waktu ujian hampir habis!
  </AlertDescription>
</Alert>
```

#### Alert Props

| Component | Prop | Type | Kegunaan |
|-----------|------|------|----------|
| Alert | `variant` | `"default" \| "destructive"` | Style variant |
| AlertTitle | `className` | string | Custom styling |
| AlertDescription | `className` | string | Custom styling |

---

### 2.13. Alert Dialog (Confirmation Dialog)

**Menggunakan Shadcn UI AlertDialog untuk konfirmasi aksi.**

#### Import

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
```

#### Basic Alert Dialog

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Hapus Data</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
      <AlertDialogDescription>
        Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen
        dari server kami.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Batal</AlertDialogCancel>
      <AlertDialogAction className="bg-red-600 hover:bg-red-700">
        Hapus
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### Reusable Confirm Dialog Component

```tsx
// components/confirm-dialog.tsx
"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ConfirmDialogProps {
  trigger: React.ReactNode
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  variant?: "default" | "destructive"
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText = "Lanjutkan",
  cancelText = "Batal",
  onConfirm,
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Usage
<ConfirmDialog
  trigger={<Button variant="destructive">Hapus</Button>}
  title="Hapus ujian?"
  description="Ujian dan semua soal akan dihapus permanen."
  confirmText="Hapus"
  onConfirm={() => deleteUjian()}
  variant="destructive"
/>
```

#### Alert Dialog Props

| Component | Prop | Type | Kegunaan |
|-----------|------|------|----------|
| AlertDialogContent | `size` | `"default" \| "sm"` | Ukuran dialog |
| AlertDialogTrigger | `asChild` | boolean | Render as child element |
| AlertDialogAction | `className` | string | Custom styling untuk tombol konfirmasi |
| AlertDialogCancel | `className` | string | Custom styling untuk tombol batal |

---

### 2.14. Exam Navigator (Question Navigator)

```jsx
// Desktop Navigator (Sidebar)
<div className="w-48 bg-white border-l border-gray-200 p-4 h-full overflow-y-auto">
  <p className="text-xs font-semibold text-gray-500 mb-3">Navigator Soal</p>
  
  <div className="grid grid-cols-5 gap-2">
    {/* Unanswered */}
    <button className="w-8 h-8 rounded-md bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200">
      1
    </button>
    
    {/* Answered */}
    <button className="w-8 h-8 rounded-md bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200">
      2
    </button>
    
    {/* Current */}
    <button className="w-8 h-8 rounded-md bg-blue-600 text-white text-sm font-medium ring-2 ring-blue-300">
      3
    </button>
  </div>
  
  {/* Stats */}
  <div className="mt-4 pt-4 border-t border-gray-200">
    <div className="flex justify-between text-xs text-gray-500">
      <span>Dijawab: 25</span>
      <span>Total: 50</span>
    </div>
  </div>
</div>

// Mobile Navigator (Bottom Bar)
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-10">
  <div className="flex justify-between items-center">
    {/* Prev Button */}
    <button className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50">
      ← Prev
    </button>
    
    {/* Progress */}
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-900">3/50</span>
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-green-500" title="Answered" />
        <span className="w-2 h-2 rounded-full bg-gray-300" title="Unanswered" />
      </div>
    </div>
    
    {/* Navigator Toggle */}
    <button className="px-3 py-2 bg-blue-600 rounded-md text-sm font-medium text-white">
      Navigator
    </button>
    
    {/* Next Button */}
    <button className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
      Next →
    </button>
  </div>
  
  {/* Expanded Navigator Grid */}
  <div className="mt-3 grid grid-cols-10 gap-1 max-h-32 overflow-y-auto">
    {/* Question buttons */}
  </div>
</div>
```

**Navigator Styles:**
| Element | Classes |
|---------|---------|
| Desktop Container | `w-48 bg-white border-l border-gray-200 p-4 h-full overflow-y-auto` |
| Grid (Desktop) | `grid grid-cols-5 gap-2` |
| Button Unanswered | `w-8 h-8 rounded-md bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200` |
| Button Answered | `w-8 h-8 rounded-md bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200` |
| Button Current | `w-8 h-8 rounded-md bg-blue-600 text-white text-sm font-medium ring-2 ring-blue-300` |
| Mobile Container | `fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-10` |
| Mobile Progress | `text-sm font-medium text-gray-900` |
| Mobile Navigator Grid | `grid grid-cols-10 gap-1 max-h-32 overflow-y-auto` |

---

### 2.15. KaTeX Math Rendering

**Menggunakan package `react-katex` untuk rendering rumus matematika.**

#### Installation

```bash
npm install katex react-katex
```

#### Setup di Root Layout

```tsx
// app/layout.tsx
import 'katex/dist/katex.min.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

#### Import dan Penggunaan

```tsx
"use client"
import { InlineMath, BlockMath } from 'react-katex'

export function MathExample() {
  return (
    <div>
      {/* Inline Math */}
      <p>
        Hasil dari <InlineMath math="\sqrt{16}" /> adalah 4.
      </p>
      
      {/* Block Math */}
      <BlockMath math="\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}" />
      
      {/* Complex Formula */}
      <BlockMath math="\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}" />
    </div>
  )
}
```

#### Alternative: Direct katex.renderToString

```tsx
"use client"
import katex from 'katex'
import 'katex/dist/katex.min.css'

export function MathRenderer({ formula, displayMode = false }: { 
  formula: string
  displayMode?: boolean 
}) {
  const html = katex.renderToString(formula, {
    displayMode,
    throwOnError: false
  })
  
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

// Usage
<MathRenderer formula="\sqrt{16} = 4" />
<MathRenderer formula="\sum_{i=1}^n i = \frac{n(n+1)}{2}" displayMode />
```

#### KaTeX Props

| Prop | Type | Default | Kegunaan |
|------|------|---------|----------|
| `math` | string | required | LaTeX formula |
| `displayMode` | boolean | `false` | Block vs inline |
| `throwOnError` | boolean | `true` | Throw on parse error |
| `errorColor` | string | `"#cc0000"` | Error text color |

#### KaTeX Styling

| Element | Classes |
|---------|---------|
| Inline Math | `text-base` (inherits parent font size) |
| Block Math Container | `my-4 text-center` |
| Math Text Color | Inherits `text-gray-900` from parent |

#### Supported LaTeX Syntax

| Syntax | Example | Result |
|--------|---------|--------|
| Fractions | `\frac{a}{b}` | a/b |
| Square root | `\sqrt{x}` | √x |
| Power | `x^2` | x² |
| Sum | `\sum_{i=1}^n` | Σ |
| Integral | `\int_a^b` | ∫ |
| Greek letters | `\alpha, \beta, \gamma` | α, β, γ |

---

## 3. Page Layouts

### 3.1. Dashboard Layout

```jsx
export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 3.2. Login Page Layout

```jsx
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & School Identity */}
        <div className="text-center mb-8">
          <img 
            src="/images/logo_kemendikdasmen.svg" 
            alt="Logo Kemendikdasmen" 
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-gray-900">Cerdas-CBT</h1>
          <p className="text-sm text-gray-500 mt-1">Nama Sekolah</p>
        </div>
        
        {/* Login Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          {/* Login Form */}
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Cerdas-CBT by EAS Creative Studio
        </p>
      </div>
    </div>
  );
}
```

### 3.3. Exam Page Layout (Siswa)

```jsx
export default function ExamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
        {/* School Logo & Name */}
        <div className="flex items-center gap-2">
          <img src="/images/logo_kemendikdasmen.svg" alt="Logo" className="h-8" />
          <span className="font-bold text-gray-900">Cerdas-CBT</span>
        </div>
        
        {/* Timer */}
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <ClockIcon className="w-4 h-4" />
          <span>59:30</span>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-8">
        {/* Question Card */}
        {/* Navigator Sidebar */}
      </main>
    </div>
  );
}
```

---

## 4. Responsive Breakpoints

| Breakpoint | Prefix | Width |
|------------|--------|-------|
| Mobile | (default) | < 768px |
| Tablet | `md:` | >= 768px |
| Desktop | `lg:` | >= 1024px |
| Wide | `xl:` | >= 1280px |

---

## 5. Animation & Transitions

```css
/* Default transition */
transition-colors duration-200

/* Hover transitions */
hover:bg-gray-50
hover:text-blue-700

/* Focus states */
focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:border-transparent
```

---

## 6. Shadows

| Shadow | Class | Usage |
|--------|-------|-------|
| Small | `shadow-sm` | Cards, dropdowns |
| Medium | `shadow` | Modals, elevated elements |
| Large | `shadow-lg` | Floating elements |

---

## 7. Spacing Scale

| Size | Value | Usage |
|------|-------|-------|
| `p-2` | 8px | Small padding |
| `p-4` | 16px | Default padding |
| `p-6` | 24px | Card padding |
| `p-8` | 32px | Page padding |
| `gap-2` | 8px | Small gap |
| `gap-4` | 16px | Default gap |
| `gap-6` | 24px | Section gap |

---

**Document Status:** ✅ Complete v1.2 - Updated with Shadcn UI Sonner, Alert, AlertDialog components and react-katex.