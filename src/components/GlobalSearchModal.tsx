import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  FileText, 
  Building2, 
  Newspaper, 
  Scale, 
  Users, 
  Download, 
  ChevronRight, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  MapPin,
  Clock,
  Filter
} from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import { NavSection } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onNavigate: (section: NavSection, subTab?: string) => void;
  onSelectPerkara?: (perkaraId: string) => void;
}

type SearchCategory = 'ALL' | 'DOKUMEN' | 'MENU' | 'BERITA' | 'PERKARA' | 'PERSONEL' | 'TEMPLATE';

export default function GlobalSearchModal({
  isOpen,
  onClose,
  initialQuery = '',
  onNavigate,
  onSelectPerkara
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('ALL');

  // Keep query synced if initialQuery changes when opening
  React.useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery, isOpen]);

  const dipList = useMemo(() => CourtDB.getDipList(), [isOpen]);
  const sakipDipaDocs = useMemo(() => CourtDB.getSakipDipaDocuments(), [isOpen]);
  const templateList = useMemo(() => CourtDB.getAllDocumentTemplates(), [isOpen]);
  const menuList = useMemo(() => CourtDB.getAllMenuContents(), [isOpen]);
  const newsList = useMemo(() => CourtDB.getNewsList(), [isOpen]);
  const sippList = useMemo(() => CourtDB.getSippList(), [isOpen]);
  const personnelList = useMemo(() => CourtDB.getPersonnelList(), [isOpen]);
  const courtIdentity = useMemo(() => CourtDB.getCourtIdentity(), [isOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: Array<{
      id: string;
      category: SearchCategory;
      categoryLabel: string;
      title: string;
      subtitle: string;
      description: string;
      icon: any;
      badge: string;
      actionType: 'navigate' | 'download' | 'perkara';
      targetSection?: NavSection;
      targetSubTab?: string;
      fileUrl?: string;
      fileName?: string;
      perkaraId?: string;
    }> = [];

    // 0. Motto REWAKO & Sambutan Resmi Pimpinan Highlight
    if (
      'rewako'.includes(q) ||
      q.includes('rewako') ||
      'responsif'.includes(q) ||
      'energik'.includes(q) ||
      'wibawa'.includes(q) ||
      'adaptif'.includes(q) ||
      'kolaboratif'.includes(q) ||
      'objektif'.includes(q) ||
      'motto'.includes(q) ||
      'slogan'.includes(q) ||
      'sulapa eppa'.includes(q)
    ) {
      results.push({
        id: 'slogan-rewako',
        category: 'MENU',
        categoryLabel: 'Motto Pengadilan',
        title: 'MOTTO RESMI: REWAKO',
        subtitle: 'Responsif, Energik, Wibawa, Adaptif, Kolaboratif, Objektif',
        description: `Filosofi integritas dan pelayanan prima Pengadilan Militer Tinggi V Makassar dipadukan dengan kearifan lokal Sulapa Eppa (Kejujuran, Kecerdasan, Keberanian, dan Keteguhan Hukum) menuju predikat Wilayah Birokrasi Bersih dan Melayani (WBBM).`,
        icon: Sparkles,
        badge: 'MOTTO REWAKO',
        actionType: 'navigate',
        targetSection: 'tentang',
        targetSubTab: 'visimisi'
      });
    }

    if (
      'sultan'.includes(q) ||
      '11980017760771'.includes(q) ||
      'wakadilmilti'.includes(q) ||
      'sambutan'.includes(q) ||
      'pimpinan'.includes(q)
    ) {
      results.push({
        id: 'sambutan-wakadilmilti',
        category: 'MENU',
        categoryLabel: 'Sambutan Pimpinan Pengadilan',
        title: `Sambutan Resmi Pimpinan: ${courtIdentity.sambutanNama || 'Kolonel Chk Sultan, S.H.'}`,
        subtitle: `${courtIdentity.sambutanJabatan || 'Wakil Kepala Pengadilan Militer Tinggi V Makassar'} • NRP: 11980017760771`,
        description: courtIdentity.sambutanQuote || courtIdentity.sambutanParagraph1 || 'Komitmen penuh menyelenggarakan proses peradilan militer yang agung, independen, transparan, dan akuntabel.',
        icon: Building2,
        badge: 'WAKADILMILTI V',
        actionType: 'navigate',
        targetSection: 'tentang',
        targetSubTab: 'sambutan'
      });
    }

    // 1. Dokumen Informasi Publik (DIP) PPID
    dipList.forEach((dip) => {
      const matchTitle = dip.namaInformasi.toLowerCase().includes(q);
      const matchRingkasan = dip.ringkasan.toLowerCase().includes(q);
      const matchPj = (dip.penanggungJawab || '').toLowerCase().includes(q);
      if (matchTitle || matchRingkasan || matchPj) {
        results.push({
          id: `dip-${dip.id}`,
          category: 'DOKUMEN',
          categoryLabel: 'Dokumen PPID / DIP',
          title: dip.namaInformasi,
          subtitle: `Penanggung Jawab: ${dip.penanggungJawab || dip.unitKerja}`,
          description: dip.ringkasan,
          icon: FileText,
          badge: dip.kategori || 'Dokumen Resmi',
          actionType: dip.downloadUrl || dip.fileUrl ? 'download' : 'navigate',
          targetSection: 'ppid',
          targetSubTab: 'dip',
          fileUrl: dip.downloadUrl || dip.fileUrl
        });
      }
    });

    // 1.1 Dokumen SAKIP, DIPA, LHKPN, Maklumat, SOP, Standar Pelayanan, ZI WBBM
    sakipDipaDocs.forEach((doc) => {
      const matchJudul = doc.judul.toLowerCase().includes(q);
      const matchDesc = (doc.deskripsi || '').toLowerCase().includes(q);
      const matchNo = (doc.nomorDokumen || '').toLowerCase().includes(q);
      const matchKat = doc.kategori.toLowerCase().includes(q);
      const matchSub = (doc.subKategori || '').toLowerCase().includes(q);
      const matchPj = (doc.penanggungJawab || '').toLowerCase().includes(q);
      const matchTahun = doc.tahun.includes(q);
      if (matchJudul || matchDesc || matchNo || matchKat || matchSub || matchPj || matchTahun) {
        results.push({
          id: `sakip-${doc.id}`,
          category: 'DOKUMEN',
          categoryLabel: `Dokumen ${doc.kategori} ${doc.subKategori ? '(' + doc.subKategori + ')' : ''}`,
          title: doc.judul,
          subtitle: `No: ${doc.nomorDokumen || '-'} • Tahun ${doc.tahun} • PJ: ${doc.penanggungJawab}`,
          description: doc.deskripsi,
          icon: FileText,
          badge: `${doc.fileType || 'PDF'} • ${doc.kategori}`,
          actionType: doc.fileUrl ? 'download' : 'navigate',
          targetSection: 'layanan-publik',
          targetSubTab: 'laporan',
          fileUrl: doc.fileUrl,
          fileName: doc.fileName || `${doc.judul}.pdf`
        });
      }
    });

    // 2. Document Templates (.docx / .pdf)
    templateList.forEach((tpl) => {
      const matchTitle = tpl.judul.toLowerCase().includes(q);
      const matchDesc = tpl.deskripsi.toLowerCase().includes(q);
      const matchKat = tpl.kategori.toLowerCase().includes(q);
      if (matchTitle || matchDesc || matchKat) {
        results.push({
          id: `tpl-${tpl.id}`,
          category: 'TEMPLATE',
          categoryLabel: 'Template Dokumen & Laporan',
          title: tpl.judul,
          subtitle: `Format: ${tpl.fileFormat} (${tpl.fileSize}) • Kategori: ${tpl.kategori}`,
          description: tpl.deskripsi,
          icon: Download,
          badge: tpl.fileFormat,
          actionType: 'download',
          targetSection: 'template-dokumen',
          fileUrl: tpl.fileUrl
        });
      }
    });

    // 3. Menu & Sub-Menu Website
    menuList.forEach((menu) => {
      const matchJudul = menu.judul.toLowerCase().includes(q);
      const matchSub = (menu.subJudul || '').toLowerCase().includes(q);
      const matchKonten = menu.kontenUtama.toLowerCase().includes(q);
      const matchDasar = (menu.dasarHukum || '').toLowerCase().includes(q);
      if (matchJudul || matchSub || matchKonten || matchDasar) {
        let sec: NavSection = 'tentang';
        if ((menu.kategori as string) === 'layanan' || menu.kategori === 'layanan_publik' || menu.kategori === 'ptsp') sec = 'layanan-publik';
        else if ((menu.kategori as string) === 'hukum' || menu.kategori === 'layanan_hukum') sec = 'layanan-hukum';
        else if (menu.kategori === 'reformasi') sec = 'reformasi-birokrasi';
        else if (menu.kategori === 'ppid') sec = 'ppid';
        else if (menu.kategori === 'dokumen') sec = 'dokumen';
        else if (menu.kategori === 'hubungi_kami') sec = 'hubungi-kami';

        let resolvedSubTab = menu.targetSubTab || menu.id;
        if (menu.id === 'm1') resolvedSubTab = 'sambutan';
        else if (menu.id === 'm2') resolvedSubTab = 'visimisi';
        else if (menu.id === 'm3') resolvedSubTab = 'sejarah';
        else if (menu.id === 'm4') resolvedSubTab = 'struktur';
        else if (menu.id === 'm5') resolvedSubTab = 'denah';
        else if (menu.id === 'm6') resolvedSubTab = 'role-model';
        else if (menu.id === 'm7') resolvedSubTab = 'kepaniteraan';
        else if (menu.id === 'm8') resolvedSubTab = 'pengelolaan';
        else if (menu.id === 'm9') resolvedSubTab = 'profil-pegawai';
        else if (menu.id === 'm10') resolvedSubTab = 'agen-perubahan';
        else if (menu.id === 'lp1') resolvedSubTab = 'jenis-layanan';
        else if (menu.id === 'lp2') resolvedSubTab = 'standar-pelayanan';
        else if (menu.id === 'lp3') resolvedSubTab = 'kompensasi';
        else if (menu.id === 'lp4' || menu.id === 'lp5' || menu.id === 'lp6') resolvedSubTab = 'layanan-disabilitas';
        else if (menu.id === 'lp7') resolvedSubTab = 'siwas';
        else if (menu.id === 'lp8') resolvedSubTab = 'survei';

        results.push({
          id: `menu-${menu.id}`,
          category: 'MENU',
          categoryLabel: 'Menu & Informasi Website',
          title: menu.judul,
          subtitle: menu.subJudul || `Dasar Hukum: ${menu.dasarHukum || '-'}`,
          description: menu.kontenUtama.slice(0, 180) + '...',
          icon: Building2,
          badge: menu.badge || 'Menu Resmi',
          actionType: 'navigate',
          targetSection: sec,
          targetSubTab: resolvedSubTab
        });
      }
    });

    // 4. Berita & Publikasi
    newsList.forEach((news) => {
      const matchTitle = news.judul.toLowerCase().includes(q);
      const matchRingkasan = news.ringkasan.toLowerCase().includes(q);
      const matchIsi = (news.isi || '').toLowerCase().includes(q);
      if (matchTitle || matchRingkasan || matchIsi) {
        results.push({
          id: `news-${news.id}`,
          category: 'BERITA',
          categoryLabel: 'Berita & Publikasi',
          title: news.judul,
          subtitle: `Tanggal: ${news.tanggal} • Penulis: ${news.penulis}`,
          description: news.ringkasan,
          icon: Newspaper,
          badge: news.kategori,
          actionType: 'navigate',
          targetSection: 'berita'
        });
      }
    });

    // 5. Data Perkara SIPP
    sippList.forEach((perkara) => {
      const matchNo = perkara.nomorPerkara.toLowerCase().includes(q);
      const matchTerdak = perkara.terdakwa.nama.toLowerCase().includes(q);
      const matchKes = perkara.terdakwa.kesatuan.toLowerCase().includes(q);
      const matchJenis = perkara.jenisPerkara.toLowerCase().includes(q);
      if (matchNo || matchTerdak || matchKes || matchJenis) {
        results.push({
          id: `sipp-${perkara.id}`,
          category: 'PERKARA',
          categoryLabel: 'Data Perkara SIPP',
          title: `${perkara.nomorPerkara} - Terdakwa: ${perkara.terdakwa.nama}`,
          subtitle: `Pangkat/NRP: ${perkara.terdakwa.pangkat} (${perkara.terdakwa.nrp}) • Kesatuan: ${perkara.terdakwa.kesatuan}`,
          description: `Klasifikasi: ${perkara.klasifikasi} | Status: ${perkara.statusPerkara}`,
          icon: Scale,
          badge: perkara.statusPerkara,
          actionType: 'perkara',
          targetSection: 'sipp',
          perkaraId: perkara.id
        });
      }
    });

    // 6. Personel Aparatur & Hakim
    personnelList.forEach((pers) => {
      const matchNama = pers.nama.toLowerCase().includes(q);
      const matchJabatan = pers.jabatan.toLowerCase().includes(q);
      const matchNip = pers.nipNrp.toLowerCase().includes(q);
      if (matchNama || matchJabatan || matchNip) {
        results.push({
          id: `pers-${pers.id}`,
          category: 'PERSONEL',
          categoryLabel: 'Hakim & Aparatur',
          title: pers.nama,
          subtitle: `Jabatan: ${pers.jabatan} • ${pers.nipNrp}`,
          description: pers.riwayatSingkat || `Kategori: ${pers.kategori} ${pers.matra ? '• ' + pers.matra : ''}`,
          icon: Users,
          badge: pers.kategori,
          actionType: 'navigate',
          targetSection: 'tentang',
          targetSubTab: 'struktur'
        });
      }
    });

    return results;
  }, [query, dipList, sakipDipaDocs, templateList, menuList, newsList, sippList, personnelList, courtIdentity]);

  const filteredResults = useMemo(() => {
    if (activeCategory === 'ALL') return searchResults;
    return searchResults.filter((r) => r.category === activeCategory);
  }, [searchResults, activeCategory]);

  if (!isOpen) return null;

  const handleSelectResult = (item: typeof searchResults[0]) => {
    if (item.actionType === 'download' && item.fileUrl) {
      if (item.fileUrl.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = item.fileUrl;
        a.download = item.fileName || `${item.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        window.open(item.fileUrl, '_blank');
      }
    } else if (item.actionType === 'perkara' && item.perkaraId) {
      if (onSelectPerkara) onSelectPerkara(item.perkaraId);
      onNavigate('sipp');
    } else if (item.targetSection) {
      onNavigate(item.targetSection, item.targetSubTab);
    }
    onClose();
  };

  const quickFilterChips = [
    { label: 'Motto REWAKO', q: 'REWAKO' },
    { label: 'Sambutan Pimpinan', q: 'Kolonel Chk Sultan' },
    { label: 'Dokumen SAKIP & DIPA', q: 'DIPA' },
    { label: 'PP No. 22 & 23/2025', q: 'PP No. 22' },
    { label: 'Laporan Perkara SIPP', q: 'Perkara' },
    { label: 'Template Dokumen', q: 'Template' },
    { label: 'Maklumat & Kompensasi', q: 'Maklumat' },
    { label: 'Posbakum & Prodeo', q: 'Posbakum' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="bg-slate-900 border-2 border-amber-400/60 rounded-3xl shadow-2xl w-full max-w-4xl text-white overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#0A3D24] via-[#0D4A2B] to-[#166534] p-4 sm:p-5 border-b border-amber-400/40 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-emerald-200 hover:text-white bg-black/30 hover:bg-black/50 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-slate-950" />
              PENCARIAN CEPAT TAKTIS GLOBAL
            </span>
            <span className="text-xs text-emerald-200 font-medium hidden sm:inline">
              Mencari Seluruh Dokumen, Perkara, Menu, & Berita
            </span>
          </div>

          {/* Search Input Field */}
          <div className="relative flex items-center mt-2">
            <Search className="w-5 h-5 text-amber-400 absolute left-3.5 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik kata kunci: Nomor PP, Nama Terdakwa, Surat, Motto REWAKO, Peresmian..."
              className="w-full pl-11 pr-24 py-3 bg-slate-950/90 border-2 border-emerald-500/50 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 px-2 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              >
                Reset
              </button>
            )}
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-emerald-600/30 text-[11px]">
            <span className="text-emerald-300 font-semibold mr-1">Kata Kunci Cepat:</span>
            {quickFilterChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(chip.q)}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-amber-300 border border-emerald-500/30 transition-all text-[11px] font-medium cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          
          {/* Category Filter Tabs */}
          {searchResults.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-slate-800 text-xs">
              <Filter className="w-3.5 h-3.5 text-amber-400 shrink-0 mr-1" />
              <button
                type="button"
                onClick={() => setActiveCategory('ALL')}
                className={`px-3 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                  activeCategory === 'ALL' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Semua ({searchResults.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('DOKUMEN')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeCategory === 'DOKUMEN' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Dokumen PPID ({searchResults.filter((r) => r.category === 'DOKUMEN').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('TEMPLATE')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeCategory === 'TEMPLATE' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Template Dokumen ({searchResults.filter((r) => r.category === 'TEMPLATE').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('MENU')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeCategory === 'MENU' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Menu Website ({searchResults.filter((r) => r.category === 'MENU').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('PERKARA')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeCategory === 'PERKARA' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Perkara SIPP ({searchResults.filter((r) => r.category === 'PERKARA').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('BERITA')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeCategory === 'BERITA' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Berita ({searchResults.filter((r) => r.category === 'BERITA').length})
              </button>
            </div>
          )}

          {/* Results List */}
          {!query.trim() ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <Search className="w-12 h-12 text-emerald-500/40 mx-auto animate-pulse" />
              <p className="text-sm font-semibold text-slate-300">
                Ketik kata kunci pada kolom pencarian di atas
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Sistem Pencarian Cepat Taktis akan memindai seluruh dokumen PPID, berkas template, menu informasi pengadilan, berita resmi, data perkara SIPP, dan profil aparatur secara real-time.
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <Search className="w-10 h-10 text-rose-400 mx-auto" />
              <p className="text-sm font-bold text-slate-200">
                Tidak ditemukan hasil untuk kata kunci "{query}"
              </p>
              <p className="text-xs text-slate-400">
                Coba gunakan kata kunci lain seperti "PP No. 22", "Sunarto", "REWAKO", "Formulir", "UU 31/1997", atau "Banding".
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
                <span>Menampilkan {filteredResults.length} hasil pencarian</span>
                <span className="text-slate-400 font-normal">Klik hasil untuk membuka atau mengunduh</span>
              </div>

              {filteredResults.map((item) => {
                const IconComp = item.icon || FileText;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectResult(item)}
                    className="p-3.5 bg-slate-950/80 hover:bg-emerald-950/60 border border-slate-800 hover:border-amber-400/60 rounded-2xl transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-emerald-950 rounded-xl border border-emerald-500/30 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-900 text-emerald-200 border border-emerald-500/40 font-mono">
                            {item.categoryLabel}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">
                            {item.badge}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs text-emerald-200/80 font-medium">
                          {item.subtitle}
                        </p>
                        <p className="text-xs text-slate-300/80 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-end">
                      {item.actionType === 'download' ? (
                        <span className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm group-hover:bg-amber-300 transition-colors">
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-slate-800 group-hover:bg-emerald-800 text-slate-200 group-hover:text-amber-300 text-xs font-bold flex items-center gap-1 transition-colors">
                          <span>Buka</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="bg-slate-950 p-3.5 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PETA DILMILTI Global Search • Standar Keterbukaan Informasi Mahkamah Agung RI</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Tekan ESC untuk menutup</span>
        </div>

      </div>
    </div>
  );
}
