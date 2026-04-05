/**
 * Design Tokens & Theme Configuration
 * Centralized design system for consistent UI/UX across Cerdas-CBT
 * Mobile-first approach with consistent breakpoints
 */

// ============================================================================
// COLOR PALETTE - SLATE BASED
// ============================================================================

export const colors = {
  // Backgrounds
  background: 'bg-slate-50',
  backgroundLight: 'bg-slate-100',
  surface: 'bg-white',
  surfaceMuted: 'bg-slate-50',
  
  // Borders
  border: 'border-slate-200',
  borderLight: 'border-slate-100',
  borderMedium: 'border-slate-300',
  
  // Text Hierarchy
  textPrimary: 'text-slate-900',
  textSecondary: 'text-slate-700',
  textTertiary: 'text-slate-500',
  textMuted: 'text-slate-400',
  textPlaceholder: 'text-slate-400',
  
  // Role-based Colors
  role: {
    admin: {
      gradient: 'from-violet-500 to-purple-600',
      light: 'bg-violet-50',
      primary: 'bg-violet-500',
      dark: 'text-violet-700',
    },
    guru: {
      gradient: 'from-blue-500 to-indigo-600',
      light: 'bg-blue-50',
      primary: 'bg-blue-500',
      dark: 'text-blue-700',
    },
    siswa: {
      gradient: 'from-emerald-500 to-teal-600',
      light: 'bg-emerald-50',
      primary: 'bg-emerald-500',
      dark: 'text-emerald-700',
    },
  },
  
  // Semantic Colors
  success: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
}

// ============================================================================
// SPACING SCALE - MOBILE OPTIMIZED
// ============================================================================

export const spacing = {
  // Gap utilities
  gapTight: 'gap-2',      // 8px - Closely related items
  gapNormal: 'gap-3',     // 12px - Default spacing
  gapRelaxed: 'gap-4',    // 16px - Section spacing
  gapLoose: 'gap-6',      // 24px - Major sections
  gapExtraLoose: 'gap-8', // 32px - Page-level spacing
  
  // Padding
  paddingTight: 'p-3',       // 12px
  paddingNormal: 'p-4',      // 16px - Default
  paddingRelaxed: 'p-6',     // 24px
  paddingLoose: 'p-8',       // 32px
  
  // Mobile-specific
  paddingMobile: 'p-4',
  paddingMobileCompact: 'p-3',
}

// ============================================================================
// TYPOGRAPHY SCALE - READABLE ON MOBILE
// ============================================================================

export const typography = {
  // Font sizes with mobile considerations
  xs: 'text-xs',          // 12px - Captions, footnotes (min readable on mobile)
  sm: 'text-sm',          // 14px - Labels, secondary text
  base: 'text-base',      // 16px - Body text (default readable)
  lg: 'text-lg',          // 18px - Subheadings
  xl: 'text-xl',          // 20px - Section titles
  '2xl': 'text-2xl',      // 24px - Page titles
  '3xl': 'text-3xl',      // 30px - Landing pages
  
  // Font weights
  weightMedium: 'font-medium',
  weightSemibold: 'font-semibold',
  weightBold: 'font-bold',
  
  // Line heights for readability
  leadingTight: 'leading-tight',
  leadingNormal: 'leading-normal',
  leadingRelaxed: 'leading-relaxed',
  
  // Letter spacing
  trackingTight: 'tracking-tight',
  trackingNormal: 'tracking-normal',
  trackingWide: 'tracking-wide',
}

// ============================================================================
// BORDER RADIUS - CONSISTENT ROUNDED CORNERS
// ============================================================================

export const radius = {
  sm: 'rounded-lg',    // 8px - Small elements (badges, tags)
  md: 'rounded-xl',    // 12px - DEFAULT for cards, buttons
  lg: 'rounded-2xl',   // 16px - Large containers, modals
  xl: 'rounded-3xl',   // 20px - Extra large radius
  full: 'rounded-full', // Circles (avatars, pills)
}

// ============================================================================
// SHADOWS - SUBTLE DEPTH
// ============================================================================

