import { UserRole, UserAccount } from '../types';

export type AdminModule = 
  | 'telemetri'
  | 'whatsapp'
  | 'personel'
  | 'satker'
  | 'tautan'
  | 'profil'
  | 'berita'
  | 'sipp'
  | 'jadwal'
  | 'ppid'
  | 'eviden'
  | 'popup'
  | 'users'
  | 'database'
  | 'slider'
  | 'ecourt';

export interface RoleMeta {
  role: UserRole;
  name: string;
  label: string;
  division: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  isStaff: boolean;
  description: string;
  allowedModules: AdminModule[];
  permissions: {
    canCreate: (mod: AdminModule) => boolean;
    canEdit: (mod: AdminModule) => boolean;
    canDelete: (mod: AdminModule) => boolean;
    canExportDb: boolean;
    canResetDb: boolean;
    canManageUsers: boolean;
  };
}

export const ROLE_CONFIGS: Record<UserRole, RoleMeta> = {
  super_admin: {
    role: 'super_admin',
    name: 'Super Admin',
    label: 'Pimpinan / Administrator TI Utama',
    division: 'Wakadilmilti V & Administrator Sistem',
    badgeBg: 'bg-amber-500/20',
    badgeBorder: 'border-amber-400/80',
    badgeText: 'text-amber-300',
    isStaff: true,
    description: 'Hak akses penuh (ALL ACCESS): CRUD ke seluruh master data Personel, Struktur Satker, Perkara SIPP, Jadwal Sidang, Berita, PPID, Eviden ZI, Pengguna & Database.',
    allowedModules: [
      'telemetri',
      'whatsapp',
      'personel',
      'satker',
      'tautan',
      'profil',
      'berita',
      'sipp',
      'jadwal',
      'ppid',
      'eviden',
      'popup',
      'users',
      'database',
      'slider',
      'ecourt'
    ],
    permissions: {
      canCreate: () => true,
      canEdit: () => true,
      canDelete: () => true,
      canExportDb: true,
      canResetDb: true,
      canManageUsers: true
    }
  },

  admin_kepaniteraan: {
    role: 'admin_kepaniteraan',
    name: 'Admin Kepaniteraan',
    label: 'Panitera & Administrasi Perkara',
    division: 'Kepaniteraan Militer (Panitera & Panmud Pidana)',
    badgeBg: 'bg-emerald-500/20',
    badgeBorder: 'border-emerald-400/80',
    badgeText: 'text-emerald-300',
    isStaff: true,
    description: 'Fokus teknis yudisial: Mengelola Perkara SIPP (tambah register banding, amar putusan), Jadwal Sidang ruang Kartika/Cakra, dan penatausahaan putusan PPID.',
    allowedModules: ['telemetri', 'whatsapp', 'sipp', 'jadwal', 'ppid', 'ecourt'],
    permissions: {
      canCreate: (mod) => ['sipp', 'jadwal', 'ppid', 'whatsapp', 'ecourt'].includes(mod),
      canEdit: (mod) => ['sipp', 'jadwal', 'ppid', 'whatsapp', 'ecourt'].includes(mod),
      canDelete: (mod) => ['sipp', 'jadwal', 'ecourt'].includes(mod),
      canExportDb: false,
      canResetDb: false,
      canManageUsers: false
    }
  },

  admin_kesekretariatan: {
    role: 'admin_kesekretariatan',
    name: 'Admin Kesekretariatan',
    label: 'Sekretaris / SDM & Zona Integritas',
    division: 'Kesekretariatan (Umum, Kepegawaian & ZI)',
    badgeBg: 'bg-sky-500/20',
    badgeBorder: 'border-sky-400/80',
    badgeText: 'text-sky-300',
    isStaff: true,
    description: 'Fokus operasional & aparatur: Mengelola Personel resmi MA-RI, Struktur Satker PERMA 1/2017, Profil Pengadilan, Pop-up Pengumuman, dan Eviden ZI (WBBM Area I s.d. VI).',
    allowedModules: ['telemetri', 'whatsapp', 'personel', 'satker', 'profil', 'popup', 'eviden', 'slider', 'ecourt'],
    permissions: {
      canCreate: (mod) => ['personel', 'satker', 'profil', 'popup', 'eviden', 'whatsapp', 'slider', 'ecourt'].includes(mod),
      canEdit: (mod) => ['personel', 'satker', 'profil', 'popup', 'eviden', 'whatsapp', 'slider', 'ecourt'].includes(mod),
      canDelete: (mod) => ['personel', 'satker', 'eviden', 'slider', 'ecourt'].includes(mod),
      canExportDb: false,
      canResetDb: false,
      canManageUsers: false
    }
  },

  editor_humas: {
    role: 'editor_humas',
    name: 'Editor Humas',
    label: 'Pranata Humas / Pengelola Informasi',
    division: 'Subbag Kepegawaian, TI & Humas',
    badgeBg: 'bg-purple-500/20',
    badgeBorder: 'border-purple-400/80',
    badgeText: 'text-purple-300',
    isStaff: true,
    description: 'Fokus komunikasi & branding website: Mengelola artikel Berita & Kegiatan Pengadilan, Pop-up Pengumuman Resmi, Tautan Situs Resmi MA, serta pemutakhiran informasi Profil Pengadilan.',
    allowedModules: ['telemetri', 'whatsapp', 'berita', 'tautan', 'profil', 'popup', 'slider', 'ecourt'],
    permissions: {
      canCreate: (mod) => ['berita', 'tautan', 'popup', 'whatsapp', 'slider', 'ecourt'].includes(mod),
      canEdit: (mod) => ['berita', 'tautan', 'profil', 'popup', 'whatsapp', 'slider', 'ecourt'].includes(mod),
      canDelete: (mod) => ['berita', 'tautan', 'slider'].includes(mod),
      canExportDb: false,
      canResetDb: false,
      canManageUsers: false
    }
  },

  petugas_ptsp: {
    role: 'petugas_ptsp',
    name: 'Petugas PTSP',
    label: 'Meja Layanan Terpadu Satu Pintu',
    division: 'Meja 1 s.d. 6 PTSP & Meja Informasi',
    badgeBg: 'bg-teal-500/20',
    badgeBorder: 'border-teal-400/80',
    badgeText: 'text-teal-300',
    isStaff: true,
    description: 'Fokus pelayanan masyarakat: Memverifikasi tiket permohonan layanan publik (Izin Besuk, Legalisasi Putusan), mengelola antrean loket, dan Daftar Informasi Publik (DIP PPID).',
    allowedModules: ['telemetri', 'whatsapp', 'ppid', 'jadwal', 'sipp'],
    permissions: {
      canCreate: (mod) => ['ppid', 'whatsapp'].includes(mod),
      canEdit: (mod) => ['ppid', 'whatsapp'].includes(mod),
      canDelete: () => false,
      canExportDb: false,
      canResetDb: false,
      canManageUsers: false
    }
  },

  user_tamu: {
    role: 'user_tamu',
    name: 'Pengunjung Publik / Advokat',
    label: 'Masyarakat & Pencari Keadilan',
    division: 'Pengunjung Publik / Pemohon Layanan',
    badgeBg: 'bg-slate-700/40',
    badgeBorder: 'border-slate-500/60',
    badgeText: 'text-slate-300',
    isStaff: false,
    description: 'Akses publik & layanan mandiri: Mengajukan permohonan layanan PTSP online, cek status tiket, melihat jadwal sidang, melacak perkara SIPP, dan permohonan PPID (Read-Only).',
    allowedModules: ['telemetri', 'sipp', 'jadwal', 'ppid', 'eviden'],
    permissions: {
      canCreate: () => false,
      canEdit: () => false,
      canDelete: () => false,
      canExportDb: false,
      canResetDb: false,
      canManageUsers: false
    }
  }
};

