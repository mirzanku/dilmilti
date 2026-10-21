export interface RouteState {
  tab: string;
  subTab?: string;
  path: string;
}

const ROUTE_STORAGE_KEY = 'dilmilti5_active_route_v1';

const TAB_TO_SLUG: Record<string, string> = {
  beranda: 'beranda',
  tentang: 'tentang-pengadilan',
  publik: 'layanan-publik',
  hukum: 'layanan-hukum',
  berita: 'berita',
  reformasi: 'reformasi-birokrasi',
  ppid: 'informasi-publik',
  dokumen: 'dokumen-laporan',
  'hubungi-kami': 'hubungi-kami',
  'panduan-hukum': 'panduan-hukum',
  sipp: 'sipp',
  ecourt: 'ecourt',
  jadwal: 'jadwal-sidang',
  whatsapp: 'notifikasi-wa',
  'ptsp-online': 'ptsp-online',
  'ptsp-inovasi': 'ptsp-online',
  'admin-portal': 'admin-portal'
};

const SLUG_TO_TAB: Record<string, string> = {
  beranda: 'beranda',
  'tentang-pengadilan': 'tentang',
  tentang: 'tentang',
  'profil-pegawai': 'tentang',
  'layanan-publik': 'publik',
  publik: 'publik',
  'layanan-hukum': 'hukum',
  hukum: 'hukum',
  berita: 'berita',
  galeri: 'berita',
  'galeri-foto': 'berita',
  'pedoman-medsos': 'berita',
  'sk-sekma-14106': 'berita',
  'reformasi-birokrasi': 'reformasi',
  reformasi: 'reformasi',
  zi: 'reformasi',
  'informasi-publik': 'ppid',
  ppid: 'ppid',
  'dokumen-laporan': 'dokumen',
  dokumen: 'dokumen',
  laporan: 'dokumen',
  'template-dokumen': 'dokumen',
  'hubungi-kami': 'hubungi-kami',
  kontak: 'hubungi-kami',
  'panduan-hukum': 'hukum',
  panduan: 'hukum',
  'pedoman-buku-ii': 'hukum',
  pedoman: 'hukum',
  sipp: 'sipp',
  ecourt: 'publik',
  'jadwal-sidang': 'jadwal',
  jadwal: 'jadwal',
  'notifikasi-wa': 'whatsapp',
  whatsapp: 'whatsapp',
  'ptsp-online': 'ptsp-online',
  'ptsp-inovasi': 'ptsp-online',
  ptsp: 'publik',
  inovasi: 'ptsp-online',
  'admin-portal': 'admin-portal',
  admin: 'admin-portal'
};

export const DEFAULT_SUBTABS: Record<string, string> = {
  tentang: 'sambutan',
  publik: 'jenis-layanan',
  hukum: 'referensi-uu31',
  berita: 'berita-terkini',
  galeri: 'galeri-foto',
  reformasi: 'zona-integritas',
  ppid: 'berkala',
  dokumen: 'laporan-tahunan',
  'hubungi-kami': 'alamat',
  'ptsp-inovasi': 'app-viewer',
  'ptsp-online': 'app-viewer'
};

export const TAB_LABELS: Record<string, string> = {
  beranda: 'Beranda',
  tentang: 'Tentang Pengadilan',
  publik: 'Layanan Publik',
  hukum: 'Layanan Hukum',
  berita: 'Berita & Publikasi',
  reformasi: 'Reformasi Birokrasi',
  ppid: 'Informasi Publik (PPID)',
  dokumen: 'Dokumen & Laporan',
  'hubungi-kami': 'Hubungi Kami',
  'panduan-hukum': 'Panduan Hukum',
  sipp: 'Penelusuran Perkara (SIPP)',
  ecourt: 'Layanan e-Court',
  jadwal: 'Jadwal Sidang',
  whatsapp: 'Notifikasi Persidangan WhatsApp',
  'ptsp-online': 'Aplikasi PTSP Online Subdomain',
  'ptsp-inovasi': 'Aplikasi PTSP Online Subdomain',
  'admin-portal': 'Portal Admin Pengadilan'
};

