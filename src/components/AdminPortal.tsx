import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Users, 
  Scale, 
  Calendar, 
  Newspaper, 
  FileText, 
  ShieldCheck, 
  Database, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  LogOut, 
  RefreshCw, 
  Download, 
  ArrowLeft, 
  UserCheck, 
  Activity, 
  Lock, 
  Eye, 
  ExternalLink,
  Shield,
  Layers,
  ChevronRight,
  Award,
  Sparkles,
  Cpu,
  Upload,
  FileJson,
  Archive,
  HardDrive,
  Building2,
  Globe,
  MapPin,
  Phone,
  Mail,
  Clock,
  Info,
  Code,
  Copy,
  X,
  BarChart,
  Key,
  Zap,
  Send,
  Server,
  Wifi,
  Laptop,
  Camera,
  Sliders,
  FileCheck,
  Compass,
  Loader2
} from 'lucide-react';
import { SakipDipaDocumentItem, MenuContentItem } from '../types';
import ECourtSection from './ECourtSection';
import MenuContentEditModal from './admin/MenuContentEditModal';
import { CourtDB } from '../data/courtDatabase';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { pushAllToFirestore, hydrateFromFirestore } from '../services/firestoreSync';
import { sendWhatsAppMessage } from '../utils/whatsappHelper';
import { compressImage, getFreshImageUrl, handleImageFallback, DEFAULT_OFFICIAL_AVATAR, logoTransparent, logoHijau } from '../utils/imageHelper';

