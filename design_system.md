# DESIGN SYSTEM - Cerdas-CBT

**Framework:** Next.js + Tailwind CSS + Shadcn UI
**Versi:** 1.1.0
**Tanggal:** 31 Maret 2026

---

## 1. Design System Overview

### 1.1. Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Icons:** Lucide React
- **Math Rendering:** KaTeX (CDN: `https://cdn.jsdelivr.net/npm/katex@0.16.9`)
- **Theme:** Light mode only

### 1.2. Typography

```css
/* Font Family */
font-family: 'Inter', sans-serif;

/* Text Colors */
--text-primary: text-gray-900    /* Headings, important text */
--text-secondary: text-gray-500  /* Descriptions, labels */
--text-brand: text-blue-600      /* Links, brand elements */
```

### 1.3. Color Palette

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

### 1.4. Layout Structure

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

### 2.11. Toast/Notification

```jsx
// Success Toast
<div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in">
  <CheckCircleIcon className="w-5 h-5" />
  <span className="text-sm font-medium">Data berhasil disimpan</span>
</div>

// Error Toast
<div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in">
  <XCircleIcon className="w-5 h-5" />
  <span className="text-sm font-medium">Gagal menyimpan data</span>
</div>

// Warning Toast
<div className="fixed bottom-4 right-4 bg-yellow-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in">
  <AlertIcon className="w-5 h-5" />
  <span className="text-sm font-medium">Periksa input Anda</span>
</div>

// Info Toast
<div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in">
  <InfoIcon className="w-5 h-5" />
  <span className="text-sm font-medium">Auto-save jawaban</span>
</div>
```

**Toast Styles:**
| Type | Background | Icon |
|------|------------|------|
| Success | `bg-green-600` | `CheckCircleIcon` |
| Error | `bg-red-600` | `XCircleIcon` |
| Warning | `bg-yellow-600` | `AlertIcon` |
| Info | `bg-blue-600` | `InfoIcon` |

| Element | Classes |
|---------|---------|
| Container | `fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50` |
| Icon | `w-5 h-5` |
| Text | `text-sm font-medium` |

---

### 2.12. Modal/Dialog (Confirmation)

```jsx
// Confirmation Modal
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
    {/* Header */}
    <h2 className="text-lg font-bold text-gray-900 mb-2">Konfirmasi</h2>
    <p className="text-sm text-gray-500">Apakah Anda yakin ingin menghapus data ini?</p>
    
    {/* Body */}
    <div className="mt-4 p-3 bg-gray-50 rounded-md">
      <p className="text-sm text-gray-700">Data yang dihapus tidak dapat dikembalikan.</p>
    </div>
    
    {/* Actions */}
    <div className="flex gap-3 mt-6">
      <button className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
        Batal
      </button>
      <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
        Hapus
      </button>
    </div>
  </div>
</div>
```

**Modal Styles:**
| Element | Classes |
|---------|---------|
| Overlay | `fixed inset-0 bg-black/50 flex items-center justify-center z-50` |
| Container | `bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4` |
| Title | `text-lg font-bold text-gray-900 mb-2` |
| Description | `text-sm text-gray-500` |
| Info Box | `mt-4 p-3 bg-gray-50 rounded-md` |
| Action Buttons Container | `flex gap-3 mt-6` |

---

### 2.13. Exam Navigator (Question Navigator)

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

### 2.14. KaTeX Math Rendering

```jsx
// KaTeX Component Wrapper
<div className="katex-container">
  {/* Inline math: $...$ */}
  <span className="text-base">Result: $`\sqrt{16} = 4`$</span>
  
  {/* Block math: $$...$$ */}
  <div className="my-4 text-center">
    $$`\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}`$$
  </div>
</div>
```

**KaTeX Styling:**
| Element | Classes |
|---------|---------|
| Inline Math | `text-base` (inherits parent font size) |
| Block Math Container | `my-4 text-center` |
| Math Text Color | Inherits `text-gray-900` from parent |

**CDN Setup (in layout.tsx):**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
```

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

**Document Status:** ✅ Complete v1.1 - Clarified with Timer, Warning, Toast, Modal, Navigator styling.