export const SUBTAB_LABELS: Record<string, string> = {
  // Tentang Pengadilan & Profil Pegawai
  sambutan: 'Sambutan Kepala',
  visimisi: 'Visi dan Misi',
  sejarah: 'Sejarah Pengadilan',
  profil: 'Sejarah & Profil Pengadilan',
  yurisdiksi: 'Wilayah Yurisdiksi',
  struktur: 'Struktur Organisasi',
  denah: 'Denah Gedung',
  pengelolaan: 'Sistem Pengelolaan Pengadilan',
  kepaniteraan: 'Kepaniteraan & Tupoksi',
  'tugas-fungsi': 'Kepaniteraan & Tupoksi',
  'profil-hakim': 'Profil Hakim',
  'profil-kepaniteraan': 'Profil Kepaniteraan',
  'profil-panitera': 'Profil Kepaniteraan',
  'profil-kesekretariatan': 'Profil Kesekretariatan',
  'profil-sekretaris': 'Profil Kesekretariatan',
  'profil-pegawai': 'Direktori Seluruh Pegawai',
  pejabat: 'Direktori Seluruh Pegawai',
  'role-model': 'Profil Role Model Pimpinan',
  rolemodel: 'Profil Role Model Pimpinan',
  'agen-perubahan': 'Profil Agen Perubahan',

  // Layanan Publik
  ptsp: 'Informasi & Jenis Layanan 6 Meja PTSP',
  'jenis-layanan': 'Informasi & Jenis Layanan 6 Meja PTSP',
  infografis: 'Infografis Alur Pelayanan 6 Meja PTSP',
  'alur-layanan': 'Infografis Alur Pelayanan 6 Meja PTSP',
  'standar-pelayanan': 'Standar & Maklumat Pelayanan',
  maklumat: 'Maklumat Pelayanan',
  kompensasi: 'Kompensasi Pelayanan',
  'jam-kerja': 'Jam Kerja Pelayanan',
  'layanan-disabilitas': 'Layanan & Fasilitas Disabilitas',
  sarpras: 'Sarana & Prasarana Disabilitas',
  laporan: 'Laporan (DIPA, SAKIP, LHKPN & Laptah)',
  sakip: 'Laporan Akuntabilitas Kinerja (SAKIP)',
  dipa: 'Laporan Realisasi Anggaran (DIPA)',
  'realisasi-anggaran': 'Realisasi Anggaran (DIPA)',
  ringkasan: 'Ringkasan Laporan Akuntabilitas',
  siwas: 'Pengaduan Layanan Publik (SIWAS & LAPOR)',
  pengaduan: 'Pengaduan Layanan Publik',
  survei: 'Survei Pelayanan (IKM/IPAK)',

  // Layanan Hukum
  'referensi-uu31': 'Referensi UU No. 31 Tahun 1997 tentang Peradilan Militer',
  uu31: 'Referensi UU No. 31 Tahun 1997 tentang Peradilan Militer',
  regulasi: 'Pangkalan Data Regulasi & UU 31/1997',
  posbakum: 'Posbakum & Prodeo',
  prodeo: 'Pelayanan Sidang Prodeo',
  'tata-cara': 'Prosedur Berperkara & Upaya Hukum',
  'upaya-hukum': 'Upaya Hukum & Sengketa TUN',
  'biaya-perkara': 'Biaya Perkara',
  eksekusi: 'Eksekusi Putusan',
  'sidang-luar': 'Sidang di Luar Gedung Pengadilan',
  tatatertib: 'Tata Tertib Persidangan',
  faq: 'Hal-hal yang Sering Ditanyakan (FAQ)',

  // Berita
  'berita-terkini': 'Berita Terkini',
  'pedoman-medsos': 'Pedoman Medsos SK 14106/2026',
  pengumuman: 'Pengumuman Resmi',
  'artikel-hukum': 'Artikel Hukum',
  'galeri-foto': 'Galeri Kegiatan & Video',
  'e-brosur': 'E-Brosur Digital',

  // Reformasi Birokrasi
  'zona-integritas': 'Zona Integritas (WBK & WBBM)',
  smap: 'SMAP (Sistem Manajemen Anti Penyuapan)',
  'manajemen-risiko': 'Manajemen Risiko (SPIP)',
  monev: 'Monitoring & Evaluasi (Monev) RB',
  pengawasan: 'Area V: Penguatan Pengawasan',
  akuntabilitas: 'Area IV: Penguatan Akuntabilitas',
  'pelayanan-publik': 'Area VI: Kualitas Pelayanan Publik',

  // Informasi Publik (PPID)
  berkala: 'Informasi Berkala (SK KMA 2-144)',
  'setiap-saat': 'Informasi Setiap Saat',
  'serta-merta': 'Informasi Serta Merta',
  dip: 'Daftar Informasi Publik (DIP)',
  permohonan: 'Prosedur Permohonan Informasi',
  lhkpn: 'Laporan LHKPN & LHKASN',
  'laporan-ppid': 'Laporan Layanan Informasi (PPID)',

  // Dokumen & Laporan
  'laporan-tahunan': 'Laporan Tahunan & LKJIP',
  renstra: 'Renstra, RKT & Perjanjian Kinerja',
  'statistik-perkara': 'Statistik Perkara',
  'arsip-dokumen': 'Arsip SOP & Template Dokumen',

  // Hubungi Kami
  alamat: 'Alamat & Peta Lokasi',
  whatsapp: 'Telepon, WhatsApp & Email',
  'form-kontak': 'Media Sosial & Form Kontak',

  // PTSP & Inovasi
  'app-viewer': 'Informasi & Jenis Layanan 6 Meja PTSP',
  inovasi: 'Direktori Card Link Inovasi Layanan',
  'permohonan-ptsp': 'Standar Persyaratan & Alur Permohonan PTSP',
  antrean: 'Ambil Antrean PTSP & Kios Mandiri',
  lacak: 'Lacak Status & Unduh Balasan TTE',
  'validasi-tte': 'Scanner Validasi QR Code & TTE Resmi',
  monitor: 'Layar Monitor Antrean & Suara TTS',
  konsultasi: 'Portal Konsultasi Video Call & Chat Online',
  pengaturan: 'Dashboard Admin/Petugas PTSP & MySQL Sync'
};

