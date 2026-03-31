export const APP_NAME = 'Cerdas-CBT'

export const SESSION_EXPIRY_SECONDS = 604800
export const TOKEN_REFRESH_THRESHOLD = 3600

export type UserRole = 'super_admin' | 'guru' | 'siswa'

export const USER_ROLES: UserRole[] = ['super_admin', 'guru', 'siswa']