export const shadows = {
  sm: 'shadow-sm',       // Subtle elevation (cards)
  md: 'shadow',          // Default elevation (dropdowns)
  lg: 'shadow-lg',       // Elevated elements (modals)
  xl: 'shadow-xl',       // Floating elements
  inner: 'shadow-inner', // Inset shadows
  none: 'shadow-none',   // No shadow
}

// ============================================================================
// BREAKPOINTS - MOBILE FIRST
// ============================================================================

export const breakpoints = {
  mobile: 'default',     // < 640px (mobile first)
  sm: 'sm:',            // ≥ 640px (large phones)
  md: 'md:',            // ≥ 768px (tablets)
  lg: 'lg:',            // ≥ 1024px (desktops)
  xl: 'xl:',            // ≥ 1280px (large screens)
  '2xl': '2xl:',        // ≥ 1536px (extra large)
}

// ============================================================================
// ANIMATIONS & TRANSITIONS
// ============================================================================

export const animations = {
  // Transition utilities
  transitionFast: 'transition-all duration-150',
  transitionNormal: 'transition-all duration-200',
  transitionSlow: 'transition-all duration-300',
  
  // Hover states
  hoverLift: 'hover:-translate-y-0.5 hover:shadow-md',
  hoverScale: 'hover:scale-[1.02]',
  hoverBrighten: 'hover:brightness-95',
  
  // Active states
  activePress: 'active:scale-[0.98]',
  
  // Loading/animations
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  ping: 'animate-ping',
  bounce: 'animate-bounce',
}

// ============================================================================
// LAYOUT UTILITIES
// ============================================================================

export const layout = {
  // Container
  containerNarrow: 'max-w-7xl mx-auto',
  containerWide: 'max-w-full',
  
  // Grid patterns
  gridCols2: 'grid-cols-2',
  gridCols3: 'grid-cols-3',
  gridCols4: 'grid-cols-4',
  
  // Responsive grid (mobile first)
  gridResponsive1Col: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  gridResponsive2Col: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  
  // Flexbox
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center justify-start',
  flexCol: 'flex flex-col',
}

// ============================================================================
// COMPONENT-SPECIFIC PATTERNS
// ============================================================================

export const patterns = {
  // Card styling
  card: 'bg-white rounded-xl border border-slate-200/80 shadow-sm',
  cardHover: 'bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200',
  
  // Button grouping
  buttonGroup: 'flex items-center gap-2',
  buttonGroupMobile: 'flex-col sm:flex-row gap-2 w-full sm:w-auto',
  
  // Form layout
  formGroup: 'space-y-4',
  formField: 'space-y-2',
  
  // Page header
  pageHeader: 'mb-6 space-y-1',
  pageHeaderMobile: 'mb-4 space-y-1',
  
  // Stats grid
  statsGrid: 'grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4',
  statsGridMobile: 'grid grid-cols-2 gap-3',
  
  // List item
  listItem: 'flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors',
  listItemMobile: 'flex items-center gap-2 p-3 rounded-lg',
}

// ============================================================================
// MOBILE OPTIMIZATIONS
// ============================================================================

export const mobile = {
  // Touch-friendly sizing
  touchTarget: 'min-h-[44px] min-w-[44px]', // Apple HIG minimum
  touchTargetLarge: 'min-h-[48px] min-w-[48px]', // Better for Android
  
  // Safe area padding
  safeAreaP: 'p-4 safe-area-inset-padding',
  safeAreaM: 'm-4 safe-area-inset-margin',
  
  // Mobile typography
  headingMobile: 'text-xl sm:text-2xl font-bold',
  subheadingMobile: 'text-base sm:text-lg font-semibold',
  bodyMobile: 'text-sm sm:text-base',
  
  // Mobile spacing
  containerPadding: 'p-4 sm:p-6 lg:p-8',
  sectionSpacing: 'space-y-4 sm:space-y-6',
  
  // Hide/show utilities
  hideOnMobile: 'hidden sm:block',
  showOnMobile: 'block sm:hidden',
  hideOnDesktop: 'block sm:hidden',
  showOnDesktop: 'hidden sm:block',
}

// ============================================================================
// EXPORT ALL (CONVENIENCE)
// ============================================================================

export const theme = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  breakpoints,
  animations,
  layout,
  patterns,
  mobile,
}

export default theme