export function normalizeRouteInput(rawTab: string, rawSubTab?: string): { tab: string; subTab?: string } {
  const cleanTab = (rawTab || 'beranda').trim().toLowerCase();
  let mappedTab = SLUG_TO_TAB[cleanTab] || cleanTab || 'beranda';

  const VALID_TABS = [
    'beranda',
    'tentang',
    'publik',
    'hukum',
    'berita',
    'reformasi',
    'ppid',
    'dokumen',
    'hubungi-kami',
    'panduan-hukum',
    'sipp',
    'ecourt',
    'jadwal',
    'whatsapp',
    'admin-portal',
    'ptsp-inovasi',
    'template-dokumen'
  ];

  if (!VALID_TABS.includes(mappedTab)) {
    mappedTab = 'beranda';
  }

  let subTab = rawSubTab ? rawSubTab.trim().toLowerCase() : undefined;
  if (!subTab && cleanTab === 'profil-pegawai') {
    subTab = 'profil-hakim';
  }
  if ((cleanTab === 'ptsp' || cleanTab === 'ptsp-inovasi' || cleanTab === 'inovasi') && (!subTab || subTab === 'app-viewer')) {
    subTab = 'jenis-layanan';
  }
  if (!subTab && DEFAULT_SUBTABS[mappedTab]) {
    subTab = DEFAULT_SUBTABS[mappedTab];
  }
  return { tab: mappedTab, subTab };
}

export function buildUrlPath(tab: string, subTab?: string): string {
  const { tab: normalizedTab, subTab: normalizedSubTab } = normalizeRouteInput(tab, subTab);
  if (normalizedTab === 'beranda') {
    return '/beranda';
  }
  const sectionSlug = TAB_TO_SLUG[normalizedTab] || normalizedTab;
  if (normalizedSubTab) {
    return `/${sectionSlug}/${encodeURIComponent(normalizedSubTab)}`;
  }
  return `/${sectionSlug}`;
}