const PERS_PHOTO_PRESETS = [
  { label: 'Pamen Militer 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { label: 'Pama Militer', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80' },
  { label: 'Pamen Militer 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
  { label: 'Aparatur ASN Pria', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80' },
  { label: 'Aparatur ASN Wanita', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
];
import { 
  PersonnelItem, 
  UserAccount, 
  NewsItem, 
  PerkaraSIPP, 
  JadwalSidangItem, 
  DIPItem, 
  AuditLogItem,
  UserRole,
  SatkerStructureItem,
  RelatedWebsiteItem,
  CourtIdentityData,
  JurisdictionCourtItem,
  ReformasiEvidenItem,
  PopupAnnouncementConfig,
  WhatsAppFoonteConfig,
  MakassarSlide,
  InovasiQuickAccessItem
} from '../types';
import { 
  ROLE_CONFIGS, 
  isStaffUser, 
  canUserPerform, 
  getAllowedAdminTabs,
  AdminModule 
} from '../utils/rbac';

interface AdminPortalProps {
  onBackToHome?: () => void;
  onOpenAuth?: () => void;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  onNavigateToSection?: (section: string, subTab?: string) => void;
}

type AdminTab = AdminModule;

export default function AdminPortal({ onBackToHome, onOpenAuth, currentUser: propUser, onLogout, onNavigateToSection }: AdminPortalProps) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => propUser !== undefined ? propUser : CourtDB.getCurrentUser());

  useEffect(() => {
    setCurrentUser(propUser !== undefined ? propUser : CourtDB.getCurrentUser());
  }, [propUser]);

  const [activeTab, setActiveTab] = useState<AdminTab>('telemetri');

  // Menu Content Edit Modal state (for the 23 sub-menus)
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [isMenuEditModalOpen, setIsMenuEditModalOpen] = useState(false);

  const handleOpenMenuEdit = (menuId: string, menuTitle?: string) => {
    setEditingMenuId(menuId);
    setIsMenuEditModalOpen(true);
    if (menuTitle) {
      showToast(`Membuka formulir edit isi data: ${menuTitle}`);
    }
  };
  
  // Data States
  const [personnelList, setPersonnelList] = useState<PersonnelItem[]>([]);
  const [satkerList, setSatkerList] = useState<SatkerStructureItem[]>([]);
  const [relatedWebsitesList, setRelatedWebsitesList] = useState<RelatedWebsiteItem[]>([]);
  const [courtIdentity, setCourtIdentity] = useState<CourtIdentityData>(() => CourtDB.getCourtIdentity());
  const [jurisdictionCourts, setJurisdictionCourts] = useState<JurisdictionCourtItem[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [sippList, setSippList] = useState<PerkaraSIPP[]>([]);
  const [jadwalList, setJadwalList] = useState<JadwalSidangItem[]>([]);
  const [dipList, setDipList] = useState<DIPItem[]>([]);
  const [evidenList, setEvidenList] = useState<ReformasiEvidenItem[]>([]);
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [slidesList, setSlidesList] = useState<MakassarSlide[]>([]);

  // Form fields for Slider Banner
  const [slideBadge, setSlideBadge] = useState('');
  const [slideTag, setSlideTag] = useState('');
  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideDesc, setSlideDesc] = useState('');
  const [slideActionText, setSlideActionText] = useState('');
  const [slideTargetSection, setSlideTargetSection] = useState('sipp');
  const [slideMakassarHighlight, setSlideMakassarHighlight] = useState('');
  const [slideIconType, setSlideIconType] = useState<'pinisi' | 'losari' | 'ptsp' | 'perma'>('pinisi');
  const [slideBgImage, setSlideBgImage] = useState('');

  // Form fields for Inovasi Layanan Publik
  const [inovasiList, setInovasiList] = useState<InovasiQuickAccessItem[]>([]);
  const [selectedInovasi, setSelectedInovasi] = useState<InovasiQuickAccessItem | null>(null);
  const [isInovasiModalOpen, setIsInovasiModalOpen] = useState(false);
  const [inovasiModalMode, setInovasiModalMode] = useState<'create' | 'edit'>('create');
  const [inovasiSearch, setInovasiSearch] = useState('');

  const [inNamaAplikasi, setInNamaAplikasi] = useState('');
  const [inNamaLengkap, setInNamaLengkap] = useState('');
  const [inDeskripsi, setInDeskripsi] = useState('');
  const [inBadge, setInBadge] = useState('INOVASI');
  const [inKategori, setInKategori] = useState('Pelayanan Publik');
  const [inUrlTujuan, setInUrlTujuan] = useState('');
  const [inDomainLabel, setInDomainLabel] = useState('');
  const [inInstansi, setInInstansi] = useState('Pengadilan Militer Tinggi V Makassar');
  const [inInternalSection, setInInternalSection] = useState('publik');
  const [inInternalSubTab, setInInternalSubTab] = useState('');
  const [inBukaTabBaru, setInBukaTabBaru] = useState(false);
  const [inIconName, setInIconName] = useState<InovasiQuickAccessItem['iconName']>('Sparkles');
  const [inStatus, setInStatus] = useState<'Aktif' | 'Maintenance'>('Aktif');
  const [inUrutan, setInUrutan] = useState<number>(1);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [evidenAreaFilter, setEvidenAreaFilter] = useState<number | 'ALL'>('ALL');
  const [isMenuQuickLaunchOpen, setIsMenuQuickLaunchOpen] = useState(true);
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<'tentang' | 'layanan' | 'hukum' | 'informasi' | 'kustom' | 'semua'>('tentang');
  const [allMenuContents, setAllMenuContents] = useState<MenuContentItem[]>(() => CourtDB.getAllMenuContents());

  useEffect(() => {
    const handleDbUpdate = () => {
      setAllMenuContents(CourtDB.getAllMenuContents());
    };
    window.addEventListener('dilmilti_db_updated', handleDbUpdate);
    return () => window.removeEventListener('dilmilti_db_updated', handleDbUpdate);
  }, []);

  const handleDeleteCustomMenu = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus menu '${title}' secara permanen?`)) {
      CourtDB.deleteMenuContent(id, currentUser);
      setAllMenuContents(CourtDB.getAllMenuContents());
      showToast(`Menu '${title}' berhasil dihapus.`, 'success');
    }
  };

  // Modals & CRUD Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncInfoModalOpen, setIsSyncInfoModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create');
  const [modalTargetModule, setModalTargetModule] = useState<AdminTab>('personel');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form fields for Satker Structure (PERMA 1/2017)
  const [satkerKelompok, setSatkerKelompok] = useState<'Kepaniteraan' | 'Kesekretariatan' | 'Pimpinan'>('Kepaniteraan');
  const [satkerJabatan, setSatkerJabatan] = useState('');
  const [satkerNamaPejabat, setSatkerNamaPejabat] = useState('');
  const [satkerPangkatNip, setSatkerPangkatNip] = useState('');
  const [satkerTugasFungsi, setSatkerTugasFungsi] = useState('');

  // Form fields for Related Websites
  const [rwName, setRwName] = useState('');
  const [rwUrl, setRwUrl] = useState('');
  const [rwRole, setRwRole] = useState('');
  const [rwCategory, setRwCategory] = useState<'Mahkamah Agung' | 'Ditjen Badilmiltun' | 'Pengawasan' | 'Layanan Publik' | 'Lainnya'>('Mahkamah Agung');

  // Form fields for Court Profile & Contacts
  const [profName, setProfName] = useState('');
  const [profAddress, setProfAddress] = useState('');
  const [profPhone, setProfPhone] = useState('');
  const [profWhatsapp, setProfWhatsapp] = useState('');
  const [profEmail, setProfEmail] = useState('');
  const [profWebsite, setProfWebsite] = useState('');
  const [profJamOperasional, setProfJamOperasional] = useState('');
  const [profYurisdiksi, setProfYurisdiksi] = useState('');
  const [profLogoUrl, setProfLogoUrl] = useState('');
  const [profBannerUrl, setProfBannerUrl] = useState('');
  const [profSlogan, setProfSlogan] = useState('');
  const [profIkmSkor, setProfIkmSkor] = useState('3.92');
  const [profIkmPredikat, setProfIkmPredikat] = useState('SANGAT BAIK');
  const [profIkmResponden, setProfIkmResponden] = useState('168');
  const [profIpakSkor, setProfIpakSkor] = useState('3.96');
  const [profIpakPredikat, setProfIpakPredikat] = useState('SANGAT BERSIH');
  const [profIpakResponden, setProfIpakResponden] = useState('168');
  const [profSurveiUrl, setProfSurveiUrl] = useState('https://survei.djmt.id/dilmilti_makassar');

  // Form fields for Profile Sections (Pimpinan, Visi Misi, Sejarah)
  const [profFotoKadilmil, setProfFotoKadilmil] = useState('');
  const [profSambutanNama, setProfSambutanNama] = useState('');
  const [profSambutanJabatan, setProfSambutanJabatan] = useState('');
  const [profSambutanPangkatNrp, setProfSambutanPangkatNrp] = useState('');
  const [profSambutanQuote, setProfSambutanQuote] = useState('');
  const [profSambutanParagraph1, setProfSambutanParagraph1] = useState('');
  const [profSambutanParagraph2, setProfSambutanParagraph2] = useState('');
  const [profVisiText, setProfVisiText] = useState('');
  const [profMisi1Title, setProfMisi1Title] = useState('');
  const [profMisi1Desc, setProfMisi1Desc] = useState('');
  const [profMisi2Title, setProfMisi2Title] = useState('');
  const [profMisi2Desc, setProfMisi2Desc] = useState('');
  const [profMisi3Title, setProfMisi3Title] = useState('');
  const [profMisi3Desc, setProfMisi3Desc] = useState('');
  const [profMisi4Title, setProfMisi4Title] = useState('');
  const [profMisi4Desc, setProfMisi4Desc] = useState('');
  const [profSejarahIntro, setProfSejarahIntro] = useState('');
  const [profSejarahParagraph, setProfSejarahParagraph] = useState('');
  const hasLoadedInitialForms = useRef(false);
  const [uploadingSlideId, setUploadingSlideId] = useState<string | null>(null);

  // Form fields for Jurisdiction Court (Dilmil tingkat pertama)
  const [dilmilName, setDilmilName] = useState('');
  const [dilmilAddress, setDilmilAddress] = useState('');
  const [dilmilPhone, setDilmilPhone] = useState('');

  // Form fields for Personnel
  const [persNama, setPersNama] = useState('');
  const [persNipNrp, setPersNipNrp] = useState('');
  const [persPangkat, setPersPangkat] = useState('');
  const [persJabatan, setPersJabatan] = useState('');
  const [persKategori, setPersKategori] = useState<PersonnelItem['kategori']>('Kesekretariatan');
  const [persIsMutasi, setPersIsMutasi] = useState(false);
  const [persMatra, setPersMatra] = useState<PersonnelItem['matra']>('ASN MA-RI');
  const [persPendidikan, setPersPendidikan] = useState('');
  const [persRiwayat, setPersRiwayat] = useState('');
  const [persFotoUrl, setPersFotoUrl] = useState('');

  const handlePersPhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran foto maksimal 5MB!', 'error');
        return;
      }
      try {
        const result = await compressImage(file, 600, 800, 0.85);
        setPersFotoUrl(result);
        showToast('Mengunggah foto personel...');
        const uploadedUrl = await CourtDB.uploadBase64ToServer(result, file.name || 'personel', 'uploads');
        if (uploadedUrl) {
          setPersFotoUrl(uploadedUrl);
        }
        showToast('File foto personel berhasil diunggah!');
      } catch (err) {
        showToast('Gagal memproses gambar foto.', 'error');
      }
    }
  };

  // Form fields for News
  const [newsJudul, setNewsJudul] = useState('');
  const [newsKategori, setNewsKategori] = useState('Kegiatan Pengadilan');
  const [newsRingkasan, setNewsRingkasan] = useState('');
  const [newsPenulis, setNewsPenulis] = useState('');
  const [newsIsFeatured, setNewsIsFeatured] = useState(false);
  const [newsGambarUrl, setNewsGambarUrl] = useState('');

  // Form fields for SIPP
  const [sippNomor, setSippNomor] = useState('');
  const [sippNamaTerdakwa, setSippNamaTerdakwa] = useState('');
  const [sippPangkat, setSippPangkat] = useState('');
  const [sippNrp, setSippNrp] = useState('');
  const [sippKesatuan, setSippKesatuan] = useState('');
  const [sippMatra, setSippMatra] = useState<PerkaraSIPP['terdakwa']['matra']>('TNI AD');
  const [sippKlasifikasi, setSippKlasifikasi] = useState<PerkaraSIPP['klasifikasi']>('Pelanggaran Disiplin/Desersi');
  const [sippStatus, setSippStatus] = useState<PerkaraSIPP['statusPerkara']>('Pemeriksaan');
  const [sippAmar, setSippAmar] = useState('');

  // Form fields for Jadwal
  const [jdwNomorPerkara, setJdwNomorPerkara] = useState('');
  const [jdwTerdakwa, setJdwTerdakwa] = useState('');
  const [jdwKesatuan, setJdwKesatuan] = useState('');
  const [jdwTanggal, setJdwTanggal] = useState('');
  const [jdwWaktu, setJdwWaktu] = useState('09:00 WITA');
  const [jdwRuang, setJdwRuang] = useState('Ruang Sidang Utama Kartika');
  const [jdwAgenda, setJdwAgenda] = useState('Pemeriksaan Saksi');
  const [jdwStatus, setJdwStatus] = useState<JadwalSidangItem['status']>('Akan Datang');

  const [ppidSubTab, setPpidSubTab] = useState<'dip' | 'sakip'>('dip');
  const [sakipDipaList, setSakipDipaList] = useState<SakipDipaDocumentItem[]>([]);

  // Form fields for PPID / DIP
  const [dipNamaInformasi, setDipNamaInformasi] = useState('');
  const [dipKategori, setDipKategori] = useState<'Berkala' | 'Serta Merta' | 'Setiap Saat'>('Berkala');
  const [dipUnitKerja, setDipUnitKerja] = useState('Kepaniteraan / Kesekretariatan');
  const [dipPenanggungJawab, setDipPenanggungJawab] = useState('PPID Dilmilti V Makassar');
  const [dipRingkasan, setDipRingkasan] = useState('');
  const [dipUkuranFile, setDipUkuranFile] = useState('1.2 MB (PDF)');
  const [dipFileUrl, setDipFileUrl] = useState('');
  const [dipFileName, setDipFileName] = useState('');

  // Form fields for SAKIP & DIPA Documents
  const [sakipJudul, setSakipJudul] = useState('');
  const [sakipKategori, setSakipKategori] = useState<'SAKIP' | 'DIPA' | 'LHKPN' | 'PPID' | 'STANDAR_PELAYANAN' | 'MAKLUMAT' | 'SK_SOP' | 'E_BROSUR'>('SAKIP');
  const [sakipSubKategori, setSakipSubKategori] = useState('Renstra');
  const [sakipTahun, setSakipTahun] = useState('2026');
  const [sakipNomor, setSakipNomor] = useState('');
  const [sakipDeskripsi, setSakipDeskripsi] = useState('');
  const [sakipFileUrl, setSakipFileUrl] = useState('');
  const [sakipFileName, setSakipFileName] = useState('');
  const [sakipFileSize, setSakipFileSize] = useState('');
  const [sakipFileType, setSakipFileType] = useState<'PDF' | 'DOCX' | 'XLSX' | 'JPG' | 'PNG'>('PDF');
  const [sakipNilai, setSakipNilai] = useState('');
  const [sakipKepatuhan, setSakipKepatuhan] = useState('100%');
  const [sakipPenanggungJawab, setSakipPenanggungJawab] = useState('Subbagian Perencanaan, TI & Pelaporan');

  const handleDipFilePicker = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDipFileName(file.name);
    const sizeMb = file.size / (1024 * 1024);
    const formattedSize = sizeMb >= 1 ? `${sizeMb.toFixed(1)} MB (PDF)` : `${Math.max(1, Math.round(file.size / 1024))} KB (PDF)`;
    setDipUkuranFile(formattedSize);

    showToast('Mengunggah dokumen fisik DIP...');
    try {
      const uploadedUrl = await CourtDB.uploadMediaFile(file, 'uploads');
      setDipFileUrl(uploadedUrl);
      showToast(`Berkas fisik ${file.name} berhasil diunggah!`);
    } catch (err) {
      showToast('Gagal mengunggah berkas fisik DIP.', 'error');
    }
  };

  const handleSakipFilePicker = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSakipFileName(file.name);
    const sizeMb = file.size / (1024 * 1024);
    setSakipFileSize(sizeMb >= 1 ? `${sizeMb.toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`);
    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    if (['PDF'].includes(ext)) setSakipFileType('PDF');
    else if (['XLS', 'XLSX', 'CSV'].includes(ext)) setSakipFileType('XLSX');
    else if (['DOC', 'DOCX'].includes(ext)) setSakipFileType('DOCX');
    else setSakipFileType('PNG');

    showToast('Mengunggah dokumen SAKIP/DIPA/LHKPN ke server...');
    try {
      const uploadedUrl = await CourtDB.uploadMediaFile(file, 'uploads');
      setSakipFileUrl(uploadedUrl);
      showToast(`Dokumen fisik ${file.name} berhasil diunggah!`);
    } catch (err) {
      showToast('Gagal mengunggah berkas dokumen.', 'error');
    }
  };

  // Form fields for Eviden Reformasi Birokrasi (ZI)
  const [evidenJudul, setEvidenJudul] = useState('');
  const [evidenNomor, setEvidenNomor] = useState('');
  const [evidenAreaId, setEvidenAreaId] = useState<number>(1);
  const [evidenTahun, setEvidenTahun] = useState('2026');
  const [evidenKeterangan, setEvidenKeterangan] = useState('');
  const [evidenFileType, setEvidenFileType] = useState<'PDF' | 'XLSX' | 'DOCX' | 'ZIP' | 'IMAGE'>('PDF');
  const [evidenFileName, setEvidenFileName] = useState('');
  const [evidenFileSize, setEvidenFileSize] = useState('');
  const [evidenFileUrl, setEvidenFileUrl] = useState('');
  const [evidenStatusVerifikasi, setEvidenStatusVerifikasi] = useState<'Terverifikasi' | 'Dalam Proses' | 'Revisi'>('Terverifikasi');
  const [evidenDiuploadOleh, setEvidenDiuploadOleh] = useState('');

  const handleEvidenFilePicker = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEvidenFileName(file.name);
    const sizeMb = file.size / (1024 * 1024);
    setEvidenFileSize(sizeMb >= 1 ? `${sizeMb.toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`);
    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    if (['PDF'].includes(ext)) setEvidenFileType('PDF');
    else if (['XLS', 'XLSX', 'CSV'].includes(ext)) setEvidenFileType('XLSX');
    else if (['DOC', 'DOCX'].includes(ext)) setEvidenFileType('DOCX');
    else if (['ZIP', 'RAR'].includes(ext)) setEvidenFileType('ZIP');
    else setEvidenFileType('IMAGE');

    showToast('Mengunggah berkas eviden ke server penyimpanan...');
    try {
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file, 1200, 1600, 0.8);
        const uploadedUrl = await CourtDB.uploadBase64ToServer(compressed, file.name, 'uploads');
        setEvidenFileUrl(uploadedUrl);
      } else {
        const uploadedUrl = await CourtDB.uploadMediaFile(file, 'uploads');
        setEvidenFileUrl(uploadedUrl);
      }
      showToast('Berkas eviden berhasil diunggah dan tersimpan di server!');
    } catch {
      showToast('Gagal mengunggah berkas eviden ke server.', 'error');
    }
  };

  // Form fields for Users
  const [userNama, setUserNama] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('petugas_ptsp');
  const [userNipNrp, setUserNipNrp] = useState('');
  const [userInstansi, setUserInstansi] = useState('');
  const [userNomorWa, setUserNomorWa] = useState('');
  const [userStatus, setUserStatus] = useState<'aktif' | 'nonaktif'>('aktif');

  // Form fields for Backup & Restore (JSON & SQL Dump)
  const [restoreJsonContent, setRestoreJsonContent] = useState('');
  const [restoreFileName, setRestoreFileName] = useState('');
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [sqlPreviewContent, setSqlPreviewContent] = useState('');

  // Form fields & State for Pop-up Windows Announcement Config
  const [popupConfig, setPopupConfig] = useState<PopupAnnouncementConfig>(() => CourtDB.getPopupConfig());
  const [popIsActive, setPopIsActive] = useState<boolean>(true);
  const [popTitle, setPopTitle] = useState<string>('');
  const [popSubtitle, setPopSubtitle] = useState<string>('');
  const [popBadge, setPopBadge] = useState<string>('');
  const [popContent, setPopContent] = useState<string>('');
  const [popBulletPoints, setPopBulletPoints] = useState<string[]>([]);
  const [newBulletText, setNewBulletText] = useState<string>('');
  const [popImageUrl, setPopImageUrl] = useState<string>('');
  const [popButtonText, setPopButtonText] = useState<string>('');
  const [popButtonLinkTab, setPopButtonLinkTab] = useState<string>('layanan');
  const [popExternalLink, setPopExternalLink] = useState<string>('');
  const [popOnlyOnce, setPopOnlyOnce] = useState<boolean>(true);

  // Form fields & State for WhatsApp Foonte Gateway Config
  const [waConfig, setWaConfig] = useState<WhatsAppFoonteConfig>(() => CourtDB.getWhatsAppConfig());
  const [waIsActive, setWaIsActive] = useState<boolean>(true);
  const [waApiToken, setWaApiToken] = useState<string>('');
  const [waSenderNumber, setWaSenderNumber] = useState<string>('');
  const [waDeviceStatus, setWaDeviceStatus] = useState<'Terhubung' | 'Terputus' | 'Dalam Pengujian'>('Terhubung');
  const [waNotifH1, setWaNotifH1] = useState<boolean>(true);
  const [waNotifSipp, setWaNotifSipp] = useState<boolean>(true);
  const [waNotifAmar, setWaNotifAmar] = useState<boolean>(true);
  const [waNotifPpid, setWaNotifPpid] = useState<boolean>(true);
  const [waNotifSiwas, setWaNotifSiwas] = useState<boolean>(true);
  const [waHeaderTemplate, setWaHeaderTemplate] = useState<string>('');
  const [showToken, setShowToken] = useState<boolean>(false);

  // Form fields & State for SIPP Sync Endpoint Modal
  const [isSippSyncModalOpen, setIsSippSyncModalOpen] = useState(false);
  const [sippSyncUrl, setSippSyncUrl] = useState('/api/sipp/sync');
  const [sippSyncStatus, setSippSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [sippSyncLog, setSippSyncLog] = useState('');
  const [sippManualJsonPayload, setSippManualJsonPayload] = useState('');
  const [sippSyncActiveTab, setSippSyncActiveTab] = useState<'live' | 'manual' | 'script'>('live');

  const PHP_SYNC_SCRIPT_CODE = `<?php
// public/php-api/sync.php
// FILE SINKRONISASI DATABASE SIPP DILMILTI V MAKASSAR
require_once 'config.php';

// KONFIGURASI DATABASE SIPP
$sipp_host = getenv('SIPP_HOST') ?: "localhost";
$sipp_user = getenv('SIPP_USER') ?: "root";
$sipp_pass = getenv('SIPP_PASS') ?: "";
$sipp_db   = getenv('SIPP_DB')   ?: "sipp";

// Header untuk CORS jika diakses dari domain web aplikasi
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Mencoba koneksi ke SIPP
mysqli_report(MYSQLI_REPORT_OFF);
$sipp_conn = @new mysqli($sipp_host, $sipp_user, $sipp_pass, $sipp_db);

if (!$sipp_conn || $sipp_conn->connect_error) {
    $err = ($sipp_conn) ? $sipp_conn->connect_error : "Ekstensi MySQLi tidak aktif atau inisialisasi gagal.";
    echo json_encode([
        "success" => false, 
        "error" => "Gagal terhubung ke database SIPP: " . $err,
        "data" => [
            "jadwal_sidang" => [],
            "perkara" => [],
            "pihak" => [],
            "perkara_pihak" => []
        ]
    ]);
    exit;
}

// Fetch date range (today and future)
$today = date('Y-m-d');

// Helper function to handle query and errors
function get_query_results($conn, $sql, $label) {
    $res = $conn->query($sql);
    if (!$res) {
        return ["error" => "Gagal query $label: " . $conn->error . " [SQL: $sql]"];
    }
    $data = [];
    while($row = $res->fetch_assoc()) {
        $data[] = $row;
    }
    return $data;
}

try {
    // 1. Jadwal Sidang (Dynamic Column Detection)
    $cols_res = $sipp_conn->query("DESCRIBE \`jadwal_sidang\`");
    $available_jadwal_cols = [];
    if ($cols_res) {
        while($c = $cols_res->fetch_assoc()) {
            $available_jadwal_cols[] = strtolower($c['Field']);
        }
    }

    $js_id_col = in_array('id', $available_jadwal_cols) ? 'id' : (in_array('jadwal_id', $available_jadwal_cols) ? 'jadwal_id' : 'id');
    $js_perkara_id_col = in_array('perkara_id', $available_jadwal_cols) ? 'perkara_id' : 'perkara_id';
    $js_tanggal_col = in_array('tanggal_sidang', $available_jadwal_cols) ? 'tanggal_sidang' : 'tanggal_sidang';
    $js_agenda_col = in_array('agenda', $available_jadwal_cols) ? 'agenda' : '';
    $js_ruang_col = in_array('ruang_sidang', $available_jadwal_cols) ? 'ruang_sidang' : (in_array('ruang', $available_jadwal_cols) ? 'ruang' : '');
    $js_jam_col = in_array('jam_sidang', $available_jadwal_cols) ? 'jam_sidang' : (in_array('waktu_sidang', $available_jadwal_cols) ? 'waktu_sidang' : '');

    $select_jadwal = [];
    $select_jadwal[] = "$js_id_col as id";
    $select_jadwal[] = "$js_perkara_id_col as perkara_id";
    $select_jadwal[] = "$js_tanggal_col as tanggal_sidang";
    
    if ($js_agenda_col) {
        $select_jadwal[] = "$js_agenda_col as agenda";
    } else {
        $select_jadwal[] = "'' as agenda";
    }
    
    if ($js_ruang_col) {
        $select_jadwal[] = "$js_ruang_col as ruang_sidang";
    } else {
        $select_jadwal[] = "'' as ruang_sidang";
    }

    if ($js_jam_col) {
        $select_jadwal[] = "$js_jam_col as jam_sidang";
    } else {
        $select_jadwal[] = "'' as jam_sidang";
    }

    $sql_jadwal = "SELECT " . implode(', ', $select_jadwal) . " FROM \`jadwal_sidang\` ORDER BY \`$js_tanggal_col\` ASC LIMIT 500";
    $jadwal = get_query_results($sipp_conn, $sql_jadwal, "Jadwal Sidang");
    
    if (isset($jadwal['error'])) throw new Exception($jadwal['error']);

    $perkara_ids = [0]; 
    foreach($jadwal as $row) {
        if (isset($row['perkara_id']) && $row['perkara_id']) {
            $perkara_ids[] = (int)$row['perkara_id'];
        }
    }

    $ids_str = implode(',', array_unique($perkara_ids));

    // 2. Perkara (Dynamic Column Detection)
    $cols_perkara = $sipp_conn->query("DESCRIBE \`perkara\`");
    $available_perkara_cols = [];
    if ($cols_perkara) {
        while($c = $cols_perkara->fetch_assoc()) {
            $available_perkara_cols[] = strtolower($c['Field']);
        }
    }
    $p_id_col = in_array('perkara_id', $available_perkara_cols) ? 'perkara_id' : 'id';
    $p_nomor_col = in_array('nomor_perkara', $available_perkara_cols) ? 'nomor_perkara' : 'nomor_perkara';

    $sql_perkara = "SELECT \`$p_id_col\` as perkara_id, \`$p_nomor_col\` as nomor_perkara FROM \`perkara\` WHERE \`$p_id_col\` IN ($ids_str)";
    $perkara = get_query_results($sipp_conn, $sql_perkara, "Perkara");
    if (isset($perkara['error'])) throw new Exception($perkara['error']);

    // 3. Perkara Pihak (Dynamic Column Detection)
    $cols_pp = $sipp_conn->query("DESCRIBE \`perkara_pihak\`");
    $available_pp_cols = [];
    if ($cols_pp) {
        while($c = $cols_pp->fetch_assoc()) {
            $available_pp_cols[] = strtolower($c['Field']);
        }
    }
    $pp_pid_col = in_array('perkara_id', $available_pp_cols) ? 'perkara_id' : 'perkara_id';
    $pp_pih_col = in_array('pihak_id', $available_pp_cols) ? 'pihak_id' : 'pihak_id';
    $pp_jenis_col = in_array('jenis_pihak', $available_pp_cols) ? 'jenis_pihak' : 'jenis_pihak';

    $sql_pp = "SELECT \`$pp_pid_col\` as perkara_id, \`$pp_pih_col\` as pihak_id, \`$pp_jenis_col\` as jenis_pihak FROM \`perkara_pihak\` WHERE \`$pp_pid_col\` IN ($ids_str)";
    $pp = get_query_results($sipp_conn, $sql_pp, "Perkara Pihak");
    if (isset($pp['error'])) throw new Exception($pp['error']);
    
    $pihak_ids = [0];
    foreach($pp as $row) {
        if (isset($row['pihak_id']) && $row['pihak_id']) {
            $pihak_ids[] = (int)$row['pihak_id'];
        }
    }

    $pids_str = implode(',', array_unique($pihak_ids));

    // 4. Pihak (with smart column detection including nomor_hp/telepon)
    $pihak = [];
    $cols_res = $sipp_conn->query("DESCRIBE \`pihak\`");
    $available_pihak_cols = [];
    if ($cols_res) {
        while($c = $cols_res->fetch_assoc()) {
            $available_pihak_cols[] = strtolower($c['Field']);
        }
    }

    $id_col = in_array('pihak_id', $available_pihak_cols) ? 'pihak_id' : 'id';
    $name_col = in_array('nama', $available_pihak_cols) ? 'nama' : 'nama';
    $addr_col = in_array('alamat', $available_pihak_cols) ? 'alamat' : '';
    $hp_col = in_array('nomor_hp', $available_pihak_cols) ? 'nomor_hp' : (in_array('telepon', $available_pihak_cols) ? 'telepon' : '');

    $select_pihak = [];
    $select_pihak[] = "\`$id_col\` as id";
    $select_pihak[] = "\`$name_col\` as nama";
    if ($addr_col) $select_pihak[] = "\`$addr_col\` as alamat";
    if ($hp_col) {
        $select_pihak[] = "\`$hp_col\` as nomor_hp";
    } else {
        $select_pihak[] = "NULL as nomor_hp";
    }
    
    $sql_pihak = "SELECT " . implode(', ', $select_pihak) . " FROM \`pihak\` WHERE \`$id_col\` IN ($pids_str)";
    $pihak = get_query_results($sipp_conn, $sql_pihak, "Pihak");
    if (isset($pihak['error'])) {
        // Last resort fallback
        $sql_pihak_safe = "SELECT \`$id_col\` as id FROM \`pihak\` WHERE \`$id_col\` IN ($pids_str)";
        $pihak = get_query_results($sipp_conn, $sql_pihak_safe, "Pihak (Safe)");
    }
    if (isset($pihak['error'])) {
        throw new Exception($pihak['error']);
    }

    echo json_encode([
        "success" => true,
        "data" => [
            "jadwal_sidang" => $jadwal,
            "perkara" => $perkara,
            "pihak" => $pihak,
            "perkara_pihak" => $pp
        ]
    ]);

} catch (Throwable $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage() . " in " . basename($e->getFile()) . " line " . $e->getLine(),
        "data" => [
            "jadwal_sidang" => [], "perkara" => [], "pihak" => [], "perkara_pihak" => []
        ]
    ]);
}
?>`;

  const handleExecuteSippSyncLive = async () => {
    setSippSyncStatus('loading');
    setSippSyncLog(`[1/3] Menghubungi endpoint SIPP: ${sippSyncUrl} ...\n`);
    try {
      const resp = await fetch(sippSyncUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!resp.ok) {
        throw new Error(`HTTP Status ${resp.status} ${resp.statusText}`);
      }
      const data = await resp.json();
      setSippSyncLog(prev => prev + `[2/3] Respon HTTP 200 OK diterima dari Server SIPP.\nMeringkas payload JSON persidangan...\n`);

      const res = CourtDB.syncSippFromApiData(data);
      if (res.success) {
        setSippSyncStatus('success');
        setSippSyncLog(prev => prev + `[3/3 SUKSES] ${res.message}\nTotal Perkara Diperbarui: ${res.countPerkara}\nTotal Jadwal Sidang Diperbarui: ${res.countJadwal}`);
        refreshData();
      } else {
        setSippSyncStatus('error');
        setSippSyncLog(prev => prev + `[ERROR SIPP] ${res.message}`);
      }
    } catch (err: any) {
      setSippSyncStatus('error');
      setSippSyncLog(prev => prev + `[KONEKSI GAGAL] ${err?.message || 'Tidak dapat terhubung ke endpoint'}.\n\n` +
        `Panduan Koneksi SIPP Localhost:\n` +
        `1. Apabila SIPP berada di localhost komputer kerja (misal: http://localhost/php-api/sync.php), pastikan file sync.php sudah ditaruh di folder htdocs/www server local SIPP.\n` +
        `2. Apabila web aplikasi ini diakses via HTTPS cloud, browser memblokir request ke http://localhost (Mixed Content). Gunakan tab "Impor Manual JSON" di samping atau pasang SSL/tunnel pada server SIPP.\n` +
        `3. Anda juga dapat menekan tombol "Simulasi Sampel Data" di bawah untuk menguji respon sinkronisasi SIPP.`
      );
    }
  };

  const handleExecuteSippSyncManual = () => {
    if (!sippManualJsonPayload.trim()) {
      alert('Silakan tempelkan data JSON hasil respon dari sync.php');
      return;
    }
    setSippSyncStatus('loading');
    try {
      const parsed = JSON.parse(sippManualJsonPayload);
      const res = CourtDB.syncSippFromApiData(parsed);
      if (res.success) {
        setSippSyncStatus('success');
        setSippSyncLog(`[MANUAL IMPORT SUKSES] ${res.message}\nTotal Perkara: ${res.countPerkara}\nTotal Jadwal Sidang: ${res.countJadwal}`);
        refreshData();
      } else {
        setSippSyncStatus('error');
        setSippSyncLog(`[MANUAL IMPORT GAGAL] ${res.message}`);
      }
    } catch (e: any) {
      setSippSyncStatus('error');
      setSippSyncLog(`[JSON PARSE ERROR] Format JSON yang Anda tempelkan tidak valid: ${e?.message}`);
    }
  };

  const handleSimulateSampleSippSync = () => {
    setSippSyncStatus('loading');
    setSippSyncLog(`[SIMULASI SIPP] Menjalankan penarikan data contoh SIPP...\n`);
    const sampleData = {
      success: true,
      data: {
        jadwal_sidang: [
          { id: 101, perkara_id: 88, tanggal_sidang: new Date().toISOString().split('T')[0], agenda: "Pemeriksaan Saksi Oditur", ruang_sidang: "Ruang Kartika", jam_sidang: "09:00 WITA" },
          { id: 102, perkara_id: 89, tanggal_sidang: new Date().toISOString().split('T')[0], agenda: "Pembacaan Tuntutan Oditur", ruang_sidang: "Ruang Cakra", jam_sidang: "10:30 WITA" },
          { id: 103, perkara_id: 90, tanggal_sidang: new Date().toISOString().split('T')[0], agenda: "Pembacaan Putusan Banding", ruang_sidang: "Ruang Kartika", jam_sidang: "13:30 WITA" }
        ],
        perkara: [
          { perkara_id: 88, nomor_perkara: "35-K/PMT.V/BDG/AD/IX/2026" },
          { perkara_id: 89, nomor_perkara: "36-K/PMT.V/BDG/AL/IX/2026" },
          { perkara_id: 90, nomor_perkara: "37-K/PMT.V/BDG/AU/IX/2026" }
        ],
        perkara_pihak: [
          { perkara_id: 88, pihak_id: 501, jenis_pihak: "Terdakwa" },
          { perkara_id: 89, pihak_id: 502, jenis_pihak: "Terdakwa" },
          { perkara_id: 90, pihak_id: 503, jenis_pihak: "Terdakwa" }
        ],
        pihak: [
          { id: 501, nama: "Serka Bambang Triyono", alamat: "Kodam XIV/Hasanuddin Makassar", nomor_hp: "081234567891" },
          { id: 502, nama: "Kopda Marinir Irwan Prasetyo", alamat: "Lantamal VI Makassar", nomor_hp: "081298765432" },
          { id: 503, nama: "Praka TNI AU Hendra Setiawan", alamat: "Lanud Sultan Hasanuddin", nomor_hp: "081355443322" }
        ]
      }
    };

    setTimeout(() => {
      const res = CourtDB.syncSippFromApiData(sampleData);
      setSippSyncStatus('success');
      setSippSyncLog(`[SIMULASI SYNC SIPP BERHASIL] ${res.message}\nSemua sampel persidangan SIPP terbaru berhasil masuk ke database.`);
      refreshData();
    }, 500);
  };

  // Test WhatsApp Foonte state
  const [testTargetPhone, setTestTargetPhone] = useState<string>('081234567890');
  const [testMessageText, setTestMessageText] = useState<string>('Yth. Oditur / Kuasa Hukum, Pemberitahuan Sidang Perkara No. 24-K/PMT.V/BDG/AD/VIII/2026 dijadwalkan besok pukul 09.00 WITA di Ruang Kartika. Terima Kasih.');
  const [testLogResponse, setTestLogResponse] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);

  // Notification Toast
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Sync state from Database
  const refreshData = (forceFormReload: boolean = false) => {
    setCurrentUser(propUser || CourtDB.getCurrentUser());
    setPersonnelList(CourtDB.getPersonnel());
    setSatkerList(CourtDB.getSatkerStructure());
    setRelatedWebsitesList(CourtDB.getRelatedWebsites());
    setJurisdictionCourts(CourtDB.getJurisdictionCourts());
    setNewsList(CourtDB.getNews());
    setSippList(CourtDB.getSIPP());
    setJadwalList(CourtDB.getJadwal());
    setDipList(CourtDB.getDIP());
    setSakipDipaList(CourtDB.getSakipDipaDocuments());
    setEvidenList(CourtDB.getReformasiEviden());
    setUsersList(CourtDB.getUsers());
    setAuditLogs(CourtDB.getAuditLogs());
    setSlidesList(CourtDB.getSlides());
    setInovasiList(CourtDB.getInovasiQuickAccess());
    
    // Only reload form input states on initial mount or when explicitly requested!
    // NEVER overwrite form input values while the admin user is actively typing or editing!
    if (forceFormReload || !hasLoadedInitialForms.current) {
      hasLoadedInitialForms.current = true;
      const idData = CourtDB.getCourtIdentity();
      setCourtIdentity(idData);
      setProfName(idData.name);
      setProfAddress(idData.address);
      setProfPhone(idData.phone);
      setProfWhatsapp(idData.whatsapp);
      setProfEmail(idData.email);
      setProfWebsite(idData.website);
      setProfJamOperasional(idData.jamOperasional || 'Senin - Jumat: 08.00 - 16.30 WITA');
      setProfYurisdiksi(idData.yurisdiksi);
      setProfLogoUrl(idData.logoUrl || logoHijau);
      setProfBannerUrl(idData.bannerUrl || '/images/makassar_court_banner_1789442426023.jpg');
      setProfSlogan(idData.slogan || 'REWAKO (Responsif, Energik, Wibawa, Adaptif, Kolaboratif, Objektif)');
      setProfIkmSkor(String(idData.ikmSkor || 3.92));
      setProfIkmPredikat(idData.ikmPredikat || 'SANGAT BAIK');
      setProfIkmResponden(String(idData.ikmResponden || 168));
      setProfIpakSkor(String(idData.ipakSkor || 3.96));
      setProfIpakPredikat(idData.ipakPredikat || 'SANGAT BERSIH');
      setProfIpakResponden(String(idData.ipakResponden || 168));
      setProfSurveiUrl(idData.surveiIkmUrl || 'https://survei.djmt.id/dilmilti_makassar');
      
      // Populate profile sections
      setProfFotoKadilmil(idData.fotoKadilmil || '');
      setProfSambutanNama(idData.sambutanNama || 'Kolonel Chk Sultan, S.H.');
      setProfSambutanJabatan(idData.sambutanJabatan || 'Wakil Kepala Pengadilan Militer Tinggi V Makassar');
      setProfSambutanPangkatNrp(idData.sambutanPangkatNrp || 'Wakil Kepala Pengadilan Militer Tinggi V Makassar • NRP: 11980017760771');
      setProfSambutanQuote(idData.sambutanQuote || "Assalamu'alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera bagi Kita Semua, Om Swastiastu, Namo Buddhaya, Salam Kebajikan. Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas hadirnya pembaruan situs resmi Pengadilan Militer Tinggi V Makassar sesuai Pedoman Standarisasi Website Ditjen Badilmiltun MA-RI SK No. 593/DJMT/SK.TI2.1.1/VII/2026 dan PERMA No. 1 Tahun 2017.");
      setProfSambutanParagraph1(idData.sambutanParagraph1 || 'Pengadilan Militer Tinggi V Makassar yang berkedudukan di Jl. Perintis Kemerdekaan KM. 13, Kel. Daya, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan 90243, berkomitmen penuh menyelenggarakan proses peradilan militer yang agung, independen, transparan, dan akuntabel di Kawasan Timur Indonesia.');
      setProfSambutanParagraph2(idData.sambutanParagraph2 || 'Dengan semangat kearifan bahari Sulawesi Selatan dan filosofi luhur Sulapa Eppa (Kejujuran, Kecerdasan, Keberanian, dan Keteguhan Hukum) serta Motto REWAKO (Responsif, Energik, Wibawa, Adaptif, Kolaboratif, Objektif), kami siap memberikan pelayanan hukum terbaik bebas dari gratifikasi menuju predikat Wilayah Birokrasi Bersih dan Melayani (WBBM).');
      setProfVisiText(idData.visiText || 'Terwujudnya Pengadilan Militer Tinggi V Makassar yang Agung, Modern, Akuntabel dan Berkeadilan');
      setProfMisi1Title(idData.misi1Title || '1. Menjaga Kemandirian Peradilan Militer:');
      setProfMisi1Desc(idData.misi1Desc || 'Menjaga independensi lembaga peradilan militer bebas dari intervensi pihak manapun dalam memeriksa dan memutus perkara banding & pamen.');
      setProfMisi2Title(idData.misi2Title || '2. Pelayanan Hukum Berkeadilan:');
      setProfMisi2Desc(idData.misi2Desc || 'Memberikan pelayanan hukum yang adil, cepat, sederhana, dan berbiaya ringan bagi prajurit dan seluruh pencari keadilan.');
      setProfMisi3Title(idData.misi3Title || '3. Integritas dan Kepemimpinan:');
      setProfMisi3Desc(idData.misi3Desc || 'Meningkatkan kualitas sumber daya manusia aparatur peradilan militer yang berintegritas tinggi, profesional, dan berwibawa.');
      setProfMisi4Title(idData.misi4Title || '4. Keterbukaan dan Transformasi Digital:');
      setProfMisi4Desc(idData.misi4Desc || 'Meningkatkan transparansi dan kredibilitas badan peradilan melalui implementasi SPBE, SIPP, dan e-Court terintegrasi.');
      setProfSejarahIntro(idData.sejarahIntro || 'Berdasarkan Undang-Undang Nomor 31 Tahun 1997 tentang Peradilan Militer, Pengadilan Militer Tinggi V Makassar berkedudukan di Makassar dan merupakan Pengadilan Militer Tingkat Banding yang membawahi 6 (enam) Pengadilan Militer Tingkat Pertama di Kawasan Timur Indonesia:');
      setProfSejarahParagraph(idData.sejarahParagraph || 'Pengadilan Militer Tinggi V Makassar juga berwenang mengadili pada tingkat pertama perkara pidana militer dengan Terdakwa berpangkat Mayor ke atas (Perwira Menengah & Perwira Tinggi) di seluruh Kawasan Timur Indonesia.');

      const pop = CourtDB.getPopupConfig();
      setPopupConfig(pop);
      setPopIsActive(pop.isActive);
      setPopTitle(pop.title);
      setPopSubtitle(pop.subtitle || '');
      setPopBadge(pop.badge || 'MAKLUMAT RESMI');
      setPopContent(pop.content);
      setPopBulletPoints(pop.bulletPoints || []);
      setPopImageUrl(pop.imageUrl || '');
      setPopButtonText(pop.buttonText || 'Buka Layanan PTSP Online');
      setPopButtonLinkTab(pop.buttonLinkTab || 'layanan');
      setPopExternalLink(pop.externalLink || '');
      setPopOnlyOnce(pop.showOnlyOncePerSession);

      const wa = CourtDB.getWhatsAppConfig();
      setWaConfig(wa);
      setWaIsActive(wa.isActive);
      setWaApiToken(wa.foonteApiToken);
      setWaSenderNumber(wa.senderNumber);
      setWaDeviceStatus(wa.deviceStatus);
      setWaNotifH1(wa.autoNotifSidangH1);
      setWaNotifSipp(wa.autoNotifStatusPerkara);
      setWaNotifAmar(wa.autoNotifAmarPutusan);
      setWaNotifPpid(wa.autoNotifPermohonanPpid);
      setWaNotifSiwas(wa.autoNotifPengaduanSiwas);
      setWaHeaderTemplate(wa.customHeaderTemplate);
    }
  };

  useEffect(() => {
    if (propUser !== undefined) {
      setCurrentUser(propUser);
    }
  }, [propUser]);

  const allowedTabs = useMemo(() => getAllowedAdminTabs(currentUser), [currentUser]);

  useEffect(() => {
    if (allowedTabs.length > 0 && !allowedTabs.includes(activeTab)) {
      setActiveTab(allowedTabs[0]);
    }
  }, [allowedTabs, activeTab]);

  useEffect(() => {
    refreshData(true);
    const handleUpdate = () => refreshData(false);
    window.addEventListener('dilmilti_db_updated', handleUpdate);
    return () => window.removeEventListener('dilmilti_db_updated', handleUpdate);
  }, []);

  const handleLogout = () => {
    CourtDB.logout();
    refreshData();
    showToast('Anda telah berhasil keluar dari sesi pengelola.');
    if (onLogout) onLogout();
  };

  const handleSaveCourtIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    CourtDB.updateCourtIdentity({
      name: profName,
      address: profAddress,
      phone: profPhone,
      whatsapp: profWhatsapp,
      email: profEmail,
      website: profWebsite,
      jamOperasional: profJamOperasional,
      yurisdiksi: profYurisdiksi,
      logoUrl: profLogoUrl,
      bannerUrl: profBannerUrl,
      slogan: profSlogan,
      ikmSkor: parseFloat(profIkmSkor) || 3.92,
      ikmPredikat: profIkmPredikat,
      ikmResponden: parseInt(profIkmResponden) || 168,
      ipakSkor: parseFloat(profIpakSkor) || 3.96,
      ipakPredikat: profIpakPredikat,
      ipakResponden: parseInt(profIpakResponden) || 168,
      surveiIkmUrl: profSurveiUrl,
      surveiIpakUrl: profSurveiUrl,
      // Sambutan Pimpinan
      fotoKadilmil: profFotoKadilmil,
      sambutanNama: profSambutanNama,
      sambutanJabatan: profSambutanJabatan,
      sambutanPangkatNrp: profSambutanPangkatNrp,
      sambutanQuote: profSambutanQuote,
      sambutanParagraph1: profSambutanParagraph1,
      sambutanParagraph2: profSambutanParagraph2,
      // Visi & Misi
      visiText: profVisiText,
      misi1Title: profMisi1Title,
      misi1Desc: profMisi1Desc,
      misi2Title: profMisi2Title,
      misi2Desc: profMisi2Desc,
      misi3Title: profMisi3Title,
      misi3Desc: profMisi3Desc,
      misi4Title: profMisi4Title,
      misi4Desc: profMisi4Desc,
      // Sejarah
      sejarahIntro: profSejarahIntro,
      sejarahParagraph: profSejarahParagraph
    });
    showToast('Profil identitas, Pengantar Pimpinan, Visi & Misi, Sejarah, Indeks Pelayanan Publik & Portal Survei berhasil disimpan!');
  };

  // OPEN MODAL HELPERS
  const openCreateModal = (module: AdminTab) => {
    setModalTargetModule(module);
    setModalType('create');
    setSelectedItem(null);

    // Reset satker form
    setSatkerKelompok('Kepaniteraan');
    setSatkerJabatan('');
    setSatkerNamaPejabat('');
    setSatkerPangkatNip('');
    setSatkerTugasFungsi('');

    // Reset tautan form
    setRwName('');
    setRwUrl('https://');
    setRwRole('');
    setRwCategory('Mahkamah Agung');

    // Reset personnel form
    setPersNama('');
    setPersNipNrp('');
    setPersPangkat('');
    setPersJabatan('');
    setPersKategori('Kesekretariatan');
    setPersIsMutasi(false);
    setPersMatra('ASN MA-RI');
    setPersPendidikan('');
    setPersRiwayat('');
    setPersFotoUrl('');

    // Reset news form
    setNewsJudul('');
    setNewsKategori('Kegiatan Pengadilan');
    setNewsRingkasan('');
    setNewsPenulis(currentUser ? currentUser.nama : 'Tim Humas Dilmilti V');
    setNewsIsFeatured(false);
    setNewsGambarUrl('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80');

    // Reset sipp form
    setSippNomor(`1${Math.floor(Math.random() * 90 + 10)}-K/PMT.V/BDG/AD/IX/2026`);
    setSippNamaTerdakwa('');
    setSippPangkat('Sersan Dua');
    setSippNrp('2119001234');
    setSippKesatuan('Yonif Raider 700/WYC');
    setSippMatra('TNI AD');
    setSippKlasifikasi('Pelanggaran Disiplin/Desersi');
    setSippStatus('Pemeriksaan');
    setSippAmar('');

    // Reset jadwal form
    setJdwNomorPerkara(`2${Math.floor(Math.random() * 90 + 10)}-K/PMT.V/BDG/AD/IX/2026`);
    setJdwTerdakwa('');
    setJdwKesatuan('Kodam XIV/Hasanuddin');
    setJdwTanggal(new Date().toISOString().split('T')[0]);
    setJdwWaktu('09:30 WITA');
    setJdwRuang('Ruang Sidang Utama Kartika');
    setJdwAgenda('Pemeriksaan Saksi');
    setJdwStatus('Akan Datang');

    // Reset PPID form
    setDipNamaInformasi('');
    setDipKategori('Berkala');
    setDipUnitKerja('Kepaniteraan / Kesekretariatan');
    setDipPenanggungJawab('PPID Dilmilti V Makassar');
    setDipRingkasan('');
    setDipUkuranFile('1.2 MB (PDF)');
    setDipFileUrl('');
    setDipFileName('');

    // Reset SAKIP & DIPA form
    setSakipJudul('');
    setSakipKategori('SAKIP');
    setSakipSubKategori('Renstra');
    setSakipTahun('2026');
    setSakipNomor(`W5-Mil.01/OT.01.2/SK/0${Math.floor(Math.random() * 9 + 1)}/2026`);
    setSakipDeskripsi('');
    setSakipFileUrl('');
    setSakipFileName('');
    setSakipFileSize('');
    setSakipFileType('PDF');
    setSakipNilai('');
    setSakipKepatuhan('100%');
    setSakipPenanggungJawab('Subbagian Perencanaan, TI & Pelaporan');

    // Reset Eviden form
    setEvidenJudul('');
    setEvidenNomor(`W5-Mil.01/OT.01.1/SK/0${Math.floor(Math.random() * 9 + 1)}/2026`);
    setEvidenAreaId(1);
    setEvidenTahun('2026');
    setEvidenKeterangan('');
    setEvidenFileType('PDF');
    setEvidenFileName('');
    setEvidenFileSize('');
    setEvidenFileUrl('');
    setEvidenStatusVerifikasi('Terverifikasi');
    setEvidenDiuploadOleh(currentUser ? currentUser.nama : 'Admin Dilmilti V');

    // Reset Slide Banner form
    setSlideBadge('');
    setSlideTag('DILMILTI V MAKASSAR');
    setSlideTitle('');
    setSlideSubtitle('');
    setSlideDesc('');
    setSlideActionText('Kunjungi Portal SIPP Banding');
    setSlideTargetSection('sipp');
    setSlideMakassarHighlight('Kota Makassar');
    setSlideIconType('pinisi');
    setSlideBgImage('');

    // Reset user form
    setUserNama('');
    setUserEmail('');
    setUserPassword('dilmilti2026');
    setUserRole('petugas_ptsp');
    setUserNipNrp('');
    setUserInstansi('Pengadilan Militer Tinggi V Makassar');
    setUserNomorWa('0812-4455-6677');
    setUserStatus('aktif');

    // Reset Inovasi form
    setInNamaAplikasi('');
    setInNamaLengkap('');
    setInDeskripsi('');
    setInBadge('INOVASI');
    setInKategori('Pelayanan Publik');
    setInUrlTujuan('');
    setInDomainLabel('dilmilti5-makassar.go.id');
    setInInstansi('Pengadilan Militer Tinggi V Makassar');
    setInInternalSection('publik');
    setInInternalSubTab('');
    setInBukaTabBaru(false);
    setInIconName('Sparkles');
    setInStatus('Aktif');
    setInUrutan(inovasiList.length + 1);

    setIsModalOpen(true);
  };

  const openEditModal = (module: AdminTab, item: any) => {
    setModalTargetModule(module);
    setModalType('edit');
    setSelectedItem(item);

    if (module === 'satker') {
      setSatkerKelompok(item.kelompok || 'Kepaniteraan');
      setSatkerJabatan(item.jabatan || '');
      setSatkerNamaPejabat(item.namaPejabat || '');
      setSatkerPangkatNip(item.pangkatNip || '');
      setSatkerTugasFungsi(item.tugasFungsi || '');
    } else if (module === 'tautan') {
      setRwName(item.name || '');
      setRwUrl(item.url || '');
      setRwRole(item.role || '');
      setRwCategory(item.category || 'Mahkamah Agung');
    } else if (module === 'profil') {
      setDilmilName(item.name || '');
      setDilmilAddress(item.address || '');
      setDilmilPhone(item.phone || '');
    } else if (module === 'personel') {
      setPersNama(item.nama || '');
      setPersNipNrp(item.nipNrp || '');
      setPersPangkat(item.pangkatGol || '');
      setPersJabatan(item.jabatan || '');
      setPersKategori(item.kategori || 'Kesekretariatan');
      setPersIsMutasi(item.isMutasiMasuk || false);
      setPersMatra(item.matra || 'ASN MA-RI');
      setPersPendidikan(item.pendidikan || '');
      setPersRiwayat(item.riwayatSingkat || '');
      setPersFotoUrl(item.fotoUrl || '');
    } else if (module === 'berita') {
      setNewsJudul(item.judul || '');
      setNewsKategori(item.kategori || 'Kegiatan Pengadilan');
      setNewsRingkasan(item.ringkasan || '');
      setNewsPenulis(item.penulis || '');
      setNewsIsFeatured(item.isFeatured || false);
      setNewsGambarUrl(item.gambarUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80');
    } else if (module === 'sipp') {
      setSippNomor(item.nomorPerkara || '');
      setSippNamaTerdakwa(item.terdakwa?.nama || '');
      setSippPangkat(item.terdakwa?.pangkat || '');
      setSippNrp(item.terdakwa?.nrp || '');
      setSippKesatuan(item.terdakwa?.kesatuan || '');
      setSippMatra(item.terdakwa?.matra || 'TNI AD');
      setSippKlasifikasi(item.klasifikasi || 'Pelanggaran Disiplin/Desersi');
      setSippStatus(item.statusPerkara || 'Pemeriksaan');
      setSippAmar(item.amarPutusan || '');
    } else if (module === 'jadwal') {
      setJdwNomorPerkara(item.nomorPerkara || '');
      setJdwTerdakwa(item.terdakwa || '');
      setJdwKesatuan(item.kesatuan || '');
      setJdwTanggal(item.tanggal || '');
      setJdwWaktu(item.waktu || '09:00 WITA');
      setJdwRuang(item.ruangSidang || 'Ruang Sidang Utama Kartika');
      setJdwAgenda(item.agenda || '');
      setJdwStatus(item.status || 'Akan Datang');
    } else if (module === 'ppid') {
      setDipNamaInformasi(item.namaInformasi || '');
      setDipKategori(item.kategori || 'Berkala');
      setDipUnitKerja(item.unitKerja || '');
      setDipPenanggungJawab(item.penanggungJawab || '');
      setDipRingkasan(item.ringkasan || '');
      setDipUkuranFile(item.ukuranFile || '1.0 MB');
    } else if ((module as string) === 'sakip') {
      setSakipJudul(item.judul || '');
      setSakipKategori(item.kategori || 'SAKIP');
      setSakipSubKategori(item.subKategori || '');
      setSakipTahun(item.tahun || '2026');
      setSakipNomor(item.nomorDokumen || '');
      setSakipDeskripsi(item.deskripsi || '');
      setSakipFileUrl(item.fileUrl || '');
      setSakipFileName(item.fileName || '');
      setSakipFileSize(item.fileSize || '');
      setSakipFileType(item.fileType || 'PDF');
      setSakipNilai(item.nilaiAnggaran || '');
      setSakipKepatuhan(item.persentaseKepatuhan || '');
      setSakipPenanggungJawab(item.penanggungJawab || '');
    } else if (module === 'eviden') {
      setEvidenJudul(item.judulDokumen || '');
      setEvidenNomor(item.nomorSurat || '');
      setEvidenAreaId(item.areaId ?? 1);
      setEvidenTahun(item.tahun || '2026');
      setEvidenKeterangan(item.keterangan || '');
      setEvidenFileType(item.fileType || 'PDF');
      setEvidenFileName(item.fileName || '');
      setEvidenFileSize(item.fileSize || '');
      setEvidenFileUrl(item.fileUrl || '');
      setEvidenStatusVerifikasi(item.statusVerifikasi || 'Terverifikasi');
      setEvidenDiuploadOleh(item.diuploadOleh || '');
    } else if (module === 'slider') {
      setSlideBadge(item.badge || '');
      setSlideTag(item.tag || '');
      setSlideTitle(item.title || '');
      setSlideSubtitle(item.subtitle || '');
      setSlideDesc(item.desc || '');
      setSlideActionText(item.actionText || '');
      setSlideTargetSection(item.targetSection || 'sipp');
      setSlideMakassarHighlight(item.makassarHighlight || '');
      setSlideIconType(item.iconType || 'pinisi');
      setSlideBgImage(item.bgImage || '');
    } else if (module === 'users') {
      setUserNama(item.nama || '');
      setUserEmail(item.email || '');
      setUserPassword('');
      setUserRole(item.role || 'petugas_ptsp');
      setUserNipNrp(item.nipNrp || '');
      setUserInstansi(item.instansi || '');
      setUserNomorWa(item.nomorWA || '');
      setUserStatus(item.status || 'aktif');
    } else if (module === 'inovasi') {
      setInNamaAplikasi(item.namaAplikasi || '');
      setInNamaLengkap(item.namaLengkap || '');
      setInDeskripsi(item.deskripsi || '');
      setInBadge(item.badge || 'INOVASI');
      setInKategori(item.kategori || 'Pelayanan Publik');
      setInUrlTujuan(item.urlTujuan || '');
      setInDomainLabel(item.domainLabel || '');
      setInInstansi(item.instansi || 'Pengadilan Militer Tinggi V Makassar');
      setInInternalSection(item.internalSection || 'publik');
      setInInternalSubTab(item.internalSubTab || '');
      setInBukaTabBaru(Boolean(item.bukaTabBaru));
      setInIconName(item.iconName || 'Sparkles');
      setInStatus(item.status || 'Aktif');
      setInUrutan(item.urutan || 1);
    }

    setIsModalOpen(true);
  };

  const openDeleteModal = (module: AdminTab, item: any) => {
    setModalTargetModule(module);
    setModalType('delete');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // SUBMIT CRUD ACTIONS
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modalType === 'delete' && selectedItem) {
      if (modalTargetModule === 'satker') {
        CourtDB.deleteSatkerStructure(selectedItem.id);
        showToast(`Jabatan/unit ${selectedItem.jabatan} berhasil dihapus dari Struktur Satker.`);
      } else if (modalTargetModule === 'tautan') {
        CourtDB.deleteRelatedWebsite(selectedItem.id);
        showToast(`Tautan resmi ${selectedItem.name} berhasil dihapus.`);
      } else if (modalTargetModule === 'personel') {
        CourtDB.deletePersonnel(selectedItem.id);
        showToast(`Personel ${selectedItem.nama} berhasil dihapus.`);
      } else if (modalTargetModule === 'berita') {
        CourtDB.deleteNews(selectedItem.id);
        showToast('Berita berhasil dihapus.');
      } else if (modalTargetModule === 'sipp') {
        CourtDB.deleteSIPP(selectedItem.id);
        showToast(`Perkara ${selectedItem.nomorPerkara} berhasil dihapus.`);
      } else if (modalTargetModule === 'jadwal') {
        CourtDB.deleteJadwal(selectedItem.id);
        showToast('Jadwal sidang berhasil dihapus.');
      } else if (modalTargetModule === 'ppid') {
        CourtDB.deleteDIP(selectedItem.id);
        showToast(`Dokumen DIP ${selectedItem.namaInformasi} berhasil dihapus.`);
      } else if ((modalTargetModule as string) === 'sakip') {
        CourtDB.deleteSakipDipaDocument(selectedItem.id);
        showToast(`Dokumen ${selectedItem.judul} berhasil dihapus.`);
      } else if (modalTargetModule === 'eviden') {
        CourtDB.deleteReformasiEviden(selectedItem.id);
        showToast(`Dokumen eviden ${selectedItem.judulDokumen} berhasil dihapus.`);
      } else if (modalTargetModule === 'users') {
        CourtDB.deleteUser(selectedItem.id);
        showToast(`Akun pengguna ${selectedItem.nama} berhasil dihapus.`);
      } else if (modalTargetModule === 'slider') {
        CourtDB.deleteSlide(selectedItem.id);
        showToast(`Slide "${selectedItem.title.substring(0, 30)}..." berhasil dihapus.`);
      } else if (modalTargetModule === 'inovasi') {
        CourtDB.deleteInovasiQuickAccess(selectedItem.id);
        showToast(`Inovasi "${selectedItem.namaAplikasi}" berhasil dihapus.`);
      }
      refreshData();
      setIsModalOpen(false);
      return;
    }

    if (modalTargetModule === 'satker') {
      if (!satkerJabatan || !satkerNamaPejabat) {
        showToast('Jabatan dan Nama Pejabat wajib diisi!', 'error');
        return;
      }
      if (modalType === 'create') {
        CourtDB.addSatkerStructure({
          kelompok: satkerKelompok,
          jabatan: satkerJabatan,
          namaPejabat: satkerNamaPejabat,
          pangkatNip: satkerPangkatNip,
          tugasFungsi: satkerTugasFungsi
        });
        showToast(`Jabatan ${satkerJabatan} berhasil ditambahkan ke Struktur Satker!`);
      } else if (modalType === 'edit' && selectedItem) {
        CourtDB.updateSatkerStructure(selectedItem.id, {
          kelompok: satkerKelompok,
          jabatan: satkerJabatan,
          namaPejabat: satkerNamaPejabat,
          pangkatNip: satkerPangkatNip,
          tugasFungsi: satkerTugasFungsi
        });
        showToast(`Jabatan ${satkerJabatan} berhasil diperbarui!`);
      }
    } else if (modalTargetModule === 'tautan') {
      if (!rwName || !rwUrl) {
        showToast('Nama dan URL tautan resmi wajib diisi!', 'error');
        return;
      }
      if (modalType === 'create') {
        CourtDB.addRelatedWebsite({
          name: rwName,
          url: rwUrl,
          role: rwRole || 'Portal Resmi MA-RI',
          category: rwCategory
        });
        showToast(`Tautan resmi ${rwName} berhasil ditambahkan!`);
      } else if (modalType === 'edit' && selectedItem) {
        CourtDB.updateRelatedWebsite(selectedItem.id, {
          name: rwName,
          url: rwUrl,
          role: rwRole,
          category: rwCategory
        });
        showToast(`Tautan resmi ${rwName} berhasil diperbarui!`);
      }
    } else if (modalTargetModule === 'profil' && selectedItem) {
      CourtDB.updateJurisdictionCourt(selectedItem.code, {
        address: dilmilAddress,
        phone: dilmilPhone
      });
      showToast(`Kontak satker yurisdiksi ${selectedItem.name} berhasil diperbarui!`);
    } else if (modalTargetModule === 'personel') {
      if (!persNama || !persJabatan) {
        showToast('Nama dan Jabatan wajib diisi!', 'error');
        return;
      }
      let finalPhoto = persFotoUrl.trim();
      if (finalPhoto.startsWith('data:')) {
        finalPhoto = await CourtDB.uploadBase64ToServer(finalPhoto, 'personel', 'uploads');
      }

      if (modalType === 'create') {
        CourtDB.addPersonnel({
          nama: persNama.trim(),
          nipNrp: persNipNrp.trim() || '-',
          pangkatGol: persPangkat.trim() || '-',
          jabatan: persJabatan.trim(),
          kategori: persKategori,
          isMutasiMasuk: persIsMutasi,
          matra: persMatra,
          pendidikan: persPendidikan.trim(),
          riwayatSingkat: persRiwayat.trim(),
          fotoUrl: finalPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
        });
        showToast(`Personel baru ${persNama} berhasil ditambahkan ke database!`);
      } else if (modalType === 'edit' && selectedItem) {
        const updatePayload = {
          nama: persNama.trim(),
          nipNrp: persNipNrp.trim() || selectedItem.nipNrp,
          pangkatGol: persPangkat.trim() || selectedItem.pangkatGol,
          jabatan: persJabatan.trim(),
          kategori: persKategori,
          isMutasiMasuk: persIsMutasi,
          matra: persMatra,
          pendidikan: persPendidikan.trim(),
          riwayatSingkat: persRiwayat.trim(),
          fotoUrl: finalPhoto !== '' ? finalPhoto : selectedItem.fotoUrl
        };
        const success = CourtDB.updatePersonnel(selectedItem.id, updatePayload);
        if (success) {
          showToast(`Data personel "${persNama}" berhasil diperbarui dan disimpan ke database!`);
        } else {
          showToast(`Gagal menyimpan perubahan data personel ${persNama}`, 'error');
        }
      }
    } else if (modalTargetModule === 'berita') {
      if (!newsJudul) {
        showToast('Judul berita wajib diisi!', 'error');
        return;
      }
      if (modalType === 'create') {
        CourtDB.addNews({
          judul: newsJudul,
          kategori: newsKategori,
          ringkasan: newsRingkasan || newsJudul,
          penulis: newsPenulis,
          tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          isFeatured: newsIsFeatured,
          gambarUrl: newsGambarUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
        });
        showToast('Berita publikasi baru berhasil diterbitkan!');
      } else if (modalType === 'edit' && selectedItem) {
        CourtDB.updateNews(selectedItem.id, {
          judul: newsJudul,
          kategori: newsKategori,
          ringkasan: newsRingkasan,
          penulis: newsPenulis,
          isFeatured: newsIsFeatured,
          gambarUrl: newsGambarUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
        });
        showToast('Berita publikasi berhasil diperbarui!');
      }
    } else if (modalTargetModule === 'sipp') {
      if (!sippNomor || !sippNamaTerdakwa) {
        showToast('Nomor perkara dan nama terdakwa wajib diisi!', 'error');
        return;
      }
      if (modalType === 'create') {
        CourtDB.addSIPP({
          nomorPerkara: sippNomor,
          nomorRegisterOditurat: `REG-OD/${Date.now().toString().slice(-4)}`,
          jenisPerkara: 'Banding Pidana Militer',
          klasifikasi: sippKlasifikasi,
          tingkatPerkara: 'Banding',
          tanggalDaftar: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          statusPerkara: sippStatus,
          terdakwa: {
            nama: sippNamaTerdakwa,
            pangkat: sippPangkat,
            korps: 'Chk/Inf/Lek',
            nrp: sippNrp,
            kesatuan: sippKesatuan,
            matra: sippMatra
          },
          oditurMiliter: 'Mayor Chk Oditur Militer IV-16',
          majelisHakim: {
            ketua: 'Kolonel Chk Sugeng Aryanto, S.H., M.H.',
            anggota1: 'Kolonel Chk Agus Husin, S.H., M.H.',
            anggota2: 'Kolonel Kum Mustofa, S.H., M.H.'
          },
          paniteraPengganti: 'Kapten Chk Rusjana, S.H.',
          amarPutusan: sippAmar,
          tahapanPerkara: [
            { tanggal: '2026-09-01', agenda: 'Penerimaan Berkas Banding', keterangan: 'Lengkap', selesai: true },
            { tanggal: '2026-09-08', agenda: 'Penetapan Majelis Hakim', keterangan: 'Majelis Hakim A', selesai: true }
          ]
        });
        showToast(`Perkara ${sippNomor} berhasil didaftarkan ke SIPP!`);
      } else if (modalType === 'edit' && selectedItem) {
        CourtDB.updateSIPP(selectedItem.id, {
          nomorPerkara: sippNomor,
          klasifikasi: sippKlasifikasi,
          statusPerkara: sippStatus,
          amarPutusan: sippAmar,
          terdakwa: {
            ...selectedItem.terdakwa,
            nama: sippNamaTerdakwa,
            pangkat: sippPangkat,
            nrp: sippNrp,
            kesatuan: sippKesatuan,
            matra: sippMatra
          }
        });
        showToast(`Data perkara SIPP ${sippNomor} berhasil diperbarui!`);
      }
    } else if (modalTargetModule === 'jadwal') {
      if (!jdwNomorPerkara || !jdwTerdakwa) {
        showToast('Nomor perkara dan nama terdakwa wajib diisi!', 'error');
        return;
      }
      if (modalType === 'create') {
        CourtDB.addJadwal({
          nomorPerkara: jdwNomorPerkara,
          terdakwa: jdwTerdakwa,
          kesatuan: jdwKesatuan,
          tanggal: jdwTanggal,
          waktu: jdwWaktu,
          ruangSidang: jdwRuang,
          agenda: jdwAgenda,
          majelisHakim: 'Majelis Hakim Tingkat Banding A',
          oditur: 'Oditur Militer Tinggi Makassar',
          status: jdwStatus
        });
        showToast('Jadwal sidang baru berhasil ditambahkan!');
      } else if (modalType === 'edit' && selectedItem) {
        CourtDB.updateJadwal(selectedItem.id, {
          nomorPerkara: jdwNomorPerkara,
          terdakwa: jdwTerdakwa,
          kesatuan: jdwKesatuan,
          tanggal: jdwTanggal,
          waktu: jdwWaktu,
          ruangSidang: jdwRuang,
          agenda: jdwAgenda,
          status: jdwStatus
        });
        showToast('Jadwal sidang berhasil diperbarui!');
      }
    } else if (modalTargetModule === 'ppid') {
      if (!dipNamaInformasi) {
        showToast('Nama informasi wajib diisi!', 'error');
        return;
      }
      if (modalType === 'create') {
        CourtDB.addDIP({
          namaInformasi: dipNamaInformasi,
          kategori: dipKategori,
          unitKerja: dipUnitKerja,
          penanggungJawab: dipPenanggungJawab || 'PPID Dilmilti V Makassar',
          ringkasan: dipRingkasan || dipNamaInformasi,
          waktuTempat: '2026 / Makassar',
          bentukTersedia: 'Elektronik (PDF)',
          retensiAktif: '2 Tahun',
          retensiInaktif: '5 Tahun',
          ukuranFile: dipUkuranFile || '1.2 MB (PDF)'
        });
        showToast(`Dokumen DIP PPID ${dipNamaInformasi} berhasil ditambahkan!`);
      } else if (modalType === 'edit' && selectedItem) {
        CourtDB.updateDIP(selectedItem.id, {
          namaInformasi: dipNamaInformasi,
          kategori: dipKategori,
          unitKerja: dipUnitKerja,
          penanggungJawab: dipPenanggungJawab,
          ringkasan: dipRingkasan,
          ukuranFile: dipUkuranFile
        });
        showToast(`Dokumen DIP PPID ${dipNamaInformasi} berhasil diperbarui!`);
      }
    } else if ((modalTargetModule as string) === 'sakip') {
      if (!sakipJudul) {
        showToast('Judul dokumen SAKIP/DIPA/LHKPN wajib diisi!', 'error');
        return;
      }
      if (modalType === 'create') {
        CourtDB.addSakipDipaDocument({
          judul: sakipJudul,
          kategori: sakipKategori,
          subKategori: sakipSubKategori,
          tahun: sakipTahun,
          nomorDokumen: sakipNomor || undefined,
          deskripsi: sakipDeskripsi || undefined,
          fileUrl: sakipFileUrl || undefined,
          fileName: sakipFileName || `${sakipJudul.replace(/[^a-zA-Z0-9]/g, '_')}.${sakipFileType.toLowerCase()}`,
          fileSize: sakipFileSize || '1.5 MB',
          fileType: sakipFileType,
          nilaiAnggaran: sakipNilai || undefined,
          persentaseKepatuhan: sakipKepatuhan || undefined,
          penanggungJawab: sakipPenanggungJawab || 'Subbagian Perencanaan, TI & Pelaporan'
        });
        showToast(`Dokumen SAKIP/DIPA ${sakipJudul} berhasil ditambahkan!`);
      } else if (modalType === 'edit' && selectedItem) {
        CourtDB.updateSakipDipaDocument(selectedItem.id, {
          judul: sakipJudul,
          kategori: sakipKategori,
          subKategori: sakipSubKategori,
          tahun: sakipTahun,
          nomorDokumen: sakipNomor || undefined,
          deskripsi: sakipDeskripsi || undefined,
          fileUrl: sakipFileUrl || undefined,
          fileName: sakipFileName || selectedItem.fileName,
          fileSize: sakipFileSize || selectedItem.fileSize,
          fileType: sakipFileType,
          nilaiAnggaran: sakipNilai || undefined,
          persentaseKepatuhan: sakipKepatuhan || undefined,
          penanggungJawab: sakipPenanggungJawab
        });
        showToast(`Dokumen SAKIP/DIPA ${sakipJudul} berhasil diperbarui!`);
      }
    } else if (modalTargetModule === 'eviden') {
      if (!evidenJudul) {
        showToast('Judul dokumen eviden wajib diisi!', 'error');
        return;
      }
      const areaNames: Record<number, string> = {
        0: 'Dokumen LKE PMPRB & SK Tim Kerja',
        1: 'Area I: Manajemen Perubahan',
        2: 'Area II: Penataan Tatalaksana',
        3: 'Area III: Manajemen SDM Aparatur',
        4: 'Area IV: Penguatan Akuntabilitas',
        5: 'Area V: Penguatan Pengawasan',
        6: 'Area VI: Kualitas Pelayanan Publik'
      };
      const areaName = areaNames[evidenAreaId] || `Area ${evidenAreaId}`;
      const finalFileName = evidenFileName.trim() || `${evidenJudul.replace(/\s+/g, '_').substring(0, 30)}.pdf`;
      const finalFileSize = evidenFileSize.trim() || '1.8 MB';

      if (modalType === 'create') {
        CourtDB.addReformasiEviden({
          areaId: evidenAreaId,
          areaName,
          judulDokumen: evidenJudul,
          nomorSurat: evidenNomor || 'W5-Mil.01/OT.01.1/SK/2026',
          tahun: evidenTahun,
          fileUrl: evidenFileUrl || `https://dilmilti-makassar.go.id/dokumen/zi/${finalFileName}`,
          fileName: finalFileName,
          fileSize: finalFileSize,
          fileType: evidenFileType,
          keterangan: evidenKeterangan || 'Dokumen eviden pendukung pemenuhan LKE Pembangunan Zona Integritas.',
          statusVerifikasi: evidenStatusVerifikasi,
          diuploadOleh: evidenDiuploadOleh || (currentUser ? currentUser.nama : 'Admin Dilmilti V')
        });
        showToast(`Dokumen eviden "${evidenJudul}" berhasil ditambahkan!`);
      } else if (modalType === 'edit' && selectedItem) {
        CourtDB.updateReformasiEviden(selectedItem.id, {
          areaId: evidenAreaId,
          areaName,
          judulDokumen: evidenJudul,
          nomorSurat: evidenNomor,
          tahun: evidenTahun,
          fileUrl: evidenFileUrl || selectedItem.fileUrl,
          fileName: finalFileName,
          fileSize: finalFileSize,
          fileType: evidenFileType,
          keterangan: evidenKeterangan,
          statusVerifikasi: evidenStatusVerifikasi,
          diuploadOleh: evidenDiuploadOleh
        });
        showToast(`Dokumen eviden "${evidenJudul}" berhasil diperbarui!`);
      }
    } else if (modalTargetModule === 'slider') {
      if (!slideTitle || !slideBadge) {
        showToast('Judul slide dan Label Badge wajib diisi!', 'error');
        return;
      }
      if (modalType === 'create') {
        CourtDB.addSlide({
          badge: slideBadge,
          tag: slideTag || 'DILMILTI V MAKASSAR',
          title: slideTitle,
          subtitle: slideSubtitle,
          desc: slideDesc,
          actionText: slideActionText || 'Selengkapnya',
          targetSection: slideTargetSection,
          makassarHighlight: slideMakassarHighlight || 'Makassar, Sulawesi Selatan',
          iconType: slideIconType,
          bgImage: slideBgImage || 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=1200&auto=format&fit=crop&q=80'
        });
        showToast('Slide banner baru berhasil ditambahkan!');
      } else if (modalType === 'edit' && selectedItem) {
        CourtDB.updateSlide(selectedItem.id, {
          badge: slideBadge,
          tag: slideTag,
          title: slideTitle,
          subtitle: slideSubtitle,
          desc: slideDesc,
          actionText: slideActionText,
          targetSection: slideTargetSection,
          makassarHighlight: slideMakassarHighlight,
          iconType: slideIconType,
          bgImage: slideBgImage.trim() !== '' ? slideBgImage.trim() : selectedItem.bgImage
        });
        showToast('Slide banner berhasil diperbarui!');
      }
    } else if (modalTargetModule === 'users') {
      if (!userNama || !userEmail) {
        showToast('Nama dan Email pengguna wajib diisi!', 'error');
        return;
      }
      if (modalType === 'create') {
        const res = CourtDB.createUser({
          nama: userNama,
          email: userEmail,
          password: userPassword || 'dilmilti2026',
          role: userRole,
          nipNrp: userNipNrp,
          instansi: userInstansi || 'Pengadilan Militer Tinggi V Makassar',
          nomorWA: userNomorWa,
          status: userStatus,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
        });
        if (res.success) {
          showToast(`Akun pengguna ${userNama} berhasil dibuat!`);
        } else {
          showToast(res.message, 'error');
          return;
        }
      } else if (modalType === 'edit' && selectedItem) {
        CourtDB.updateUser(selectedItem.id, {
          nama: userNama,
          email: userEmail,
          role: userRole,
          nipNrp: userNipNrp,
          instansi: userInstansi,
          nomorWA: userNomorWa,
          status: userStatus,
          ...(userPassword ? { password: userPassword } : {})
        });
        showToast(`Akun pengguna ${userNama} berhasil diperbarui!`);
      }
    } else if (modalTargetModule === 'inovasi') {
      if (!inNamaAplikasi.trim()) {
        showToast('Nama Aplikasi wajib diisi!', 'error');
        return;
      }
      if (modalType === 'create') {
        CourtDB.addInovasiQuickAccess({
          namaAplikasi: inNamaAplikasi.trim(),
          namaLengkap: inNamaLengkap.trim() || inNamaAplikasi.trim(),
          deskripsi: inDeskripsi.trim(),
          badge: inBadge.trim() || 'INOVASI',
          kategori: inKategori,
          urlTujuan: inUrlTujuan.trim() || '#',
          domainLabel: inDomainLabel.trim() || 'dilmilti5-makassar.go.id',
          instansi: inInstansi.trim() || 'Pengadilan Militer Tinggi V Makassar',
          internalSection: (inInternalSection as any) || undefined,
          internalSubTab: inInternalSubTab.trim() || undefined,
          bukaTabBaru: inBukaTabBaru,
          iconName: inIconName,
          status: inStatus,
          urutan: Number(inUrutan) || 1
        });
        showToast(`Aplikasi Inovasi "${inNamaAplikasi}" berhasil ditambahkan!`);
      } else if (modalType === 'edit' && selectedItem) {
        CourtDB.updateInovasiQuickAccess(selectedItem.id, {
          namaAplikasi: inNamaAplikasi.trim(),
          namaLengkap: inNamaLengkap.trim() || inNamaAplikasi.trim(),
          deskripsi: inDeskripsi.trim(),
          badge: inBadge.trim() || 'INOVASI',
          kategori: inKategori,
          urlTujuan: inUrlTujuan.trim() || '#',
          domainLabel: inDomainLabel.trim() || 'dilmilti5-makassar.go.id',
          instansi: inInstansi.trim() || 'Pengadilan Militer Tinggi V Makassar',
          internalSection: (inInternalSection as any) || undefined,
          internalSubTab: inInternalSubTab.trim() || undefined,
          bukaTabBaru: inBukaTabBaru,
          iconName: inIconName,
          status: inStatus,
          urutan: Number(inUrutan) || 1
        });
        showToast(`Aplikasi Inovasi "${inNamaAplikasi}" berhasil diperbarui!`);
      }
    }

    refreshData();
    setIsModalOpen(false);
  };

  // Central Server Synchronization Handlers
  const [isServerSyncing, setIsServerSyncing] = useState(false);
  const [serverVersionInfo, setServerVersionInfo] = useState<{
    version: number;
    lastUpdated?: string;
    storage?: string;
    mongodbConfigured?: boolean;
    mongodbConnected?: boolean;
    mongodbError?: string | null;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/court-db/version?_t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setServerVersionInfo(data))
      .catch(() => {});
  }, []);

  const handleManualSyncPush = async () => {
    setIsServerSyncing(true);
    try {
      await CourtDB.syncAllToServer();
      await pushAllToFirestore();
      try {
        const res = await fetch(`/api/court-db/version?_t=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        setServerVersionInfo(data);
      } catch {}
      showToast('Seluruh data berhasil dicadangkan dan disinkronkan ke Cloud Firestore & Server!');
    } catch {
      showToast('Gagal sinkronisasi ke cloud', 'error');
    } finally {
      setIsServerSyncing(false);
    }
  };

  const handleManualSyncPull = async () => {
    setIsServerSyncing(true);
    try {
      await hydrateFromFirestore();
      await CourtDB.fetchFromCentralServer(true);
      refreshData();
      try {
        const res = await fetch(`/api/court-db/version?_t=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        setServerVersionInfo(data);
      } catch {}
      showToast('Pembaruan data terbaru berhasil diambil dari Cloud Firestore!');
    } catch {
      showToast('Gagal mengambil data dari cloud', 'error');
    } finally {
      setIsServerSyncing(false);
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const jsonStr = CourtDB.exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dilmilti5_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Cadangan database JSON berhasil diunduh!');
  };

  // Export SQL Dump (.sql file)
  const handleExportSql = () => {
    const sqlStr = CourtDB.exportDatabaseSql();
    const blob = new Blob([sqlStr], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dilmilti5_database_backup_${new Date().toISOString().slice(0, 10)}.sql`;
    a.click();
    showToast('Cadangan database SQL Dump (.sql) berhasil diunduh!');
  };

  // Preview SQL Script Modal
  const handlePreviewSqlModal = () => {
    const sqlStr = CourtDB.exportDatabaseSql();
    setSqlPreviewContent(sqlStr);
    setIsSqlModalOpen(true);
  };

  // Popup Announcement Management Handlers
  const persistPopupChanges = (overrides: Partial<PopupAnnouncementConfig>, toastMessage?: string) => {
    const latestFromDb = CourtDB.getPopupConfig();
    const updated: PopupAnnouncementConfig = {
      ...latestFromDb,
      ...popupConfig,
      isActive: popIsActive,
      title: popTitle.trim() || latestFromDb.title,
      subtitle: popSubtitle,
      badge: popBadge,
      content: popContent.trim() || latestFromDb.content,
      bulletPoints: popBulletPoints.filter(b => b.trim().length > 0),
      imageUrl: popImageUrl !== undefined ? popImageUrl.trim() : (popupConfig.imageUrl || ''),
      buttonText: popButtonText,
      buttonLinkTab: popButtonLinkTab,
      externalLink: popExternalLink,
      showOnlyOncePerSession: popOnlyOnce,
      ...overrides,
      updatedAt: new Date().toISOString()
    };
    const success = CourtDB.savePopupConfig(updated);
    if (success) {
      setPopupConfig(updated);
      if (toastMessage) {
        showToast(toastMessage);
      }
    } else {
      showToast('Gagal menyimpan Pop-up ke database.', 'error');
    }
    return success;
  };

  const handleSavePopupConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!popTitle.trim() || !popContent.trim()) {
      showToast('Judul dan isi pengumuman pop-up wajib diisi!', 'error');
      return;
    }
    persistPopupChanges(
      {
        isActive: popIsActive,
        title: popTitle,
        subtitle: popSubtitle,
        badge: popBadge,
        content: popContent,
        bulletPoints: popBulletPoints.filter(b => b.trim().length > 0),
        imageUrl: popImageUrl !== undefined ? popImageUrl.trim() : popupConfig.imageUrl,
        buttonText: popButtonText,
        buttonLinkTab: popButtonLinkTab,
        externalLink: popExternalLink,
        showOnlyOncePerSession: popOnlyOnce
      },
      'Konfigurasi Pop-up Pengumuman berhasil disimpan ke database!'
    );
  };

  const handleResetPopupConfig = () => {
    if (confirm('Kembalikan konfigurasi pop-up windows ke template resmi standar MA-RI?')) {
      const def = CourtDB.resetPopupConfig();
      setPopupConfig(def);
      setPopIsActive(def.isActive);
      setPopTitle(def.title);
      setPopSubtitle(def.subtitle || '');
      setPopBadge(def.badge || 'MAKLUMAT RESMI');
      setPopContent(def.content);
      setPopBulletPoints(def.bulletPoints || []);
      setPopImageUrl(def.imageUrl || '');
      setPopButtonText(def.buttonText || 'Buka Layanan PTSP Online');
      setPopButtonLinkTab(def.buttonLinkTab || 'layanan');
      setPopExternalLink(def.externalLink || '');
      setPopOnlyOnce(def.showOnlyOncePerSession);
      showToast('Konfigurasi pop-up berhasil direset ke standar resmi!');
    }
  };

  const handlePreviewPopupModal = () => {
    const temp: PopupAnnouncementConfig = {
      ...popupConfig,
      isActive: popIsActive,
      title: popTitle,
      subtitle: popSubtitle,
      badge: popBadge,
      content: popContent,
      bulletPoints: popBulletPoints.filter(b => b.trim().length > 0),
      imageUrl: popImageUrl !== undefined ? popImageUrl.trim() : popupConfig.imageUrl,
      buttonText: popButtonText,
      buttonLinkTab: popButtonLinkTab,
      externalLink: popExternalLink,
      showOnlyOncePerSession: popOnlyOnce,
      updatedAt: new Date().toISOString()
    };
    CourtDB.savePopupConfig(temp);
    setPopupConfig(temp);
    window.dispatchEvent(new CustomEvent('open_popup_announcement_preview'));
    showToast('Membuka simulasi tampilan pop-up...');
  };

  const handleAddBulletPoint = () => {
    if (!newBulletText.trim()) return;
    setPopBulletPoints(prev => [...prev, newBulletText.trim()]);
    setNewBulletText('');
  };

  const handleRemoveBulletPoint = (index: number) => {
    setPopBulletPoints(prev => prev.filter((_, i) => i !== index));
  };

  // WhatsApp Foonte Gateway Handlers
  const handleSaveWhatsAppConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waApiToken.trim()) {
      showToast('Foonte API Token wajib diisi!', 'error');
      return;
    }
    const updated: WhatsAppFoonteConfig = {
      ...waConfig,
      isActive: waIsActive,
      foonteApiToken: waApiToken.trim(),
      senderNumber: waSenderNumber.trim(),
      deviceStatus: waDeviceStatus,
      autoNotifSidangH1: waNotifH1,
      autoNotifStatusPerkara: waNotifSipp,
      autoNotifAmarPutusan: waNotifAmar,
      autoNotifPermohonanPpid: waNotifPpid,
      autoNotifPengaduanSiwas: waNotifSiwas,
      customHeaderTemplate: waHeaderTemplate,
      updatedAt: new Date().toISOString()
    };
    CourtDB.saveWhatsAppConfig(updated, currentUser);
    setWaConfig(updated);
    showToast('Pengaturan Foonte WhatsApp Gateway & Notifikasi Otomatis berhasil disimpan!');
  };

  const handleResetWhatsAppConfig = () => {
    if (confirm('Kembalikan konfigurasi Foonte WhatsApp Gateway ke pengaturan standar pengadilan?')) {
      const def = CourtDB.resetWhatsAppConfig();
      setWaConfig(def);
      setWaIsActive(def.isActive);
      setWaApiToken(def.foonteApiToken);
      setWaSenderNumber(def.senderNumber);
      setWaDeviceStatus(def.deviceStatus);
      setWaNotifH1(def.autoNotifSidangH1);
      setWaNotifSipp(def.autoNotifStatusPerkara);
      setWaNotifAmar(def.autoNotifAmarPutusan);
      setWaNotifPpid(def.autoNotifPermohonanPpid);
      setWaNotifSiwas(def.autoNotifPengaduanSiwas);
      setWaHeaderTemplate(def.customHeaderTemplate);
      showToast('Konfigurasi Foonte WhatsApp direset ke standar awal!');
    }
  };

  const handleCheckDeviceStatus = () => {
    setWaDeviceStatus('Dalam Pengujian');
    setTimeout(() => {
      setWaDeviceStatus('Terhubung');
      showToast('Status Perangkat Foonte terverifikasi: Terhubung & Aktif!');
    }, 700);
  };

  const handleSendTestMessage = async () => {
    if (!testTargetPhone.trim() || !testMessageText.trim()) {
      showToast('Nomor WhatsApp tujuan dan pesan uji coba wajib diisi!', 'error');
      return;
    }
    setIsSendingTest(true);
    setTestLogResponse('⚡ Connecting to https://api.fonnte.com/send ...\nHeaders: Authorization: ' + (waApiToken ? (waApiToken.substring(0, 8) + '...') : 'Token_Required'));

    const isMockToken = !waApiToken || waApiToken === 'f3k8_Foonte_Token_DILMILTI5_2026_xYz987';

    if (isMockToken) {
      setTimeout(() => {
        const formattedPhone = testTargetPhone.trim();
        const resPayload = {
          status: true,
          target: [formattedPhone],
          message: 'Pesan berhasil diproses oleh Fonnte Gateway (SIMULASI)',
          detail: {
            id: `ft-msg-${Date.now().toString().slice(-6)}`,
            device_sender: waSenderNumber || '081245678900',
            provider: 'Fonnte Official API Gateway (v4.2)',
            quota_remaining: 4850,
            timestamp: new Date().toLocaleString('id-ID')
          }
        };
        setTestLogResponse(JSON.stringify(resPayload, null, 2) + "\n\n⚠️ Catatan: Anda menggunakan token simulasi bawaan. Untuk mengirim pesan sungguhan ke WhatsApp, silakan ganti dengan API Token Fonnte asli Anda.");
        setIsSendingTest(false);
        showToast(`[SIMULASI] Pesan uji coba sukses dikirim ke ${formattedPhone}!`);
      }, 1000);
      return;
    }

    const res = await sendWhatsAppMessage(testTargetPhone, testMessageText);
    setIsSendingTest(false);
    
    if (res.success) {
      if (res.provider === 'Fonnte API') {
        setTestLogResponse(JSON.stringify(res.payload, null, 2));
        showToast(`Pesan sukses dikirim via Fonnte Gateway ke ${testTargetPhone}!`, 'success');
      } else {
        setTestLogResponse(`⚡ Dialihkan ke WhatsApp Web/App Link:\n\n${res.message}`);
        showToast(`Dialihkan ke WhatsApp untuk pengiriman ke ${testTargetPhone}!`);
      }
    } else {
      if (res.payload) {
        setTestLogResponse(JSON.stringify(res.payload, null, 2) + `\n\n❌ GAGAL: ${res.message}`);
      } else {
        setTestLogResponse(`❌ [ERROR] ${res.message}\n\nSilakan periksa koneksi jaringan atau kevalidan Fonnte Token Anda.`);
      }
      showToast(`Gagal mengirim via Fonnte: ${res.message}`, 'error');
    }
  };

  // Restore File Import Handler (.JSON or .SQL)
  const handleImportRestoreFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreJsonContent) {
      showToast('Silakan pilih atau unggah berkas cadangan (.sql atau .json) terlebih dahulu!', 'error');
      return;
    }
    const res = CourtDB.importRestoreDatabaseFile(restoreJsonContent, restoreFileName);
    if (res.success) {
      refreshData();
      showToast(res.message, 'success');
      setRestoreJsonContent('');
      setRestoreFileName('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRestoreFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setRestoreJsonContent(content);
      };
      reader.readAsText(file);
    }
  };

  // Reset to Factory Defaults
  const handleResetDefaults = () => {
    if (confirm('Apakah Anda yakin ingin memulihkan seluruh basis data ke data resmi awal (Personel PDF, SIPP awal, Berita resmi)? Tindakan ini akan mengembalikan data ke status asli.')) {
      CourtDB.resetToFactoryDefaults();
      refreshData();
      showToast('Database berhasil dipulihkan ke Personel resmi & data awal!');
    }
  };

  // Filtered Personnel
  const filteredPersonnel = personnelList.filter(p => {
    const matchesSearch = 
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nipNrp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.jabatan.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (categoryFilter === 'ALL') return matchesSearch;
    if (categoryFilter === 'MUTASI') return matchesSearch && p.isMutasiMasuk;
    return matchesSearch && p.kategori === categoryFilter;
  });

  // Filtered Eviden Reformasi Birokrasi
  const filteredEviden = evidenList.filter(e => {
    const matchesSearch = 
      e.judulDokumen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.nomorSurat && e.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.keterangan && e.keterangan.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.areaName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (evidenAreaFilter === 'ALL') return matchesSearch;
    return matchesSearch && e.areaId === evidenAreaFilter;
  });

  if (!isStaffUser(currentUser)) {
    return (
      <div id="admin-access-restricted" className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Akses Khusus Aparatur Pengadilan
            </span>
            <h2 className="text-xl font-black text-white">
              Pusat Kendali & CRUD Terbatas
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Halaman ini dikhususkan bagi aparatur, hakim, panitera, dan staf pengelola Pengadilan Militer Tinggi V Makassar. Pengunjung publik dapat mengakses layanan mandiri melalui beranda website resmi.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              id="btn-login-aparatur-restricted"
              onClick={onOpenAuth}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Lock className="w-4 h-4" />
              <span>Login Sebagai Aparatur / Petugas</span>
            </button>
            <button
              type="button"
              id="btn-back-to-public-website"
              onClick={onBackToHome}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Website Publik</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-management-portal" className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* Top Futuristic Cyber-Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0A2619] to-slate-950 border-b border-emerald-500/20 px-4 py-3 sticky top-0 z-40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Lihat Website Publik</span>
            </button>

            <div className="h-4 w-px bg-slate-700"></div>

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                CORE SYSTEM DILMILTI V MAKASSAR
              </span>
              <SyncStatusIndicator variant="badge" onToast={showToast} />
              <button
                type="button"
                onClick={() => setIsSyncInfoModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white text-[10px] font-bold border border-emerald-500/40 cursor-pointer transition-all shadow-xs"
                title="Klik untuk membuka Pengaturan & Status Sinkronisasi Lintas Perangkat"
              >
                <span>Atur Sync</span>
              </button>
            </div>
          </div>

          {/* User Session Info */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-end">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{currentUser.nama}</span>
                  </div>
                  <div className="text-[10px] font-mono text-amber-300 uppercase">
                    Role: {ROLE_CONFIGS[currentUser.role]?.name || currentUser.role.replace('_', ' ')}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-400/60 shadow-xs">
                  <img 
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} 
                    alt="User Avatar"
                    className="w-full h-full object-cover" 
                  />
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Keluar / Logout Sesi"
                  className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 hover:text-white transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Masuk Akun Aparatur</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* HUD Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#062416] via-[#0A3D24] to-[#041C11] border border-emerald-500/30 p-6 sm:p-7 shadow-2xl">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-400 text-slate-950 shadow-xs">
                  PUSAT KENDALI DATABASE & KONTEN
                </span>
                <span className="text-xs text-emerald-300/80 font-mono">
                  v2.6 • Live Database Persistence
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                Panel Administrasi & Pengelolaan Pengadilan Militer Tinggi V Makassar
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-1.5 max-w-3xl leading-relaxed">
                Platform terpusat untuk mengelola Personel resmi MA-RI, perkara register SIPP, jadwal sidang ruang Kartika/Cakra, artikel humas, PPID, serta otentikasi pengelola sesuai PERMA No. 1 Tahun 2017.
              </p>
            </div>

            {/* Fast Action Buttons with RBAC guard */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {(canUserPerform(currentUser, 'database', 'edit') || currentUser?.role === 'super_admin') && (
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Export DB (JSON)</span>
                </button>
              )}

              {currentUser?.role === 'super_admin' && (
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Data Pabrik</span>
                </button>
              )}
            </div>
          </div>

          {/* Telemetry Gauge Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-emerald-500/20">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-500/20">
              <div className="text-[10px] text-emerald-400 font-mono uppercase">Total Personel</div>
              <div className="text-xl font-black text-white mt-0.5">{personnelList.length} Pegawai</div>
              <div className="text-[9px] text-amber-300">Sesuai SK Resmi PDF</div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-500/20">
              <div className="text-[10px] text-emerald-400 font-mono uppercase">Perkara SIPP</div>
              <div className="text-xl font-black text-white mt-0.5">{sippList.length} Perkara</div>
              <div className="text-[9px] text-emerald-300">Tingkat Banding & Pamen</div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-500/20">
              <div className="text-[10px] text-emerald-400 font-mono uppercase">Jadwal Sidang</div>
              <div className="text-xl font-black text-white mt-0.5">{jadwalList.length} Agenda</div>
              <div className="text-[9px] text-sky-300">Ruang Kartika & Cakra</div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-500/20">
              <div className="text-[10px] text-emerald-400 font-mono uppercase">Berita & Publikasi</div>
              <div className="text-xl font-black text-white mt-0.5">{newsList.length} Artikel</div>
              <div className="text-[9px] text-purple-300">Portal Humas Aktif</div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-500/20">
              <div className="text-[10px] text-emerald-400 font-mono uppercase">Dokumen PPID/DIP</div>
              <div className="text-xl font-black text-white mt-0.5">{dipList.length} Dokumen</div>
              <div className="text-[9px] text-amber-300">Keterbukaan Informasi</div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-500/20">
              <div className="text-[10px] text-emerald-400 font-mono uppercase">Eviden ZI (WBBM)</div>
              <div className="text-xl font-black text-white mt-0.5">{evidenList.length} Berkas</div>
              <div className="text-[9px] text-amber-300">PermenPAN-RB 90/2021</div>
            </div>
          </div>
        </div>

        {/* Real-time Sync Status Indicator */}
        <SyncStatusIndicator variant="card" onToast={showToast} />

        {/* Quick CRUD Launcher & Dynamic Menu Manager */}
        <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-5 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Sliders className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                    PUSAT NAVIGASI CRUD MENU
                  </span>
                  <span className="text-xs text-amber-300 font-mono">
                    {allMenuContents.length} Menu & Sub-Menu Navigasi Website
                  </span>
                </div>
                <h2 className="text-base font-black text-white tracking-tight mt-0.5">
                  Pusat Pengelolaan & Pengeditan Isi Konten Menu Website
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  const newId = `cmenu-${Date.now()}`;
                  handleOpenMenuEdit(newId, 'Menu / Sub-Menu Baru');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-md flex items-center gap-1.5 border border-amber-300"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Menu / Sub-Menu Baru</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMenuQuickLaunchOpen(!isMenuQuickLaunchOpen)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 transition-all cursor-pointer border border-slate-700 flex items-center gap-1.5"
              >
                <span>{isMenuQuickLaunchOpen ? 'Sembunyikan Panel' : 'Tampilkan Panel Edit Menu'}</span>
              </button>
            </div>
          </div>

          {isMenuQuickLaunchOpen && (
            <div className="space-y-4">
              {/* Group Category Tabs */}
              <div className="flex flex-wrap gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedMenuCategory('tentang')}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedMenuCategory === 'tentang'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Tentang ({allMenuContents.filter(m => m.kategori === 'tentang').length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMenuCategory('layanan')}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedMenuCategory === 'layanan'
                      ? 'bg-emerald-400 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Layanan Publik ({allMenuContents.filter(m => m.kategori === 'layanan').length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMenuCategory('hukum')}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedMenuCategory === 'hukum'
                      ? 'bg-sky-400 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>Layanan Hukum ({allMenuContents.filter(m => m.kategori === 'hukum').length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMenuCategory('informasi')}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedMenuCategory === 'informasi'
                      ? 'bg-purple-400 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>PPID ({allMenuContents.filter(m => m.kategori === 'informasi' || m.id.startsWith('ppid')).length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMenuCategory('kustom')}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedMenuCategory === 'kustom'
                      ? 'bg-rose-400 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Menu Kustom ({allMenuContents.filter(m => m.isCustomCreated).length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMenuCategory('semua')}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedMenuCategory === 'semua'
                      ? 'bg-slate-200 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Semua Menu ({allMenuContents.length})</span>
                </button>
              </div>

              {/* Grid of Dynamic Menu Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {allMenuContents
                  .filter((item) => {
                    if (selectedMenuCategory === 'semua') return true;
                    if (selectedMenuCategory === 'kustom') return item.isCustomCreated;
                    if (selectedMenuCategory === 'informasi') return item.kategori === 'informasi' || item.id.startsWith('ppid');
                    return item.kategori === selectedMenuCategory;
                  })
                  .map((item) => (
                    <div key={item.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono text-amber-300 font-bold uppercase truncate">
                            {item.kategori === 'tentang' ? 'Tentang Pengadilan' :
                             item.kategori === 'layanan' ? 'Layanan Publik' :
                             item.kategori === 'hukum' ? 'Layanan Hukum' :
                             item.kategori === 'informasi' ? 'PPID & Informasi' : 'Menu Kustom'}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            {item.isCustomCreated ? (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400 text-slate-950 border border-amber-300">
                                KUSTOM
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                SK 593/2026
                              </span>
                            )}
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              item.status === 'Draft' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {item.status || 'Aktif'}
                            </span>
                          </div>
                        </div>
                        <h4 className="text-xs font-black text-white mt-1.5 line-clamp-1">{item.judul}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                          {item.subJudul || item.kontenUtama || item.dasarHukum}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-900">
                        <button
                          type="button"
                          onClick={() => handleOpenMenuEdit(item.id, item.judul)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Isi</span>
                        </button>
                        {item.isCustomCreated && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomMenu(item.id, item.judul)}
                            className="py-1.5 px-2 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center cursor-pointer border border-rose-500/30"
                            title="Hapus Menu Kustom"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onNavigateToSection && (
                          <button
                            type="button"
                            onClick={() => {
                              const targetSec = item.targetSection || item.kategori || 'publik';
                              onNavigateToSection(targetSec, item.targetSubTab);
                            }}
                            className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                            title="Lihat Tampilan Langsung di Website"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Lihat</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Navigation Tabs Bar (Filtered by Role Permissions) */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-emerald-500/20 shadow-md">
          {allowedTabs.includes('telemetri') && (
            <button
              type="button"
              onClick={() => setActiveTab('telemetri')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'telemetri'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Telemetri & Log</span>
            </button>
          )}

          {allowedTabs.includes('whatsapp') && (
            <button
              type="button"
              id="admin-tab-whatsapp-btn"
              onClick={() => setActiveTab('whatsapp')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'whatsapp'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black ring-2 ring-emerald-300'
                  : 'text-emerald-300 hover:text-white hover:bg-slate-800 border border-emerald-500/30'
              }`}
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Notifikasi WA (Foonte)</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${waIsActive ? 'bg-emerald-500/30 text-emerald-300' : 'bg-rose-500/30 text-rose-300'}`}>
                {waIsActive ? 'AKTIF' : 'OFF'}
              </span>
            </button>
          )}

          {allowedTabs.includes('personel') && (
            <button
              type="button"
              onClick={() => setActiveTab('personel')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'personel'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Personel DILMILTI V</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/50 text-[10px] font-mono text-amber-300">
                {personnelList.length}
              </span>
            </button>
          )}

          {allowedTabs.includes('satker') && (
            <button
              type="button"
              onClick={() => setActiveTab('satker')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'satker'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Struktur Satker (PERMA 1/2017)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/50 text-[10px] font-mono text-amber-300">
                {satkerList.length}
              </span>
            </button>
          )}

          {allowedTabs.includes('tautan') && (
            <button
              type="button"
              onClick={() => setActiveTab('tautan')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tautan'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Tautan Situs Resmi MA</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/50 text-[10px] font-mono text-sky-300">
                {relatedWebsitesList.length}
              </span>
            </button>
          )}

          {allowedTabs.includes('profil') && (
            <button
              type="button"
              onClick={() => setActiveTab('profil')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'profil'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Profil & Kontak Satker</span>
            </button>
          )}

          {allowedTabs.includes('sipp') && (
            <button
              type="button"
              onClick={() => setActiveTab('sipp')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sipp'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Perkara SIPP</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/50 text-[10px] font-mono text-emerald-300">
                {sippList.length}
              </span>
            </button>
          )}

          {allowedTabs.includes('jadwal') && (
            <button
              type="button"
              onClick={() => setActiveTab('jadwal')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'jadwal'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwal Sidang</span>
            </button>
          )}

          {allowedTabs.includes('berita') && (
            <button
              type="button"
              onClick={() => setActiveTab('berita')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'berita'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Berita & Publikasi</span>
            </button>
          )}

          {allowedTabs.includes('ppid') && (
            <button
              type="button"
              onClick={() => setActiveTab('ppid')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ppid'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>PPID & Regulasi</span>
            </button>
          )}

          {allowedTabs.includes('eviden') && (
            <button
              type="button"
              onClick={() => setActiveTab('eviden')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'eviden'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Eviden ZI (WBBM)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/50 text-[10px] font-mono text-amber-300">
                {evidenList.length}
              </span>
            </button>
          )}

          {allowedTabs.includes('popup') && (
            <button
              type="button"
              onClick={() => setActiveTab('popup')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'popup'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Pop-up Pengumuman</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${popIsActive ? 'bg-emerald-500/30 text-emerald-300' : 'bg-rose-500/30 text-rose-300'}`}>
                {popIsActive ? 'ON' : 'OFF'}
              </span>
            </button>
          )}

          {allowedTabs.includes('slider') && (
            <button
              type="button"
              onClick={() => setActiveTab('slider')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'slider'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Slider Banner</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/50 text-[10px] font-mono text-amber-300">
                {slidesList.length}
              </span>
            </button>
          )}

          {allowedTabs.includes('inovasi') && (
            <button
              type="button"
              id="admin-tab-inovasi-btn"
              onClick={() => setActiveTab('inovasi')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'inovasi'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-300'
                  : 'text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-500/30'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Inovasi Layanan Publik</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/50 text-[10px] font-mono text-amber-300">
                {inovasiList.length}
              </span>
            </button>
          )}

          {allowedTabs.includes('users') && (
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Pengguna & Hak Akses</span>
            </button>
          )}

          {allowedTabs.includes('ecourt') && (
            <button
              type="button"
              onClick={() => setActiveTab('ecourt')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ecourt'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-black ring-2 ring-blue-300'
                  : 'text-blue-300 hover:text-white hover:bg-slate-800 border border-blue-500/30'
              }`}
            >
              <Laptop className="w-4 h-4 text-blue-300" />
              <span>CRUD e-Court Perkara</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-200">
                CRUD
              </span>
            </button>
          )}

          {allowedTabs.includes('database') && (
            <button
              type="button"
              onClick={() => setActiveTab('database')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-300'
                  : 'text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-500/30'
              }`}
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>Backup & Restore Aplikasi</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-[10px] font-bold text-amber-300">
                Admin
              </span>
            </button>
          )}
        </div>

        {/* TOAST NOTIFICATION */}
        {toastMsg && (
          <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-top duration-300 shadow-xl border ${
            toastMsg.type === 'success' 
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/60' 
              : 'bg-red-950/90 text-red-200 border-red-500/60'
          }`}>
            {toastMsg.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />}
            <span>{toastMsg.text}</span>
          </div>
        )}

        {/* TAB: PENGATURAN WHATSAPP FOONTE GATEWAY & NOTIFIKASI OTOMATIS */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header Banner */}
            <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/30 p-5 sm:p-6 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        FOONTE WHATSAPP GATEWAY INTEGRATION
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
                        waDeviceStatus === 'Terhubung' 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${waDeviceStatus === 'Terhubung' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                        <span>Perangkat: {waDeviceStatus}</span>
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-white tracking-tight">
                      Pengaturan WhatsApp Notifikasi (Foonte API)
                    </h2>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      Atur Foonte API Token, nomor WhatsApp pengirim resmi, sakelar notifikasi otomatis untuk panggilan sidang H-1, pembaruan SIPP, PPID, serta lakukan pengujian kirim pesan langsung.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCheckDeviceStatus}
                    className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Cek Perangkat Foonte</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Foonte Credentials & Configuration Form (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Credentials Card */}
                <form onSubmit={handleSaveWhatsAppConfig} className="bg-slate-900/90 rounded-2xl border border-emerald-500/20 p-5 sm:p-6 space-y-5 shadow-lg">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span>Kredensial Akun Foonte API & Pengirim</span>
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">api.foonte.com v4.2</span>
                  </div>

                  {/* Master Switch Activation */}
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Status Layanan WhatsApp Notifikasi</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${waIsActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                          {waIsActive ? 'AKTIF' : 'NONAKTIF'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Aktifkan untuk mengizinkan sistem mengirimkan notifikasi otomatis ke Oditur, Advokat & Pihak Perkara.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setWaIsActive(!waIsActive)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        waIsActive ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        waIsActive ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Foonte API Token Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Foonte API Token <span className="text-rose-400">*</span></span>
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{showToken ? 'Sembunyikan Token' : 'Tampilkan Token'}</span>
                      </button>
                    </label>
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={waApiToken}
                      onChange={(e) => setWaApiToken(e.target.value)}
                      placeholder="Masukkan Foonte API Token Anda (e.g. f3k8_Foonte_Token_...)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-400 font-mono"
                      required
                    />
                    <p className="text-[10px] text-slate-400">
                      Token diperoleh dari Dashboard Foonte (https://foonte.com). Disimpan aman di database lokal aplikasi.
                    </p>
                  </div>

                  {/* Sender Number / Device ID Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Nomor Pengirim / Perangkat Terhubung (Foonte Device)
                    </label>
                    <input
                      type="text"
                      value={waSenderNumber}
                      onChange={(e) => setWaSenderNumber(e.target.value)}
                      placeholder="081245678900 (Pengadilan Militer Tinggi V Makassar)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-400 font-mono"
                    />
                  </div>

                  {/* Header Template Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Header / Awalan Pesan Otomatis Standard
                    </label>
                    <input
                      type="text"
                      value={waHeaderTemplate}
                      onChange={(e) => setWaHeaderTemplate(e.target.value)}
                      placeholder="*[PENGADILAN MILITER TINGGI V MAKASSAR - NOTIFIKASI OTOMATIS]*"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-400 font-mono"
                    />
                  </div>

                  {/* Auto Notification Toggles */}
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Skenario Trigger Notifikasi Otomatis</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Trigger 1: Sidang H-1 */}
                      <label className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all">
                        <div className="pr-2">
                          <div className="font-bold text-white">Notifikasi Pengingat Jadwal Sidang H-1</div>
                          <div className="text-[10px] text-slate-400">Kirim WhatsApp pengingat H-1 persidangan di Ruang Kartika/Cakra ke Oditur & Kuasa Hukum.</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={waNotifH1}
                          onChange={(e) => setWaNotifH1(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                        />
                      </label>

                      {/* Trigger 2: Status SIPP */}
                      <label className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all">
                        <div className="pr-2">
                          <div className="font-bold text-white">Notifikasi Perubahan Status Perkara SIPP</div>
                          <div className="text-[10px] text-slate-400">Kirim pemberitahuan saat ada register perkara baru, penetapan majelis, atau tahapan sidang di SIPP.</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={waNotifSipp}
                          onChange={(e) => setWaNotifSipp(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                        />
                      </label>

                      {/* Trigger 3: Amar Putusan */}
                      <label className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all">
                        <div className="pr-2">
                          <div className="font-bold text-white">Notifikasi Amar Putusan Banding</div>
                          <div className="text-[10px] text-slate-400">Kirim salinan ringkasan amar putusan perkara begitu diminutasi oleh Panitera Pengganti.</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={waNotifAmar}
                          onChange={(e) => setWaNotifAmar(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                        />
                      </label>

                      {/* Trigger 4: PPID */}
                      <label className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all">
                        <div className="pr-2">
                          <div className="font-bold text-white">Notifikasi Permohonan PPID / PTSP Baru</div>
                          <div className="text-[10px] text-slate-400">Beritahukan Petugas PTSP saat ada permohonan informasi publik atau tiket layanan online masuk.</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={waNotifPpid}
                          onChange={(e) => setWaNotifPpid(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                        />
                      </label>

                      {/* Trigger 5: SIWAS */}
                      <label className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all">
                        <div className="pr-2">
                          <div className="font-bold text-white">Notifikasi Pengaduan SIWAS / Pelanggaran</div>
                          <div className="text-[10px] text-slate-400">Beritahukan Tim Pengawasan internal saat ada laporan pengaduan masyarakat masuk.</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={waNotifSiwas}
                          onChange={(e) => setWaNotifSiwas(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={handleResetWhatsAppConfig}
                      className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      Reset Standard
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-slate-950" />
                      <span>Simpan Pengaturan Foonte</span>
                    </button>
                  </div>
                </form>

              </div>

              {/* Right Side: WhatsApp Foonte API Test Generator (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/20 p-5 sm:p-6 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Send className="w-4 h-4 text-emerald-400" />
                      <span>Simulator Uji Coba Kirim WA via Foonte</span>
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">API TESTER</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Uji coba langsung pengiriman pesan WhatsApp menggunakan token Foonte yang terkonfigurasi.
                  </p>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Nomor WhatsApp Tujuan</label>
                      <input
                        type="text"
                        value={testTargetPhone}
                        onChange={(e) => setTestTargetPhone(e.target.value)}
                        placeholder="e.g. 081234567890"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Template Preset Pesan Contoh</label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <button
                          type="button"
                          onClick={() => setTestMessageText(`${waHeaderTemplate}\n\nYth. Oditur / Kuasa Hukum,\nPemberitahuan Sidang Perkara No. 24-K/PMT.V/BDG/AD/VIII/2026 dijadwalkan besok:\n📅 Tanggal: Besok, 09.00 WITA\n⚖️ Ruang: Ruang Sidang Utama Kartika\nMohon hadir tepat waktu. Terima Kasih.`)}
                          className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-amber-300 border border-amber-500/30 cursor-pointer"
                        >
                          + Sidang H-1
                        </button>
                        <button
                          type="button"
                          onClick={() => setTestMessageText(`${waHeaderTemplate}\n\nYth. Pemohon Perkara,\nStatus Perkara No. 12-K/PMT.V/BDG/AL/VII/2026 telah diperbarui di SIPP Dilmilti V Makassar:\n📌 Status: Musyawarah Majelis Hakim / Minutasi Putusan.`)}
                          className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-emerald-300 border border-emerald-500/30 cursor-pointer"
                        >
                          + Status SIPP
                        </button>
                        <button
                          type="button"
                          onClick={() => setTestMessageText(`${waHeaderTemplate}\n\nYth. Pemohon PPID,\nTiket Layanan Informasi No. #PPID-2026-089 telah disetujui. Dokumen Salinan Putusan dapat diunduh melalui portal PTSP Online.`)}
                          className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-sky-300 border border-sky-500/30 cursor-pointer"
                        >
                          + Notif PPID
                        </button>
                      </div>

                      <textarea
                        rows={5}
                        value={testMessageText}
                        onChange={(e) => setTestMessageText(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-400 font-mono leading-relaxed"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSendTestMessage}
                      disabled={isSendingTest}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      {isSendingTest ? (
                        <>
                          <RefreshCw className="w-4 h-4 text-slate-950 animate-spin" />
                          <span>Menghubungi Foonte API...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-slate-950" />
                          <span>Kirim Pesan Uji Coba (Foonte API)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Response Log Console Box */}
                  {testLogResponse && (
                    <div className="space-y-1.5 pt-3 border-t border-slate-800">
                      <div className="text-[10px] font-mono text-emerald-400 font-bold flex items-center justify-between">
                        <span>Foonte HTTP API Response Payload:</span>
                        <span className="text-slate-500">200 OK</span>
                      </div>
                      <pre className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-48 whitespace-pre-wrap leading-tight">
                        {testLogResponse}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Information Card */}
                <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 space-y-2 text-xs">
                  <div className="font-extrabold text-amber-300 flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-400" />
                    <span>Petunjuk Dokumentasi Foonte API</span>
                  </div>
                  <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                    Foonte adalah penyedia layanan WhatsApp Gateway untuk instansi pemerintah dan swasta di Indonesia. Pastikan nomor pengirim terhubung dengan scan QR Code di menu Foonte Dashboard.
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 1: TELEMETRI & LOG AUDIT */}
        {activeTab === 'telemetri' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Organization Summary from PERMA 1/2017 */}
              <div className="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-emerald-500/20 p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Struktur Satker Berdasarkan PERMA RI No. 1 Tahun 2017</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    Makassar • Sulawesi Selatan
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Peraturan Mahkamah Agung RI No. 1 Tahun 2017 tentang Perubahan Atas PERMA No. 7 Tahun 2015 mengatur bahwa Pengadilan Militer Tinggi V Makassar terdiri dari:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-emerald-400" />
                      <span>Kepaniteraan (Teknis Perkara)</span>
                    </div>
                    <ul className="text-[11px] text-slate-400 space-y-0.5 pl-2 list-disc list-inside">
                      <li>Panitera (Kolonel Kum M. Nirwan Said, S.H., M.H.)</li>
                      <li>Panmud Pidana (Mayor Chk Mahpul Saepuloh, S.H.)</li>
                      <li>Panitera Pengganti (Kapten Chk Rusjana, S.H.)</li>
                      <li>Pengelolaan Register SIPP & Minutasi Perkara Banding</li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-extrabold text-sky-300 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-sky-400" />
                      <span>Kesekretariatan (Non-Teknis & Operasional)</span>
                    </div>
                    <ul className="text-[11px] text-slate-400 space-y-0.5 pl-2 list-disc list-inside">
                      <li>Bagian Perencanaan & Kepegawaian (M. Arfah Afendi)</li>
                      <li>Bagian Umum & Keuangan (Herna Dian P. Napan)</li>
                      <li>Subbag TU & Rumah Tangga (Andi Adzan Mirzan)</li>
                      <li>Subbag Rencana Program & Anggaran (M. Imam S)</li>
                      <li>Subbag Keuangan & Pelaporan (Allen Farlianso)</li>
                      <li>Subbag Kepegawaian & TI (Afni Syafaatun)</li>
                    </ul>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-200 flex items-center justify-between">
                  <span>📍 Lokasi Kantor: Jl. Perintis Kemerdekaan KM. 13, Daya, Biringkanaya, Makassar 90243</span>
                  <span className="font-bold text-amber-300">Status WBK/WBBM: Menuju WBBM</span>
                </div>
              </div>

              {/* Right Column: Live Audit Logs */}
              <div className="bg-slate-900/80 rounded-2xl border border-emerald-500/20 p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Log Aktivitas Sistem (Audit Trail)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">{auditLogs.length} logs</span>
                </div>

                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-amber-300">{log.userName}</span>
                        <span className="text-slate-500 font-mono">{log.timestamp}</span>
                      </div>
                      <div className="text-slate-300 leading-snug">{log.details}</div>
                      <div className="flex items-center gap-1.5 text-[9px]">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono">
                          {log.action}
                        </span>
                        <span className="text-slate-500">{log.module}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: CRUD PERSONEL DILMILTI V MAKASSAR */}
        {activeTab === 'personel' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Header & Action bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari Personel / NIP / NRP / Jabatan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-400 w-56 sm:w-64"
                  />
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-emerald-400"
                  >
                    <option value="ALL">Semua Kategori ({personnelList.length} Personel)</option>
                    <option value="Pimpinan">Pimpinan</option>
                    <option value="Hakim Militer Tinggi">Hakim Militer Tinggi</option>
                    <option value="Kepaniteraan">Kepaniteraan</option>
                    <option value="Kesekretariatan">Kesekretariatan</option>
                    <option value="MUTASI">Status Mutasi Masuk</option>
                  </select>
                </div>
              </div>

              {canUserPerform(currentUser, 'personel', 'create') && (
                <button
                  type="button"
                  onClick={() => openCreateModal('personel')}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Data Personel</span>
                </button>
              )}
            </div>

            {/* Table / List */}
            <div className="bg-slate-900/80 rounded-2xl border border-emerald-500/20 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/90 text-emerald-400 border-b border-emerald-500/20 text-[11px] font-mono uppercase">
                    <tr>
                      <th className="py-3 px-3 text-center">No</th>
                      <th className="py-3 px-3">Foto & Nama Lengkap</th>
                      <th className="py-3 px-3">NRP / NIP</th>
                      <th className="py-3 px-3">Pangkat / Golongan</th>
                      <th className="py-3 px-3">Jabatan Resmi</th>
                      <th className="py-3 px-3">Kategori</th>
                      <th className="py-3 px-3">Status Mutasi</th>
                      <th className="py-3 px-3 text-center">Aksi (CRUD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredPersonnel.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-3 text-center font-mono text-slate-400">{p.no || idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="relative group/foto shrink-0">
                              <img
                                src={getFreshImageUrl(p.fotoUrl)}
                                alt={p.nama}
                                onError={(e) => handleImageFallback(e, DEFAULT_OFFICIAL_AVATAR)}
                                loading="lazy"
                                decoding="async"
                                className="w-9 h-11 rounded-lg object-cover border border-emerald-500/30"
                              />
                              {canUserPerform(currentUser, 'personel', 'edit') && (
                                <button
                                  type="button"
                                  onClick={() => openEditModal('personel', p)}
                                  title="Ganti Foto"
                                  className="absolute -bottom-1 -right-1 p-0.5 rounded bg-emerald-700 hover:bg-emerald-500 text-white shadow-xs"
                                >
                                  <Camera className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                            <div>
                              <div className="font-extrabold text-white">{p.nama}</div>
                              <div className="text-[10px] text-slate-400">{p.matra || 'ASN MA-RI'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-amber-300">{p.nipNrp}</td>
                        <td className="py-3 px-3 text-slate-300">{p.pangkatGol}</td>
                        <td className="py-3 px-3 font-semibold text-emerald-300">{p.jabatan}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.kategori === 'Pimpinan' ? 'bg-amber-400 text-slate-950' :
                            p.kategori === 'Hakim Militer Tinggi' ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40' :
                            p.kategori === 'Kepaniteraan' ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40' :
                            'bg-sky-900/60 text-sky-200 border border-sky-500/40'
                          }`}>
                            {p.kategori}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {p.isMutasiMasuk ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                              Mutasi Masuk
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">Organik</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {canUserPerform(currentUser, 'personel', 'edit') && (
                              <button
                                type="button"
                                onClick={() => openEditModal('personel', p)}
                                title="Edit / Ganti Foto Pegawai"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 transition-colors cursor-pointer border border-slate-700"
                              >
                                <Camera className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {canUserPerform(currentUser, 'personel', 'edit') && (
                              <button
                                type="button"
                                onClick={() => openEditModal('personel', p)}
                                title="Edit Data Personel"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer border border-slate-700"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {canUserPerform(currentUser, 'personel', 'delete') && (
                              <button
                                type="button"
                                onClick={() => openDeleteModal('personel', p)}
                                title="Hapus Personel"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-red-400 transition-colors cursor-pointer border border-slate-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {!canUserPerform(currentUser, 'personel', 'edit') && !canUserPerform(currentUser, 'personel', 'delete') && (
                              <span className="text-[10px] text-slate-500 font-mono">Lihat Saja</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CRUD STRUKTUR SATKER PERMA 1/2017 */}
        {activeTab === 'satker' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Struktur Satker Sesuai PERMA RI No. 1 Tahun 2017</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Unit Kepaniteraan (Teknis Peradilan Militer) & Kesekretariatan (Dukungan Administrasi & Finansial).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canUserPerform(currentUser, 'satker', 'delete') && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Kembalikan struktur satker ke standar PERMA No. 1 Tahun 2017?')) {
                        CourtDB.resetSatkerStructure();
                        refreshData();
                        showToast('Struktur satker berhasil dikembalikan ke standar PERMA 1/2017.');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Standar PERMA</span>
                  </button>
                )}

                {canUserPerform(currentUser, 'satker', 'create') && (
                  <button
                    type="button"
                    onClick={() => openCreateModal('satker')}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Jabatan / Satker</span>
                  </button>
                )}
              </div>
            </div>

            {/* List Table */}
            <div className="bg-slate-900/80 rounded-2xl border border-emerald-500/20 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200">
                  <thead className="bg-slate-950/80 text-emerald-400 border-b border-emerald-500/20 uppercase tracking-wider text-[10px] font-mono">
                    <tr>
                      <th className="py-3 px-3 w-12 text-center">No</th>
                      <th className="py-3 px-4">Jabatan Struktural</th>
                      <th className="py-3 px-4">Kelompok</th>
                      <th className="py-3 px-4">Nama Pejabat / Aparatur</th>
                      <th className="py-3 px-4">Pangkat / NIP / NRP</th>
                      <th className="py-3 px-4">Tugas Pokok & Fungsi</th>
                      <th className="py-3 px-3 text-center w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {satkerList.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-white">
                          {item.jabatan}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            item.kelompok === 'Pimpinan' 
                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/40' 
                              : item.kelompok === 'Kepaniteraan' 
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                              : 'bg-sky-950/80 text-sky-300 border-sky-500/40'
                          }`}>
                            {item.kelompok}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-200 font-medium">{item.namaPejabat}</td>
                        <td className="py-3 px-4 text-amber-200 font-mono text-[11px]">{item.pangkatNip || '-'}</td>
                        <td className="py-3 px-4 text-slate-300 text-[11px] max-w-xs truncate">{item.tugasFungsi}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {canUserPerform(currentUser, 'satker', 'edit') && (
                              <button
                                type="button"
                                onClick={() => openEditModal('satker', item)}
                                title="Edit Data Satker"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer border border-slate-700"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {canUserPerform(currentUser, 'satker', 'delete') && (
                              <button
                                type="button"
                                onClick={() => openDeleteModal('satker', item)}
                                title="Hapus Data Satker"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-red-400 transition-colors cursor-pointer border border-slate-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {!canUserPerform(currentUser, 'satker', 'edit') && !canUserPerform(currentUser, 'satker', 'delete') && (
                              <span className="text-[10px] text-slate-500 font-mono">Lihat Saja</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CRUD TAUTAN WEBSITE RESMI MA-RI */}
        {activeTab === 'tautan' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span>Tautan Website Resmi Mahkamah Agung & Pengawasan</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Kelola tautan yang otomatis tampil pada footer, widget sidebar, dan navigasi portal instansi.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canUserPerform(currentUser, 'tautan', 'delete') && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Kembalikan tautan resmi ke standar Mahkamah Agung RI?')) {
                        CourtDB.resetRelatedWebsites();
                        refreshData();
                        showToast('Tautan resmi berhasil direset ke standar.');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Standar</span>
                  </button>
                )}

                {canUserPerform(currentUser, 'tautan', 'create') && (
                  <button
                    type="button"
                    onClick={() => openCreateModal('tautan')}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Tautan Baru</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-900/80 rounded-2xl border border-emerald-500/20 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200">
                  <thead className="bg-slate-950/80 text-emerald-400 border-b border-emerald-500/20 uppercase tracking-wider text-[10px] font-mono">
                    <tr>
                      <th className="py-3 px-3 w-12 text-center">No</th>
                      <th className="py-3 px-4">Nama Lembaga / Portal</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Peranan / Deskripsi</th>
                      <th className="py-3 px-4">URL Resmi</th>
                      <th className="py-3 px-3 text-center w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {relatedWebsitesList.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                          <span>{item.name}</span>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-amber-300"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950/80 text-sky-300 border border-sky-500/30">
                            {item.category || 'Mahkamah Agung'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 text-[11px]">{item.role}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-amber-200 break-all">{item.url}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {canUserPerform(currentUser, 'tautan', 'edit') && (
                              <button
                                type="button"
                                onClick={() => openEditModal('tautan', item)}
                                title="Edit Tautan"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer border border-slate-700"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {canUserPerform(currentUser, 'tautan', 'delete') && (
                              <button
                                type="button"
                                onClick={() => openDeleteModal('tautan', item)}
                                title="Hapus Tautan"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-red-400 transition-colors cursor-pointer border border-slate-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {!canUserPerform(currentUser, 'tautan', 'edit') && !canUserPerform(currentUser, 'tautan', 'delete') && (
                              <span className="text-[10px] text-slate-500 font-mono">Lihat Saja</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PROFIL IDENTITAS, KONTAK & 6 WILAYAH YURISDIKSI */}
        {activeTab === 'profil' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Form Profil Identitas Pengadilan Militer Tinggi V Makassar */}
            <div className="bg-slate-900/80 rounded-2xl border border-emerald-500/20 p-5 space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Pengaturan Header Banner & Lambang Satuan Kerja Resmi</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Kelola URL lambang satker, motto REWAKO, serta informasi kontak resmi yang ditampilkan pada Header dan Footer situs.
                  </p>
                </div>
                {canUserPerform(currentUser, 'profil', 'edit') && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Kembalikan identitas dan kontak ke standar resmi Makassar?')) {
                        CourtDB.resetCourtIdentity();
                        CourtDB.resetJurisdictionCourts();
                        refreshData();
                        showToast('Data identitas dan yurisdiksi berhasil direset ke standar resmi.');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Standar Makassar</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveCourtIdentity} className="space-y-4 text-xs">
                {/* Logo & Slogan Settings Box with Oval Gold Frame Preview */}
                <div className="bg-slate-950/90 rounded-2xl border-2 border-amber-400/40 p-4 space-y-4">
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Manajemen Lambang Banner & Motto Utama</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Live Preview in Oval Frame with Gold Border */}
                    <div className="flex flex-col items-center justify-center p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30">
                      <span className="text-[10px] font-bold text-amber-300 mb-2 uppercase tracking-wide">Pratinjau Bingkai Oval Emas</span>
                      <div className="w-28 h-[147px] rounded-[50%] border-4 border-amber-400 ring-2 ring-amber-300/80 shadow-2xl overflow-hidden bg-[#1b6b2d] flex items-center justify-center relative group p-0">
                        <img
                          src={getFreshImageUrl(profLogoUrl || logoTransparent)}
                          alt="Pratinjau Lambang"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover scale-[1.01] filter drop-shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = logoTransparent;
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 mt-2 text-center">Tampil di Header & Footer</span>
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <label className="block font-bold text-slate-200 mb-1">URL Gambar Lambang / Logo (Banner & Footer) *</label>
                        <div className="space-y-2">
                          <input
                            type="text"
                            required
                            value={profLogoUrl}
                            onChange={(e) => setProfLogoUrl(e.target.value)}
                            onBlur={() => {
                              if (profLogoUrl?.trim()) {
                                CourtDB.updateCourtIdentity({ logoUrl: profLogoUrl.trim() });
                                showToast('Tautan lambang pengadilan disimpan!');
                              }
                            }}
                            placeholder="Contoh: /images/dilmilti_v_logo_transparent.png atau https://..."
                            className="w-full bg-slate-900 border border-amber-400/50 rounded-xl px-3 py-2 text-white focus:border-amber-400 font-mono text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!profLogoUrl) return;
                              CourtDB.updateCourtIdentity({ logoUrl: profLogoUrl.trim() });
                              showToast('Tautan lambang pengadilan diterapkan & disimpan!');
                            }}
                            className="px-2.5 py-1 mb-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] cursor-pointer flex items-center gap-1 shadow-xs transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Terapkan URL</span>
                          </button>
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Unggah Berkas Lambang</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                      showToast('Ukuran maksimal berkas 5MB', 'error');
                                      return;
                                    }
                                    showToast('Mengunggah lambang pengadilan...');
                                    try {
                                      const compressed = await compressImage(file, 800, 800, 0.9);
                                      const uploadedUrl = await CourtDB.uploadBase64ToServer(compressed, file.name || 'logo_pengadilan', 'images');
      setProfLogoUrl( uploadedUrl);
                                      CourtDB.updateCourtIdentity({ logoUrl: uploadedUrl });
                                      showToast('Lambang pengadilan berhasil diunggah & disimpan!');
                                    } catch {
                                      showToast('Gagal mengunggah berkas lambang', 'error');
                                    }
                                  }
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setProfLogoUrl(logoTransparent);
                                CourtDB.updateCourtIdentity({ logoUrl: logoTransparent });
                                showToast('Logo Transparan Resmi diterapkan & disimpan!');
                              }}
                              className="px-2 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-300 text-[10px] font-bold cursor-pointer border border-amber-400/30"
                            >
                              Gunakan Logo Transparan Resmi
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setProfLogoUrl(logoHijau);
                                CourtDB.updateCourtIdentity({ logoUrl: logoHijau });
                                showToast('Logo Hijau MA-RI diterapkan & disimpan!');
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-medium cursor-pointer"
                            >
                              Gunakan Logo Hijau MA-RI
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const pinisiLogo = '/images/dilmilti_makassar_logo_badge_1789442475459.jpg';
                                setProfLogoUrl(pinisiLogo);
                                CourtDB.updateCourtIdentity({ logoUrl: pinisiLogo });
                                showToast('Logo Pinisi Makassar diterapkan & disimpan!');
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-medium cursor-pointer"
                            >
                              Gunakan Logo Pinisi Makassar
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-200 mb-1">Motto Satuan Kerja (Banner Utama) *</label>
                        <input
                          type="text"
                          required
                          value={profSlogan}
                          onChange={(e) => setProfSlogan(e.target.value)}
                          placeholder="REWAKO (Responsif, Energik, Wibawa, Adaptif, Kolaboratif, Objektif)"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-medium"
                        />
                      </div>

                      {/* Header Banner Background Image Setting */}
                      <div className="pt-2 border-t border-slate-800">
                        <label className="block font-bold text-slate-200 mb-1">Gambar Latar Belakang Header Banner (Header Website)</label>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={profBannerUrl}
                            onChange={(e) => setProfBannerUrl(e.target.value)}
                            onBlur={() => {
                              if (profBannerUrl?.trim()) {
                                CourtDB.updateCourtIdentity({ bannerUrl: profBannerUrl.trim() });
                                showToast('Tautan banner header disimpan!');
                              }
                            }}
                            placeholder="Contoh: /images/makassar_court_banner_1789442426023.jpg atau https://..."
                            className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!profBannerUrl) return;
                              CourtDB.updateCourtIdentity({ bannerUrl: profBannerUrl.trim() });
                              showToast('Tautan banner header diterapkan & disimpan!');
                            }}
                            className="px-2.5 py-1 mb-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] cursor-pointer flex items-center gap-1 shadow-xs transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Terapkan URL Banner</span>
                          </button>
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Unggah Banner Header</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 8 * 1024 * 1024) {
                                      showToast('Ukuran maksimal berkas 8MB', 'error');
                                      return;
                                    }
                                    showToast('Mengunggah gambar banner header...');
                                    try {
                                      const compressed = await compressImage(file, 1920, 1080, 0.85);
                                      const uploadedUrl = await CourtDB.uploadBase64ToServer(compressed, file.name || 'banner_header', 'images');
                                      setProfBannerUrl(uploadedUrl);
                                      CourtDB.updateCourtIdentity({ bannerUrl: uploadedUrl });
                                      showToast('Gambar banner header berhasil diunggah & disimpan!');
                                    } catch {
                                      showToast('Gagal mengunggah berkas banner header', 'error');
                                    }
                                  }
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const defaultBanner = '/images/makassar_court_banner_1789442426023.jpg';
                                setProfBannerUrl(defaultBanner);
                                CourtDB.updateCourtIdentity({ bannerUrl: defaultBanner });
                                showToast('Banner Pinisi Makassar diterapkan & disimpan!');
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-medium cursor-pointer"
                            >
                              Gunakan Banner Pinisi Makassar
                            </button>
                          </div>
                          {profBannerUrl && (
                            <div className="mt-2 h-16 w-full rounded-xl overflow-hidden border border-slate-700 relative">
                              <img
                                src={getFreshImageUrl(profBannerUrl)}
                                alt="Pratinjau Banner Header"
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-1 right-2 px-1.5 py-0.5 bg-black/70 text-[9px] text-amber-300 rounded font-mono">
                                Pratinjau Header Banner
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Indeks Pelayanan Publik (IKM & IPAK) & Portal Survei Management Card */}
                <div className="bg-slate-950/90 rounded-2xl border-2 border-emerald-500/40 p-4 space-y-4">
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <BarChart className="w-4 h-4 text-amber-400" />
                    <span>Pengaturan Indeks Pelayanan Publik (IKM & IPAK) & Tautan Portal Survei</span>
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Sesuai Lampiran II SK Dirjen Badilmiltun Nomor 593/DJMT/SK.TI2.1.1/VII/2026, atur skor kepuasan IKM, indeks antikorupsi IPAK, serta URL tautan Portal Survei resmi Badilmiltun yang tampil di Widget Sidebar dan Layanan Publik.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {/* IKM Settings */}
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-3">
                      <div className="text-xs font-black text-amber-300 uppercase">1. Indeks Kepuasan Masyarakat (IKM)</div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Skor IKM (Maks. 4.00)</label>
                        <input
                          type="number"
                          step="0.01"
                          max="4.00"
                          min="1.00"
                          value={profIkmSkor}
                          onChange={(e) => setProfIkmSkor(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Predikat IKM</label>
                        <input
                          type="text"
                          value={profIkmPredikat}
                          onChange={(e) => setProfIkmPredikat(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-bold uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Jumlah Responden</label>
                        <input
                          type="number"
                          value={profIkmResponden}
                          onChange={(e) => setProfIkmResponden(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                        />
                      </div>
                    </div>

                    {/* IPAK Settings */}
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-3">
                      <div className="text-xs font-black text-amber-300 uppercase">2. Indeks Persepsi Anti Korupsi (IPAK)</div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Skor IPAK (Maks. 4.00)</label>
                        <input
                          type="number"
                          step="0.01"
                          max="4.00"
                          min="1.00"
                          value={profIpakSkor}
                          onChange={(e) => setProfIpakSkor(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Predikat IPAK</label>
                        <input
                          type="text"
                          value={profIpakPredikat}
                          onChange={(e) => setProfIpakPredikat(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-bold uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Jumlah Responden</label>
                        <input
                          type="number"
                          value={profIpakResponden}
                          onChange={(e) => setProfIpakResponden(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                        />
                      </div>
                    </div>

                    {/* Portal Survei URL */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-black text-amber-300 uppercase mb-2">3. Tautan Portal Survei Elektronik</div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">URL Pengisian Survei Badilmiltun *</label>
                        <input
                          type="text"
                          required
                          value={profSurveiUrl}
                          onChange={(e) => setProfSurveiUrl(e.target.value)}
                          placeholder="https://survei.djmt.id/dilmilti_makassar"
                          className="w-full bg-slate-950 border border-amber-400/50 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-amber-400"
                        />
                        <p className="text-[10px] text-slate-400 mt-1.5">
                          Tautan ini akan langsung mengarahkan masyarakat ketika menekan tombol E-Survei atau menu Indeks Pelayanan Publik.
                        </p>
                      </div>

                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-200 border border-emerald-500/40 text-[10px] font-mono">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          Terintegrasi Portal Badilmiltun
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Nama Satuan Kerja Pengadilan *</label>
                    <input
                      type="text"
                      required
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Alamat Gedung Kantor *</label>
                    <input
                      type="text"
                      required
                      value={profAddress}
                      onChange={(e) => setProfAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Nomor Telepon Kantor *</label>
                    <input
                      type="text"
                      required
                      value={profPhone}
                      onChange={(e) => setProfPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">WhatsApp Layanan PTSP & SIPP *</label>
                    <input
                      type="text"
                      required
                      value={profWhatsapp}
                      onChange={(e) => setProfWhatsapp(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Email Resmi *</label>
                    <input
                      type="email"
                      required
                      value={profEmail}
                      onChange={(e) => setProfEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Jam Operasional Pelayanan *</label>
                    <input
                      type="text"
                      required
                      value={profJamOperasional}
                      onChange={(e) => setProfJamOperasional(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Website Resmi</label>
                    <input
                      type="text"
                      value={profWebsite}
                      onChange={(e) => setProfWebsite(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Cakupan Wilayah Hukum Yurisdiksi</label>
                    <input
                      type="text"
                      value={profYurisdiksi}
                      onChange={(e) => setProfYurisdiksi(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* DYNAMIC SECTIONS: PENGANTAR PIMPINAN, VISI MISI, SEJARAH */}
                <div className="border-t border-slate-800 pt-5 space-y-5">
                  <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Edit Konten Halaman Informasi Utama</span>
                  </h3>

                  {/* 1. Pengantar Pimpinan */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4 text-left">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
                      <span>1. Pengaturan Pengantar Pimpinan (Sambutan Wakadilmil)</span>
                    </h4>

                    {/* Foto Pimpinan Card */}
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-24 h-32 bg-slate-950 rounded-xl border-2 border-amber-400 overflow-hidden shrink-0 flex items-center justify-center relative group shadow-md">
                        {profFotoKadilmil ? (
                          <img src={getFreshImageUrl(profFotoKadilmil)} alt="Preview Foto Pimpinan" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-2 text-slate-500 text-[10px]">
                            <span className="text-2xl block mb-1">🎖️</span>
                            <span>Belum ada foto</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2 w-full text-left">
                        <label className="block text-xs font-bold text-amber-300">
                          Foto Resmi Pimpinan (Wakadilmil / Kadilmil)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={profFotoKadilmil}
                            onChange={(e) => setProfFotoKadilmil(e.target.value)}
                            placeholder="https://... atau /uploads/..."
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-emerald-400 font-mono"
                          />
                          <label className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Unggah Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    showToast('Memproses dan mengunggah foto pimpinan...');
                                    const compressed = await compressImage(file, 800, 1000, 0.85);
                                    setProfFotoKadilmil(compressed);
                                    const uploadedUrl = await CourtDB.uploadBase64ToServer(compressed, file.name || 'foto-pimpinan', 'uploads');
                                    if (uploadedUrl) {
                                      setProfFotoKadilmil(uploadedUrl);
                                      CourtDB.updateCourtIdentity({ fotoKadilmil: uploadedUrl });
                                    } else {
                                      CourtDB.updateCourtIdentity({ fotoKadilmil: compressed });
                                    }
                                    showToast('Foto pimpinan berhasil diunggah & disimpan!');
                                  } catch (err) {
                                    showToast('Gagal memproses foto pimpinan', 'error');
                                  }
                                }
                              }}
                            />
                          </label>
                          {profFotoKadilmil && (
                            <button
                              type="button"
                              onClick={() => setProfFotoKadilmil('')}
                              className="px-2.5 py-1.5 bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700 rounded-xl text-xs font-bold cursor-pointer"
                              title="Hapus foto"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Foto ini tampil pada halaman Sambutan / Pengantar Pimpinan dan profil resmi pimpinan. Mendukung JPG, PNG, WEBP.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Nama Pimpinan / Wakadilmil</label>
                        <input
                          type="text"
                          value={profSambutanNama}
                          onChange={(e) => setProfSambutanNama(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Pangkat, Jabatan & NRP</label>
                        <input
                          type="text"
                          value={profSambutanPangkatNrp}
                          onChange={(e) => setProfSambutanPangkatNrp(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Pernyataan Kutipan Utama (Quote)</label>
                      <textarea
                        rows={3}
                        value={profSambutanQuote}
                        onChange={(e) => setProfSambutanQuote(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Paragraph Pembuka 1</label>
                        <textarea
                          rows={4}
                          value={profSambutanParagraph1}
                          onChange={(e) => setProfSambutanParagraph1(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Paragraph Penutup 2</label>
                        <textarea
                          rows={4}
                          value={profSambutanParagraph2}
                          onChange={(e) => setProfSambutanParagraph2(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Visi & Misi */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4 text-left">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
                      <span>2. Pengaturan Visi dan Misi Satker</span>
                    </h4>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Pernyataan Visi Utama</label>
                      <textarea
                        rows={2}
                        value={profVisiText}
                        onChange={(e) => setProfVisiText(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 text-xs font-semibold"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <span className="block font-bold text-amber-300 text-[10px] uppercase">Daftar 4 Misi Utama Satuan Kerja:</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                          <input
                            type="text"
                            value={profMisi1Title}
                            onChange={(e) => setProfMisi1Title(e.target.value)}
                            placeholder="Misi 1 Title"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-bold"
                          />
                          <textarea
                            rows={2}
                            value={profMisi1Desc}
                            onChange={(e) => setProfMisi1Desc(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                          />
                        </div>

                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                          <input
                            type="text"
                            value={profMisi2Title}
                            onChange={(e) => setProfMisi2Title(e.target.value)}
                            placeholder="Misi 2 Title"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-bold"
                          />
                          <textarea
                            rows={2}
                            value={profMisi2Desc}
                            onChange={(e) => setProfMisi2Desc(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                          />
                        </div>

                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                          <input
                            type="text"
                            value={profMisi3Title}
                            onChange={(e) => setProfMisi3Title(e.target.value)}
                            placeholder="Misi 3 Title"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-bold"
                          />
                          <textarea
                            rows={2}
                            value={profMisi3Desc}
                            onChange={(e) => setProfMisi3Desc(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                          />
                        </div>

                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                          <input
                            type="text"
                            value={profMisi4Title}
                            onChange={(e) => setProfMisi4Title(e.target.value)}
                            placeholder="Misi 4 Title"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-bold"
                          />
                          <textarea
                            rows={2}
                            value={profMisi4Desc}
                            onChange={(e) => setProfMisi4Desc(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Sejarah & Yurisdiksi */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4 text-left">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
                      <span>3. Pengaturan Sejarah & Yurisdiksi Pengadilan</span>
                    </h4>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Pengantar Sejarah / Yurisdiksi (Intro)</label>
                      <textarea
                        rows={3}
                        value={profSejarahIntro}
                        onChange={(e) => setProfSejarahIntro(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Paragraph Tambahan (Kewenangan Perkara, dll.)</label>
                      <textarea
                        rows={3}
                        value={profSejarahParagraph}
                        onChange={(e) => setProfSejarahParagraph(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                {canUserPerform(currentUser, 'profil', 'edit') && (
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Simpan Perubahan Identitas & Kontak</span>
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* 6 Pengadilan Militer Tingkat Pertama di Bawah Yurisdiksi */}
            <div className="bg-slate-900/80 rounded-2xl border border-emerald-500/20 p-5 space-y-4 shadow-lg">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>6 Pengadilan Militer Tingkat Pertama Wilayah Kerja DILMILTI V Makassar</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Data alamat dan kontak 6 satuan kerja peradilan militer tingkat pertama di Kawasan Timur Indonesia.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200">
                  <thead className="bg-slate-950/80 text-emerald-400 border-b border-emerald-500/20 uppercase tracking-wider text-[10px] font-mono">
                    <tr>
                      <th className="py-3 px-3 w-16 text-center">Kode</th>
                      <th className="py-3 px-4">Nama Pengadilan</th>
                      <th className="py-3 px-4">Wilayah Hukum</th>
                      <th className="py-3 px-4">Alamat Gedung Kantor</th>
                      <th className="py-3 px-4">Telepon / Kontak</th>
                      <th className="py-3 px-3 text-center w-20">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {jurisdictionCourts.map((court) => (
                      <tr key={court.code} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-3 text-center font-mono font-bold text-amber-300">{court.code}</td>
                        <td className="py-3 px-4 font-bold text-white">{court.name}</td>
                        <td className="py-3 px-4 text-slate-300">{court.jurisdiction}</td>
                        <td className="py-3 px-4 text-slate-300 text-[11px]">{court.address}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-emerald-300">{court.phone}</td>
                        <td className="py-3 px-3 text-center">
                          {canUserPerform(currentUser, 'profil', 'edit') ? (
                            <button
                              type="button"
                              onClick={() => openEditModal('profil', court)}
                              title="Edit Kontak Satker"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer border border-slate-700 inline-flex items-center gap-1"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold">Edit</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono">Lihat</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CRUD PERKARA SIPP */}
        {activeTab === 'sipp' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20">
              <div>
                <h3 className="text-sm font-extrabold text-white">Sistem Informasi Penelusuran Perkara (SIPP)</h3>
                <p className="text-[11px] text-slate-400">Kelola register perkara tingkat banding, status sidang, dan petikan amar putusan.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSippSyncModalOpen(true);
                    setSippSyncStatus('idle');
                    setSippSyncLog('');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md border border-sky-400/40"
                >
                  <RefreshCw className="w-4 h-4 text-sky-200" />
                  <span>Sinkronkan SIPP Localhost / Server</span>
                </button>

                {canUserPerform(currentUser, 'sipp', 'create') && (
                  <button
                    type="button"
                    onClick={() => openCreateModal('sipp')}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Daftarkan Perkara Baru</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sippList.map((s) => (
                <div key={s.id} className="p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {s.tingkatPerkara} • {s.klasifikasi}
                      </span>
                      <h4 className="text-sm font-black text-white mt-1">{s.nomorPerkara}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      {s.statusPerkara}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-300">
                      <strong className="text-white">Terdakwa:</strong> {s.terdakwa.nama} ({s.terdakwa.pangkat} / NRP: {s.terdakwa.nrp})
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      <strong>Kesatuan:</strong> {s.terdakwa.kesatuan} ({s.terdakwa.matra})
                    </div>
                    {s.amarPutusan && (
                      <div className="mt-2 p-2 bg-emerald-950/40 rounded border border-emerald-500/30 text-[11px] text-emerald-200">
                        <strong>Amar Putusan:</strong> {s.amarPutusan}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-500 text-[11px]">Daftar: {s.tanggalDaftar}</span>
                    <div className="flex items-center gap-1.5">
                      {canUserPerform(currentUser, 'sipp', 'edit') && (
                        <button
                          type="button"
                          onClick={() => openEditModal('sipp', s)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer"
                          title="Edit Perkara SIPP"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canUserPerform(currentUser, 'sipp', 'delete') && (
                        <button
                          type="button"
                          onClick={() => openDeleteModal('sipp', s)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-red-400 transition-colors cursor-pointer"
                          title="Hapus Perkara SIPP"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {!canUserPerform(currentUser, 'sipp', 'edit') && !canUserPerform(currentUser, 'sipp', 'delete') && (
                        <span className="text-[10px] text-slate-500 font-mono">Lihat Saja</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CRUD JADWAL SIDANG */}
        {activeTab === 'jadwal' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20">
              <div>
                <h3 className="text-sm font-extrabold text-white">Kelola Jadwal Persidangan Harian</h3>
                <p className="text-[11px] text-slate-400">Jadwal sidang di Ruang Utama Kartika dan Ruang Sidang Cakra.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSippSyncModalOpen(true);
                    setSippSyncStatus('idle');
                    setSippSyncLog('');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md border border-sky-400/40"
                >
                  <RefreshCw className="w-4 h-4 text-sky-200" />
                  <span>Tarik Data SIPP Localhost</span>
                </button>

                {canUserPerform(currentUser, 'jadwal', 'create') && (
                  <button
                    type="button"
                    onClick={() => openCreateModal('jadwal')}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Jadwal Sidang</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-900/80 rounded-2xl border border-emerald-500/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-emerald-400 border-b border-emerald-500/20 text-[11px] font-mono uppercase">
                    <tr>
                      <th className="py-3 px-3">No. Perkara</th>
                      <th className="py-3 px-3">Terdakwa & Kesatuan</th>
                      <th className="py-3 px-3">Waktu & Tanggal</th>
                      <th className="py-3 px-3">Ruang Sidang</th>
                      <th className="py-3 px-3">Agenda Sidang</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {jadwalList.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-mono font-bold text-amber-300">{j.nomorPerkara}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{j.terdakwa}</div>
                          <div className="text-[10px] text-slate-400">{j.kesatuan}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-300 font-mono">{j.tanggal} • {j.waktu}</td>
                        <td className="py-3 px-3 text-emerald-300">{j.ruangSidang}</td>
                        <td className="py-3 px-3 text-slate-300">{j.agenda}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            j.status === 'Sedang Berlangsung' ? 'bg-red-500 text-white animate-pulse' :
                            j.status === 'Selesai' ? 'bg-emerald-900 text-emerald-200' :
                            'bg-slate-800 text-amber-300 border border-amber-400/40'
                          }`}>
                            {j.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {canUserPerform(currentUser, 'jadwal', 'edit') && (
                              <button
                                type="button"
                                onClick={() => openEditModal('jadwal', j)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer"
                                title="Edit Jadwal Sidang"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {canUserPerform(currentUser, 'jadwal', 'delete') && (
                              <button
                                type="button"
                                onClick={() => openDeleteModal('jadwal', j)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-red-400 transition-colors cursor-pointer"
                                title="Hapus Jadwal Sidang"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {!canUserPerform(currentUser, 'jadwal', 'edit') && !canUserPerform(currentUser, 'jadwal', 'delete') && (
                              <span className="text-[10px] text-slate-500 font-mono">Lihat Saja</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CRUD BERITA & PUBLIKASI */}
        {activeTab === 'berita' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20">
              <div>
                <h3 className="text-sm font-extrabold text-white">Manajemen Berita & Publikasi Humas</h3>
                <p className="text-[11px] text-slate-400">Mempublikasikan siaran pers, kegiatan kedinasan, dan pengumuman resmi.</p>
              </div>

              {canUserPerform(currentUser, 'berita', 'create') && (
                <button
                  type="button"
                  onClick={() => openCreateModal('berita')}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Artikel Baru</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newsList.map((n) => (
                <div key={n.id} className="p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                        {n.kategori}
                      </span>
                      {n.isFeatured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                          ★ Headline Utama
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-black text-white leading-snug">{n.judul}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{n.ringkasan}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-500">{n.tanggal} • {n.penulis}</span>
                    <div className="flex items-center gap-1.5">
                      {canUserPerform(currentUser, 'berita', 'edit') && (
                        <button
                          type="button"
                          onClick={() => openEditModal('berita', n)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer"
                          title="Edit Berita"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canUserPerform(currentUser, 'berita', 'delete') && (
                        <button
                          type="button"
                          onClick={() => openDeleteModal('berita', n)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-red-400 transition-colors cursor-pointer"
                          title="Hapus Berita"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {!canUserPerform(currentUser, 'berita', 'edit') && !canUserPerform(currentUser, 'berita', 'delete') && (
                        <span className="text-[10px] text-slate-500 font-mono">Lihat Saja</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PPID & LAYANAN DOKUMEN PUBLIK (SAKIP / DIPA / LHKPN) */}
        {activeTab === 'ppid' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Subtab Toggle Buttons */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setPpidSubTab('dip')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  ppidSubTab === 'dip'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Daftar Informasi Publik (DIP PPID)</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-950/60 text-[10px] font-mono text-emerald-300">
                  {dipList.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPpidSubTab('sakip')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  ppidSubTab === 'sakip'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>Dokumen SAKIP, DIPA, LHKPN & Standar Pelayanan</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-950/60 text-[10px] font-mono text-emerald-300">
                  {sakipDipaList.length}
                </span>
              </button>
            </div>

            {ppidSubTab === 'dip' ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Daftar Informasi Publik (DIP) & Regulasi PERMA 1/2017</h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Menyajikan informasi publik secara berkala, serta merta, dan setiap saat sesuai standar keterbukaan informasi Mahkamah Agung RI dan Komisi Informasi Pusat.
                    </p>
                  </div>

                  {canUserPerform(currentUser, 'ppid', 'create') && (
                    <button
                      type="button"
                      onClick={() => openCreateModal('ppid')}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Dokumen DIP</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dipList.map((d) => (
                    <div key={d.id} className="p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20 space-y-2 text-xs flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            {d.kategori}
                          </span>
                          <span className="text-[10px] text-slate-500">{d.ukuranFile}</span>
                        </div>
                        <h4 className="font-black text-white text-xs leading-snug">{d.namaInformasi}</h4>
                        <p className="text-[11px] text-slate-400">{d.ringkasan}</p>
                        <div className="text-[10px] text-amber-300 font-mono pt-1">
                          Unit: {d.unitKerja}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-slate-800">
                        {canUserPerform(currentUser, 'ppid', 'edit') && (
                          <button
                            type="button"
                            onClick={() => openEditModal('ppid', d)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer"
                            title="Edit Dokumen DIP"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canUserPerform(currentUser, 'ppid', 'delete') && (
                          <button
                            type="button"
                            onClick={() => openDeleteModal('ppid', d)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-red-400 transition-colors cursor-pointer"
                            title="Hapus Dokumen DIP"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {!canUserPerform(currentUser, 'ppid', 'edit') && !canUserPerform(currentUser, 'ppid', 'delete') && (
                          <span className="text-[10px] text-slate-500 font-mono">Lihat Saja</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* SAKIP / DIPA / LHKPN / STANDAR PELAYANAN */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Manajemen Dokumen SAKIP, DIPA, LHKPN & Standar Pelayanan</h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Kelola dan upload dokumen fisik Renstra, LKjIP, IKU, RKT, PK Pimpinan, Realisasi DIPA 01/05, dan Rekap LHKPN.
                    </p>
                  </div>

                  {canUserPerform(currentUser, 'ppid', 'create') && (
                    <button
                      type="button"
                      onClick={() => openCreateModal('sakip' as any)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Dokumen SAKIP/DIPA Baru</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sakipDipaList.map((doc) => (
                    <div key={doc.id} className="p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20 space-y-3 text-xs flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 uppercase">
                            {doc.kategori}
                          </span>
                          <span className="text-[10px] text-amber-300 font-mono font-bold">
                            TA {doc.tahun}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-xs leading-snug">{doc.judul}</h4>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                          <span className="truncate max-w-[180px]">{doc.fileName}</span>
                          <span className="text-emerald-400">{doc.fileSize}</span>
                        </div>
                        {doc.nilaiAnggaran && (
                          <div className="text-[11px] font-mono text-amber-300 font-bold">
                            Anggaran: {doc.nilaiAnggaran}
                          </div>
                        )}
                        {doc.nomorDokumen && (
                          <div className="text-[10px] text-slate-500">
                            No: {doc.nomorDokumen}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-slate-800">
                        {canUserPerform(currentUser, 'ppid', 'edit') && (
                          <button
                            type="button"
                            onClick={() => openEditModal('sakip' as any, doc)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer"
                            title="Edit Dokumen SAKIP"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canUserPerform(currentUser, 'ppid', 'delete') && (
                          <button
                            type="button"
                            onClick={() => openDeleteModal('sakip' as any, doc)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-red-400 transition-colors cursor-pointer"
                            title="Hapus Dokumen SAKIP"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: EVIDEN REFORMASI BIROKRASI (ZI WBBM) */}
        {activeTab === 'eviden' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Header Action Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 rounded-2xl border border-emerald-500/30 shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-bold text-[10px] border border-amber-400/30">
                    PERMENPAN-RB NO. 90 TAHUN 2021
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Total: {evidenList.length} Dokumen Eviden
                  </span>
                </div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Repositori Eviden Pembangunan Zona Integritas (WBBM)</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  Kelola dan perbarui seluruh dokumen bukti (eviden) pemenuhan Lembar Kerja Evaluasi (LKE) 6 Area Perubahan reformasi birokrasi Pengadilan Militer Tinggi V Makassar.
                </p>
              </div>

              {canUserPerform(currentUser, 'eviden', 'create') && (
                <button
                  type="button"
                  onClick={() => openCreateModal('eviden')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Unggah Eviden Baru</span>
                </button>
              )}
            </div>

            {/* Filter Area Tabs & Search */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-emerald-500/20 space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan judul dokumen, nomor SK/surat, atau keterangan..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Counter Tag */}
                <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                  <span>Menampilkan:</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
                    {filteredEviden.length} dari {evidenList.length} berkas
                  </span>
                </div>
              </div>

              {/* Area Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-emerald-400" />
                  Area:
                </span>
                {[
                  { id: 'ALL', label: 'Semua Area' },
                  { id: 0, label: 'LKE & SK Tim' },
                  { id: 1, label: 'Area I (Manajemen Perubahan)' },
                  { id: 2, label: 'Area II (Tatalaksana)' },
                  { id: 3, label: 'Area III (SDM)' },
                  { id: 4, label: 'Area IV (Akuntabilitas)' },
                  { id: 5, label: 'Area V (Pengawasan)' },
                  { id: 6, label: 'Area VI (Pelayanan Publik)' }
                ].map((tab) => (
                  <button
                    key={String(tab.id)}
                    type="button"
                    onClick={() => setEvidenAreaFilter(tab.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      evidenAreaFilter === tab.id
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Eviden List / Table */}
            {filteredEviden.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Tidak ada dokumen eviden yang sesuai</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Coba ubah kata kunci pencarian atau bersihkan filter area perubahan di atas.
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setEvidenAreaFilter('ALL'); }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 font-bold transition-colors cursor-pointer"
                >
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="bg-slate-900/80 rounded-2xl border border-emerald-500/20 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5 pl-4">Dokumen & Nomor Surat</th>
                        <th className="p-3.5">Area Perubahan</th>
                        <th className="p-3.5">Tahun / Berkas</th>
                        <th className="p-3.5">Status Verifikasi</th>
                        <th className="p-3.5">Pengunggah</th>
                        <th className="p-3.5 text-right pr-4">Aksi Kelola</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredEviden.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                          <td className="p-3.5 pl-4 max-w-md">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="space-y-1">
                                <div className="font-bold text-white text-xs leading-snug group-hover:text-emerald-300 transition-colors">
                                  {item.judulDokumen}
                                </div>
                                <div className="text-[10px] font-mono text-amber-300">
                                  {item.nomorSurat || 'Nomor SK Resmi Terlampir'}
                                </div>
                                {item.keterangan && (
                                  <div className="text-[11px] text-slate-400 line-clamp-1">
                                    {item.keterangan}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                              {item.areaName}
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap space-y-0.5">
                            <div className="font-mono font-bold text-white text-[11px]">
                              Tahun {item.tahun}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 font-bold">
                                {item.fileType || 'PDF'}
                              </span>
                              <span>{item.fileSize || '1.8 MB'}</span>
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                              item.statusVerifikasi === 'Terverifikasi'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                : item.statusVerifikasi === 'Revisi'
                                ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                                : 'bg-amber-950 text-amber-300 border-amber-500/40'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                item.statusVerifikasi === 'Terverifikasi' ? 'bg-emerald-400' :
                                item.statusVerifikasi === 'Revisi' ? 'bg-rose-400' : 'bg-amber-400 animate-pulse'
                              }`}></span>
                              {item.statusVerifikasi || 'Terverifikasi'}
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap space-y-0.5 text-slate-300">
                            <div className="font-bold text-white text-[11px]">
                              {item.diuploadOleh || 'Admin Dilmilti V'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {item.tanggalUpload || '2026-03-12'}
                            </div>
                          </td>

                          <td className="p-3.5 pr-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Unduh / Buka */}
                              <a
                                href={item.fileUrl || '#'}
                                target="_blank"
                                rel="noreferrer"
                                download={item.fileName || 'dokumen_eviden.pdf'}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-emerald-400 transition-colors"
                                title="Unduh Berkas Eviden"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>

                              {/* Edit */}
                              {canUserPerform(currentUser, 'eviden', 'edit') && (
                                <button
                                  type="button"
                                  onClick={() => openEditModal('eviden', item)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer"
                                  title="Edit Metadata Eviden"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Hapus */}
                              {canUserPerform(currentUser, 'eviden', 'delete') && (
                                <button
                                  type="button"
                                  onClick={() => openDeleteModal('eviden', item)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-red-400 transition-colors cursor-pointer"
                                  title="Hapus Dokumen Eviden"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB POPUP ANNOUNCEMENT CONFIGURATION */}
        {activeTab === 'popup' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header with quick actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-900 via-[#0B2317] to-slate-900 rounded-2xl border border-emerald-500/30 shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-400 text-slate-950">
                    KENDALI POP-UP DIALOG
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    popIsActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}>
                    {popIsActive ? 'STATUS: AKTIF (MUNCUL OTOMATIS)' : 'STATUS: NONAKTIF (DISEMBUNYIKAN)'}
                  </span>
                </div>
                <h3 className="text-base font-black text-white">
                  Pengaturan Jendela Pop-up Pengumuman Akses Awal Website
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Konfigurasikan maklumat pelayanan, pengumuman persidangan, atau himbauan Zona Integritas (WBK/WBBM) yang akan tampil secara otomatis saat pengunjung pertama kali membuka portal Pengadilan Militer Tinggi V Makassar.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePreviewPopupModal}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                  <span>Uji & Pratinjau Pop-up</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetPopupConfig}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>

            {/* Form Settings */}
            <form onSubmit={handleSavePopupConfig} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (2 Cols): Text & Structure Content */}
                <div className="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-emerald-500/20 p-5 sm:p-6 space-y-5">
                  
                  {/* Status Switcher & Template Presets */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        popIsActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
                      }`}>
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white">Status Penayangan Pop-up</div>
                        <div className="text-[11px] text-slate-400">
                          {popIsActive ? 'Pop-up otomatis muncul di halaman depan' : 'Pop-up dimatikan untuk semua pengunjung'}
                        </div>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={popIsActive}
                        onChange={(e) => {
                          const nextActive = e.target.checked;
                          setPopIsActive(nextActive);
                          persistPopupChanges(
                            { isActive: nextActive },
                            nextActive ? 'Pop-up Pengumuman diaktifkan & disimpan!' : 'Pop-up Pengumuman dinonaktifkan & disimpan!'
                          );
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      <span className="ml-2.5 text-xs font-bold text-slate-200">
                        {popIsActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </label>
                  </div>

                  {/* Preset Template Fast Fill */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                      ⚡ Pilih Template Cepat Resmi MA-RI:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const nextTitle = 'Maklumat Pelayanan & Komitmen Zona Integritas (WBK/WBBM)';
                          const nextSub = 'Pengadilan Militer Tinggi V Makassar';
                          const nextBadge = 'MAKLUMAT RESMI';
                          const nextContent = 'Selamat Datang di Portal Resmi Pengadilan Militer Tinggi V Makassar. Kami berkomitmen memberikan pelayanan peradilan militer yang cepat, transparan, akuntabel, bebas dari korupsi, kolusi, nepotisme, dan gratifikasi.';
                          const nextBullets = [
                            'Pelayanan Meja 1 s.d. 6 PTSP & Posbakum 100% Bebas Pungli',
                            'Keterbukaan Informasi Publik melalui Register SIPP & e-Court',
                            'Pengaduan Masyarakat terlindungi melalui Whistleblowing System (SIWAS MA-RI)'
                          ];
                          const nextBtn = 'Buka Layanan PTSP Online';
                          const nextTab = 'layanan';
                          const nextImg = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80';
                          setPopTitle(nextTitle);
                          setPopSubtitle(nextSub);
                          setPopBadge(nextBadge);
                          setPopContent(nextContent);
                          setPopBulletPoints(nextBullets);
                          setPopButtonText(nextBtn);
                          setPopButtonLinkTab(nextTab);
                          setPopImageUrl(nextImg);
                          persistPopupChanges({
                            title: nextTitle,
                            subtitle: nextSub,
                            badge: nextBadge,
                            content: nextContent,
                            bulletPoints: nextBullets,
                            buttonText: nextBtn,
                            buttonLinkTab: nextTab,
                            imageUrl: nextImg
                          }, 'Template Maklumat Pelayanan diterapkan & disimpan!');
                        }}
                        className="p-2.5 rounded-xl bg-slate-950 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 text-left text-xs transition-all cursor-pointer"
                      >
                        <div className="font-bold text-emerald-300">Maklumat Pelayanan & ZI</div>
                        <div className="text-[10px] text-slate-400">Standar Zona Integritas & Bebas Pungli</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const nextTitle = 'Jadwal Persidangan Terbuka & Informasi Perkara Banding';
                          const nextSub = 'Ruang Sidang Utama Kartika & Cakra Dilmilti V';
                          const nextBadge = 'JADWAL SIDANG';
                          const nextContent = 'Pemberitahuan resmi persidangan perkara pidana militer tingkat banding. Para pihak terdakwa, oditur, dan penasihat hukum diimbau hadir tepat waktu sesuai tata tertib ruang sidang peradilan militer.';
                          const nextBullets = [
                            'Pemeriksaan Register Perkara Banding dan Peninjauan Kembali',
                            'Ruang Sidang Kartika & Cakra dilengkapi Audio Visual Digital',
                            'Penerapan Protokol Keamanan dan Tertib Sidang Militer'
                          ];
                          const nextBtn = 'Cek Jadwal Sidang Hari Ini';
                          const nextTab = 'jadwal';
                          const nextImg = 'https://images.unsplash.com/photo-1575320181282-9afab399332c?w=800&auto=format&fit=crop&q=80';
                          setPopTitle(nextTitle);
                          setPopSubtitle(nextSub);
                          setPopBadge(nextBadge);
                          setPopContent(nextContent);
                          setPopBulletPoints(nextBullets);
                          setPopButtonText(nextBtn);
                          setPopButtonLinkTab(nextTab);
                          setPopImageUrl(nextImg);
                          persistPopupChanges({
                            title: nextTitle,
                            subtitle: nextSub,
                            badge: nextBadge,
                            content: nextContent,
                            bulletPoints: nextBullets,
                            buttonText: nextBtn,
                            buttonLinkTab: nextTab,
                            imageUrl: nextImg
                          }, 'Template Jadwal Sidang diterapkan & disimpan!');
                        }}
                        className="p-2.5 rounded-xl bg-slate-950 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 text-left text-xs transition-all cursor-pointer"
                      >
                        <div className="font-bold text-sky-300">Agenda Sidang Terbuka</div>
                        <div className="text-[10px] text-slate-400">Ruang Sidang Kartika / Cakra</div>
                      </button>
                    </div>
                  </div>

                  {/* Title & Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-300 mb-1">Judul Pop-up Pengumuman *</label>
                      <input
                        type="text"
                        required
                        value={popTitle}
                        onChange={(e) => setPopTitle(e.target.value)}
                        placeholder="Contoh: Maklumat Pelayanan & Komitmen Zona Integritas"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Badge Kategori Tag</label>
                      <input
                        type="text"
                        value={popBadge}
                        onChange={(e) => setPopBadge(e.target.value)}
                        placeholder="Contoh: MAKLUMAT RESMI"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono focus:border-emerald-400 font-bold uppercase"
                      />
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block font-bold text-slate-300 mb-1 text-xs">Subjudul / Keterangan Lembaga</label>
                    <input
                      type="text"
                      value={popSubtitle}
                      onChange={(e) => setPopSubtitle(e.target.value)}
                      placeholder="Contoh: Pengadilan Militer Tinggi V Makassar"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-400"
                    />
                  </div>

                  {/* Content Body */}
                  <div>
                    <label className="block font-bold text-slate-300 mb-1 text-xs">Teks Lengkap Isi Pengumuman *</label>
                    <textarea
                      rows={4}
                      required
                      value={popContent}
                      onChange={(e) => setPopContent(e.target.value)}
                      placeholder="Tuliskan narasi sambutan, maklumat keterbukaan informasi, atau petunjuk layanan..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs leading-relaxed focus:border-emerald-400"
                    />
                  </div>

                  {/* Dynamic Bullet Points */}
                  <div className="space-y-3 pt-2">
                    <label className="block font-bold text-slate-300 text-xs flex items-center justify-between">
                      <span>Poin-Poin Penting Pelayanan (Checklist Bullet Points)</span>
                      <span className="text-[10px] text-amber-400 font-normal">{popBulletPoints.length} Poin Terdaftar</span>
                    </label>

                    <div className="space-y-2">
                      {popBulletPoints.map((point, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          <input 
                            type="text"
                            value={point}
                            onChange={(e) => {
                              const newPoints = [...popBulletPoints];
                              newPoints[idx] = e.target.value;
                              setPopBulletPoints(newPoints);
                            }}
                            className="w-full bg-transparent text-slate-200 text-xs focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveBulletPoint(idx)}
                            className="p-1 rounded text-red-400 hover:bg-red-950/60 hover:text-red-300 cursor-pointer"
                            title="Hapus Poin Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newBulletText}
                          onChange={(e) => setNewBulletText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddBulletPoint();
                            }
                          }}
                          placeholder="Tambah poin penting baru..."
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-400"
                        />
                        <button
                          type="button"
                          onClick={handleAddBulletPoint}
                          className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Poin</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column (1 Col): Media & Action Buttons */}
                <div className="space-y-5">
                  
                  {/* Poster / Image Settings */}
                  <div className="bg-slate-900/80 rounded-2xl border border-emerald-500/20 p-5 space-y-4 text-xs">
                    <h4 className="font-black text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Poster / Gambar Pop-up</span>
                    </h4>

                    {popImageUrl ? (
                      <div className="relative rounded-xl overflow-hidden border border-amber-400/40 group">
                        <img 
                          src={getFreshImageUrl(popImageUrl)} 
                          alt="Poster Preview" 
                          referrerPolicy="no-referrer"
                          className="w-full h-36 object-cover object-center"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPopImageUrl('');
                            persistPopupChanges({ imageUrl: '' }, 'Gambar poster pop-up dihapus & disimpan!');
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white text-xs transition-colors cursor-pointer"
                          title="Hapus Gambar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl bg-slate-950/80 border border-dashed border-slate-700 text-center text-slate-500 text-[11px]">
                        Tidak ada gambar poster (Pop-up akan tampil minimalis tanpa banner gambar)
                      </div>
                    )}

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">URL Gambar Poster</label>
                      <input
                        type="text"
                        value={popImageUrl}
                        onChange={(e) => setPopImageUrl(e.target.value)}
                        onBlur={(e) => {
                          if (e.target.value.trim() !== (popupConfig.imageUrl || '')) {
                            persistPopupChanges({ imageUrl: e.target.value.trim() });
                          }
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:border-emerald-400"
                      />
                    </div>

                    {/* Image Preset Buttons */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400">Pilihan Gambar Preset:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const presetUrl = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80';
                            setPopImageUrl(presetUrl);
                            persistPopupChanges({ imageUrl: presetUrl }, 'Gambar preset Gedung Peradilan diterapkan & disimpan!');
                          }}
                          className="px-2 py-1 rounded bg-slate-950 hover:bg-emerald-900 border border-slate-800 text-[10px] text-slate-300 cursor-pointer"
                        >
                          Gedung Peradilan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const presetUrl = 'https://images.unsplash.com/photo-1575320181282-9afab399332c?w=800&auto=format&fit=crop&q=80';
                            setPopImageUrl(presetUrl);
                            persistPopupChanges({ imageUrl: presetUrl }, 'Gambar preset Ruang Sidang diterapkan & disimpan!');
                          }}
                          className="px-2 py-1 rounded bg-slate-950 hover:bg-emerald-900 border border-slate-800 text-[10px] text-slate-300 cursor-pointer"
                        >
                          Ruang Sidang
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const presetUrl = 'https://images.unsplash.com/photo-1521791136364-723a757042f0?w=800&auto=format&fit=crop&q=80';
                            setPopImageUrl(presetUrl);
                            persistPopupChanges({ imageUrl: presetUrl }, 'Gambar preset Zona Integritas diterapkan & disimpan!');
                          }}
                          className="px-2 py-1 rounded bg-slate-950 hover:bg-emerald-900 border border-slate-800 text-[10px] text-slate-300 cursor-pointer"
                        >
                          Zona Integritas
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const presetUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80';
                            setPopImageUrl(presetUrl);
                            persistPopupChanges({ imageUrl: presetUrl }, 'Gambar preset Digital SIPP diterapkan & disimpan!');
                          }}
                          className="px-2 py-1 rounded bg-slate-950 hover:bg-emerald-900 border border-slate-800 text-[10px] text-slate-300 cursor-pointer"
                        >
                          Digital SIPP
                        </button>
                      </div>
                    </div>

                    {/* Upload File to base64 */}
                    <div className="pt-2 border-t border-slate-800">
                      <label className="block text-[11px] font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Gambar Poster Baru</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              showToast('Maksimal ukuran poster 10MB', 'error');
                              e.target.value = '';
                              return;
                            }
                            showToast('Mengunggah & menyimpan gambar poster pop-up...');
                            try {
                              const result = await compressImage(file, 1080, 1350, 0.75);
                              const uploadedUrl = await CourtDB.uploadBase64ToServer(result, file.name || 'poster_pengumuman', 'uploads');
                              const finalUrl = uploadedUrl || result;
                              setPopImageUrl(finalUrl);
                              persistPopupChanges({ imageUrl: finalUrl }, 'Gambar poster pop-up berhasil diunggah & disimpan permanen ke database!');
                            } catch (err) {
                              console.error('Popup upload error:', err);
                              showToast('Gagal memproses gambar poster pop-up', 'error');
                            } finally {
                              e.target.value = '';
                            }
                          }
                        }}
                        className="w-full text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-600 file:cursor-pointer text-[10px]"
                      />
                    </div>
                  </div>

                  {/* Action Link & Behavior */}
                  <div className="bg-slate-900/80 rounded-2xl border border-emerald-500/20 p-5 space-y-4 text-xs">
                    <h4 className="font-black text-white flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-amber-400" />
                      <span>Tombol Aksi & Navigasi</span>
                    </h4>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Teks Tombol Utama</label>
                      <input
                        type="text"
                        value={popButtonText}
                        onChange={(e) => setPopButtonText(e.target.value)}
                        placeholder="Contoh: Buka Layanan PTSP Online"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Tujuan Tab Navigasi</label>
                      <select
                        value={popButtonLinkTab}
                        onChange={(e) => setPopButtonLinkTab(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-bold"
                      >
                        <option value="layanan">Layanan PTSP & Pelayanan Publik</option>
                        <option value="sipp">SIPP (Sistem Informasi Penelusuran Perkara)</option>
                        <option value="jadwal">Jadwal Sidang Terbuka</option>
                        <option value="reformasi">Zona Integritas (WBK/WBBM)</option>
                        <option value="profil">Profil Pengadilan & Satker</option>
                        <option value="berita">Berita & Publikasi Terkini</option>
                        <option value="transparansi">Transparansi & PPID</option>
                        <option value="beranda">Beranda Utama</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Tautan Eksternal Opsional (URL)</label>
                      <input
                        type="text"
                        value={popExternalLink}
                        onChange={(e) => setPopExternalLink(e.target.value)}
                        placeholder="https://siwas.mahkamahagung.go.id"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:border-emerald-400"
                      />
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={popOnlyOnce}
                          onChange={(e) => setPopOnlyOnce(e.target.checked)}
                          className="w-4 h-4 text-emerald-500 rounded mt-0.5"
                        />
                        <div>
                          <span className="font-bold text-white block">Tampilkan 1x Per Sesi</span>
                          <span className="text-[10px] text-slate-400 block leading-snug">
                            Jika dicentang, setelah ditutup oleh pengunjung, pop-up tidak akan muncul kembali di tab yang sama hingga sesi browser ditutup.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Submit Save Button */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Perubahan pop-up akan tersimpan permanen di database dan langsung aktif bagi seluruh pengunjung.</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handlePreviewPopupModal}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>Pratinjau</span>
                  </button>

                  <button
                    type="submit"
                    id="btn-save-popup-config"
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Simpan Pengaturan Pop-up</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 6.5: MANAJEMEN SLIDER BANNER */}
        {activeTab === 'slider' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Manajemen Slider Banner Beranda</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Kelola gambar latar, judul utama, subjudul, ikon pinisi/losari, serta link navigasi slider beranda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openCreateModal('slider')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Slide Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {slidesList.length === 0 ? (
                <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-center space-y-2">
                  <Layers className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400 font-bold">Belum ada slide banner beranda.</p>
                  <p className="text-[10px] text-slate-500">Klik "Tambah Slide Baru" di atas untuk menambahkan slide.</p>
                </div>
              ) : (
                slidesList.map((slide, index) => (
                  <div 
                    key={slide.id} 
                    className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row gap-5 items-stretch relative overflow-hidden"
                  >
                    {/* Background image preview container */}
                    <div className="w-full md:w-56 h-36 rounded-xl overflow-hidden relative border border-slate-800 flex-shrink-0 bg-slate-950">
                      <img 
                        src={slide.bgImage} 
                        alt={slide.title}
                        className="w-full h-full object-cover opacity-60"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-3">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-600/90 text-[9px] font-bold text-white w-fit uppercase">
                          {slide.badge}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono font-bold text-amber-400 border border-amber-500/20">
                        Slide {index + 1}
                      </div>
                    </div>

                    {/* Content information */}
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{slide.tag}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-700" />
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            Target: <strong className="text-emerald-400">{slide.targetSection}</strong>
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white mt-1">{slide.title}</h4>
                        <p className="text-xs text-slate-300 font-medium mt-1 line-clamp-2 leading-relaxed">{slide.desc}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-400 font-bold font-mono">
                        <div>
                          <span className="font-sans text-slate-500">Subjudul: </span>
                          <span className="text-slate-200">{slide.subtitle || '-'}</span>
                        </div>
                        <div className="h-3 w-[1px] bg-slate-800 hidden sm:block" />
                        <div>
                          <span className="font-sans text-slate-500">Tombol: </span>
                          <span className="text-emerald-400">{slide.actionText}</span>
                        </div>
                        <div className="h-3 w-[1px] bg-slate-800 hidden sm:block" />
                        <div>
                          <span className="font-sans text-slate-500">Ikon: </span>
                          <span className="text-amber-400 uppercase">{slide.iconType}</span>
                        </div>
                        <div className="h-3 w-[1px] bg-slate-800 hidden sm:block" />
                        <div>
                          <span className="font-sans text-slate-500">Lokasi: </span>
                          <span className="text-slate-300">{slide.makassarHighlight}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions panel */}
                    <div className="flex md:flex-col justify-end items-center gap-2 border-t md:border-t-0 md:border-l border-slate-800/80 pt-3 md:pt-0 md:pl-5 flex-shrink-0">
                      <label className={`flex-1 md:flex-initial p-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-bold px-3 md:px-2 md:w-full ${
                        uploadingSlideId === slide.id 
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40 cursor-wait' 
                          : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 cursor-pointer'
                      }`}>
                        {uploadingSlideId === slide.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Menyimpan...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Ganti Foto</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingSlideId !== null}
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 10 * 1024 * 1024) {
                                showToast('Ukuran maksimal foto 10MB', 'error');
                                e.target.value = '';
                                return;
                              }
                              setUploadingSlideId(slide.id);
                              showToast(`Mengunggah gambar baru untuk Slide ${index + 1}...`);
                              try {
                                const compressed = await compressImage(file, 1280, 720, 0.75);
                                const uploadedUrl = await CourtDB.uploadBase64ToServer(compressed, file.name || `slide_${index + 1}`, 'uploads');
                                CourtDB.updateSlide(slide.id, { bgImage: uploadedUrl });
                                setSlidesList(CourtDB.getSlides());
                                refreshData(false);
                                showToast(`Gambar Slide ${index + 1} berhasil diganti dan disimpan permanen!`);
                              } catch (err) {
                                console.error('Slide upload error:', err);
                                showToast('Gagal mengunggah gambar slide', 'error');
                              } finally {
                                setUploadingSlideId(null);
                                e.target.value = '';
                              }
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => openEditModal('slider', slide)}
                        className="flex-1 md:flex-initial p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold px-3 md:px-2 md:w-full"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span className="md:hidden">Ubah</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal('slider', slide)}
                        className="flex-1 md:flex-initial p-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold px-3 md:px-2 md:w-full"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="md:hidden">Hapus</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: INOVASI LAYANAN PUBLIK */}
        {activeTab === 'inovasi' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 rounded-2xl border border-amber-400/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-white">Inovasi Layanan Publik</h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-400/30">
                      {inovasiList.length} APLIKASI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Kelola seluruh aplikasi inovasi pelayanan publik, PTSP Online, Cuti Online, e-Berpadu, dan Notifikasi WhatsApp.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {onNavigateToSection && (
                  <button
                    type="button"
                    onClick={() => onNavigateToSection('beranda', 'beranda-inovasi-ptsp')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lihat di Beranda</span>
                  </button>
                )}

                {canUserPerform(currentUser, 'inovasi', 'edit') && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Kembalikan daftar Inovasi Layanan Publik ke konfigurasi bawaan resmi?')) {
                        CourtDB.resetInovasiQuickAccess();
                        refreshData();
                        showToast('Daftar Inovasi Layanan Publik berhasil direset ke standar awal.');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Standar</span>
                  </button>
                )}

                {canUserPerform(currentUser, 'inovasi', 'create') && (
                  <button
                    type="button"
                    onClick={() => openCreateModal('inovasi')}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Tambah Inovasi</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama aplikasi, instansi, atau kategori..."
                  value={inovasiSearch}
                  onChange={(e) => setInovasiSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-400"
                />
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Menampilkan {inovasiList.filter(i => 
                  !inovasiSearch.trim() || 
                  i.namaAplikasi.toLowerCase().includes(inovasiSearch.toLowerCase()) ||
                  i.namaLengkap.toLowerCase().includes(inovasiSearch.toLowerCase()) ||
                  i.kategori.toLowerCase().includes(inovasiSearch.toLowerCase())
                ).length} dari {inovasiList.length} inovasi
              </div>
            </div>

            {/* Inovasi Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {inovasiList
                .filter(item => 
                  !inovasiSearch.trim() || 
                  item.namaAplikasi.toLowerCase().includes(inovasiSearch.toLowerCase()) ||
                  item.namaLengkap.toLowerCase().includes(inovasiSearch.toLowerCase()) ||
                  item.kategori.toLowerCase().includes(inovasiSearch.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-400/50 transition-all flex flex-col justify-between gap-3 group relative overflow-hidden"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center font-mono">
                            #{item.urutan}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                            {item.badge}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Aktif' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                          {item.namaAplikasi}
                        </h4>
                        <div className="text-[11px] font-semibold text-emerald-300 line-clamp-1">
                          {item.namaLengkap}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {item.deskripsi}
                      </p>

                      <div className="pt-2 border-t border-slate-800 space-y-1 text-[10px] text-slate-400">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Kategori:</span>
                          <span className="font-semibold text-slate-300">{item.kategori}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Domain / URL:</span>
                          <span className="font-mono text-amber-300 truncate max-w-[180px]">{item.domainLabel || item.urlTujuan}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Buka Tab:</span>
                          <span className="font-semibold text-slate-300">{item.bukaTabBaru ? 'Tab Baru (_blank)' : 'Internal Tab'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                      <a
                        href={item.urlTujuan}
                        target={item.bukaTabBaru ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 text-emerald-400" />
                        <span>Buka URL</span>
                      </a>

                      <div className="flex items-center gap-1">
                        {canUserPerform(currentUser, 'inovasi', 'edit') && (
                          <button
                            type="button"
                            onClick={() => openEditModal('inovasi', item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer"
                            title="Edit Inovasi"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canUserPerform(currentUser, 'inovasi', 'delete') && (
                          <button
                            type="button"
                            onClick={() => openDeleteModal('inovasi', item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-rose-400 transition-colors cursor-pointer"
                            title="Hapus Inovasi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 7: PENGGUNA & HAK AKSES */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20">
              <div>
                <h3 className="text-sm font-extrabold text-white">Manajemen Akun Pengelola & Hak Akses (RBAC)</h3>
                <p className="text-[11px] text-slate-400">Kelola otorisasi Super Admin, Kepaniteraan, Kesekretariatan, Humas, PTSP, dan User Terdaftar.</p>
              </div>

              {canUserPerform(currentUser, 'users', 'create') && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Daftar / Tambah Akun Baru</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {usersList.map((u) => (
                <div key={u.id} className="p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={u.nama}
                      className="w-11 h-11 rounded-xl object-cover border border-amber-400/40 shrink-0"
                    />
                    <div>
                      <h4 className="font-black text-white text-xs">{u.nama}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{u.email}</span>
                      <div className="text-[10px] font-bold text-amber-300 uppercase">
                        {u.role.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] space-y-1">
                    <div className="text-slate-400">Instansi: <span className="text-slate-200">{u.instansi}</span></div>
                    <div className="text-slate-400">WhatsApp: <span className="text-emerald-400 font-mono">{u.nomorWA}</span></div>
                    <div className="text-slate-500 text-[10px]">Login Terakhir: {u.lastLogin || '-'}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Status: {u.status}
                    </span>

                    {canUserPerform(currentUser, 'users', 'delete') && (
                      <button
                        type="button"
                        onClick={() => openDeleteModal('users', u)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-red-400 transition-colors cursor-pointer"
                        title="Hapus Akun"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CRUD LAYANAN E-COURT PERKARA */}
        {activeTab === 'ecourt' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl text-white">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg font-bold">
                  <Laptop className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    Pengelolaan Konten Layanan Perkara Elektronik (e-Court)
                    <span className="px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-200 text-[10px] border border-blue-400/30 font-mono">
                      ADMIN CRUD
                    </span>
                  </h3>
                  <p className="text-xs text-blue-200 leading-relaxed mt-1">
                    Kelola data secara visual dan real-time: Banner, Dasar Hukum, Jenis Perkara e-Filing, Dokumen Persyaratan, Alur Langkah, Bank Mitra e-Payment, e-Summons, dan e-Litigation.
                  </p>
                </div>
              </div>
            </div>

            <ECourtSection />
          </div>
        )}

        {/* TAB 8: BACKUP & RESTORE APLIKASI (JSON & SQL DUMP) */}
        {activeTab === 'database' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header Banner */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shrink-0 shadow-lg font-bold">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    Pusat Pemulihan & Cadangan Basis Data Aplikasi
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] border border-amber-400/30 font-mono">
                      FORMAT: .SQL DUMP & .JSON
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    Kelola ekspor cadangan basis data lengkap dalam format <strong className="text-emerald-300">.sql (Skrip SQL PostgreSQL / ANSI Dump)</strong> maupun <strong className="text-amber-300">.json</strong>, lakukan pemulihan instant (*restore*), atau kembalikan ke standar pabrik Mahkamah Agung RI.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExportSql}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Code className="w-4 h-4" />
                  <span>Unduh Script .SQL</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Berkas .JSON</span>
                </button>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-rose-950/40 to-slate-900 rounded-2xl border border-rose-500/30 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Paksa Sinkronisasi & Pembersihan Cache</h4>
                <p className="text-[11px] text-rose-200/70">
                  Gunakan tombol ini jika gambar atau data terlihat basi (stale) dan tidak diperbarui meski sudah diubah di server.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Lakukan pembersihan cache dan paksa sinkronisasi ulang dengan server?')) {
                    CourtDB.forceFullSync();
                    showToast('Sinkronisasi penuh dipicu!');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-lg transition-all"
              >
                Sync Ulang Sekarang
              </button>
            </div>

            {/* Central Server & LAN Sync Status Card */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 rounded-2xl border border-indigo-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0 text-indigo-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      Server Database Terpusat (LAN / Wi-Fi Multi-Perangkat)
                    </h4>
                    {serverVersionInfo?.storage === 'mongodb_atlas' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        MongoDB Atlas (Permanen Cloud)
                      </span>
                    ) : serverVersionInfo?.mongodbError ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        MongoDB Gagal Konek (Cek URI)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Aktif Terhubung
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Data tersimpan di server utama (<code className="text-indigo-300 font-mono text-[11px]">/api/court-db</code>). Setiap pembaruan data otomatis disinkronkan ke seluruh HP, laptop, dan komputer lain yang terhubung dalam satu jaringan Wi-Fi/LAN kantor.
                    {serverVersionInfo && (
                      <span className="block text-[11px] text-slate-400 mt-0.5">
                        Versi Database Server: <strong>v{serverVersionInfo.version}</strong> &bull; Terakhir Diperbarui: {serverVersionInfo.lastUpdated ? new Date(serverVersionInfo.lastUpdated).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Baru saja'}
                        {serverVersionInfo.storage && (
                          <> &bull; Mode Storage: <strong className="text-indigo-300 font-mono">{serverVersionInfo.storage}</strong></>
                        )}
                      </span>
                    )}
                    {serverVersionInfo?.mongodbError && (
                      <span className="block mt-1.5 text-[11px] font-medium text-amber-300 bg-amber-950/60 p-1.5 rounded-lg border border-amber-600/40">
                        ⚠️ <strong>Perhatian:</strong> Koneksi MongoDB Atlas gagal ({serverVersionInfo.mongodbError}). Pastikan variabel <code className="bg-amber-900/60 px-1 py-0.5 rounded">MONGODB_URI</code> di Vercel menggunakan domain cluster asli (bukan contoh &quot;cluster0.abcde.mongodb.net&quot;).
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={handleManualSyncPush}
                  disabled={isServerSyncing}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  title="Kirim seluruh data lokal saat ini ke server pusat"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isServerSyncing ? 'animate-spin' : ''}`} />
                  <span>Kirim ke Server</span>
                </button>

                <button
                  type="button"
                  onClick={handleManualSyncPull}
                  disabled={isServerSyncing}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Tarik data terbaru dari server pusat"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tarik Pembaruan</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Personel</div>
                <div className="text-lg font-black text-emerald-400 mt-0.5">{personnelList.length}</div>
                <div className="text-[9px] text-slate-500">Aparatur & Hakim</div>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Perkara SIPP</div>
                <div className="text-lg font-black text-amber-400 mt-0.5">{sippList.length}</div>
                <div className="text-[9px] text-slate-500">Banding Militer</div>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Jadwal Sidang</div>
                <div className="text-lg font-black text-sky-400 mt-0.5">{jadwalList.length}</div>
                <div className="text-[9px] text-slate-500">Kartika & Cakra</div>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Berita Humas</div>
                <div className="text-lg font-black text-purple-400 mt-0.5">{newsList.length}</div>
                <div className="text-[9px] text-slate-500">Artikel & Siaran</div>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">PPID & DIP</div>
                <div className="text-lg font-black text-blue-400 mt-0.5">{dipList.length}</div>
                <div className="text-[9px] text-slate-500">Regulasi PERMA</div>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Akun Pengguna</div>
                <div className="text-lg font-black text-pink-400 mt-0.5">{usersList.length}</div>
                <div className="text-[9px] text-slate-500">RBAC Active</div>
              </div>
            </div>

            {/* Main Action Cards: Backup & Restore */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Card 1: Ekspor Cadangan (Format SQL Dump & JSON) */}
              <div className="p-5 bg-slate-900/80 rounded-2xl border border-emerald-500/20 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                      <Download className="w-5 h-5" />
                      <span>Ekspor Cadangan (.SQL & .JSON)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Standard SQL Dump
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Unduh skrip <strong className="text-emerald-300">.sql (CREATE TABLE & INSERT INTO)</strong> yang kompatibel dengan PostgreSQL/MySQL atau simpan berkas snapshot data <strong className="text-amber-300">.json</strong>.
                  </p>
                  
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
                    <div className="text-slate-400 flex justify-between">
                      <span>Database Engine:</span>
                      <span className="text-emerald-400 font-bold">CourtDB LocalStorage Engine</span>
                    </div>
                    <div className="text-slate-400 flex justify-between">
                      <span>SQL Syntax Format:</span>
                      <span className="text-slate-200">PostgreSQL / ANSI SQL-92</span>
                    </div>
                    <div className="text-slate-400 flex justify-between">
                      <span>Waktu Generate:</span>
                      <span className="text-amber-300">{new Date().toLocaleTimeString('id-ID')} WITA</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleExportSql}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Code className="w-4 h-4" />
                    <span>Unduh .SQL</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <FileJson className="w-4 h-4" />
                    <span>Unduh .JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePreviewSqlModal}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <Eye className="w-4 h-4 text-sky-400" />
                    <span>Intip Script SQL</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Impor & Memulihkan Database (Restore .SQL / .JSON) */}
              <div className="p-5 bg-slate-900/80 rounded-2xl border border-emerald-500/20 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sky-400 font-black text-sm">
                      <Upload className="w-5 h-5" />
                      <span>Impor & Pulihkan Database (Restore File)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Mendukung .SQL & .JSON
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Unggah berkas skrip <strong className="text-emerald-300">.sql</strong> atau <strong className="text-amber-300">.json</strong> yang pernah diunduh untuk mengembalikan seluruh tabel dan catatan data secara otomatis.
                  </p>

                  <form onSubmit={handleImportRestoreFile} className="space-y-3">
                    <div className="border-2 border-dashed border-slate-700 hover:border-emerald-400/60 rounded-xl p-4 text-center bg-slate-950/50 transition-colors">
                      <input
                        type="file"
                        accept=".sql,.json"
                        onChange={handleFileChange}
                        className="hidden"
                        id="restoreFileInput"
                      />
                      <label htmlFor="restoreFileInput" className="cursor-pointer block space-y-1.5">
                        <Upload className="w-6 h-6 text-sky-400 mx-auto animate-bounce" />
                        <span className="text-xs font-bold text-slate-200 block">
                          {restoreFileName ? restoreFileName : 'Klik atau Tarik Berkas Cadangan (.SQL / .JSON) Ke Sini'}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Format resmi: dilmilti5_database_backup_*.sql / *.json
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!restoreJsonContent}
                      className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                        restoreJsonContent
                          ? 'bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 cursor-pointer font-black'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Eksekusi & Pulihkan Database</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Danger Zone: Factory Reset */}
            <div className="p-5 bg-red-950/40 rounded-2xl border border-red-500/40 space-y-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-white">Reset Database Ke Standar Pabrik (Factory Reset)</h4>
                  <p className="text-xs text-red-200/80 leading-relaxed">
                    Mengembalikan seluruh koleksi data (Personel PDF resmi, Perkara SIPP awal, Jadwal Sidang, Berita resmi) ke kondisi bawaan standar Mahkamah Agung RI.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Ke Standar Pabrik</span>
              </button>
            </div>

            {/* Audit Trail Log for Backup & Restore */}
            <div className="p-5 bg-slate-900/80 rounded-2xl border border-emerald-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Riwayat Audit System Backup & Pemulihan</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Total Audit: {auditLogs.length} Entri</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Waktu WITA</th>
                      <th className="p-2.5">Aksi</th>
                      <th className="p-2.5">Modul</th>
                      <th className="p-2.5">Operator</th>
                      <th className="p-2.5">Rincian Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {auditLogs.slice(0, 10).map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40">
                        <td className="p-2.5 text-slate-400">{log.timestamp}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.action === 'BACKUP' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                            log.action === 'RESTORE' ? 'bg-sky-950 text-sky-300 border border-sky-500/30' :
                            log.action === 'CREATE' ? 'bg-amber-950 text-amber-300' :
                            log.action === 'DELETE' ? 'bg-red-950 text-red-300' :
                            'bg-purple-950 text-purple-300'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-300">{log.module}</td>
                        <td className="p-2.5 text-slate-200 font-bold">{log.operator}</td>
                        <td className="p-2.5 text-slate-400">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL DIALOG (CREATE / EDIT / DELETE) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div 
            className="w-full max-w-xl bg-slate-900 text-slate-100 rounded-2xl border border-emerald-500/40 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-emerald-500/20 bg-slate-950/60">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>
                  {modalType === 'create' ? `Tambah Data ${modalTargetModule.toUpperCase()}` :
                   modalType === 'edit' ? `Edit Data ${modalTargetModule.toUpperCase()}` :
                   `Konfirmasi Hapus Data`}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleModalSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {modalType === 'delete' ? (
                <div className="space-y-3 text-center py-4">
                  <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
                  <h4 className="text-base font-black text-white">Apakah Anda yakin ingin menghapus data ini?</h4>
                  <p className="text-xs text-slate-300">
                    Data yang dihapus: <strong className="text-amber-300">{selectedItem?.nama || selectedItem?.judul || selectedItem?.nomorPerkara}</strong>. Tindakan ini tidak dapat dibatalkan.
                  </p>
                  <div className="flex justify-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white cursor-pointer shadow-lg"
                    >
                      Ya, Hapus Data
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* PERSONNEL FORM FIELDS */}
                  {modalTargetModule === 'personel' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Nama Lengkap & Gelar *</label>
                        <input
                          type="text"
                          required
                          value={persNama}
                          onChange={(e) => setPersNama(e.target.value)}
                          placeholder="Contoh: Kolonel Chk Sultan, S.H."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">NRP / NIP Resmi *</label>
                          <input
                            type="text"
                            required
                            value={persNipNrp}
                            onChange={(e) => setPersNipNrp(e.target.value)}
                            placeholder="Contoh: 11980017760771"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Pangkat / Golongan *</label>
                          <input
                            type="text"
                            required
                            value={persPangkat}
                            onChange={(e) => setPersPangkat(e.target.value)}
                            placeholder="Contoh: Kolonel Chk / Pembina IV/a"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Jabatan *</label>
                        <input
                          type="text"
                          required
                          value={persJabatan}
                          onChange={(e) => setPersJabatan(e.target.value)}
                          placeholder="Contoh: Wakadilmilti V Makassar / Panmud Pidana"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Kategori Bagian</label>
                          <select
                            value={persKategori}
                            onChange={(e) => setPersKategori(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          >
                            <option value="Pimpinan">Pimpinan</option>
                            <option value="Hakim Militer Tinggi">Hakim Militer Tinggi</option>
                            <option value="Kepaniteraan">Kepaniteraan</option>
                            <option value="Kesekretariatan">Kesekretariatan</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Matra / Instansi</label>
                          <select
                            value={persMatra}
                            onChange={(e) => setPersMatra(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          >
                            <option value="TNI AD">TNI AD</option>
                            <option value="TNI AL">TNI AL</option>
                            <option value="TNI AU">TNI AU</option>
                            <option value="ASN MA-RI">ASN MA-RI</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <input
                          type="checkbox"
                          id="isMutasiCheck"
                          checked={persIsMutasi}
                          onChange={(e) => setPersIsMutasi(e.target.checked)}
                          className="w-4 h-4 text-emerald-500 rounded"
                        />
                        <label htmlFor="isMutasiCheck" className="text-xs font-bold text-amber-300 cursor-pointer">
                          Tandai sebagai Pegawai Status Mutasi Masuk (Sesuai PDF)
                        </label>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Pendidikan Terakhir</label>
                        <input
                          type="text"
                          value={persPendidikan}
                          onChange={(e) => setPersPendidikan(e.target.value)}
                          placeholder="Contoh: S1 Ilmu Hukum / S2 Magister Hukum"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Riwayat Singkat / Catatan</label>
                        <textarea
                          rows={2}
                          value={persRiwayat}
                          onChange={(e) => setPersRiwayat(e.target.value)}
                          placeholder="Catatan penugasan atau riwayat kedinasan..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>

                      {/* Photo input: File Upload + URL Input + Live Preview */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                        <label className="block font-bold text-slate-300">Foto Resmi Pegawai</label>
                        <div className="flex items-center gap-3">
                          <img
                            src={getFreshImageUrl(persFotoUrl)}
                            alt="Preview"
                            onError={(e) => handleImageFallback(e, DEFAULT_OFFICIAL_AVATAR)}
                            className="w-16 h-20 rounded-xl object-cover border-2 border-emerald-500/50 shrink-0 bg-slate-900 shadow-md"
                          />
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <label className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Unggah Berkas Foto</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handlePersPhotoFileChange}
                                  className="hidden"
                                />
                              </label>
                              {persFotoUrl && (
                                <button
                                  type="button"
                                  onClick={() => setPersFotoUrl('')}
                                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-red-400 text-xs transition-colors"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              value={persFotoUrl}
                              onChange={(e) => setPersFotoUrl(e.target.value)}
                              placeholder="Atau tempel URL gambar (https://...)"
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:border-emerald-400"
                            />
                            <div className="text-[10px] text-slate-400">Format: JPG, PNG, WEBP. Maksimal 5MB.</div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800 space-y-1">
                          <div className="text-[11px] font-bold text-slate-400">Atau Pilih Preset Foto Resmi:</div>
                          <div className="grid grid-cols-5 gap-1.5">
                            {PERS_PHOTO_PRESETS.map((pr, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setPersFotoUrl(pr.url)}
                                className={`p-1 rounded-lg border text-center transition-all cursor-pointer ${
                                  persFotoUrl === pr.url ? 'border-emerald-400 bg-emerald-950/60' : 'border-slate-800 hover:border-slate-600 bg-slate-900'
                                }`}
                              >
                                <img src={pr.url} alt={pr.label} className="w-full h-10 object-cover rounded mb-0.5" />
                                <span className="text-[9px] font-semibold text-slate-300 block truncate">{pr.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NEWS FORM FIELDS */}
                  {modalTargetModule === 'berita' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Judul Artikel Berita *</label>
                        <input
                          type="text"
                          required
                          value={newsJudul}
                          onChange={(e) => setNewsJudul(e.target.value)}
                          placeholder="Ketik judul berita terkini..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Kategori</label>
                          <select
                            value={newsKategori}
                            onChange={(e) => setNewsKategori(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          >
                            <option value="Kegiatan Pengadilan">Kegiatan Pengadilan</option>
                            <option value="Siaran Pers">Siaran Pers</option>
                            <option value="Reformasi Birokrasi">Reformasi Birokrasi</option>
                            <option value="Pengumuman">Pengumuman</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Penulis / Sumber</label>
                          <input
                            type="text"
                            value={newsPenulis}
                            onChange={(e) => setNewsPenulis(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">
                          Gambar Thumbnail Berita (URL / Unggah Berkas)
                        </label>

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={newsGambarUrl}
                            onChange={(e) => setNewsGambarUrl(e.target.value)}
                            placeholder="Tulis URL Gambar (https://...) atau pilih unggah berkas di bawah..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-emerald-400"
                          />

                          {/* Quick Preset Buttons */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] text-slate-400 font-bold">Preset Foto:</span>
                            <button
                              type="button"
                              onClick={() => setNewsGambarUrl('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80')}
                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-800 text-slate-200 text-[10px] font-medium"
                            >
                              Gedung Pengadilan
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewsGambarUrl('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80')}
                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-800 text-slate-200 text-[10px] font-medium"
                            >
                              Teknologi SIPP
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewsGambarUrl('https://images.unsplash.com/photo-1521791136364-723a757042f0?w=600&auto=format&fit=crop&q=80')}
                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-800 text-slate-200 text-[10px] font-medium"
                            >
                              Sertifikasi WBBM
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewsGambarUrl('https://images.unsplash.com/photo-1575320181282-9afab399332c?w=600&auto=format&fit=crop&q=80')}
                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-800 text-slate-200 text-[10px] font-medium"
                            >
                              Ruang Sidang
                            </button>
                          </div>

                          {/* File Upload Input & Preview */}
                          <div className="flex items-center gap-3 pt-2">
                            <label className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-amber-300 border border-emerald-500/40 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Unggah Dari Komputer</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                      showToast('Ukuran maksimal 5MB', 'error');
                                      return;
                                    }
                                    compressImage(file, 800, 600, 0.8).then(async result => {
                                      const uploadedUrl = await CourtDB.uploadBase64ToServer(result, file.name || 'berita', 'uploads');
                                      setNewsGambarUrl(uploadedUrl);
                                      showToast('Gambar berita berhasil diunggah!');
                                    });
                                  }
                                }}
                              />
                            </label>

                            {/* Live Thumbnail Preview */}
                            {newsGambarUrl && (
                              <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                                <img
                                  src={newsGambarUrl}
                                  alt="Preview Thumbnail"
                                  className="w-12 h-9 object-cover rounded-lg border border-amber-400/50"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';
                                  }}
                                />
                                <span className="text-[10px] font-bold text-emerald-400">Pratinjau Thumbnail</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Ringkasan / Isi Berita</label>
                        <textarea
                          rows={4}
                          value={newsRingkasan}
                          onChange={(e) => setNewsRingkasan(e.target.value)}
                          placeholder="Tuliskan isi ringkasan berita..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="featuredCheck"
                          checked={newsIsFeatured}
                          onChange={(e) => setNewsIsFeatured(e.target.checked)}
                          className="w-4 h-4 text-emerald-500 rounded"
                        />
                        <label htmlFor="featuredCheck" className="text-xs font-bold text-amber-300">
                          Tampilkan sebagai Berita Utama (Headline)
                        </label>
                      </div>
                    </div>
                  )}

                  {/* SIPP FORM FIELDS */}
                  {modalTargetModule === 'sipp' && (
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Nomor Perkara Banding *</label>
                          <input
                            type="text"
                            required
                            value={sippNomor}
                            onChange={(e) => setSippNomor(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Status Perkara</label>
                          <select
                            value={sippStatus}
                            onChange={(e) => setSippStatus(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          >
                            <option value="Pemeriksaan">Pemeriksaan</option>
                            <option value="Tuntutan Oditur">Tuntutan Oditur</option>
                            <option value="Pledoi">Pledoi</option>
                            <option value="Putusan Diucapkan">Putusan Diucapkan</option>
                            <option value="Minutasi">Minutasi</option>
                            <option value="BHT (Inkracht)">BHT (Inkracht)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Nama Terdakwa *</label>
                          <input
                            type="text"
                            required
                            value={sippNamaTerdakwa}
                            onChange={(e) => setSippNamaTerdakwa(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Pangkat & NRP</label>
                          <input
                            type="text"
                            value={sippPangkat}
                            onChange={(e) => setSippPangkat(e.target.value)}
                            placeholder="Contoh: Serda / 2119001234"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Kesatuan</label>
                          <input
                            type="text"
                            value={sippKesatuan}
                            onChange={(e) => setSippKesatuan(e.target.value)}
                            placeholder="Contoh: Yonif 700 / Lantamal VI"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Klasifikasi Perkara</label>
                          <select
                            value={sippKlasifikasi}
                            onChange={(e) => setSippKlasifikasi(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          >
                            <option value="Pelanggaran Disiplin/Desersi">Pelanggaran Disiplin/Desersi</option>
                            <option value="Tindak Pidana Khusus Militer">Tindak Pidana Khusus Militer</option>
                            <option value="Tindak Pidana Umum">Tindak Pidana Umum</option>
                            <option value="Sengketa Kepegawaian TNI/TUN">Sengketa Kepegawaian TNI/TUN</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Amar Putusan (Jika Ada)</label>
                        <textarea
                          rows={2}
                          value={sippAmar}
                          onChange={(e) => setSippAmar(e.target.value)}
                          placeholder="Ketikkan ringkasan amar putusan majelis hakim..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  )}

                  {/* JADWAL FORM FIELDS */}
                  {modalTargetModule === 'jadwal' && (
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">No. Perkara *</label>
                          <input
                            type="text"
                            required
                            value={jdwNomorPerkara}
                            onChange={(e) => setJdwNomorPerkara(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Terdakwa *</label>
                          <input
                            type="text"
                            required
                            value={jdwTerdakwa}
                            onChange={(e) => setJdwTerdakwa(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Tanggal Sidang</label>
                          <input
                            type="date"
                            value={jdwTanggal}
                            onChange={(e) => setJdwTanggal(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Waktu / Jam</label>
                          <input
                            type="text"
                            value={jdwWaktu}
                            onChange={(e) => setJdwWaktu(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Ruang Sidang</label>
                          <select
                            value={jdwRuang}
                            onChange={(e) => setJdwRuang(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          >
                            <option value="Ruang Sidang Utama Kartika">Ruang Sidang Utama Kartika</option>
                            <option value="Ruang Sidang Cakra">Ruang Sidang Cakra</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Status Sidang</label>
                          <select
                            value={jdwStatus}
                            onChange={(e) => setJdwStatus(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          >
                            <option value="Akan Datang">Akan Datang</option>
                            <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Ditunda">Ditunda</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Agenda Sidang</label>
                        <input
                          type="text"
                          value={jdwAgenda}
                          onChange={(e) => setJdwAgenda(e.target.value)}
                          placeholder="Contoh: Pemeriksaan Saksi / Pembacaan Tuntutan"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* PPID / DIP FORM FIELDS */}
                  {modalTargetModule === 'ppid' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Nama / Judul Informasi Publik *</label>
                        <input
                          type="text"
                          required
                          value={dipNamaInformasi}
                          onChange={(e) => setDipNamaInformasi(e.target.value)}
                          placeholder="Contoh: Laporan Kinerja Instansi Pemerintah (LKjIP) 2025"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>

                      {/* File Upload Selector for DIP */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-dashed border-emerald-500/40 space-y-2">
                        <label className="block font-bold text-emerald-300 text-[11px] flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          Unggah Dokumen Fisik DIP / Informasi Publik (.pdf, .doc, .docx, .xls, .xlsx)
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,image/*"
                          onChange={handleDipFilePicker}
                          className="w-full text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-600 file:cursor-pointer text-xs"
                        />
                        {dipFileName && (
                          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                            <span className="font-mono text-emerald-400 truncate max-w-[280px]">
                              {dipFileName}
                            </span>
                            <span className="font-mono text-amber-300 shrink-0">
                              {dipUkuranFile}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Kategori DIP</label>
                          <select
                            value={dipKategori}
                            onChange={(e) => setDipKategori(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          >
                            <option value="Berkala">Berkala</option>
                            <option value="Serta Merta">Serta Merta</option>
                            <option value="Setiap Saat">Setiap Saat</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Ukuran / Format File</label>
                          <input
                            type="text"
                            value={dipUkuranFile}
                            onChange={(e) => setDipUkuranFile(e.target.value)}
                            placeholder="Contoh: 1.5 MB (PDF)"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Unit Kerja Penanggung Jawab</label>
                          <input
                            type="text"
                            value={dipUnitKerja}
                            onChange={(e) => setDipUnitKerja(e.target.value)}
                            placeholder="Contoh: Subbagian Perencanaan & TI"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Penanggung Jawab Dokumentasi</label>
                          <input
                            type="text"
                            value={dipPenanggungJawab}
                            onChange={(e) => setDipPenanggungJawab(e.target.value)}
                            placeholder="Contoh: PPID Dilmilti V Makassar"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Ringkasan / Uraian Singkat Informasi</label>
                        <textarea
                          rows={3}
                          value={dipRingkasan}
                          onChange={(e) => setDipRingkasan(e.target.value)}
                          placeholder="Jelaskan ringkasan materi dokumen informasi publik..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  )}

                  {/* SAKIP / DIPA / LHKPN FORM FIELDS */}
                  {(modalTargetModule as string) === 'sakip' && (
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Judul Dokumen Resmi *</label>
                        <input
                          type="text"
                          required
                          value={sakipJudul}
                          onChange={(e) => setSakipJudul(e.target.value)}
                          placeholder="Contoh: Rencana Strategis (Renstra) TA 2025-2029"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>

                      {/* File Upload Selector for SAKIP */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-dashed border-emerald-500/40 space-y-2">
                        <label className="block font-bold text-emerald-300 text-[11px] flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          Unggah File Fisik Dokumen (PDF, DOCX, XLSX, PNG, JPG)
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                          onChange={handleSakipFilePicker}
                          className="w-full text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-600 file:cursor-pointer text-xs"
                        />
                        {sakipFileName && (
                          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                            <span className="font-mono text-emerald-400 truncate max-w-[280px]">
                              {sakipFileName}
                            </span>
                            <span className="font-mono text-amber-300 shrink-0">
                              {sakipFileSize || '1.5 MB'} ({sakipFileType})
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Kategori Dokumen</label>
                          <select
                            value={sakipKategori}
                            onChange={(e) => setSakipKategori(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          >
                            <option value="SAKIP">SAKIP & Akuntabilitas</option>
                            <option value="DIPA">Keuangan & DIPA</option>
                            <option value="LAPORAN_PERKARA">Laporan Perkara & Kepaniteraan</option>
                            <option value="LHKPN">LHKPN / LHKASN</option>
                            <option value="LAPORAN_SURVEI">Laporan Survei IKM & IPAK</option>
                            <option value="LAPORAN_POSBAKUM">Laporan Posbakum & Prodeo</option>
                            <option value="LAPORAN_EVIDEN_ZI">Laporan Eviden ZI WBBM</option>
                            <option value="PPID">Laporan PPID & Keterbukaan Informasi</option>
                            <option value="STANDAR_PELAYANAN">Standar Pelayanan</option>
                            <option value="MAKLUMAT">Maklumat Pelayanan</option>
                            <option value="SK_SOP">SK & SOP Standard</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Tahun Anggaran / Terbit</label>
                          <input
                            type="text"
                            value={sakipTahun}
                            onChange={(e) => setSakipTahun(e.target.value)}
                            placeholder="2026"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Nomor Surat / SK</label>
                          <input
                            type="text"
                            value={sakipNomor}
                            onChange={(e) => setSakipNomor(e.target.value)}
                            placeholder="SK/01/2026"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          />
                        </div>
                      </div>

                      {sakipKategori === 'DIPA' && (
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Alokasi Nilai Anggaran (Khusus DIPA)</label>
                          <input
                            type="text"
                            value={sakipNilai}
                            onChange={(e) => setSakipNilai(e.target.value)}
                            placeholder="Contoh: Rp 4,8 Miliar"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          />
                        </div>
                      )}

                      {sakipKategori === 'LHKPN' && (
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Persentase Kepatuhan (Khusus LHKPN)</label>
                          <input
                            type="text"
                            value={sakipKepatuhan}
                            onChange={(e) => setSakipKepatuhan(e.target.value)}
                            placeholder="100%"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Uraian & Ringkasan Eksekutif Dokumen</label>
                        <textarea
                          rows={3}
                          value={sakipDeskripsi}
                          onChange={(e) => setSakipDeskripsi(e.target.value)}
                          placeholder="Jelaskan ringkasan materi dan cakupan dokumen fisik..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  )}

                  {/* EVIDEN REFORMASI BIROKRASI (ZI) FORM FIELDS */}
                  {modalTargetModule === 'eviden' && (
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Judul Dokumen Eviden *</label>
                        <input
                          type="text"
                          required
                          value={evidenJudul}
                          onChange={(e) => setEvidenJudul(e.target.value)}
                          placeholder="Contoh: SK Tim Kerja Pembangunan Zona Integritas Tahun 2026"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Nomor Surat / SK Resmi</label>
                          <input
                            type="text"
                            value={evidenNomor}
                            onChange={(e) => setEvidenNomor(e.target.value)}
                            placeholder="Contoh: W5-Mil.01/OT.01.1/SK/01/2026"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono text-[11px]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Area Perubahan *</label>
                          <select
                            value={evidenAreaId}
                            onChange={(e) => setEvidenAreaId(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          >
                            <option value={0}>Dokumen LKE PMPRB & SK Tim Kerja</option>
                            <option value={1}>Area I: Manajemen Perubahan</option>
                            <option value={2}>Area II: Penataan Tatalaksana</option>
                            <option value={3}>Area III: Manajemen SDM Aparatur</option>
                            <option value={4}>Area IV: Penguatan Akuntabilitas</option>
                            <option value={5}>Area V: Penguatan Pengawasan</option>
                            <option value={6}>Area VI: Kualitas Pelayanan Publik</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Tahun Anggaran</label>
                          <select
                            value={evidenTahun}
                            onChange={(e) => setEvidenTahun(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          >
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Format Berkas</label>
                          <select
                            value={evidenFileType}
                            onChange={(e) => setEvidenFileType(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          >
                            <option value="PDF">PDF</option>
                            <option value="XLSX">XLSX / Excel</option>
                            <option value="DOCX">DOCX / Word</option>
                            <option value="ZIP">ZIP / RAR</option>
                            <option value="IMAGE">Gambar (JPG/PNG)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Status Verifikasi</label>
                          <select
                            value={evidenStatusVerifikasi}
                            onChange={(e) => setEvidenStatusVerifikasi(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          >
                            <option value="Terverifikasi">Terverifikasi</option>
                            <option value="Dalam Proses">Dalam Proses</option>
                            <option value="Revisi">Revisi</option>
                          </select>
                        </div>
                      </div>

                      {/* File Upload Selector */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-dashed border-emerald-500/40 space-y-2">
                        <label className="block font-bold text-emerald-300 text-[11px] flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          Unggah File Eviden (PDF, DOCX, XLSX, ZIP)
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,image/*"
                          onChange={handleEvidenFilePicker}
                          className="w-full text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-600 file:cursor-pointer text-xs"
                        />
                        {evidenFileName && (
                          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                            <span className="font-mono text-emerald-400 truncate max-w-[280px]">
                              {evidenFileName}
                            </span>
                            <span className="font-mono text-amber-300 shrink-0">
                              {evidenFileSize || '1.8 MB'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Nama Pengunggah</label>
                          <input
                            type="text"
                            value={evidenDiuploadOleh}
                            onChange={(e) => setEvidenDiuploadOleh(e.target.value)}
                            placeholder="Contoh: Tim Kerja WBBM Dilmilti V"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Ukuran / Keterangan File</label>
                          <input
                            type="text"
                            value={evidenFileSize}
                            onChange={(e) => setEvidenFileSize(e.target.value)}
                            placeholder="Contoh: 1.8 MB"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono text-[11px]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Uraian / Ringkasan Eviden</label>
                        <textarea
                          rows={2}
                          value={evidenKeterangan}
                          onChange={(e) => setEvidenKeterangan(e.target.value)}
                          placeholder="Jelaskan substansi eviden pemenuhan komponen LKE..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  )}

                  {/* SATKER (PERMA 1/2017) FORM FIELDS */}
                  {modalTargetModule === 'satker' && (
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Kelompok Satuan Kerja *</label>
                          <select
                            value={satkerKelompok}
                            onChange={(e) => setSatkerKelompok(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          >
                            <option value="Pimpinan">Pimpinan</option>
                            <option value="Kepaniteraan">Kepaniteraan (Teknis Peradilan)</option>
                            <option value="Kesekretariatan">Kesekretariatan (Non-Teknis)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Nama Jabatan Struktural *</label>
                          <input
                            type="text"
                            required
                            value={satkerJabatan}
                            onChange={(e) => setSatkerJabatan(e.target.value)}
                            placeholder="Contoh: Panitera Muda Pidana"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          >
                          </input>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Nama Pejabat / Aparatur *</label>
                          <input
                            type="text"
                            required
                            value={satkerNamaPejabat}
                            onChange={(e) => setSatkerNamaPejabat(e.target.value)}
                            placeholder="Contoh: Mayor Chk ..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Pangkat & Gol / NRP / NIP</label>
                          <input
                            type="text"
                            value={satkerPangkatNip}
                            onChange={(e) => setSatkerPangkatNip(e.target.value)}
                            placeholder="Contoh: Mayor Chk / NRP 110200..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Tugas Pokok & Fungsi Sesuai PERMA</label>
                        <textarea
                          rows={3}
                          value={satkerTugasFungsi}
                          onChange={(e) => setSatkerTugasFungsi(e.target.value)}
                          placeholder="Uraian tugas pokok dan fungsi jabatan..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAUTAN RESMI FORM FIELDS */}
                  {modalTargetModule === 'tautan' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Nama Lembaga / Portal Resmi *</label>
                        <input
                          type="text"
                          required
                          value={rwName}
                          onChange={(e) => setRwName(e.target.value)}
                          placeholder="Contoh: Mahkamah Agung RI"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">URL Website Resmi *</label>
                          <input
                            type="text"
                            required
                            value={rwUrl}
                            onChange={(e) => setRwUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Kategori Tautan</label>
                          <select
                            value={rwCategory}
                            onChange={(e) => setRwCategory(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          >
                            <option value="Mahkamah Agung">Mahkamah Agung</option>
                            <option value="Ditjen Badilmiltun">Ditjen Badilmiltun</option>
                            <option value="Pengawasan">Pengawasan (SIWAS/SP4N)</option>
                            <option value="Layanan Publik">Layanan Publik (e-Court/JDIH)</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Deskripsi / Peranan Portal</label>
                        <input
                          type="text"
                          value={rwRole}
                          onChange={(e) => setRwRole(e.target.value)}
                          placeholder="Contoh: Portal Pusat Peradilan Tertinggi Indonesia"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  )}

                  {/* PROFIL DILMIL TINGKAT PERTAMA FORM FIELDS */}
                  {modalTargetModule === 'profil' && selectedItem && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                        <div className="font-bold text-white text-sm">{selectedItem.name} ({selectedItem.code})</div>
                        <div className="text-[11px] text-amber-300 font-mono">Wilayah Hukum: {selectedItem.jurisdiction}</div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Alamat Kantor Gedung Pengadilan *</label>
                        <textarea
                          rows={2}
                          required
                          value={dilmilAddress}
                          onChange={(e) => setDilmilAddress(e.target.value)}
                          placeholder="Alamat lengkap gedung pengadilan..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Nomor Telepon / Kontak Resmi</label>
                        <input
                          type="text"
                          value={dilmilPhone}
                          onChange={(e) => setDilmilPhone(e.target.value)}
                          placeholder="Contoh: (0411) 123456 / WA: 0811-..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* SLIDER BANNER FORM FIELDS */}
                  {modalTargetModule === 'slider' && (
                    <div className="space-y-3 text-xs text-left">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Label Badge *</label>
                          <input
                            type="text"
                            required
                            value={slideBadge}
                            onChange={(e) => setSlideBadge(e.target.value)}
                            placeholder="Contoh: LAYANAN PUBLIK"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Tag Atas</label>
                          <input
                            type="text"
                            value={slideTag}
                            onChange={(e) => setSlideTag(e.target.value)}
                            placeholder="Contoh: DILMILTI V MAKASSAR"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Judul Utama Slide *</label>
                          <input
                            type="text"
                            required
                            value={slideTitle}
                            onChange={(e) => setSlideTitle(e.target.value)}
                            placeholder="Contoh: Layanan Aspirasi Online Rakyat"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Subjudul Pendukung</label>
                          <input
                            type="text"
                            value={slideSubtitle}
                            onChange={(e) => setSlideSubtitle(e.target.value)}
                            placeholder="Contoh: Mengawal Transparansi Keadilan"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Deskripsi Informasi Panjang</label>
                        <textarea
                          rows={3}
                          value={slideDesc}
                          onChange={(e) => setSlideDesc(e.target.value)}
                          placeholder="Tuliskan deskripsi lengkap atau ringkasan informasi yang ingin ditampilkan..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Teks Tombol Aksi</label>
                          <input
                            type="text"
                            value={slideActionText}
                            onChange={(e) => setSlideActionText(e.target.value)}
                            placeholder="Contoh: Buka SIPP Banding"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Tujuan Section Navigasi</label>
                          <select
                            value={slideTargetSection}
                            onChange={(e) => setSlideTargetSection(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-bold"
                          >
                            <option value="sipp">SIPP (Sistem Informasi Perkara)</option>
                            <option value="jadwal">Jadwal Sidang Pengadilan</option>
                            <option value="layanan">Layanan PTSP & Pengaduan</option>
                            <option value="berita">Berita & Publikasi Terbaru</option>
                            <option value="struktur">Struktur Satker & Profil Pejabat</option>
                            <option value="kontak">Hubungi Kami & Peta Satker</option>
                            <option value="visimisi">Visi, Misi & Tugas Pokok</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Jenis Ikon Visual</label>
                          <select
                            value={slideIconType}
                            onChange={(e) => setSlideIconType(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          >
                            <option value="pinisi">Perahu Pinisi (Tradisional)</option>
                            <option value="losari">Pantai Losari / Mercusuar</option>
                            <option value="ptsp">Meja Layanan Terpadu (PTSP)</option>
                            <option value="perma">Peradilan & Lambang Hukum (MA-RI)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Sorotan Lokasi (Highlight)</label>
                          <input
                            type="text"
                            value={slideMakassarHighlight}
                            onChange={(e) => setSlideMakassarHighlight(e.target.value)}
                            placeholder="Contoh: Makassar, Sulawesi Selatan"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Tautan Gambar Latar belakang (URL / Unggah Gambar)</label>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={slideBgImage}
                            onChange={(e) => setSlideBgImage(e.target.value)}
                            placeholder="Contoh: /images/makassar_court_banner_1789442426023.jpg atau tautan https://..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono text-xs"
                          />

                          {/* Live preview banner */}
                          {slideBgImage && (
                            <div className="relative rounded-xl overflow-hidden border border-emerald-500/40 h-36 bg-slate-950 group">
                              <img
                                key={slideBgImage}
                                src={slideBgImage}
                                alt="Pratinjau Slide"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/makassar_court_banner_1789442426023.jpg';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-end justify-between p-2.5">
                                <span className="text-[10px] font-bold text-emerald-300 bg-slate-900/90 px-2 py-0.5 rounded border border-emerald-500/30">
                                  Pratinjau Gambar Aktif
                                </span>
                                {modalType === 'edit' && selectedItem && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!slideBgImage) return;
                                      CourtDB.updateSlide(selectedItem.id, { bgImage: slideBgImage });
                                      selectedItem.bgImage = slideBgImage;
                                      refreshData();
                                      showToast('Gambar latar berhasil disimpan & disinkronkan!');
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow cursor-pointer transition-all flex items-center gap-1"
                                  >
                                    <CheckCircle className="w-3 h-3 text-emerald-200" />
                                    <span>Terapkan Gambar Ini</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Preset banners */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] text-slate-400">Pilihan Cepat Standar:</span>
                            {[
                              { label: 'Gedung Pengadilan', url: '/images/makassar_court_banner_1789442426023.jpg' },
                              { label: 'Meja PTSP', url: '/images/ptsp_makassar_banner_1789442442546.jpg' },
                              { label: 'Transformasi Digital', url: '/images/maklumat_banner_1789442457863.jpg' },
                              { label: 'Perahu Pinisi', url: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=1200&auto=format&fit=crop&q=80' },
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => {
                                  setSlideBgImage(preset.url);
                                  if (modalType === 'edit' && selectedItem?.id) {
                                    CourtDB.updateSlide(selectedItem.id, { bgImage: preset.url });
                                    selectedItem.bgImage = preset.url;
                                    refreshData();
                                    showToast(`Gambar latar berhasil diubah ke ${preset.label}!`);
                                  }
                                }}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-800 text-slate-200 text-[10px] font-medium transition-colors cursor-pointer"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>

                          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                            <span className="text-[10px] text-slate-400">Unggah berkas gambar dari komputer (disimpan ke server):</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 10 * 1024 * 1024) {
                                    showToast('Ukuran maksimal 10MB', 'error');
                                    return;
                                  }
                                  showToast('Mengunggah gambar slide ke server...');
                                  compressImage(file, 1280, 720, 0.75).then(async (compressed) => {
                                    const uploadedUrl = await CourtDB.uploadBase64ToServer(compressed, file.name || 'slider_banner', 'uploads');
                                    setSlideBgImage(uploadedUrl);
                                    if (modalType === 'edit' && selectedItem?.id) {
                                      CourtDB.updateSlide(selectedItem.id, { bgImage: uploadedUrl });
                                      selectedItem.bgImage = uploadedUrl;
                                      refreshData();
                                      showToast('Gambar latar belakang berhasil diunggah dan langsung tersimpan permanen!');
                                    } else {
                                      showToast('Gambar latar belakang berhasil diunggah!');
                                    }
                                  });
                                }
                              }}
                              className="text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-600 file:cursor-pointer text-[10px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* USERS / RBAC FORM FIELDS */}
                  {modalTargetModule === 'users' && (
                    <div className="space-y-3 text-xs text-left">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Nama Lengkap & Gelar *</label>
                          <input
                            type="text"
                            required
                            value={userNama}
                            onChange={(e) => setUserNama(e.target.value)}
                            placeholder="Contoh: Mayor Chk Ahmad, S.H."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Alamat Email (Akun Login) *</label>
                          <input
                            type="email"
                            required
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="nama@dilmilti5-makassar.go.id"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">
                            {modalType === 'create' ? 'Kata Sandi Awal *' : 'Ganti Kata Sandi (Kosongkan jika tidak diubah)'}
                          </label>
                          <input
                            type="text"
                            required={modalType === 'create'}
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            placeholder={modalType === 'create' ? 'Minimal 6 karakter' : 'Masukkan password baru...'}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Hak Akses / Otoritas (Role) *</label>
                          <select
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value as UserRole)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-bold"
                          >
                            <option value="super_admin">Super Administrator (Akses Penuh)</option>
                            <option value="admin_kepaniteraan">Admin Kepaniteraan (SIPP & Jadwal)</option>
                            <option value="admin_kesekretariatan">Admin Kesekretariatan (Satker, SDM, Eviden)</option>
                            <option value="humas">Petugas Humas / PPID</option>
                            <option value="petugas_ptsp">Petugas PTSP Terpadu</option>
                            <option value="user_terdaftar">Pengguna Publik Terdaftar</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">NIP / NRP (Opsional)</label>
                          <input
                            type="text"
                            value={userNipNrp}
                            onChange={(e) => setUserNipNrp(e.target.value)}
                            placeholder="Contoh: 198501012010121001"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Nomor WhatsApp *</label>
                          <input
                            type="text"
                            value={userNomorWa}
                            onChange={(e) => setUserNomorWa(e.target.value)}
                            placeholder="Contoh: 0812-4455-6677"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Instansi / Unit Kerja</label>
                          <input
                            type="text"
                            value={userInstansi}
                            onChange={(e) => setUserInstansi(e.target.value)}
                            placeholder="Pengadilan Militer Tinggi V Makassar"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Status Akun</label>
                          <select
                            value={userStatus}
                            onChange={(e) => setUserStatus(e.target.value as 'aktif' | 'nonaktif')}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 font-bold"
                          >
                            <option value="aktif">Aktif (Dapat Login)</option>
                            <option value="nonaktif">Nonaktif (Dibekukan)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-xs font-black text-slate-950 cursor-pointer shadow-lg"
                    >
                      {modalType === 'create' ? 'Simpan Data Baru' : 'Simpan Perubahan'}
                    </button>
                  </div>
                </>
              )}

            </form>
          </div>
        </div>
      )}

      {/* MODAL: SINKRONISASI DATA SIPP LOCALHOST / API */}
      {isSippSyncModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-sky-500/30 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                  <RefreshCw className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm flex items-center gap-2">
                    Sinkronisasi Data Persidangan dari SIPP Localhost
                    <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-300 font-mono border border-sky-500/30">
                      PHP-API Sync Engine
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Integrasi data jadwal sidang & register perkara dari database SIPP MySQL</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSippSyncModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Sub-tabs */}
            <div className="bg-slate-950/60 px-4 pt-2 border-b border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSippSyncActiveTab('live')}
                className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 ${
                  sippSyncActiveTab === 'live'
                    ? 'bg-slate-900 text-sky-400 border-t-2 border-x border-sky-500 border-b-slate-900 -mb-px'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>1. Penarikan Langsung (Live API)</span>
              </button>
              <button
                type="button"
                onClick={() => setSippSyncActiveTab('manual')}
                className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 ${
                  sippSyncActiveTab === 'manual'
                    ? 'bg-slate-900 text-sky-400 border-t-2 border-x border-sky-500 border-b-slate-900 -mb-px'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>2. Impor Manual JSON</span>
              </button>
              <button
                type="button"
                onClick={() => setSippSyncActiveTab('script')}
                className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 ${
                  sippSyncActiveTab === 'script'
                    ? 'bg-slate-900 text-sky-400 border-t-2 border-x border-sky-500 border-b-slate-900 -mb-px'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>3. Panduan & Skrip sync.php</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              
              {/* TAB 1: LIVE HTTP API FETCH */}
              {sippSyncActiveTab === 'live' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 space-y-2">
                    <h4 className="font-bold text-sky-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sky-400" />
                      <span>Alamat Endpoint API Sync SIPP</span>
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Masukkan URL endpoint `sync.php` yang terpasang pada web server SIPP lokal Anda (Apache/Nginx XAMPP/Linux).
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={sippSyncUrl}
                        onChange={(e) => setSippSyncUrl(e.target.value)}
                        placeholder="/api/sipp/sync"
                        className="flex-1 bg-slate-950 border border-sky-400/50 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-sky-400"
                      />
                      <button
                        type="button"
                        onClick={handleExecuteSippSyncLive}
                        disabled={sippSyncStatus === 'loading'}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {sippSyncStatus === 'loading' ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        <span>Tarik Data Sekarang</span>
                      </button>
                    </div>
                  </div>

                  {/* Operational Note & Quick Simulation Action */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-xl gap-3">
                    <div className="space-y-0.5">
                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Info className="w-4 h-4" />
                        <span>Mode Uji Coba Tanpa Server SIPP Localhost?</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Anda dapat menekan simulasi di samping untuk langsung menguji pengisian data perkara & jadwal sidang.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSimulateSampleSippSync}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Simulasi Sampel Data</span>
                    </button>
                  </div>

                  {/* Output Log Terminal */}
                  {sippSyncLog && (
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-300">Status & Log Hasil Penarikan SIPP:</label>
                      <div className={`p-4 rounded-xl font-mono text-[11px] leading-relaxed border ${
                        sippSyncStatus === 'success' 
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' 
                          : sippSyncStatus === 'error'
                          ? 'bg-red-950/60 text-red-300 border-red-500/40'
                          : 'bg-slate-950 text-sky-300 border-sky-500/30'
                      }`}>
                        <pre className="whitespace-pre-wrap">{sippSyncLog}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MANUAL JSON PASTE */}
              {sippSyncActiveTab === 'manual' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 text-[11px]">
                    <strong className="text-white block mb-1">Kapan Menggunakan Impor Manual JSON?</strong>
                    Jika aplikasi ini diakses melalui domain cloud HTTPS dan server SIPP lokal Anda tidak menggunakan SSL, browser akan memblokir request langsung (Cross-Origin Mixed Content). Anda cukup membuka <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">http://localhost/php-api/sync.php</code> di browser PC SIPP, lalu salin dan tempelkan teks respon JSON-nya di bawah ini:
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Tempelkan Respon JSON dari sync.php *</label>
                    <textarea
                      rows={8}
                      value={sippManualJsonPayload}
                      onChange={(e) => setSippManualJsonPayload(e.target.value)}
                      placeholder='{\n  "success": true,\n  "data": {\n    "jadwal_sidang": [...],\n    "perkara": [...]\n  }\n}'
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-emerald-400 font-mono text-[11px] focus:border-sky-400"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleExecuteSippSyncManual}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Proses Impor JSON SIPP</span>
                    </button>
                  </div>

                  {sippSyncLog && sippSyncActiveTab === 'manual' && (
                    <div className="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-[11px] text-emerald-300">
                      <pre className="whitespace-pre-wrap">{sippSyncLog}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PHP SCRIPT INSTRUCTIONS & CODE VIEWER */}
              {sippSyncActiveTab === 'script' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-slate-200 space-y-2">
                    <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>Petunjuk Pemasangan Script sync.php di Server SIPP Localhost</span>
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                      <li>Buat folder baru <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded">php-api</code> di folder webroot server SIPP (misal: <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded">C:\xampp\htdocs\php-api\</code> atau <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded">/var/www/html/php-api/</code>).</li>
                      <li>Buat berkas bernama <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded">sync.php</code> dan tempelkan kode PHP di bawah ini.</li>
                      <li>Pastikan skrip dapat terhubung ke MySQL SIPP dengan mengatur environment variable atau mengedit variabel <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded">$sipp_host</code>, <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded">$sipp_user</code>, dan <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded">$sipp_pass</code>.</li>
                    </ol>
                  </div>

                  <div className="relative">
                    <div className="absolute right-3 top-3">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(PHP_SYNC_SCRIPT_CODE);
                          showToast('Skrip PHP sync.php berhasil disalin!');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Skrip PHP</span>
                      </button>
                    </div>
                    <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-amber-300 font-mono text-[10.5px] max-h-72 overflow-y-auto leading-relaxed select-all">
                      {PHP_SYNC_SCRIPT_CODE}
                    </pre>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px] flex items-center gap-1 text-sky-400">
                <CheckCircle className="w-3.5 h-3.5" />
                Terhubung dengan Database SIPP DILMILTI V Makassar
              </span>
              <button
                type="button"
                onClick={() => setIsSippSyncModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW SCRIPT SQL DUMP */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm flex items-center gap-2">
                    Pratinjau Skrip SQL Dump (.SQL)
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                      PostgreSQL / ANSI SQL
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Skrip DDL & DML untuk importasi database peradilan militer</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(sqlPreviewContent);
                    showToast('Skrip SQL Dump berhasil disalin ke clipboard!');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin SQL</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportSql}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh .sql</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSqlModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Code Viewer */}
            <div className="p-4 flex-1 overflow-y-auto bg-slate-950 text-emerald-400 font-mono text-[11px] leading-relaxed select-all">
              <pre className="whitespace-pre-wrap">{sqlPreviewContent}</pre>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">
                Total Baris: <strong className="text-emerald-400">{sqlPreviewContent.split('\n').length}</strong> baris SQL DDL/DML
              </span>
              <button
                type="button"
                onClick={() => setIsSqlModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT ISI DATA MENU (23 SUB-MENU ITEMS) */}
      <MenuContentEditModal
        isOpen={isMenuEditModalOpen}
        menuId={editingMenuId}
        onClose={() => {
          setIsMenuEditModalOpen(false);
          setEditingMenuId(null);
        }}
        onSaveSuccess={(savedItem) => {
          setCourtIdentity(CourtDB.getCourtIdentity());
          setJurisdictionCourts(CourtDB.getJurisdictionCourts());
          setPersonnelList(CourtDB.getPersonnelList());
          setSatkerList(CourtDB.getSatkerStructure());
        }}
        onNavigateToLivePage={(section, subTab) => {
          if (onNavigateToSection) {
            onNavigateToSection(section, subTab);
          } else {
            showToast(`Navigasi ke halaman ${section} (${subTab || 'utama'})...`);
          }
        }}
        onOpenSpecificTab={(tabName) => {
          setActiveTab(tabName as any);
        }}
        showToast={showToast}
      />

      {/* MODAL: PENGATURAN & STATUS SINKRONISASI LINTAS PERANGKAT */}
      {isSyncInfoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Server className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Status & Pengaturan Sinkronisasi Lintas Perangkat</h3>
                  <p className="text-[11px] text-slate-400">Pengadilan Militer Tinggi V Makassar • Node.js Engine Port 3000</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSyncInfoModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-200">
              
              {/* Real-time Diagnostic Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${CourtDB.getSyncStatus().connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                    <span className="font-bold text-white text-xs">
                      {CourtDB.getSyncStatus().connected ? 'Terhubung Ke Server Sentral (Node.js)' : 'Mode Sinkronisasi Lokal (Offline Fallback)'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/40 font-bold">
                    DB Versi: v{CourtDB.getSyncStatus().version || 1}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Interval Polling Otomatis:</span>
                    <strong className="text-emerald-300 font-mono">1.5 Detik (Real-time)</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Koneksi Antar-Tab (0ms):</span>
                    <strong className="text-amber-300 font-mono">BroadcastChannel Active</strong>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={async () => {
                      await CourtDB.fetchFromCentralServer();
                      refreshData();
                      showToast('Database berhasil diperbarui & ditarik dari server sentral!');
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Tarik Pembaruan Server</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await CourtDB.syncAllToServer();
                      refreshData();
                      showToast('Seluruh data lokal berhasil dikirim & disinkronkan ke server!');
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Kirim Data Lokal ke Server</span>
                  </button>
                </div>
              </div>

              {/* Instructions on how to access on other devices */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-extrabold text-amber-300 text-xs flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Cara Agar PC / Ponsel (HP) Lain Dapat Melihat Data Terupdate:</span>
                </h4>

                <ol className="space-y-2 list-decimal list-inside text-slate-300 leading-relaxed text-[11px]">
                  <li>
                    <strong className="text-white">Gunakan URL Server Web Yang Sama:</strong>
                    <div className="mt-1 p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-300 flex items-center justify-between gap-2 overflow-x-auto">
                      <span>{typeof window !== 'undefined' ? window.location.origin : 'https://dilmilti5-makassar.go.id'}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            navigator.clipboard.writeText(window.location.origin);
                            showToast('Link URL aplikasi berhasil disalin ke clipboard!');
                          }
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Salin Link</span>
                      </button>
                    </div>
                  </li>
                  <li>
                    <strong className="text-white">Otomatisasi Lintas Perangkat:</strong> Setiap kali Anda mengedit berita, foto, jadwal sidang, atau data SIPP di PC Admin, data dikirim ke endpoint server `/api/court-db`. Ponsel/PC lain akan mendeteksi peningkatan versi dalam 1.5 detik dan memperbarui layar secara otomatis tanpa perlu me-refresh browser.
                  </li>
                  <li>
                    <strong className="text-white">Hindari Membuka File HTML Statis Saja:</strong> Jika ponsel/PC lain membuka file HTML lokal tanpa server Express Node.js, aplikasi tidak dapat mengakses `/api/court-db` dan hanya menyimpan data secara terisolasi di perangkat tersebut.
                  </li>
                </ol>
              </div>

            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSyncInfoModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