/**
 * Helper: Cek apakah user adalah aparatur/petugas pengadilan
 */
export function isStaffUser(user?: UserAccount | null): boolean {
  if (!user || !user.role) return false;
  return ROLE_CONFIGS[user.role]?.isStaff || false;
}

/**
 * Helper: Cek apakah user memiliki izin untuk modul dan aksi tertentu
 */
export function canUserPerform(
  user: UserAccount | null | undefined,
  module: AdminModule,
  action: 'create' | 'edit' | 'delete'
): boolean {
  if (!user || !user.role) return false;
  const config = ROLE_CONFIGS[user.role];
  if (!config || !config.isStaff) return false;

  if (action === 'create') return config.permissions.canCreate(module);
  if (action === 'edit') return config.permissions.canEdit(module);
  if (action === 'delete') return config.permissions.canDelete(module);
  return false;
}

/**
 * Helper: Dapatkan daftar tab admin yang boleh dibuka oleh user
 */
export function getAllowedAdminTabs(user?: UserAccount | null): AdminModule[] {
  if (!user || !user.role) return [];
  const config = ROLE_CONFIGS[user.role];
  return config ? config.allowedModules : [];
}

/**
 * Helper: Ambil nama role yang ramah dan jelas
 */
export function getRoleDisplayName(role?: UserRole | null): string {
  if (!role) return 'Pengunjung Publik';
  return ROLE_CONFIGS[role]?.name || role;
}
