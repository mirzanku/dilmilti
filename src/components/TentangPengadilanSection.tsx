import React, { useState, useEffect } from 'react';
import { compressImage, getFreshImageUrl, handleImageFallback, DEFAULT_OFFICIAL_AVATAR } from '../utils/imageHelper';
import { 
  Building2, 
  Target, 
  MapPin, 
  Users, 
  Award, 
  Compass, 
  FileText, 
  ShieldCheck, 
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  FileCheck,
  Camera,
  Upload,
  Eye,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Briefcase,
  UserCheck,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import { PersonnelItem, SatkerStructureItem, CourtIdentityData, JurisdictionCourtItem, UserAccount, MenuContentItem, RoleModelAndAgentItem } from '../types';
import { isStaffUser } from '../utils/rbac';
import MenuContentEditModal from './admin/MenuContentEditModal';
import { syncRouteToUrl } from '../utils/urlRouter';
import OfficerProfileImage from './OfficerProfileImage';

interface TentangProps {
  initialSubTab?: string;
  onOpenAdmin?: () => void;
  onNavigate?: (section: any, subTab?: string) => void;
  currentUser?: UserAccount | null;
}

const PHOTO_PRESETS = [
  { label: 'Pamen TNI AD (Kolonel Chk)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { label: 'Pamen TNI AU (Kolonel Kum)', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80' },
  { label: 'Pamen TNI AD (Mayor Chk)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
  { label: 'Pama TNI (Kapten Chk)', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80' },
  { label: 'Aparatur ASN Pria (Jas/Batik)', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80' },
  { label: 'Aparatur ASN Wanita (Hijab)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
  { label: 'Aparatur ASN Wanita (Resmi)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80' },
  { label: 'Staf Aparatur (Batik)', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80' },
];

export default function TentangPengadilanSection({ initialSubTab = 'sambutan', onOpenAdmin, onNavigate, currentUser }: TentangProps) {
  const [subTab, setSubTab] = useState<string>(initialSubTab);

  const isAdminOrStaff = isStaffUser(currentUser);

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
      if (initialSubTab === 'profil-hakim') setPersFilter('HAKIM_PIMPINAN');
      else if (initialSubTab === 'profil-panitera' || initialSubTab === 'profil-kepaniteraan') setPersFilter('Kepaniteraan');
      else if (initialSubTab === 'profil-sekretaris' || initialSubTab === 'profil-kesekretariatan') setPersFilter('Kesekretariatan');
      else if (initialSubTab === 'profil-pegawai' || initialSubTab === 'pejabat') setPersFilter('ALL');
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (subTab) {
      syncRouteToUrl('tentang', subTab, true);
    }
  }, [subTab]);

  const [personnelList, setPersonnelList] = useState<PersonnelItem[]>(() => CourtDB.getPersonnel());
  const [satkerList, setSatkerList] = useState<SatkerStructureItem[]>(() => CourtDB.getSatkerStructure());
  const [courtIdentity, setCourtIdentity] = useState<CourtIdentityData>(() => CourtDB.getCourtIdentity());
  const [jurisdictionCourts, setJurisdictionCourts] = useState<JurisdictionCourtItem[]>(() => CourtDB.getJurisdictionCourts());
  const [menuContents, setMenuContents] = useState<MenuContentItem[]>(() => CourtDB.getAllMenuContents());
  const [roleModelList, setRoleModelList] = useState<RoleModelAndAgentItem[]>(() => CourtDB.getRoleModelAgents());
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [persFilter, setPersFilter] = useState('ALL');
  const [persSearch, setPersSearch] = useState('');

  // Personnel Detail Popup & Photo Input Modal State
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelItem | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoTargetPersonnelId, setPhotoTargetPersonnelId] = useState('');
  const [photoInputUrl, setPhotoInputUrl] = useState('');
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState('');
  const [photoInputMode, setPhotoInputMode] = useState<'upload' | 'url' | 'preset'>('upload');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [copiedNip, setCopiedNip] = useState(false);

  // Satker Structure CRUD Modal state
  const [isSatkerModalOpen, setIsSatkerModalOpen] = useState(false);
  const [satkerModalMode, setSatkerModalMode] = useState<'create' | 'edit'>('create');
  const [selectedSatker, setSelectedSatker] = useState<SatkerStructureItem | null>(null);

  // Form fields for Satker
  const [formKelompok, setFormKelompok] = useState<'Kepaniteraan' | 'Kesekretariatan' | 'Pimpinan'>('Kepaniteraan');
  const [formJabatan, setFormJabatan] = useState('');
  const [formNamaPejabat, setFormNamaPejabat] = useState('');
  const [formPangkatNip, setFormPangkatNip] = useState('');
  const [formTugasFungsi, setFormTugasFungsi] = useState('');

  // Personnel Full CRUD Modal State (Admin / Staff Only)
  const [isPersCrudModalOpen, setIsPersCrudModalOpen] = useState(false);
  const [persCrudMode, setPersCrudMode] = useState<'create' | 'edit' | 'delete'>('create');
  const [selectedPersCrudItem, setSelectedPersCrudItem] = useState<PersonnelItem | null>(null);

  const [crudNama, setCrudNama] = useState('');
  const [crudNipNrp, setCrudNipNrp] = useState('');
  const [crudPangkatGol, setCrudPangkatGol] = useState('');
  const [crudJabatan, setCrudJabatan] = useState('');
  const [crudKategori, setCrudKategori] = useState<PersonnelItem['kategori']>('Kesekretariatan');
  const [crudIsMutasiMasuk, setCrudIsMutasiMasuk] = useState(false);
  const [crudMatra, setCrudMatra] = useState<PersonnelItem['matra']>('ASN MA-RI');
  const [crudPendidikan, setCrudPendidikan] = useState('');
  const [crudRiwayatSingkat, setCrudRiwayatSingkat] = useState('');
  const [crudFotoUrl, setCrudFotoUrl] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadData = () => {
    const list = CourtDB.getPersonnel();
    setPersonnelList(list);
    if (selectedPersonnel) {
      const refreshed = list.find(p => 
        p.id === selectedPersonnel.id || 
        (p.nipNrp && p.nipNrp !== '-' && p.nipNrp === selectedPersonnel.nipNrp) || 
        (p.nama && p.nama.toLowerCase() === selectedPersonnel.nama.toLowerCase())
      );
      if (refreshed) {
        setSelectedPersonnel(refreshed);
      }
    }
    setSatkerList(CourtDB.getSatkerStructure());
    setCourtIdentity(CourtDB.getCourtIdentity());
    setJurisdictionCourts(CourtDB.getJurisdictionCourts());
    setMenuContents(CourtDB.getAllMenuContents());
    setRoleModelList(CourtDB.getRoleModelAgents());
  };

  const menuM1 = menuContents.find(m => m.id === 'm1') || CourtDB.getMenuContentById('m1');
  const menuM2 = menuContents.find(m => m.id === 'm2') || CourtDB.getMenuContentById('m2');
  const menuM3 = menuContents.find(m => m.id === 'm3') || CourtDB.getMenuContentById('m3');
  const menuM4 = menuContents.find(m => m.id === 'm4') || CourtDB.getMenuContentById('m4');
  const menuM5 = menuContents.find(m => m.id === 'm5') || CourtDB.getMenuContentById('m5');
  const menuM6 = menuContents.find(m => m.id === 'm6') || CourtDB.getMenuContentById('m6');
  const menuM7 = menuContents.find(m => m.id === 'm7') || CourtDB.getMenuContentById('m7');
  const menuM8 = menuContents.find(m => m.id === 'm8') || CourtDB.getMenuContentById('m8');
  const menuM9 = menuContents.find(m => m.id === 'm9') || CourtDB.getMenuContentById('m9');

  const openPhotoModal = (p?: PersonnelItem) => {
    if (!isAdminOrStaff) {
      showToast('Akses dibatasi: Hanya Admin atau Petugas yang berwenang mengelola foto personel.');
      return;
    }
    const currentList = CourtDB.getPersonnel();
    const target = p || selectedPersonnel || currentList[0];
    if (target) {
      setPhotoTargetPersonnelId(String(target.id));
      setPhotoInputUrl(target.fotoUrl || '');
      setPhotoPreviewUrl(target.fotoUrl || '');
    } else {
      setPhotoTargetPersonnelId('');
      setPhotoInputUrl('');
      setPhotoPreviewUrl('');
    }
    setPhotoInputMode('upload');
    setIsPhotoModalOpen(true);
  };

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Ukuran foto maksimal 10MB!');
        return;
      }
      setIsUploadingPhoto(true);
      try {
        const compressedBase64 = await compressImage(file, 500, 650, 0.8);
        setPhotoPreviewUrl(compressedBase64);
        setPhotoInputUrl(compressedBase64);
        
        // Upload to backend storage
        const uploadedUrl = await CourtDB.uploadBase64ToServer(compressedBase64, file.name || 'personel', 'uploads');
        if (uploadedUrl && !uploadedUrl.startsWith('data:')) {
          setPhotoPreviewUrl(uploadedUrl);
          setPhotoInputUrl(uploadedUrl);
        }
        showToast('Foto pegawai siap disimpan!');
      } catch {
        showToast('Gagal memproses gambar foto.');
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const handleSavePersonnelPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminOrStaff) {
      showToast('Akses dibatasi: Hanya Admin atau Petugas yang dapat memperbarui foto personel.');
      return;
    }
    if (!photoTargetPersonnelId) {
      showToast('Pilih personel terlebih dahulu!');
      return;
    }
    let finalPhoto = photoPreviewUrl.trim() || photoInputUrl.trim();
    if (!finalPhoto) {
      showToast('Pilih berkas foto, pilih preset, atau masukkan URL foto terlebih dahulu!');
      return;
    }

    if (finalPhoto.startsWith('data:')) {
      finalPhoto = await CourtDB.uploadBase64ToServer(finalPhoto, 'personel', 'uploads');
    }

    const currentList = CourtDB.getPersonnel();
    const targetPerson = currentList.find(p => 
      String(p.id) === String(photoTargetPersonnelId) || 
      String(p.no) === String(photoTargetPersonnelId) ||
      (p.id && String(p.id).replace('pers-', '') === String(photoTargetPersonnelId).replace('pers-', ''))
    );
    
    const success = CourtDB.updatePersonnel(photoTargetPersonnelId, { 
      ...(targetPerson ? { nama: targetPerson.nama, nipNrp: targetPerson.nipNrp, jabatan: targetPerson.jabatan, kategori: targetPerson.kategori } : {}),
      fotoUrl: finalPhoto 
    });

    if (success) {
      CourtDB.syncAllData(true).catch(() => {});
      loadData();
      if (selectedPersonnel && (String(selectedPersonnel.id) === String(photoTargetPersonnelId) || (targetPerson && selectedPersonnel.nipNrp === targetPerson.nipNrp))) {
        setSelectedPersonnel(prev => prev ? { ...prev, fotoUrl: finalPhoto } : null);
      }
      showToast('Foto pegawai berhasil diperbarui dan disimpan secara permanen!');
      setIsPhotoModalOpen(false);
    } else {
      showToast('Gagal memperbarui foto pegawai. Silakan coba lagi.');
    }
  };

  const handleCopyNip = (nip: string) => {
    navigator.clipboard.writeText(nip);
    setCopiedNip(true);
    showToast(`NRP/NIP ${nip} disalin ke clipboard!`);
    setTimeout(() => setCopiedNip(false), 2000);
  };

  // Personnel CRUD Handlers (Admin / Staff Only)
  const openCreatePersonnel = () => {
    if (!isAdminOrStaff) {
      showToast('Akses dibatasi: Hanya Admin atau Petugas yang berwenang menambah data personel.');
      return;
    }
    setPersCrudMode('create');
    setSelectedPersCrudItem(null);
    setCrudNama('');
    setCrudNipNrp('');
    setCrudPangkatGol('');
    setCrudJabatan('');
    setCrudKategori('Kesekretariatan');
    setCrudIsMutasiMasuk(false);
    setCrudMatra('ASN MA-RI');
    setCrudPendidikan('');
    setCrudRiwayatSingkat('');
    setCrudFotoUrl('');
    setIsPersCrudModalOpen(true);
  };

  const openEditPersonnel = (p: PersonnelItem) => {
    if (!isAdminOrStaff) {
      showToast('Akses dibatasi: Hanya Admin atau Petugas yang berwenang mengedit data personel.');
      return;
    }
    setPersCrudMode('edit');
    setSelectedPersCrudItem(p);
    setCrudNama(p.nama || '');
    setCrudNipNrp(p.nipNrp || '');
    setCrudPangkatGol(p.pangkatGol || '');
    setCrudJabatan(p.jabatan || '');
    setCrudKategori(p.kategori || 'Kesekretariatan');
    setCrudIsMutasiMasuk(p.isMutasiMasuk || false);
    setCrudMatra(p.matra || 'ASN MA-RI');
    setCrudPendidikan(p.pendidikan || '');
    setCrudRiwayatSingkat(p.riwayatSingkat || '');
    setCrudFotoUrl(p.fotoUrl || '');
    setIsPersCrudModalOpen(true);
  };

  const openDeletePersonnel = (p: PersonnelItem) => {
    if (!isAdminOrStaff) {
      showToast('Akses dibatasi: Hanya Admin atau Petugas yang berwenang menghapus data personel.');
      return;
    }
    setPersCrudMode('delete');
    setSelectedPersCrudItem(p);
    setIsPersCrudModalOpen(true);
  };

  const handlePersFormPhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran foto maksimal 5MB!');
        return;
      }
      compressImage(file, 600, 800, 0.85).then(async (result) => {
        const uploadedUrl = await CourtDB.uploadBase64ToServer(result, file.name || 'personel', 'uploads');
        setCrudFotoUrl(uploadedUrl);
        showToast('Foto berhasil dimuat!');
      }).catch(() => {
        showToast('Gagal memproses gambar foto.');
      });
    }
  };

  const handleSavePersonnelForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminOrStaff) {
      showToast('Akses dibatasi: Hanya Admin atau Petugas yang dapat menyimpan data.');
      return;
    }

    if (persCrudMode === 'delete' && selectedPersCrudItem) {
      const ok = CourtDB.deletePersonnel(selectedPersCrudItem.id);
      if (ok) {
        showToast(`Personel "${selectedPersCrudItem.nama}" berhasil dihapus.`);
        loadData();
        setSelectedPersonnel(null);
        setIsPersCrudModalOpen(false);
      } else {
        showToast('Gagal menghapus personel.');
      }
      return;
    }

    if (!crudNama.trim() || !crudJabatan.trim()) {
      showToast('Nama Lengkap dan Jabatan wajib diisi!');
      return;
    }

    let finalFormPhoto = crudFotoUrl.trim();
    if (finalFormPhoto.startsWith('data:')) {
      finalFormPhoto = await CourtDB.uploadBase64ToServer(finalFormPhoto, 'personel', 'uploads');
    }

    if (persCrudMode === 'create') {
      const created = CourtDB.addPersonnel({
        nama: crudNama.trim(),
        nipNrp: crudNipNrp.trim() || '-',
        pangkatGol: crudPangkatGol.trim() || '-',
        jabatan: crudJabatan.trim(),
        kategori: crudKategori,
        isMutasiMasuk: crudIsMutasiMasuk,
        matra: crudMatra,
        pendidikan: crudPendidikan.trim(),
        riwayatSingkat: crudRiwayatSingkat.trim(),
        fotoUrl: finalFormPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
      });
      showToast(`Personel baru "${created.nama}" berhasil ditambahkan!`);
    } else if (persCrudMode === 'edit' && selectedPersCrudItem) {
      const updatedFotoUrl = finalFormPhoto !== '' ? finalFormPhoto : selectedPersCrudItem.fotoUrl;
      const success = CourtDB.updatePersonnel(selectedPersCrudItem.id, {
        nama: crudNama.trim(),
        nipNrp: crudNipNrp.trim() || selectedPersCrudItem.nipNrp,
        pangkatGol: crudPangkatGol.trim() || selectedPersCrudItem.pangkatGol,
        jabatan: crudJabatan.trim(),
        kategori: crudKategori,
        isMutasiMasuk: crudIsMutasiMasuk,
        matra: crudMatra,
        pendidikan: crudPendidikan.trim(),
        riwayatSingkat: crudRiwayatSingkat.trim(),
        fotoUrl: updatedFotoUrl
      });
      if (success) {
        showToast(`Data personel "${crudNama}" berhasil diperbarui!`);
        if (selectedPersonnel && (selectedPersonnel.id === selectedPersCrudItem.id || selectedPersonnel.nipNrp === selectedPersCrudItem.nipNrp)) {
          setSelectedPersonnel({
            ...selectedPersonnel,
            nama: crudNama.trim(),
            nipNrp: crudNipNrp.trim(),
            pangkatGol: crudPangkatGol.trim(),
            jabatan: crudJabatan.trim(),
            kategori: crudKategori,
            isMutasiMasuk: crudIsMutasiMasuk,
            matra: crudMatra,
            pendidikan: crudPendidikan.trim(),
            riwayatSingkat: crudRiwayatSingkat.trim(),
            fotoUrl: updatedFotoUrl
          });
        }
      } else {
        showToast('Gagal memperbarui data personel.');
      }
    }

    CourtDB.syncAllData(true).catch(() => {});
    loadData();
    setIsPersCrudModalOpen(false);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('dilmilti_db_updated', handleUpdate);
    return () => window.removeEventListener('dilmilti_db_updated', handleUpdate);
  }, []);

  const openCreateSatker = (kelompok: 'Kepaniteraan' | 'Kesekretariatan' | 'Pimpinan' = 'Kepaniteraan') => {
    if (!isAdminOrStaff) {
      showToast('Akses dibatasi: Hanya Admin atau Petugas yang berwenang menambah struktur satker.');
      return;
    }
    setSelectedSatker(null);
    setSatkerModalMode('create');
    setFormKelompok(kelompok);
    setFormJabatan('');
    setFormNamaPejabat('');
    setFormPangkatNip('');
    setFormTugasFungsi('');
    setIsSatkerModalOpen(true);
  };

  const openEditSatker = (item: SatkerStructureItem) => {
    if (!isAdminOrStaff) {
      showToast('Akses dibatasi: Hanya Admin atau Petugas yang berwenang mengedit struktur satker.');
      return;
    }
    setSelectedSatker(item);
    setSatkerModalMode('edit');
    setFormKelompok(item.kelompok);
    setFormJabatan(item.jabatan);
    setFormNamaPejabat(item.namaPejabat);
    setFormPangkatNip(item.pangkatNip || '');
    setFormTugasFungsi(item.tugasFungsi || '');
    setIsSatkerModalOpen(true);
  };

  const handleSaveSatker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminOrStaff) {
      showToast('Akses ditolak: Hanya Admin/Petugas yang dapat mengubah struktur satker.');
      return;
    }
    if (!formJabatan.trim() || !formNamaPejabat.trim()) {
      alert('Jabatan dan Nama Pejabat wajib diisi!');
      return;
    }

    if (satkerModalMode === 'create') {
      CourtDB.addSatkerStructure({
        kelompok: formKelompok,
        jabatan: formJabatan,
        namaPejabat: formNamaPejabat,
        pangkatNip: formPangkatNip,
        tugasFungsi: formTugasFungsi
      });
      showToast(`Unit/Jabatan ${formJabatan} berhasil ditambahkan!`);
    } else if (satkerModalMode === 'edit' && selectedSatker) {
      CourtDB.updateSatkerStructure(selectedSatker.id, {
        kelompok: formKelompok,
        jabatan: formJabatan,
        namaPejabat: formNamaPejabat,
        pangkatNip: formPangkatNip,
        tugasFungsi: formTugasFungsi
      });
      showToast(`Jabatan ${formJabatan} berhasil diperbarui!`);
    }
    setIsSatkerModalOpen(false);
  };

  const handleDeleteSatker = (item: SatkerStructureItem) => {
    if (!isAdminOrStaff) {
      showToast('Akses ditolak: Hanya Admin/Petugas yang dapat menghapus struktur satker.');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus data jabatan "${item.jabatan}" (${item.namaPejabat})?`)) {
      CourtDB.deleteSatkerStructure(item.id);
      showToast(`Jabatan ${item.jabatan} berhasil dihapus.`);
    }
  };

  const kepaniteraanItems = satkerList.filter(s => s.kelompok === 'Kepaniteraan');
  const kesekretariatanItems = satkerList.filter(s => s.kelompok === 'Kesekretariatan');

  const formatRankWithoutNipNrp = (text?: string) => {
    if (!text) return '';
    return text
      .replace(/\s*[•·|-]?\s*(?:NRP|NIP|NRP\/NIP)\s*[:.]?\s*[\d\s./-]+/gi, '')
      .replace(/\b(?:NRP|NIP)\b\s*[:.]?\s*[\d\s./-]+/gi, '')
      .replace(/\(\s*\)/g, '')
      .trim();
  };

  const filteredPersonnel = personnelList.filter(p => {
    const matchesSearch = 
      p.nama.toLowerCase().includes(persSearch.toLowerCase()) ||
      (p.pangkatGol || '').toLowerCase().includes(persSearch.toLowerCase()) ||
      p.jabatan.toLowerCase().includes(persSearch.toLowerCase());
    
    if (persFilter === 'ALL') return matchesSearch;
    if (persFilter === 'MUTASI') return matchesSearch && p.isMutasiMasuk;
    if (persFilter === 'HAKIM_PIMPINAN') {
      return matchesSearch && (p.kategori === 'Pimpinan' || p.kategori === 'Hakim Militer Tinggi' || p.jabatan.toLowerCase().includes('hakim') || p.jabatan.toLowerCase().includes('kepala'));
    }
    return matchesSearch && p.kategori === persFilter;
  });

  const getActiveSubTabTitle = () => {
    let menuId = '';
    switch (subTab) {
      case 'sambutan': menuId = 'm1'; break;
      case 'visimisi': menuId = 'm2'; break;
      case 'sejarah':
      case 'profil': menuId = 'm3'; break;
      case 'struktur': menuId = 'm4'; break;
      case 'denah': menuId = 'm5'; break;
      case 'role-model':
      case 'rolemodel': menuId = 'm6'; break;
      case 'kepaniteraan':
      case 'tugas-fungsi': menuId = 'm7'; break;
      case 'pengelolaan': menuId = 'm8'; break;
      case 'profil-pegawai':
      case 'pejabat': menuId = 'm9'; break;
      default: break;
    }
    if (menuId) {
      const found = menuContents.find(m => m.id === menuId);
      if (found?.judul) return found.judul;
    }

    switch (subTab) {
      case 'sambutan': return 'Sambutan Kepala';
      case 'visimisi': return 'Visi dan Misi';
      case 'sejarah':
      case 'profil': return 'Sejarah Pengadilan';
      case 'yurisdiksi': return 'Wilayah Yurisdiksi';
      case 'struktur': return 'Struktur Organisasi';
      case 'denah': return 'Denah Gedung';
      case 'pengelolaan': return 'Sistem Pengelolaan Pengadilan';
      case 'kepaniteraan':
      case 'tugas-fungsi': return 'Kepaniteraan & Tupoksi';
      case 'profil-hakim': return 'Profil Hakim Militer Tinggi';
      case 'profil-kepaniteraan':
      case 'profil-panitera': return 'Profil Kepaniteraan';
      case 'profil-kesekretariatan':
      case 'profil-sekretaris': return 'Profil Kesekretariatan';
      case 'profil-pegawai':
      case 'pejabat': return 'Direktori Seluruh Pegawai';
      case 'role-model':
      case 'rolemodel': return 'Profil Role Model';
      case 'agen-perubahan': return 'Profil Agen Perubahan';
      default: {
        const custom = menuContents.find(m => m.id === subTab);
        return custom?.judul || 'Tentang Pengadilan';
      }
    }
  };

  return (
    <section id="tentang-pengadilan-section" className="space-y-6">
      
      {/* Header Breadcrumb Ringkas: Pengunjung langsung melihat halaman yang dituju tanpa terhalang menu besar */}
      <div className="bg-gradient-to-r from-[#072414] via-[#0B3A23] to-[#04160D] text-white rounded-2xl px-4 py-3 sm:px-6 sm:py-3.5 border border-emerald-500/30 shadow-md flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('beranda')}
            className="text-emerald-300 hover:text-amber-300 font-bold transition-colors cursor-pointer"
          >
            Beranda
          </button>
          <span className="text-emerald-500 font-bold">/</span>
          <span className="text-emerald-200 font-semibold">Tentang Pengadilan</span>
          <span className="text-emerald-500 font-bold">/</span>
          <span className="text-amber-300 font-black tracking-wide">{getActiveSubTabTitle()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
            REWAKO
          </span>
          <span className="text-[11px] font-mono text-emerald-200/80 hidden sm:inline">
            Pengadilan Militer Tinggi V Makassar
          </span>
        </div>
      </div>

      {/* SUBTAB: SAMBUTAN WAKADILMILTI (MENU M1) */}
      {subTab === 'sambutan' && (() => {
        const menuM1 = menuContents.find(m => m.id === 'm1') || CourtDB.getMenuContentById('m1');
        const pimpinanNama = menuM1?.customFields?.namaKadilmil || courtIdentity.sambutanNama || 'Kolonel Chk Sultan, S.H.';
        const pimpinanPangkat = menuM1?.customFields?.pangkatKadilmil || 'Kolonel Chk';
        const pimpinanJabatan = menuM1?.subJudul || courtIdentity.sambutanJabatan || 'Wakil Kepala Pengadilan Militer Tinggi V Makassar';
        const pimpinanPangkatJabatan = `${pimpinanJabatan} • ${pimpinanPangkat}`;
        const customFotoM1 = menuM1?.customFields?.fotoKadilmil;
        const customFotoIdentity = courtIdentity.fotoKadilmil;
        const pimpinanFoto = (customFotoM1 && !customFotoM1.includes('unsplash.com/photo-1573496359142'))
          ? customFotoM1
          : (customFotoIdentity && !customFotoIdentity.includes('unsplash.com/photo-1573496359142'))
            ? customFotoIdentity
            : (customFotoM1 || customFotoIdentity || '/uploads/Screenshot_2026-09-16_093219_1790213987956.jpg');
        const rawText = menuM1?.kontenUtama || '';
        const allParagraphs = rawText.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
        const quoteText = menuM1?.customFields?.kutipanQuote || courtIdentity.sambutanQuote || (allParagraphs[0]?.startsWith('"') ? allParagraphs[0].replace(/^"|"$/g, '') : "Assalamu'alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera bagi Kita Semua, Om Swastiastu, Namo Buddhaya, Salam Kebajikan. Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas diresmikannya operasional Pengadilan Militer Tinggi V Makassar oleh Ketua Mahkamah Agung RI Prof. Dr. H. Sunarto, S.H., M.H. pada Kamis, 9 Juli 2026 berdasarkan PP No. 22 Tahun 2025 dan PP No. 23 Tahun 2025.");
        
        // Body paragraphs (excluding initial quote block if already shown in quote callout)
        const bodyParagraphs = allParagraphs.filter(p => !p.startsWith('"') && p !== quoteText && !p.startsWith("Assalamu'alaikum"));
        const displayParagraphs = bodyParagraphs.length > 0 ? bodyParagraphs : [
          courtIdentity.sambutanParagraph1 || `Pengadilan Militer Tinggi V Makassar yang berkedudukan di ${courtIdentity.address}, berkomitmen penuh menyelenggarakan proses peradilan militer yang agung, independen, transparan, dan akuntabel di Kawasan Timur Indonesia.`,
          courtIdentity.sambutanParagraph2 || 'Dengan semangat kearifan bahari Sulawesi Selatan dan filosofi luhur Sulapa Eppa (Kejujuran, Kecerdasan, Keberanian, dan Keteguhan Hukum) serta Motto REWAKO (Responsif, Energik, Wibawa, Adaptif, Kolaboratif, Objektif), kami siap memberikan pelayanan hukum terbaik bebas dari gratifikasi menuju predikat Wilayah Birokrasi Bersih dan Melayani (WBBM).'
        ];

        return (
          <div className="bg-white rounded-2xl border border-emerald-900/15 p-6 shadow-xs space-y-5 text-xs leading-relaxed text-slate-700">
            {/* Header with Admin Quick Edit */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 pb-5 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-36 h-48 sm:w-44 sm:h-56 bg-gradient-to-b from-[#0A3D24] to-[#041C11] rounded-2xl p-1.5 shadow-xl shrink-0 flex flex-col items-center justify-center text-center text-white border-2 border-amber-400 overflow-hidden relative group">
                    {pimpinanFoto ? (
                      <img 
                        src={getFreshImageUrl(pimpinanFoto)} 
                        alt={pimpinanNama} 
                        onError={(e) => handleImageFallback(e, DEFAULT_OFFICIAL_AVATAR)}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover rounded-xl" 
                      />
                    ) : (
                      <>
                        <span className="text-3xl mb-1">🎖️</span>
                        <div className="text-[10px] font-black text-amber-300">WAKADILMILTI V</div>
                        <div className="text-[9px] text-emerald-200">{pimpinanPangkat}</div>
                      </>
                    )}
                    {isAdminOrStaff && (
                      <label className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] font-bold text-amber-300 cursor-pointer transition-opacity p-2 text-center z-10">
                        <Camera className="w-6 h-6 mb-1 text-amber-400" />
                        <span>Ganti Foto Pimpinan</span>
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
                                let newUrl = compressed;
                                const uploadedUrl = await CourtDB.uploadBase64ToServer(compressed, file.name || 'foto-pimpinan', 'uploads');
                                if (uploadedUrl) {
                                  newUrl = uploadedUrl;
                                }
                                CourtDB.updateCourtIdentity({ fotoKadilmil: newUrl });
                                const currentM1 = CourtDB.getMenuContentById('m1');
                                if (currentM1) {
                                  currentM1.customFields = {
                                    ...currentM1.customFields,
                                    fotoKadilmil: newUrl
                                  };
                                  CourtDB.saveMenuContent(currentM1);
                                }
                                loadData();
                                showToast('Foto pimpinan berhasil diperbarui!');
                              } catch (err) {
                                showToast('Gagal memproses foto.');
                              }
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                  {isAdminOrStaff && (
                    <label className="mt-1.5 px-2 py-0.5 bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 border border-amber-400/40 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs">
                      <Camera className="w-3 h-3 text-amber-400" />
                      <span>Ganti Foto</span>
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
                              let newUrl = compressed;
                              const uploadedUrl = await CourtDB.uploadBase64ToServer(compressed, file.name || 'foto-pimpinan', 'uploads');
                              if (uploadedUrl) {
                                newUrl = uploadedUrl;
                              }
                              CourtDB.updateCourtIdentity({ fotoKadilmil: newUrl });
                              const currentM1 = CourtDB.getMenuContentById('m1');
                              if (currentM1) {
                                currentM1.customFields = {
                                  ...currentM1.customFields,
                                  fotoKadilmil: newUrl
                                };
                                CourtDB.saveMenuContent(currentM1);
                              }
                              loadData();
                              showToast('Foto pimpinan berhasil diperbarui!');
                            } catch (err) {
                              showToast('Gagal memproses foto.');
                            }
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#0D4A2B] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                    {menuM1?.badge || 'SAMBUTAN RESMI PIMPINAN'}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 font-serif">
                    {pimpinanNama}
                  </h3>
                  <p className="text-xs text-[#0D4A2B] font-bold mt-0.5">
                    {pimpinanPangkatJabatan}
                  </p>
                  <div className="mt-2.5 p-3.5 bg-emerald-50/80 rounded-xl border-l-4 border-[#0D4A2B] italic font-serif text-slate-800 text-xs shadow-xs">
                    "{quoteText}"
                  </div>
                </div>
              </div>

              {isAdminOrStaff && (
                <button
                  type="button"
                  onClick={() => { setEditingMenuId('m1'); setIsMenuModalOpen(true); }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Isi Menu Ini (Role Admin)</span>
                </button>
              )}
            </div>

            {/* Narrative Body */}
            <div className="space-y-3 pt-1">
              {displayParagraphs.map((para, i) => (
                <p key={i} className="text-slate-700 leading-relaxed">{para}</p>
              ))}
            </div>

            {/* Policy Points */}
            {menuM1?.poinPoin && menuM1.poinPoin.length > 0 && (
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2 mt-2">
                <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wide">
                  Komitmen & Arah Kebijakan Satuan Kerja:
                </strong>
                <ul className="space-y-1.5">
                  {menuM1.poinPoin.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Legal Basis & Meta */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0D4A2B]" />
                <span>{menuM1?.dasarHukum || 'PP No. 22 Tahun 2025 jo PP No. 23 Tahun 2025'}</span>
              </span>
              <span>Terakhir Diperbarui: {menuM1?.tanggalUpdate || '2026-07-09'}</span>
            </div>
          </div>
        );
      })()}

      {/* SUBTAB: VISI DAN MISI (MENU M2) */}
      {subTab === 'visimisi' && (() => {
        const menuM2 = menuContents.find(m => m.id === 'm2') || CourtDB.getMenuContentById('m2');
        const visiText = menuM2?.customFields?.visiUtama || courtIdentity.visiText || 'Terwujudnya Pengadilan Militer Tinggi V Makassar yang Agung, Modern, Akuntabel dan Berkeadilan';
        const sloganText = menuM2?.customFields?.mottoPengadilan || courtIdentity.slogan || 'REWAKO (Responsif, Energik, Wibawa, Adaptif, Kolaboratif, Objektif)';
        const misiPoints = menuM2?.poinPoin && menuM2.poinPoin.length > 0 ? menuM2.poinPoin : [
          'Misi 1: Menjaga kemandirian Pengadilan Militer Tinggi V Makassar.',
          'Misi 2: Memberikan pelayanan hukum yang berkeadilan kepada pencari keadilan.',
          'Misi 3: Meningkatkan kualitas kepemimpinan Pengadilan Militer Tinggi V Makassar.',
          'Misi 4: Meningkatkan kredibilitas dan transparansi Pengadilan Militer Tinggi V Makassar.'
        ];

        return (
          <div className="bg-white rounded-2xl border border-emerald-900/15 p-6 shadow-xs space-y-5 text-xs text-slate-700">
            {isAdminOrStaff && (
              <div className="flex justify-end pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => { setEditingMenuId('m2'); setIsMenuModalOpen(true); }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Isi Menu Visi & Misi (Role Admin)</span>
                </button>
              </div>
            )}

            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-2">
              <span className="text-[10px] font-extrabold text-[#0D4A2B] uppercase tracking-widest block">
                VISI MAHKAMAH AGUNG & PENGADILAN MILITER TINGGI V MAKASSAR
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-serif">
                "{visiText}"
              </h3>
              <div className="pt-2">
                <span className="inline-block bg-amber-400 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-xs">
                  MOTTO: {sloganText}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#0D4A2B]" />
                <span>Misi Pengadilan Militer Tinggi V Makassar:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {misiPoints.map((misi, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <strong className="text-slate-900 block mb-1">
                      {misi.split(':')[0] || `Misi ${idx + 1}`}:
                    </strong>
                    <p className="text-[11px] text-slate-600">
                      {misi.includes(':') ? misi.split(':').slice(1).join(':').trim() : misi}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {menuM2?.kontenUtama && (
              <div className="pt-2 text-slate-600 leading-relaxed whitespace-pre-wrap">
                {menuM2.kontenUtama}
              </div>
            )}

            {menuM2?.dasarHukum && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0D4A2B] shrink-0" />
                <span><strong>Dasar Hukum:</strong> {menuM2.dasarHukum}</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* SUBTAB: SEJARAH & YURISDIKSI (MENU M3) */}
      {(subTab === 'profil' || subTab === 'sejarah' || subTab === 'yurisdiksi') && (() => {
        const menuM3 = menuContents.find(m => m.id === 'm3') || CourtDB.getMenuContentById('m3');
        const introText = menuM3?.kontenUtama || courtIdentity.sejarahIntro || 'Berdasarkan Undang-Undang Nomor 31 Tahun 1997 tentang Peradilan Militer, Pengadilan Militer Tinggi V Makassar berkedudukan di Makassar dan merupakan Pengadilan Militer Tingkat Banding yang membawahi 6 (enam) Pengadilan Militer Tingkat Pertama di Kawasan Timur Indonesia:';

        return (
          <div className="bg-white rounded-2xl border border-emerald-900/15 p-6 shadow-xs space-y-5 text-xs text-slate-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-slate-100 gap-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#0D4A2B]" />
                <span>
                  {subTab === 'sejarah'
                    ? 'Sejarah Pembentukan Pengadilan Militer Tinggi V Makassar'
                    : subTab === 'yurisdiksi'
                    ? 'Wilayah Yurisdiksi & Daerah Hukum Pengadilan Militer Tinggi V Makassar'
                    : (menuM3?.judul || 'Sejarah & Wilayah Yurisdiksi Pengadilan Militer Tinggi V Makassar')}
                </span>
              </h3>
              {isAdminOrStaff && (
                <button
                  type="button"
                  onClick={() => { setEditingMenuId('m3'); setIsMenuModalOpen(true); }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profil & Sejarah (Role Admin)</span>
                </button>
              )}
            </div>

            {/* Foto Gedung / Sejarah if available */}
            {menuM3?.customFields?.fotoSejarahUrl && (
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-800/40 shadow-md bg-slate-950">
                <img
                  src={menuM3.customFields.fotoSejarahUrl}
                  alt="Gedung Pengadilan Militer Tinggi V Makassar"
                  className="w-full max-h-72 object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4 text-white flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-amber-300">Gedung Pengadilan Militer Tinggi V Makassar</span>
                    <p className="text-[10px] sm:text-xs text-slate-200">Kawasan Yurisdiksi Kawasan Timur Indonesia</p>
                  </div>
                  {isAdminOrStaff && (
                    <label className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Ganti Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          showToast('Mengunggah foto gedung...');
                          const base64 = await compressImage(file, 1200, 1200, 0.85);
                          const url = await CourtDB.uploadBase64ToServer(base64, file.name, 'uploads');
                          if (url && menuM3) {
                            const updated = {
                              ...menuM3,
                              customFields: { ...menuM3.customFields, fotoSejarahUrl: url }
                            };
                            CourtDB.saveMenuContent(updated, currentUser || null);
                            showToast('Foto gedung berhasil diperbarui!');
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            <div className="mt-2 text-slate-600 leading-relaxed whitespace-pre-wrap">
              {introText}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mt-4">
              {jurisdictionCourts.map((court, idx) => (
                <div key={court.code || idx} className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <strong className="text-[#0D4A2B] block text-xs font-black">{court.name}</strong>
                      <span className="text-[10px] bg-[#0F7A43] text-amber-300 font-bold px-2 py-0.5 rounded shadow-xs shrink-0">
                        {court.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium leading-snug">{court.jurisdiction}</p>
                  </div>
                  <div className="mt-3 text-[10px] text-slate-500 pt-2 border-t border-emerald-200/60 flex flex-col gap-1 font-mono">
                    <span className="flex items-center gap-1">📍 {court.address}</span>
                    <span className="flex items-center gap-1">📞 Telp: {court.phone}</span>
                  </div>
                </div>
              ))}
            </div>

            {menuM3?.poinPoin && menuM3.poinPoin.length > 0 && (
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2 mt-2">
                <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wide">
                  Poin Pokok Yurisdiksi & Landasan Regulasi:
                </strong>
                <ul className="space-y-1.5">
                  {menuM3.poinPoin.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <strong className="font-bold text-amber-900 block">Kewenangan Perkara Tingkat Pertama Perwira Menengah/Tinggi TNI</strong>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  {courtIdentity.sejarahParagraph || 'Pengadilan Militer Tinggi V Makassar juga berwenang mengadili pada tingkat pertama perkara pidana militer dengan Terdakwa berpangkat Mayor ke atas (Perwira Menengah & Perwira Tinggi) di seluruh Kawasan Timur Indonesia.'}
                </p>
              </div>
              <span className="px-3 py-1.5 bg-amber-400 text-slate-950 font-black text-[11px] rounded-lg shadow-xs shrink-0">
                PASAL 11 UU 31/1997
              </span>
            </div>

            {menuM3?.dasarHukum && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0D4A2B] shrink-0" />
                <span><strong>Dasar Hukum:</strong> {menuM3.dasarHukum}</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* SUBTAB: STRUKTUR ORGANISASI PERMA 1/2017 */}
      {subTab === 'struktur' && (
        <div className="bg-white rounded-2xl border border-emerald-900/15 p-6 shadow-xs space-y-5 text-xs text-slate-700">
          
          {/* Toast Notification */}
          {toastMsg && (
            <div className="p-3 bg-emerald-800 text-amber-300 rounded-xl text-xs font-bold shadow-md flex items-center justify-between border border-amber-400/40 animate-in fade-in">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{toastMsg}</span>
              </span>
              <button onClick={() => setToastMsg(null)} className="text-amber-200 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* PERMA 1/2017 Header & Location Badge */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-[#0A3D24] text-white p-5 rounded-2xl border-2 border-emerald-500/30 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-700/50">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                  PERMA RI NO. 1 TAHUN 2017 (PERUBAHAN PERMA NO. 7 TAHUN 2015)
                </span>
                <h3 className="text-base sm:text-lg font-black mt-1 text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <span>Struktur Satker Pengadilan Militer Tinggi V Makassar</span>
                </h3>
                <p className="text-xs text-emerald-100/90 mt-0.5">
                  Makassar • Sulawesi Selatan
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="px-3 py-1 rounded-lg text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Status: Menuju WBBM</span>
                </span>
                <span className="text-[11px] text-emerald-200 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-amber-300" />
                  <span>{courtIdentity.address}</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-100/90 mt-3 leading-relaxed">
              Peraturan Mahkamah Agung RI No. 1 Tahun 2017 tentang Perubahan Atas PERMA No. 7 Tahun 2015 mengatur bahwa Pengadilan Militer Tinggi V Makassar terdiri dari Kepaniteraan (Teknis Perkara) dan Kesekretariatan (Non-Teknis & Operasional).
            </p>
          </div>

          {/* Action Bar for CRUD Satker & Menu Content (Only for Admin & Staff) */}
          {isAdminOrStaff && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 text-xs block">Pengelolaan Struktur Satker & Bagan (Admin / Petugas)</span>
                <span className="text-[11px] text-slate-500">Kelola entitas kepaniteraan/kesekretariatan atau perbarui gambar bagan struktur organisasi.</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => { setEditingMenuId('m4'); setIsMenuModalOpen(true); }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Menu Struktur (Role Admin)</span>
                </button>
                <button
                  type="button"
                  onClick={() => openCreateSatker('Kepaniteraan')}
                  className="px-3 py-1.5 bg-[#0D4A2B] hover:bg-emerald-900 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Kepaniteraan</span>
                </button>
                <button
                  type="button"
                  onClick={() => openCreateSatker('Kesekretariatan')}
                  className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Kesekretariatan</span>
                </button>
              </div>
            </div>
          )}

          {/* Bagan Struktur Gambar if available */}
          {(courtIdentity.baganStrukturUrl || menuM4?.customFields?.baganStrukturUrl || menuM4?.customFields?.linkBaganStruktur) && (
            <div className="bg-slate-950 p-4 rounded-2xl border-2 border-emerald-800/60 shadow-md space-y-2">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-xs text-amber-300">Bagan Struktur Organisasi Resmi</span>
                </div>
                {isAdminOrStaff && (
                  <label className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Ganti Bagan</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        showToast('Mengunggah bagan struktur...');
                        const base64 = await compressImage(file, 1600, 1600, 0.88);
                        const url = await CourtDB.uploadBase64ToServer(base64, file.name, 'uploads');
                        if (url && menuM4) {
                          const updated = {
                            ...menuM4,
                            customFields: { ...menuM4.customFields, baganStrukturUrl: url, linkBaganStruktur: url }
                          };
                          CourtDB.saveMenuContent(updated, currentUser || null);
                          showToast('Bagan struktur berhasil diperbarui!');
                        }
                      }}
                    />
                  </label>
                )}
              </div>
              <div className="rounded-xl overflow-hidden bg-white p-2 border border-slate-700">
                <img
                  src={getFreshImageUrl(courtIdentity.baganStrukturUrl || menuM4?.customFields?.baganStrukturUrl || menuM4?.customFields?.linkBaganStruktur)}
                  alt="Bagan Struktur Organisasi"
                  className="w-full max-h-96 object-contain mx-auto"
                />
              </div>
            </div>
          )}

          {/* Interactive Organizational Chart Representation */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-center">
            {/* Top Node */}
            <div className="inline-block bg-[#0A3D24] text-white p-3.5 rounded-xl shadow-md border-2 border-amber-400">
              <div className="font-black text-xs sm:text-sm">KEPALA PENGADILAN MILITER TINGGI V MAKASSAR</div>
              <div className="text-[10px] text-amber-300 font-mono">Pati TNI (Brigadir Jenderal TNI)</div>
            </div>

            <div className="w-0.5 h-4 bg-slate-300 mx-auto"></div>

            {/* Wakil Node */}
            <div className="inline-block bg-[#0D4A2B] text-white p-3.5 rounded-xl shadow-sm border border-amber-300/50">
              <div className="font-bold text-xs">WAKIL KEPALA PENGADILAN (WAKADILMILTI)</div>
              <div className="text-[11px] text-amber-200 font-bold mt-0.5">Kolonel Chk Sultan, S.H.</div>
            </div>
          </div>

          {/* Detailed Satker Units: Kepaniteraan vs Kesekretariatan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            
            {/* 1. KEPANITERAAN (TEKNIS PERKARA) */}
            <div className="bg-emerald-50/40 border-2 border-emerald-600/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg">⚖️</span>
                  <div>
                    <h4 className="font-black text-[#0D4A2B] text-xs uppercase tracking-wide">
                      1. Kepaniteraan (Teknis Perkara)
                    </h4>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {kepaniteraanItems.length} Unit / Pejabat Terdaftar
                    </span>
                  </div>
                </div>

                {isAdminOrStaff && (
                  <button
                    type="button"
                    onClick={() => openCreateSatker('Kepaniteraan')}
                    className="px-2 py-1 bg-emerald-800 hover:bg-emerald-900 text-amber-300 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah</span>
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {kepaniteraanItems.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-xs hover:border-emerald-500 transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                          {item.jabatan}
                        </span>
                      </div>

                      <div className="font-extrabold text-slate-900 text-xs">
                        {item.namaPejabat}
                      </div>

                      {formatRankWithoutNipNrp(item.pangkatNip) && (
                        <div className="text-[11px] text-emerald-800 font-semibold">
                          {formatRankWithoutNipNrp(item.pangkatNip)}
                        </div>
                      )}

                      {item.tugasFungsi && (
                        <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
                          {item.tugasFungsi}
                        </p>
                      )}
                    </div>

                    {/* CRUD Actions (Admin/Staff Only) */}
                    {isAdminOrStaff && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditSatker(item)}
                          className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition-colors cursor-pointer"
                          title="Edit Jabatan Satker"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSatker(item)}
                          className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Jabatan Satker"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. KESEKRETARIATAN (NON-TEKNIS & OPERASIONAL) */}
            <div className="bg-sky-50/40 border-2 border-sky-600/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-sky-200">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-blue-900 text-white rounded-lg">📂</span>
                  <div>
                    <h4 className="font-black text-blue-950 text-xs uppercase tracking-wide">
                      2. Kesekretariatan (Non-Teknis & Operasional)
                    </h4>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {kesekretariatanItems.length} Subbag / Bagian Terdaftar
                    </span>
                  </div>
                </div>

                {isAdminOrStaff && (
                  <button
                    type="button"
                    onClick={() => openCreateSatker('Kesekretariatan')}
                    className="px-2 py-1 bg-blue-900 hover:bg-blue-950 text-white text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah</span>
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {kesekretariatanItems.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white p-3.5 rounded-xl border border-sky-200 shadow-xs hover:border-sky-500 transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 uppercase">
                          {item.jabatan}
                        </span>
                      </div>

                      <div className="font-extrabold text-slate-900 text-xs">
                        {item.namaPejabat}
                      </div>

                      {formatRankWithoutNipNrp(item.pangkatNip) && (
                        <div className="text-[11px] text-blue-900 font-semibold">
                          {formatRankWithoutNipNrp(item.pangkatNip)}
                        </div>
                      )}

                      {item.tugasFungsi && (
                        <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
                          {item.tugasFungsi}
                        </p>
                      )}
                    </div>

                    {/* CRUD Actions (Admin/Staff Only) */}
                    {isAdminOrStaff && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditSatker(item)}
                          className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition-colors cursor-pointer"
                          title="Edit Jabatan Satker"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSatker(item)}
                          className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Jabatan Satker"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SATKER CRUD MODAL DIALOG (Admin/Staff Only) */}
          {isAdminOrStaff && isSatkerModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
              <div className="bg-white rounded-2xl max-w-lg w-full border-2 border-emerald-800 shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0D4A2B]" />
                    <span>{satkerModalMode === 'create' ? 'Tambah Jabatan Satker Baru' : 'Edit Data Jabatan Satker'}</span>
                  </h4>
                  <button 
                    onClick={() => setIsSatkerModalOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveSatker} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kelompok Satker (PERMA 1/2017)</label>
                    <select
                      value={formKelompok}
                      onChange={(e) => setFormKelompok(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-hidden focus:border-[#0D4A2B]"
                    >
                      <option value="Kepaniteraan">Kepaniteraan (Teknis Perkara)</option>
                      <option value="Kesekretariatan">Kesekretariatan (Non-Teknis & Operasional)</option>
                      <option value="Pimpinan">Pimpinan / Majelis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Jabatan / Bagian / Subbag *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Panmud Pidana / Subbag Kepegawaian & TI"
                      value={formJabatan}
                      onChange={(e) => setFormJabatan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-hidden focus:border-[#0D4A2B]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Pejabat *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Mayor Chk Mahpul Saepuloh, S.H."
                      value={formNamaPejabat}
                      onChange={(e) => setFormNamaPejabat(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-hidden focus:border-[#0D4A2B]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pangkat / NIP / NRP</label>
                    <input
                      type="text"
                      placeholder="Contoh: NRP: 21940135670972 ATAU NIP: 199609182020122005"
                      value={formPangkatNip}
                      onChange={(e) => setFormPangkatNip(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-hidden focus:border-[#0D4A2B]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tugas, Fungsi & Deskripsi Tanggung Jawab</label>
                    <textarea
                      rows={3}
                      placeholder="Uraian tugas pokok dan pelayanan administrasi peradilan..."
                      value={formTugasFungsi}
                      onChange={(e) => setFormTugasFungsi(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#0D4A2B]"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSatkerModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0D4A2B] hover:bg-emerald-900 text-amber-300 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>{satkerModalMode === 'create' ? 'Simpan Jabatan Baru' : 'Simpan Perubahan'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUBTAB: TUGAS DAN FUNGSI / KEPANITERAAN MILITER TINGGI */}
      {(subTab === 'kepaniteraan' || subTab === 'tugas-fungsi') && (
        <div className="bg-white rounded-2xl border border-emerald-900/15 p-6 shadow-xs space-y-6 text-xs text-slate-700">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#0D4A2B]" />
              <span>Tugas Pokok dan Fungsi (Tupoksi) Pengadilan, Kepaniteraan & Kesekretariatan</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Berdasarkan UU No. 31 Tahun 1997 tentang Peradilan Militer & PERMA No. 1 Tahun 2017 (Standar Organisasi 2026)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Pidana Militer */}
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-800 text-amber-300 font-bold">01</span>
                <div>
                  <h4 className="font-extrabold text-slate-900 uppercase text-xs tracking-wide">Kepaniteraan Pidana</h4>
                  <span className="text-[9px] text-[#0D4A2B] font-extrabold block">Pidana Militer Khusus</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Menyelenggarakan registrasi, pembukuan, pengawasan berkas, serta administrasi persidangan bagi perkara pidana militer tingkat pertama (terdakwa berpangkat Mayor ke atas) dan perkara banding pidana militer dari seluruh jajaran Pengadilan Militer di Wilayah Timur.
              </p>
              <div className="pt-2 border-t border-emerald-100 space-y-1 text-[10px] text-slate-500">
                <div>• Perkara Banding (Dilmil Ambon, Jayapura, dll)</div>
                <div>• Perkara Pertama Tingkat Pamen (Mayor s/d Jenderal)</div>
                <div>• Pengawasan Eksekusi Putusan Pidana Militer</div>
              </div>
            </div>

            {/* 2. Tata Usaha Militer */}
            <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-100 space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">02</span>
                <div>
                  <h4 className="font-extrabold text-slate-900 uppercase text-xs tracking-wide">Kepaniteraan TU Militer</h4>
                  <span className="text-[9px] text-amber-700 font-extrabold block">Sengketa Kepegawaian TNI</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Menangani administrasi pendaftaran, kelengkapan berkas gugatan, pemeriksaan kelayakan, dan penyusunan minutasi berkas perkara Sengketa Tata Usaha Militer (kepegawaian prajurit TNI) terhadap Surat Keputusan Pejabat Militer.
              </p>
              <div className="pt-2 border-t border-amber-100 space-y-1 text-[10px] text-slate-500">
                <div>• Gugatan Keputusan Pemberhentian Dengan Hormat/PDTH</div>
                <div>• Sengketa Jabatan & Mutasi Kepegawaian Prajurit</div>
                <div>• Rekonsiliasi Data Perkara Sengketa TUN Militer</div>
              </div>
            </div>

            {/* 3. Kepaniteraan Hukum */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-slate-800 text-white font-bold">03</span>
                <div>
                  <h4 className="font-extrabold text-slate-900 uppercase text-xs tracking-wide">Kepaniteraan Hukum</h4>
                  <span className="text-[9px] text-slate-500 font-extrabold block">Statistik & Publikasi</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Menyelenggarakan fungsi pelaporan statistik perkara bulanan/tahunan, penataan arsip aktif dan inkracht, pengelolaan SIPP di tingkat banding, serta pelayanan penyediaan salinan putusan militer terdisosiasi (disensor/anonimisasi) bagi publik.
              </p>
              <div className="pt-2 border-t border-slate-200 space-y-1 text-[10px] text-slate-500">
                <div>• Penyusunan Laporan Bulanan & Tahunan Perkara</div>
                <div>• Manajemen Backup & Sinkronisasi SIPP Lokal</div>
                <div>• Meja Informasi & Konsultasi Hukum Militer</div>
              </div>
            </div>
          </div>

          {/* STANDAR TEKNIS ADMINISTRASI KEPANITERAAN SESUAI SK KMA 159/KMA/SK.HK2/VIII/2026 */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-900 text-amber-300 inline-block mb-1">
                  Pedoman Buku II Peradilan Militer • SK KMA No. 159/KMA/SK.HK2/VIII/2026
                </span>
                <h4 className="text-xs font-black text-slate-900 uppercase">
                  Standar Teknis Administrasi Kepaniteraan, Register Elektronik (e-Register) & Penomoran Perkara
                </h4>
              </div>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('dokumen', 'arsip-dokumen')}
                  className="px-3 py-1.5 bg-[#0D4A2B] hover:bg-emerald-900 text-amber-300 rounded-xl font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Format Dokumen Buku II</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <strong className="text-slate-900 font-extrabold block uppercase text-[11px]">
                  1. Urutan Penomoran Perkara (Hal. 940 & 1031 SK KMA 159/2026)
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  Nomor perkara diberikan secara berurutan berdasarkan buku register perkara yang dimulai dari angka 1 (satu) pada awal tahun dan ditutup pada akhir tahun takwim:
                </p>
                <ul className="space-y-1 font-mono text-[10px] text-emerald-950 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                  <li>• Tingkat Pertama Dilmilti: <strong>Nomor Urut-K/PMT.V/AD|AL|AU/Bulan/Tahun</strong></li>
                  <li>• Tingkat Banding Dilmilti: <strong>Nomor Urut-K/BDG/PMT.V/AD|AL|AU/Bulan/Tahun</strong></li>
                  <li>• Sengketa Tata Usaha Militer: <strong>Nomor Urut-G/TUN-MIL/PMT.V/Bulan/Tahun</strong></li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <strong className="text-slate-900 font-extrabold block uppercase text-[11px]">
                  2. Pengelolaan Register Elektronik / e-Register (Hal. 1036–1047)
                </strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Buku Register Perkara dikelola secara elektronik (<strong>e-Register</strong>) pada aplikasi SIPP oleh petugas yang ditunjuk Panitera;</li>
                  <li>Menjelang akhir tahun, buku register perkara ditutup oleh <strong>Panitera</strong> dan diketahui oleh <strong>Kepala Pengadilan Militer Tinggi</strong>;</li>
                  <li>Pencetakan buku register induk dilakukan setiap bulan dan dijilid setiap akhir tahun (mencakup Register Induk Tingkat Pertama, Banding, Kasasi, PK, Grasi, dan Penyitaan/Penggeledahan).</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <strong className="text-slate-900 font-extrabold block uppercase text-[11px]">
                  3. Penataan Berkas Perkara Bundel A & Bundel B (Hal. 935–957)
                </strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li><strong>Bundel A:</strong> Berkas perkara dari Oditurat Militer/Oditurat Militer Tinggi beserta seluruh surat yang timbul di persidangan tingkat pertama (tersimpan di Pengadilan tingkat pertama);</li>
                  <li><strong>Bundel B:</strong> Salinan Putusan, Berita Acara Sidang, Akta Permohonan Banding/Kasasi, Akta Penerimaan Memori/Kontra Memori, Relaas Pemberitahuan, dan Surat Pengantar Pengiriman Berkas.</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <strong className="text-slate-900 font-extrabold block uppercase text-[11px]">
                  4. Ketentuan Pakaian Dinas Persidangan (Hal. 1008–1009)
                </strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li><strong>Hakim Militer, Oditur, Penasihat Hukum TNI & Panitera:</strong> Mengenakan <strong>PDU IV</strong> dengan <em>Tali Kur</em> sesuai jabatan (Hakim: Kuning Emas-Hitam; Oditur: Merah-Hitam; Penasihat Hukum TNI: Biru-Putih; Panitera: Hijau-Kuning);</li>
                  <li><strong>Terdakwa TNI Aktif:</strong> Mengenakan Pakaian Dinas Harian (PDH) tanpa atribut/tanda pangkat selain tanda korps dan papan nama;</li>
                  <li><strong>Penasihat Hukum Advokat / Non-TNI:</strong> Mengenakan Toga Advokat; <strong>Saksi/Ahli:</strong> PDH (bagi TNI) atau pakaian rapi dan sopan (bagi non-militer).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: SISTEM PENGELOLAAN PENGADILAN (SK 593/2026) */}
      {subTab === 'pengelolaan' && (
        <div className="bg-white rounded-2xl border border-emerald-900/15 p-6 shadow-xs space-y-6 text-xs text-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                STANDARISASI SK DIRJEN BADILMILTUN NO. 593/2026
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
                <Building2 className="w-4 h-4 text-[#0D4A2B]" />
                <span>Sistem Pengelolaan Pengadilan (Manajemen & Tata Kelola Peradilan)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mencakup e-Learning, Kebijakan & Yurisprudensi, Rencana Kerja (RKT), Rencana Strategis (Renstra), serta Pengawasan & Kode Etik
              </p>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('dokumen', 'renstra')}
                className="px-3.5 py-2 rounded-xl bg-[#0D4A2B] hover:bg-emerald-900 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lihat Dokumen Perencanaan & Laporan</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. e-Learning */}
            <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200/80 flex flex-col justify-between gap-3">
              <div className="flex gap-3">
                <GraduationCap className="w-8 h-8 text-[#0D4A2B] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase">01. Pengembangan SDM</span>
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">e-Learning & Pembinaan Teknis</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Platform pembelajaran mandiri terintegrasi Pusdiklat Mahkamah Agung RI dan Badilmiltun bagi Hakim Militer Tinggi, Panitera Pengganti, dan aparatur.
                  </p>
                </div>
              </div>
              <a
                href="https://bldk.mahkamahagung.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#0D4A2B] hover:underline flex items-center gap-1 pt-2 border-t border-emerald-200/60"
              >
                <span>Portal e-Learning BLDK MA-RI</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 2. Kebijakan & Yurisprudensi */}
            <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/80 flex flex-col justify-between gap-3">
              <div className="flex gap-3">
                <FileText className="w-8 h-8 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-800 uppercase">02. Regulasi & Putusan</span>
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">Kebijakan, PERMA, SEMA & Yurisprudensi</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Kumpulan kebijakan internal, Peraturan/Surat Edaran Mahkamah Agung RI, SK Dirjen Badilmiltun, serta kaidah yurisprudensi putusan militer tetap (inkracht).
                  </p>
                </div>
              </div>
              <a
                href="https://jdih.mahkamahagung.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-amber-900 hover:underline flex items-center gap-1 pt-2 border-t border-amber-200/60"
              >
                <span>Akses JDIH & Direktori Putusan MA-RI</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 3. Rencana Kerja (RKT & PK) */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between gap-3">
              <div className="flex gap-3">
                <Briefcase className="w-8 h-8 text-blue-800 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-blue-800 uppercase">03. Program Tahunan</span>
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">Rencana Kerja (RKT) & Program Kerja</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Penjabaran program kerja tahunan kepaniteraan dan kesekretariatan, Perjanjian Kinerja (PK), serta alokasi anggaran DIPA 01 dan DIPA 05.
                  </p>
                </div>
              </div>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('dokumen', 'renstra')}
                  className="text-[11px] font-bold text-blue-900 hover:underline flex items-center gap-1 pt-2 border-t border-slate-200 cursor-pointer text-left"
                >
                  <span>Buka Dokumen RKT & Perjanjian Kinerja</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 4. Rencana Strategis (Renstra) */}
            <div className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-200/80 flex flex-col justify-between gap-3">
              <div className="flex gap-3">
                <Target className="w-8 h-8 text-emerald-800 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase">04. Perencanaan 5 Tahunan</span>
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">Rencana Strategis (Renstra 2025–2029)</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Dokumen perencanaan strategis jangka menengah 5 tahunan yang memuat Indikator Kinerja Utama (IKU) selaras dengan Cetak Biru Pembaruan Peradilan.
                  </p>
                </div>
              </div>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('dokumen', 'renstra')}
                  className="text-[11px] font-bold text-[#0D4A2B] hover:underline flex items-center gap-1 pt-2 border-t border-emerald-200/60 cursor-pointer text-left"
                >
                  <span>Buka Dokumen Renstra & IKU</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 5. Pengawasan dan Kode Etik */}
            <div className="p-4 bg-red-50/30 rounded-xl border border-red-200/80 flex flex-col justify-between gap-3 md:col-span-2">
              <div className="flex gap-3">
                <ShieldCheck className="w-8 h-8 text-red-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-red-800 uppercase">05. Integritas & Disiplin</span>
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">Pengawasan Internal (Hawasbid) & Kode Etik Hakim / Aparatur</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Penegakan Pedoman Perilaku Hakim (PPH), Kode Etik Panitera dan Jurusita, disiplin prajurit TNI & ASN, serta pengawasan melekat oleh Hakim Pengawas Bidang (Hawasbid) yang terintegrasi dengan SIWAS Mahkamah Agung RI.
                  </p>
                </div>
              </div>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('publik', 'siwas')}
                  className="text-[11px] font-bold text-red-800 hover:underline flex items-center gap-1 pt-2 border-t border-red-200/60 cursor-pointer text-left"
                >
                  <span>Buka Layanan Pengaduan & Pengawasan SIWAS MA-RI</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Unduh File Laporan Khusus Halaman Sistem Pengelolaan Pengadilan (Renstra, RKT, PK & IKU) */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-wide flex items-center gap-2">
                <Download className="w-4 h-4 text-[#0D4A2B]" />
                <span>Unduh Dokumen Sistem Pengelolaan Pengadilan (Renstra, RKT, PK & IKU)</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-500">Format Resmi PDF</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CourtDB.getSakipDipaDocuments()
                .filter(d => ['Renstra', 'RKT', 'PK', 'IKU'].includes(d.subKategori))
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-600/40 transition-all"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-[#0D4A2B] font-extrabold text-[10px] uppercase">
                          {doc.subKategori}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">TA {doc.tahun}</span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs truncate">{doc.judul}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        PDF • {doc.fileSize || '2.4 MB'}
                      </div>
                    </div>
                    <a
                      href={doc.fileUrl}
                      download={doc.fileName || `${doc.judul.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-[#0D4A2B] hover:bg-emerald-950 text-amber-300 font-extrabold text-[11px] flex items-center gap-1.5 shrink-0 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: DENAH & PETA GEDUNG PENGADILAN (SK 593/2026 PAGE 21) */}
      {subTab === 'denah' && (
        <div className="bg-white rounded-2xl border border-emerald-900/15 p-6 shadow-xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                FASILITAS SARPRAS RESMI
              </span>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-[#0D4A2B]" />
                <span>Denah Gedung & Peta Fasilitas Pengadilan Militer Tinggi V Makassar</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Berdasarkan Pedoman Standardisasi Website Pengadilan SK Dirjen Badilmiltun No. 593/2026
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isAdminOrStaff && (
                <button
                  type="button"
                  onClick={() => { setEditingMenuId('m5'); setIsMenuModalOpen(true); }}
                  className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Denah (Role Admin)</span>
                </button>
              )}
              <a
                href="https://maps.google.com/?q=Pengadilan+Militer+Tinggi+V+Makassar"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#0D4A2B] hover:bg-[#082E1B] text-amber-300 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shrink-0"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Buka Google Maps Official</span>
              </a>
            </div>
          </div>

          {/* Uploaded Architectural Floor Maps if available */}
          {(courtIdentity.denahLantai1Url || courtIdentity.denahLantai2Url) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courtIdentity.denahLantai1Url && (
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                  <span className="font-bold text-xs text-amber-300">📐 Denah Arsitektural Lantai 1</span>
                  <div className="rounded-xl overflow-hidden bg-white p-1">
                    <img src={getFreshImageUrl(courtIdentity.denahLantai1Url)} alt="Denah Lantai 1" className="w-full max-h-64 object-contain mx-auto" />
                  </div>
                </div>
              )}
              {courtIdentity.denahLantai2Url && (
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                  <span className="font-bold text-xs text-emerald-300">📐 Denah Arsitektural Lantai 2</span>
                  <div className="rounded-xl overflow-hidden bg-white p-1">
                    <img src={getFreshImageUrl(courtIdentity.denahLantai2Url)} alt="Denah Lantai 2" className="w-full max-h-64 object-contain mx-auto" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interactive Visual Floor Layout Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lantai 1 */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl border-2 border-amber-400/60 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center font-mono text-xs">
                    L1
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-amber-300">DENAH LANTAI 1 (LOBBY & PELAYANAN PUBLIK)</h4>
                    <p className="text-[10px] text-slate-400">Area Utama PTSP 6 Meja, Ruang Sidang & Aksesibilitas Disabilitas</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded">Zona Bebas Pungli</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-500/40 text-center space-y-1">
                  <div className="font-bold text-emerald-300">PTSP 6 Meja</div>
                  <div className="text-[9px] text-slate-300">Informasi, Perkara, Hukum, Kasir, Besuk, Surat</div>
                </div>
                <div className="bg-amber-950/80 p-3 rounded-xl border border-amber-500/40 text-center space-y-1">
                  <div className="font-bold text-amber-300">Ruang Sidang Utama</div>
                  <div className="text-[9px] text-slate-300">Sidang Garuda & Sidang Cakra (Audio/Video Live)</div>
                </div>
                <div className="bg-blue-950/80 p-3 rounded-xl border border-blue-500/40 text-center space-y-1">
                  <div className="font-bold text-blue-300">Posbakum Gratis</div>
                  <div className="text-[9px] text-slate-300">Konsultasi Hukum & Bantuan Dokumen Prodeo</div>
                </div>
                <div className="bg-purple-950/80 p-3 rounded-xl border border-purple-500/40 text-center space-y-1">
                  <div className="font-bold text-purple-300">Area Ramah Anak & Laktasi</div>
                  <div className="text-[9px] text-slate-300">Ruang Bermain Anak & Tempat Menyusui Bersih</div>
                </div>
                <div className="bg-teal-950/80 p-3 rounded-xl border border-teal-500/40 text-center space-y-1">
                  <div className="font-bold text-teal-300">Layanan Disabilitas</div>
                  <div className="text-[9px] text-slate-300">Ramp Khusus, Kursi Roda, Toilet Difabel & Guiding Block</div>
                </div>
                <div className="bg-red-950/80 p-3 rounded-xl border border-red-500/40 text-center space-y-1">
                  <div className="font-bold text-red-300">Ruang Tahanan Sementara</div>
                  <div className="text-[9px] text-slate-300">Pengamanan Steril Oditurat & Pomdam</div>
                </div>
              </div>
            </div>

            {/* Lantai 2 */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl border-2 border-emerald-500/60 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-950 font-black flex items-center justify-center font-mono text-xs">
                    L2
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-300">DENAH LANTAI 2 (PIMPINAN & PERINTIS PERADILAN)</h4>
                    <p className="text-[10px] text-slate-400">Ruang Kerja Pimpinan, Hakim, Kepaniteraan & Command Center</p>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded">Khusus Aparatur</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="bg-amber-950/80 p-3 rounded-xl border border-amber-500/40 text-center space-y-1">
                  <div className="font-bold text-amber-300">Ruang Pimpinan</div>
                  <div className="text-[9px] text-slate-300">Ruang Kadilmilti V & Wakadilmilti V Makassar</div>
                </div>
                <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-500/40 text-center space-y-1">
                  <div className="font-bold text-emerald-300">Ruang Hakim Militer</div>
                  <div className="text-[9px] text-slate-300">Kamar Musyawarah & Penyusunan Putusan Banding</div>
                </div>
                <div className="bg-blue-950/80 p-3 rounded-xl border border-blue-500/40 text-center space-y-1">
                  <div className="font-bold text-blue-300">Kepaniteraan Banding</div>
                  <div className="text-[9px] text-slate-300">Pengelolaan SIPP, Minutasi & Tanda Tangan Elektronik</div>
                </div>
                <div className="bg-indigo-950/80 p-3 rounded-xl border border-indigo-500/40 text-center space-y-1">
                  <div className="font-bold text-indigo-300">Kesekretariatan</div>
                  <div className="text-[9px] text-slate-300">Subbag PTIP, Kepegawaian Ortala & Keuangan</div>
                </div>
                <div className="bg-cyan-950/80 p-3 rounded-xl border border-cyan-500/40 text-center space-y-1">
                  <div className="font-bold text-cyan-300">Server TIK & Command Center</div>
                  <div className="text-[9px] text-slate-300">Pusat Data Cloud, CCTV & Monitoring Eksekusi</div>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center space-y-1">
                  <div className="font-bold text-slate-200">Aula Pinisi / Rapat Utama</div>
                  <div className="text-[9px] text-slate-400">Pertemuan Kedinasan, Pelantikan & Pembinaan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB TERPISAH 1: PROFIL ROLE MODEL PIMPINAN (SK 593/2026) */}
      {(subTab === 'rolemodel' || subTab === 'role-model') && (
        <div className="bg-white rounded-2xl border border-emerald-900/15 p-6 shadow-xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                KETELADANAN PIMPINAN • ZONA INTEGRITAS
              </span>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
                <Award className="w-4 h-4 text-[#0D4A2B]" />
                <span>Profil Role Model Pimpinan Pengadilan Militer Tinggi V Makassar</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Penetapan Role Model Keteladanan Integritas, Disiplin Militer, dan Kepemimpinan Satuan Kerja (SK Dirjen Badilmiltun No. 593/2026)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSubTab('agen-perubahan')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#0D4A2B] border border-slate-200 font-bold text-xs transition-colors cursor-pointer"
              >
                Lihat Profil Agen Perubahan →
              </button>
              {isAdminOrStaff && (
                <button
                  type="button"
                  onClick={() => { setEditingMenuId('m6'); setIsMenuModalOpen(true); }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Menu Role Model (Admin)</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roleModelList
              .filter((item) => item.tipe === 'Role Model')
              .map((item) => (
              <div 
                key={item.id} 
                className="bg-gradient-to-br from-white via-amber-50/20 to-emerald-50/10 p-6 rounded-2xl border-2 border-amber-400/60 hover:border-amber-500 transition-all space-y-4 shadow-md"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="w-32 h-44 sm:w-36 sm:h-48 rounded-2xl p-1 bg-gradient-to-b from-amber-400 via-emerald-700 to-[#062416] shadow-lg shrink-0 overflow-hidden">
                    <OfficerProfileImage
                      src={item.fotoUrl}
                      alt={item.nama}
                      className="w-full h-full rounded-xl object-cover object-top"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider inline-block shadow-2xs bg-amber-400 text-slate-950 border border-amber-300">
                      ROLE MODEL PIMPINAN
                    </span>
                    <h4 className="font-black text-slate-900 text-base sm:text-lg mt-2 leading-tight font-serif">
                      {item.nama}
                    </h4>
                    <div className="text-xs font-bold text-[#0D4A2B] mt-1">
                      {item.jabatan}
                    </div>
                    {formatRankWithoutNipNrp(item.pangkatNip) && (
                      <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                        {formatRankWithoutNipNrp(item.pangkatNip)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/80 text-[11px]">
                  <div>
                    <strong className="text-slate-900 font-bold block">Komitmen Keteladanan Pimpinan:</strong>
                    <p className="text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200 mt-0.5">
                      "{item.komitmenKerja}"
                    </p>
                  </div>

                  <div>
                    <strong className="text-slate-900 font-bold block">Kontribusi Pembangunan ZI & SMAP:</strong>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{item.kontribusiReformasi}</p>
                  </div>

                  {item.rencanaProgramKerja && (
                    <div>
                      <strong className="text-[#0D4A2B] font-bold block">Arah Kebijakan & Keteladanan:</strong>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{item.rencanaProgramKerja}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB TERPISAH 2: PROFIL AGEN PERUBAHAN (SK 593/2026) */}
      {subTab === 'agen-perubahan' && (
        <div className="bg-white rounded-2xl border border-emerald-900/15 p-6 shadow-xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-700 text-amber-300 uppercase tracking-wider">
                AGENT OF CHANGE • MANAJEMEN PERUBAHAN AREA I
              </span>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4 text-[#0D4A2B]" />
                <span>Profil Agen Perubahan Pengadilan Militer Tinggi V Makassar</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Penggerak Budaya Kerja BerAKHLAK, Transformasi Digital, dan Inovasi Pelayanan Publik (SK Dirjen Badilmiltun No. 593/2026)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSubTab('role-model')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 font-bold text-xs transition-colors cursor-pointer"
              >
                ← Lihat Profil Role Model
              </button>
              {isAdminOrStaff && (
                <button
                  type="button"
                  onClick={() => { setEditingMenuId('m10'); setIsMenuModalOpen(true); }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Menu Agen Perubahan (Admin)</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roleModelList
              .filter((item) => item.tipe === 'Agen Perubahan')
              .map((item) => (
              <div 
                key={item.id} 
                className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/10 p-6 rounded-2xl border-2 border-emerald-800/30 hover:border-emerald-600 transition-all space-y-4 shadow-md"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="w-32 h-44 sm:w-36 sm:h-48 rounded-2xl p-1 bg-gradient-to-b from-emerald-600 via-[#0D4A2B] to-[#062416] shadow-lg shrink-0 overflow-hidden">
                    <OfficerProfileImage
                      src={item.fotoUrl}
                      alt={item.nama}
                      className="w-full h-full rounded-xl object-cover object-top"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider inline-block shadow-2xs bg-[#0D4A2B] text-amber-300 border border-emerald-600">
                      AGEN PERUBAHAN (AGENT OF CHANGE)
                    </span>
                    <h4 className="font-black text-slate-900 text-base sm:text-lg mt-2 leading-tight font-serif">
                      {item.nama}
                    </h4>
                    <div className="text-xs font-bold text-[#0D4A2B] mt-1">
                      {item.jabatan}
                    </div>
                    {formatRankWithoutNipNrp(item.pangkatNip) && (
                      <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                        {formatRankWithoutNipNrp(item.pangkatNip)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/80 text-[11px]">
                  <div>
                    <strong className="text-slate-900 font-bold block">Komitmen Kerja Agen Perubahan:</strong>
                    <p className="text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200 mt-0.5">
                      "{item.komitmenKerja}"
                    </p>
                  </div>

                  <div>
                    <strong className="text-slate-900 font-bold block">Kontribusi Pembangunan ZI & SMAP:</strong>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{item.kontribusiReformasi}</p>
                  </div>

                  {item.rencanaProgramKerja && (
                    <div>
                      <strong className="text-[#0D4A2B] font-bold block">Rencana Tindak & Program Kerja Agen Perubahan:</strong>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{item.rencanaProgramKerja}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: DATA PERSONEL RESMI (HAKIM, KEPANITERAAN, KESEKRETARIATAN, PEGAWAI) */}
      {(subTab === 'pejabat' ||
        subTab === 'profil-hakim' ||
        subTab === 'profil-panitera' ||
        subTab === 'profil-kepaniteraan' ||
        subTab === 'profil-sekretaris' ||
        subTab === 'profil-kesekretariatan' ||
        subTab === 'profil-pegawai') && (
        <div className="bg-white rounded-2xl border border-emerald-900/15 p-6 shadow-xs space-y-4 text-xs">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0D4A2B]" />
                <span>
                  {subTab === 'profil-hakim'
                    ? 'Profil Hakim & Pimpinan DILMILTI V Makassar'
                    : subTab === 'profil-panitera' || subTab === 'profil-kepaniteraan'
                    ? 'Profil Kepaniteraan DILMILTI V Makassar'
                    : subTab === 'profil-sekretaris' || subTab === 'profil-kesekretariatan'
                    ? 'Profil Kesekretariatan DILMILTI V Makassar'
                    : 'Profil & Direktori Seluruh Pegawai DILMILTI V Makassar'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Klik kategori di bawah untuk memfilter Profil Hakim, Profil Kepaniteraan, atau Profil Kesekretariatan
              </p>
            </div>

            {isAdminOrStaff && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={openCreatePersonnel}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Personel Baru</span>
                </button>

                <button
                  type="button"
                  onClick={() => openPhotoModal()}
                  className="px-3 py-1.5 rounded-lg bg-[#0D4A2B] hover:bg-[#082E1B] text-amber-300 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Input Foto Pegawai</span>
                </button>

                {onOpenAdmin && (
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Kelola Personel (Admin)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Category Selector Tabs (Profil Hakim, Profil Kepaniteraan, Profil Kesekretariatan) */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'HAKIM_PIMPINAN', sub: 'profil-hakim', label: 'Profil Hakim' },
              { id: 'Kepaniteraan', sub: 'profil-kepaniteraan', label: 'Profil Kepaniteraan' },
              { id: 'Kesekretariatan', sub: 'profil-kesekretariatan', label: 'Profil Kesekretariatan' },
              { id: 'ALL', sub: 'profil-pegawai', label: `Semua Pegawai (${personnelList.length})` }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setPersFilter(cat.id);
                  setSubTab(cat.sub);
                }}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  persFilter === cat.id
                    ? 'bg-[#0A3D24] text-amber-300 shadow-sm border border-amber-400'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-gradient-to-r from-slate-50 via-emerald-50/30 to-slate-50 p-3.5 rounded-2xl border border-emerald-900/15 shadow-2xs">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-800" />
              <input
                type="text"
                placeholder="Cari Nama Pegawai, Pangkat, atau Jabatan..."
                value={persSearch}
                onChange={(e) => setPersSearch(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-medium focus:outline-hidden focus:border-[#0D4A2B] focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#0D4A2B]" />
              <select
                value={persFilter}
                onChange={(e) => setPersFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#0D4A2B]"
              >
                <option value="ALL">Semua Kategori ({personnelList.length} Pegawai)</option>
                <option value="HAKIM_PIMPINAN">Profil Hakim & Pimpinan</option>
                <option value="Kepaniteraan">Profil Kepaniteraan</option>
                <option value="Kesekretariatan">Profil Kesekretariatan</option>
                <option value="MUTASI">Pegawai Mutasi Masuk</option>
              </select>
            </div>
          </div>

          {/* Personnel Grid Cards (Clickable with Pop-up & Enlarged Profile Photos without NRP/NIP) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {filteredPersonnel.map((p, idx) => (
              <div 
                key={p.id} 
                onClick={() => setSelectedPersonnel(p)}
                className="bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/30 hover:from-white hover:to-emerald-50/70 p-5 rounded-2xl border-2 border-emerald-900/15 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer group relative overflow-hidden flex flex-col justify-between"
              >
                {/* Subtle Top Accent Bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#072918] via-[#0F7A43] to-amber-400 opacity-85 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-1">
                  {/* Large Official Portrait Frame */}
                  <div className="relative shrink-0">
                    <div className="w-32 h-44 sm:w-36 sm:h-48 rounded-2xl p-1 bg-gradient-to-b from-amber-400 via-[#0D4A2B] to-[#051F12] shadow-lg group-hover:shadow-amber-500/20 transition-all overflow-hidden">
                      <OfficerProfileImage
                        src={p.fotoUrl}
                        alt={p.nama}
                        className="w-full h-full rounded-xl object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {isAdminOrStaff && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPhotoModal(p);
                        }}
                        title="Input / Ganti Foto Pegawai Ini"
                        className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#0D4A2B] hover:bg-emerald-700 text-amber-300 border border-amber-400/60 transition-colors shadow-lg cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Staff Profile Info (Clean, Prominent, No NRP/NIP) */}
                  <div className="flex-1 min-w-0 text-center sm:text-left w-full space-y-2">
                    <div className="flex flex-wrap items-center justify-center sm:justify-between gap-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#0D4A2B] text-amber-300 shadow-2xs">
                          {p.kategori}
                        </span>
                        {p.matra && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200/80 text-slate-700">
                            {p.matra}
                          </span>
                        )}
                        {p.isMutasiMasuk && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            Mutasi Masuk
                          </span>
                        )}
                      </div>

                      {isAdminOrStaff && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditPersonnel(p);
                            }}
                            title="Edit Data Pegawai Ini"
                            className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeletePersonnel(p);
                            }}
                            title="Hapus Data Pegawai Ini"
                            className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-base sm:text-lg leading-snug group-hover:text-[#0D4A2B] transition-colors font-serif">
                        {p.nama}
                      </h4>
                      <div className="text-xs sm:text-sm font-extrabold text-[#0D4A2B] mt-1 leading-snug">
                        {p.jabatan}
                      </div>
                      {p.pangkatGol && p.pangkatGol !== '-' && (
                        <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-950">
                          <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{p.pangkatGol}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                      {p.pendidikan && (
                        <div className="flex items-start justify-center sm:justify-start gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span className="line-clamp-1"><strong className="text-slate-800">Pendidikan:</strong> {p.pendidikan}</span>
                        </div>
                      )}
                      {p.riwayatSingkat && (
                        <div className="text-slate-500 italic line-clamp-2 leading-relaxed">
                          {p.riwayatSingkat}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pop-up trigger cue */}
                <div className="mt-4 pt-2.5 border-t border-emerald-900/10 flex items-center justify-between text-[11px] font-bold text-[#0D4A2B] group-hover:text-emerald-700">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-600" />
                    <span>Lihat Profil Lengkap Pegawai</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-900 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                    <span>Detail</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* POP-UP DETAIL PERSONEL DILMILTI V MAKASSAR */}
      {selectedPersonnel && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setSelectedPersonnel(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-xl w-full border-2 border-[#0D4A2B] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#062416] via-[#0A3D24] to-[#041C11] text-white p-5 border-b border-emerald-500/30 flex items-start justify-between gap-3 relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center font-mono text-sm border-2 border-amber-300 shadow-md">
                  #{selectedPersonnel.no || 1}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-amber-300 font-bold tracking-wider">
                    PROFIL RESMI PERSONEL DILMILTI V
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    {selectedPersonnel.nama}
                  </h3>
                  <div className="text-xs text-emerald-200 font-semibold mt-0.5">
                    Pengadilan Militer Tinggi V Makassar • Mahkamah Agung RI
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPersonnel(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 text-xs">
              {/* Photo & Core Bio Card (Enlarged Portrait, No NRP/NIP) */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 rounded-2xl border-2 border-emerald-900/15 shadow-inner">
                <div className="flex flex-col items-center gap-2.5 shrink-0">
                  <div className="w-44 h-56 sm:w-48 sm:h-64 rounded-2xl p-1.5 bg-gradient-to-b from-amber-400 via-[#0D4A2B] to-[#041C11] shadow-xl overflow-hidden">
                    <OfficerProfileImage
                      src={selectedPersonnel.fotoUrl}
                      alt={selectedPersonnel.nama}
                      className="w-full h-full rounded-xl object-cover object-top"
                    />
                  </div>
                  {isAdminOrStaff && (
                    <button
                      type="button"
                      onClick={() => openPhotoModal(selectedPersonnel)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0D4A2B] hover:bg-[#082E1B] text-amber-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Ganti Foto Pegawai</span>
                    </button>
                  )}
                </div>

                <div className="flex-1 w-full space-y-3 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-[#0D4A2B] text-amber-300 shadow-2xs">
                      {selectedPersonnel.kategori}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-200 text-slate-800">
                      {selectedPersonnel.matra || 'ASN MA-RI'}
                    </span>
                    {selectedPersonnel.isMutasiMasuk && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        Pegawai Mutasi Masuk
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Nama Lengkap & Gelar</div>
                    <div className="text-base sm:text-lg font-black text-slate-900 font-serif leading-snug mt-0.5">
                      {selectedPersonnel.nama}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                    <div className="text-[10px] text-emerald-800 uppercase font-mono font-bold tracking-wider">Jabatan Kedinasan</div>
                    <div className="text-sm font-black text-[#0D4A2B] leading-snug mt-0.5">
                      {selectedPersonnel.jabatan}
                    </div>
                  </div>

                  {selectedPersonnel.pangkatGol && selectedPersonnel.pangkatGol !== '-' && (
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80">
                      <div className="text-[10px] text-amber-900 uppercase font-mono font-bold tracking-wider">Pangkat / Korps / Golongan</div>
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
                        <Award className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{selectedPersonnel.pangkatGol}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Extended Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Pendidikan Terakhir</span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs">
                    {selectedPersonnel.pendidikan || 'Pendidikan Hukum / Militer Kedinasan'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Status Kepegawaian</span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs">
                    {selectedPersonnel.isMutasiMasuk ? 'Aparatur Mutasi Masuk' : 'Aparatur Sipil / Militer Organik'}
                  </div>
                </div>
              </div>

              {/* Riwayat / Catatan Penugasan */}
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-1">
                <div className="text-[10px] font-mono text-emerald-900 font-bold uppercase flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Riwayat Kedinasan & Penugasan</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  {selectedPersonnel.riwayatSingkat || 'Menjalankan tugas dan kewajiban sesuai Surat Keputusan Mahkamah Agung RI dan ketentuan organisasi PERMA No. 1 Tahun 2017 pada Pengadilan Militer Tinggi V Makassar.'}
                </p>
              </div>

              {/* Legal Reference */}
              <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-200 pt-3">
                <span>Landasan: PERMA No. 1/2017 jo SK Ketua Mahkamah Agung RI</span>
                <span className="font-mono text-emerald-800 font-bold">Terverifikasi SIMARI MA-RI</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
              {isAdminOrStaff ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openPhotoModal(selectedPersonnel)}
                    className="px-3 py-1.5 rounded-xl bg-[#0D4A2B] hover:bg-[#082E1B] text-amber-300 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Ganti Foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedPersonnel) {
                        openEditPersonnel(selectedPersonnel);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Biodata & Jabatan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedPersonnel) {
                        openDeletePersonnel(selectedPersonnel);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-slate-500 italic">
                  Data Personel Terverifikasi • DILMILTI V Makassar
                </span>
              )}

              <button
                type="button"
                onClick={() => setSelectedPersonnel(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer ml-auto"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INPUT FOTO PEGAWAI (Admin/Staff Only) */}
      {isAdminOrStaff && isPhotoModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full border-2 border-[#0D4A2B] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#062416] via-[#0A3D24] to-[#041C11] text-white p-5 border-b border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-400 text-slate-950">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wide">
                    Input & Perbarui Foto Pegawai
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    Pengadilan Militer Tinggi V Makassar
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePersonnelPhoto} className="p-5 sm:p-6 space-y-4 text-xs">
              {/* Select Employee */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  Pilih Pegawai / Pejabat *
                </label>
                <select
                  value={photoTargetPersonnelId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setPhotoTargetPersonnelId(id);
                    const found = personnelList.find(p => p.id === id);
                    if (found) {
                      setPhotoInputUrl(found.fotoUrl || '');
                      setPhotoPreviewUrl(found.fotoUrl || '');
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:border-[#0D4A2B] focus:outline-hidden"
                >
                  {personnelList.map((p, idx) => (
                    <option key={p.id} value={p.id}>
                      #{p.no || idx + 1} - {p.nama} ({p.jabatan})
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode Selection Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPhotoInputMode('upload')}
                  className={`py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    photoInputMode === 'upload' ? 'bg-[#0D4A2B] text-amber-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Unggah File
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoInputMode('url')}
                  className={`py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    photoInputMode === 'url' ? 'bg-[#0D4A2B] text-amber-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tautan URL
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoInputMode('preset')}
                  className={`py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    photoInputMode === 'preset' ? 'bg-[#0D4A2B] text-amber-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Preset Resmi
                </button>
              </div>

              {/* Mode 1: File Upload */}
              {photoInputMode === 'upload' && (
                <div className="space-y-2">
                  <label className="block border-2 border-dashed border-emerald-600/40 hover:border-[#0D4A2B] bg-emerald-50/40 rounded-xl p-4 text-center cursor-pointer transition-colors relative">
                    {isUploadingPhoto ? (
                      <div className="py-2 flex flex-col items-center justify-center">
                        <div className="w-7 h-7 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="font-bold text-slate-800 text-xs">Mengompres & Mengunggah Foto...</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">Mohon tunggu sebentar</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-[#0D4A2B] mx-auto mb-1.5" />
                        <span className="font-bold text-slate-800 block text-xs">Pilih Berkas Foto dari Perangkat</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Format: JPG, PNG, WEBP (Otomatis Dioptimalkan)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingPhoto}
                      onChange={handlePhotoFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Mode 2: URL Input */}
              {photoInputMode === 'url' && (
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-900">
                    Masukkan URL / Alamat Foto Web
                  </label>
                  <input
                    type="text"
                    value={photoInputUrl}
                    onChange={(e) => {
                      setPhotoInputUrl(e.target.value);
                      setPhotoPreviewUrl(e.target.value);
                    }}
                    placeholder="https://domain.com/foto-pegawai.jpg atau /uploads/..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#0D4A2B] focus:outline-hidden"
                  />
                  <p className="text-[10px] text-slate-500">
                    Gunakan tautan gambar HTTPS langsung, path upload lokal, atau data image
                  </p>
                </div>
              )}

              {/* Mode 3: Presets */}
              {photoInputMode === 'preset' && (
                <div className="space-y-2">
                  <label className="block font-bold text-slate-900">
                    Pilih Dari Preset Foto Resmi
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {PHOTO_PRESETS.map((pr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPhotoPreviewUrl(pr.url);
                          setPhotoInputUrl(pr.url);
                        }}
                        className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                          photoPreviewUrl === pr.url ? 'border-2 border-[#0D4A2B] bg-emerald-50' : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <img
                          src={pr.url}
                          alt={pr.label}
                          className="w-full h-16 rounded-lg object-cover mb-1"
                        />
                        <span className="text-[9px] font-bold text-slate-700 block truncate">{pr.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Preview Container */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="shrink-0">
                  <img
                    src={photoPreviewUrl || photoInputUrl || DEFAULT_OFFICIAL_AVATAR}
                    alt="Pratinjau Foto"
                    onError={(e) => handleImageFallback(e, DEFAULT_OFFICIAL_AVATAR)}
                    className="w-16 h-20 rounded-xl object-cover border-2 border-emerald-600/40 shadow-xs bg-slate-200"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Pratinjau Foto Baru</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5 truncate">
                    {personnelList.find(p => p.id === photoTargetPersonnelId || String(p.id) === String(photoTargetPersonnelId) || String(p.no) === String(photoTargetPersonnelId))?.nama || 'Pegawai Terpilih'}
                  </div>
                  <div className="text-[10px] text-emerald-800 font-semibold truncate">
                    {personnelList.find(p => p.id === photoTargetPersonnelId || String(p.id) === String(photoTargetPersonnelId) || String(p.no) === String(photoTargetPersonnelId))?.jabatan || '-'}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1">
                    Foto akan langsung disimpan ke database browser dan disinkronkan ke seluruh portal.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploadingPhoto}
                  className="px-4 py-2 rounded-xl bg-[#0D4A2B] hover:bg-[#082E1B] disabled:opacity-50 text-amber-300 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isUploadingPhoto ? 'Memproses...' : 'Simpan Foto Pegawai'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KELOLA / TAMBAH / EDIT / HAPUS PERSONEL (Admin/Staff Only) */}
      {isAdminOrStaff && isPersCrudModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setIsPersCrudModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-xl w-full border-2 border-[#0D4A2B] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#062416] via-[#0A3D24] to-[#041C11] text-white p-5 border-b border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl font-bold text-slate-950 ${persCrudMode === 'delete' ? 'bg-red-400' : 'bg-amber-400'}`}>
                  {persCrudMode === 'create' && <Plus className="w-5 h-5" />}
                  {persCrudMode === 'edit' && <Edit3 className="w-5 h-5" />}
                  {persCrudMode === 'delete' && <Trash2 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wide">
                    {persCrudMode === 'create' && 'Tambah Data Personel Baru'}
                    {persCrudMode === 'edit' && `Edit Data: ${selectedPersCrudItem?.nama || 'Personel'}`}
                    {persCrudMode === 'delete' && 'Konfirmasi Hapus Personel'}
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    Pengadilan Militer Tinggi V Makassar • SIMARI MA-RI
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPersCrudModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            {persCrudMode === 'delete' ? (
              <form onSubmit={handleSavePersonnelForm} className="p-6 space-y-4 text-xs">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 space-y-2">
                  <p className="font-bold text-sm">Apakah Anda yakin ingin menghapus personel ini?</p>
                  <div className="bg-white p-3 rounded-lg border border-red-200 space-y-1">
                    <p className="font-extrabold text-slate-900">{selectedPersCrudItem?.nama}</p>
                    <p className="text-slate-600">{selectedPersCrudItem?.jabatan}</p>
                    <p className="font-mono text-slate-500">NIP/NRP: {selectedPersCrudItem?.nipNrp} • {selectedPersCrudItem?.pangkatGol}</p>
                  </div>
                  <p className="text-[11px] text-red-700">Tindakan ini akan menghapus data personel dari database publik dan portal.</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsPersCrudModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Permanen</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSavePersonnelForm} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block font-bold text-slate-900">
                      Nama Lengkap & Gelar <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kolonel Chk Sultan, S.H."
                      value={crudNama}
                      onChange={(e) => setCrudNama(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D4A2B] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-900">
                      NIP / NRP
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 11980017760771 atau 19800101..."
                      value={crudNipNrp}
                      onChange={(e) => setCrudNipNrp(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-[#0D4A2B] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-900">
                      Pangkat / Golongan
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Kolonel Chk / IV/b / Penata Muda (III/a)"
                      value={crudPangkatGol}
                      onChange={(e) => setCrudPangkatGol(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D4A2B] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block font-bold text-slate-900">
                      Jabatan Resmi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Wakil Kepala / Panitera / Sekretaris"
                      value={crudJabatan}
                      onChange={(e) => setCrudJabatan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D4A2B] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-900">
                      Kategori Unit
                    </label>
                    <select
                      value={crudKategori}
                      onChange={(e) => setCrudKategori(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D4A2B] focus:bg-white"
                    >
                      <option value="Pimpinan">Pimpinan</option>
                      <option value="Hakim Militer Tinggi">Hakim Militer Tinggi</option>
                      <option value="Kepaniteraan">Kepaniteraan</option>
                      <option value="Kesekretariatan">Kesekretariatan</option>
                      <option value="PPNPN">PPNPN / Tenaga Pendukung</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-900">
                      Matra / Asal Korps
                    </label>
                    <select
                      value={crudMatra}
                      onChange={(e) => setCrudMatra(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D4A2B] focus:bg-white"
                    >
                      <option value="TNI AD">TNI AD</option>
                      <option value="TNI AL">TNI AL</option>
                      <option value="TNI AU">TNI AU</option>
                      <option value="ASN MA-RI">ASN MA-RI</option>
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200">
                      <input
                        type="checkbox"
                        checked={crudIsMutasiMasuk}
                        onChange={(e) => setCrudIsMutasiMasuk(e.target.checked)}
                        className="rounded text-[#0D4A2B] focus:ring-[#0D4A2B] w-4 h-4"
                      />
                      <span className="font-bold text-slate-800">Tandai sebagai Pegawai Mutasi Masuk</span>
                    </label>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block font-bold text-slate-900">
                      Pendidikan Terakhir
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: S1 Ilmu Hukum Univ. Hasanuddin • S2 Magister Hukum"
                      value={crudPendidikan}
                      onChange={(e) => setCrudPendidikan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D4A2B] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block font-bold text-slate-900">
                      Riwayat Singkat & Penugasan
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Catatan kedinasan atau tupoksi penugasan..."
                      value={crudRiwayatSingkat}
                      onChange={(e) => setCrudRiwayatSingkat(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0D4A2B] focus:bg-white"
                    />
                  </div>

                  {/* Photo upload / URL in CRUD modal */}
                  <div className="space-y-2 sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block font-bold text-slate-900">
                      Foto Personel
                    </label>
                    <div className="flex items-center gap-3">
                      <img
                        src={crudFotoUrl || DEFAULT_OFFICIAL_AVATAR}
                        alt="Foto"
                        onError={(e) => handleImageFallback(e, DEFAULT_OFFICIAL_AVATAR)}
                        className="w-14 h-16 rounded-xl object-cover border border-slate-300 bg-white shrink-0"
                      />
                      <div className="flex-1 space-y-1.5">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 cursor-pointer shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-[#0D4A2B]" />
                          <span>Unggah File Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePersFormPhotoFileChange}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Atau masukkan URL / path gambar foto..."
                          value={crudFotoUrl}
                          onChange={(e) => setCrudFotoUrl(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-[11px] text-slate-900 focus:outline-hidden focus:border-[#0D4A2B]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsPersCrudModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#0D4A2B] hover:bg-[#082E1B] text-amber-300 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{persCrudMode === 'create' ? 'Simpan Personel Baru' : 'Simpan Perubahan Data'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DYNAMIC CUSTOM SUBTAB (FOR ANY CUSTOM MENU CREATED IN ADMIN PORTAL) */}
      {!['sambutan', 'visimisi', 'profil', 'sejarah', 'yurisdiksi', 'struktur', 'denah', 'rolemodel', 'role-model', 'agen-perubahan', 'kepaniteraan', 'tugas-fungsi', 'pengelolaan', 'pejabat', 'profil-hakim', 'profil-panitera', 'profil-kepaniteraan', 'profil-sekretaris', 'profil-kesekretariatan', 'profil-pegawai'].includes(subTab) && (() => {
        const customMenu = menuContents.find(m => m.id === subTab || m.targetSubTab === subTab || m.judul.toLowerCase() === subTab.toLowerCase());
        if (!customMenu) return null;
        return (
          <div className="bg-white rounded-2xl border border-emerald-900/15 p-6 shadow-xs space-y-5 text-xs text-slate-700 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                  {customMenu.badge || 'MENU RESMI'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  {customMenu.judul}
                </h3>
                {customMenu.subJudul && (
                  <p className="text-xs text-slate-500 mt-0.5">{customMenu.subJudul}</p>
                )}
              </div>
              {isAdminOrStaff && (
                <button
                  type="button"
                  onClick={() => { setEditingMenuId(customMenu.id); setIsMenuModalOpen(true); }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Isi Data</span>
                </button>
              )}
            </div>

            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
              {customMenu.kontenUtama}
            </div>

            {customMenu.poinPoin && customMenu.poinPoin.length > 0 && (
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2">
                <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wide">
                  Poin Ketentuan & Informasi Terkait:
                </strong>
                <ul className="space-y-1.5">
                  {customMenu.poinPoin.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {customMenu.dasarHukum && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0D4A2B] shrink-0" />
                <span><strong>Dasar Hukum:</strong> {customMenu.dasarHukum}</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* MODAL EDIT MENU LANGSUNG (ADMIN/PETUGAS) */}
      <MenuContentEditModal
        isOpen={isMenuModalOpen}
        menuId={editingMenuId}
        showToast={showToast}
        onClose={() => {
          setIsMenuModalOpen(false);
          setEditingMenuId(null);
        }}
        onSaveSuccess={() => {
          loadData();
          showToast('Data menu berhasil diperbarui dan tampilan publik langsung sinkron!');
        }}
      />

    </section>
  );
}