export function parseUrlToRoute(pathname: string, search?: string, hash?: string): RouteState | null {
  // 1. Check query parameter ?halaman= or ?page= if provided
  if (search) {
    const params = new URLSearchParams(search);
    const pageParam = params.get('halaman') || params.get('page') || params.get('tab');
    const subParam = params.get('sub') || params.get('subtab') || undefined;
    if (pageParam) {
      const { tab, subTab } = normalizeRouteInput(pageParam, subParam);
      return { tab, subTab, path: buildUrlPath(tab, subTab) };
    }
  }

  // 2. Check hash #/... if provided
  if (hash && hash.startsWith('#/') && hash.length > 2) {
    const hashSegments = hash.slice(2).split('/').filter(Boolean);
    if (hashSegments.length > 0) {
      const { tab, subTab } = normalizeRouteInput(
        decodeURIComponent(hashSegments[0]),
        hashSegments[1] ? decodeURIComponent(hashSegments[1]) : undefined
      );
      return { tab, subTab, path: buildUrlPath(tab, subTab) };
    }
  }

  // 3. Check pathname /section/subTab
  const cleanPath = (pathname || '/').replace(/\/+$/, '');
  if (cleanPath === '/beranda') {
    return { tab: 'beranda', path: '/beranda' };
  }
  if (!cleanPath || cleanPath === '' || cleanPath === '/' || cleanPath === '/index.html') {
    return null;
  }

  const segments = cleanPath.split('/').filter(Boolean);
  if (segments.length === 0) {
    return null;
  }

  const firstSeg = decodeURIComponent(segments[0]).toLowerCase();
  // Ignore static/API paths
  if (['api', 'uploads', 'images', 'assets', 'sw.js'].includes(firstSeg)) {
    return null;
  }

  if (SLUG_TO_TAB[firstSeg]) {
    const secondSeg = segments[1] ? decodeURIComponent(segments[1]).toLowerCase() : undefined;
    const { tab, subTab } = normalizeRouteInput(firstSeg, secondSeg);
    return { tab, subTab, path: buildUrlPath(tab, subTab) };
  }

  return { tab: 'beranda', path: '/beranda' };
}

export function getInitialRouteState(): RouteState {
  if (typeof window === 'undefined') {
    return { tab: 'beranda', path: '/beranda' };
  }

  // 1. Check explicit browser URL first
  const fromUrl = parseUrlToRoute(
    window.location.pathname,
    window.location.search,
    window.location.hash
  );
  if (fromUrl) {
    saveRouteToStorage(fromUrl);
    return fromUrl;
  }

  // 2. Fallback to storage if URL was static asset/API or empty
  try {
    const rawSaved =
      window.sessionStorage.getItem(ROUTE_STORAGE_KEY) ||
      window.localStorage.getItem(ROUTE_STORAGE_KEY);
    if (rawSaved) {
      const parsed = JSON.parse(rawSaved) as RouteState;
      if (parsed && typeof parsed === 'object' && parsed.tab) {
        const { tab, subTab } = normalizeRouteInput(parsed.tab, parsed.subTab);
        const path = buildUrlPath(tab, subTab);
        try {
          window.history.replaceState({ tab, subTab }, '', path);
        } catch {}
        return { tab, subTab, path };
      }
    }
  } catch {}

  const defaultState: RouteState = { tab: 'beranda', path: '/beranda' };
  saveRouteToStorage(defaultState);
  return defaultState;
}

function saveRouteToStorage(route: RouteState) {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(route);
    window.sessionStorage.setItem(ROUTE_STORAGE_KEY, serialized);
    window.localStorage.setItem(ROUTE_STORAGE_KEY, serialized);
  } catch {}
}

export function updateDocumentTitleForRoute(tab: string, subTab?: string) {
  if (typeof document === 'undefined') return;
  const baseTitle = 'Pengadilan Militer Tinggi V Makassar';
  if (tab === 'beranda') {
    document.title = `Beranda Resmi — ${baseTitle}`;
    return;
  }
  const tabTitle = TAB_LABELS[tab] || tab;
  const subTitle = subTab ? SUBTAB_LABELS[subTab] || subTab : '';
  document.title = subTitle
    ? `${subTitle} | ${tabTitle} — ${baseTitle}`
    : `${tabTitle} — ${baseTitle}`;
}

let lastSyncedPath = '';

export function syncRouteToUrl(tab: string, subTab?: string, replace: boolean = false): RouteState {
  const { tab: normalizedTab, subTab: normalizedSubTab } = normalizeRouteInput(tab, subTab);
  const path = buildUrlPath(normalizedTab, normalizedSubTab);
  const routeState: RouteState = {
    tab: normalizedTab,
    subTab: normalizedSubTab,
    path
  };

  saveRouteToStorage(routeState);
  updateDocumentTitleForRoute(normalizedTab, normalizedSubTab);

  if (typeof window !== 'undefined') {
    let pathChanged = false;
    try {
      const currentPath = window.location.pathname;
      if (currentPath !== path) {
        pathChanged = true;
        if (replace) {
          window.history.replaceState(routeState, '', path);
        } else {
          window.history.pushState(routeState, '', path);
        }
      }
    } catch {}

    if (pathChanged && lastSyncedPath !== path) {
      lastSyncedPath = path;
      window.dispatchEvent(
        new CustomEvent('dilmilti_route_changed', { detail: routeState })
      );
    }
  }

  return routeState;
}
