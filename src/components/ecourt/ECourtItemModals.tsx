import React, { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { 
  ECourtCaseTypeItem, 
  ECourtDocRequirementItem, 
  ECourtProcedureStepItem,
  ECourtLegalBasisItem,
  ECourtPrincipleItem,
  ECourtPartnerBankItem,
  ECourtPaymentRuleItem
} from '../../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function BaseModal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between">
          <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
            <span>{title}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {children}
        </div>
      </div>
    </div>
  );
}

// 1. Modal CRUD Jenis Perkara
export function CaseTypeModal({
  isOpen,
  onClose,
  initialData,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ECourtCaseTypeItem | null;
  onSave: (item: ECourtCaseTypeItem) => void;
}) {
  const [tingkat, setTingkat] = useState(initialData?.tingkat || 'Tingkat Banding');
  const [nama, setNama] = useState(initialData?.nama || '');
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || '');

  React.useEffect(() => {
    if (initialData) {
      setTingkat(initialData.tingkat);
      setNama(initialData.nama);
      setDeskripsi(initialData.deskripsi);
    } else {
      setTingkat('Tingkat Banding');
      setNama('');
      setDeskripsi('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;
    onSave({
      id: initialData?.id || `jp-${Date.now()}`,
      tingkat,
      nama,
      deskripsi
    });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Jenis Perkara' : 'Tambah Jenis Perkara e-Court'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Tingkatan / Kategori Perkara</label>
          <input
            type="text"
            value={tingkat}
            onChange={(e) => setTingkat(e.target.value)}
            placeholder="Contoh: Tingkat Banding / Tingkat Pertama / Upaya Luar Biasa"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Nama Permohonan / Gugatan</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Permohonan Banding Pidana Militer"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Deskripsi & Ruang Lingkup</label>
          <textarea
            rows={3}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Pemeriksaan ulang putusan pengadilan militer asal..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Simpan</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

// 2. Modal CRUD Dokumen Persyaratan
export function DocRequirementModal({
  isOpen,
  onClose,
  initialData,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ECourtDocRequirementItem | null;
  onSave: (item: ECourtDocRequirementItem) => void;
}) {
  const [urutan, setUrutan] = useState(initialData?.urutan || 1);
  const [nama, setNama] = useState(initialData?.nama || '');
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || '');
  const [format, setFormat] = useState(initialData?.format || 'PDF (Maks. 10MB)');

  React.useEffect(() => {
    if (initialData) {
      setUrutan(initialData.urutan);
      setNama(initialData.nama);
      setDeskripsi(initialData.deskripsi);
      setFormat(initialData.format);
    } else {
      setUrutan(1);
      setNama('');
      setDeskripsi('');
      setFormat('PDF (Maks. 10MB)');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;
    onSave({
      id: initialData?.id || `dok-${Date.now()}`,
      urutan: Number(urutan),
      nama,
      deskripsi,
      format
    });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Dokumen Persyaratan' : 'Tambah Dokumen Persyaratan'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nomor Urutan</label>
            <input
              type="number"
              value={urutan}
              onChange={(e) => setUrutan(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Format & Ukuran Maksimal</label>
            <input
              type="text"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="PDF (Maks. 10MB)"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Nama Dokumen</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: 1. Akta / Permohonan"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Deskripsi Persyaratan</label>
          <textarea
            rows={3}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Akta permohonan banding resmi dari pengadilan militer asal..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Simpan</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

// 3. Modal CRUD Alur Langkah
export function ProcedureStepModal({
  isOpen,
  onClose,
  initialData,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ECourtProcedureStepItem | null;
  onSave: (item: ECourtProcedureStepItem) => void;
}) {
  const [stepNumber, setStepNumber] = useState(initialData?.stepNumber || 1);
  const [judul, setJudul] = useState(initialData?.judul || '');
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || '');
  const [urlLink, setUrlLink] = useState(initialData?.urlLink || '');

  React.useEffect(() => {
    if (initialData) {
      setStepNumber(initialData.stepNumber);
      setJudul(initialData.judul);
      setDeskripsi(initialData.deskripsi);
      setUrlLink(initialData.urlLink || '');
    } else {
      setStepNumber(1);
      setJudul('');
      setDeskripsi('');
      setUrlLink('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) return;
    onSave({
      id: initialData?.id || `step-${Date.now()}`,
      stepNumber: Number(stepNumber),
      judul,
      deskripsi,
      urlLink: urlLink.trim() ? urlLink.trim() : undefined
    });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Alur Langkah' : 'Tambah Alur Langkah Pendaftaran'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Nomor Langkah (Step)</label>
          <input
            type="number"
            value={stepNumber}
            onChange={(e) => setStepNumber(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Judul Langkah</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Contoh: Login ke Akun e-Court"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Deskripsi Petunjuk Teknis</label>
          <textarea
            rows={3}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Buka https://ecourt.mahkamahagung.go.id/ lalu masuk..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Tautan URL Opsional</label>
          <input
            type="text"
            value={urlLink}
            onChange={(e) => setUrlLink(e.target.value)}
            placeholder="https://ecourt.mahkamahagung.go.id/"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Simpan</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

// 4. Modal CRUD Dasar Hukum
export function LegalBasisModal({
  isOpen,
  onClose,
  initialData,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ECourtLegalBasisItem | null;
  onSave: (item: ECourtLegalBasisItem) => void;
}) {
  const [nomorRegulasi, setNomorRegulasi] = useState(initialData?.nomorRegulasi || '');
  const [tentang, setTentang] = useState(initialData?.tentang || '');

  React.useEffect(() => {
    if (initialData) {
      setNomorRegulasi(initialData.nomorRegulasi);
      setTentang(initialData.tentang);
    } else {
      setNomorRegulasi('');
      setTentang('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomorRegulasi.trim()) return;
    onSave({
      id: initialData?.id || `hukum-${Date.now()}`,
      nomorRegulasi,
      tentang
    });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Dasar Hukum' : 'Tambah Dasar Hukum'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Nomor Regulasi / Aturan</label>
          <input
            type="text"
            value={nomorRegulasi}
            onChange={(e) => setNomorRegulasi(e.target.value)}
            placeholder="Contoh: Perma No. 1 Tahun 2019"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Tentang / Perihal</label>
          <textarea
            rows={3}
            value={tentang}
            onChange={(e) => setTentang(e.target.value)}
            placeholder="Administrasi Perkara dan Persidangan di Pengadilan Secara Elektronik."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Simpan</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

// 5. Modal CRUD Bank Mitra
export function PartnerBankModal({
  isOpen,
  onClose,
  initialData,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ECourtPartnerBankItem | null;
  onSave: (item: ECourtPartnerBankItem) => void;
}) {
  const [namaBank, setNamaBank] = useState(initialData?.namaBank || '');
  const [layananVa, setLayananVa] = useState(initialData?.layananVa || '');

  React.useEffect(() => {
    if (initialData) {
      setNamaBank(initialData.namaBank);
      setLayananVa(initialData.layananVa);
    } else {
      setNamaBank('');
      setLayananVa('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaBank.trim()) return;
    onSave({
      id: initialData?.id || `bank-${Date.now()}`,
      namaBank,
      layananVa
    });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Bank Mitra' : 'Tambah Bank Mitra'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Nama Bank Mitra</label>
          <input
            type="text"
            value={namaBank}
            onChange={(e) => setNamaBank(e.target.value)}
            placeholder="Contoh: Bank BRI / Bank BNI"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Nama Saluran Virtual Account</label>
          <input
            type="text"
            value={layananVa}
            onChange={(e) => setLayananVa(e.target.value)}
            placeholder="Contoh: BRIVA e-Court / Virtual Account BNI"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Simpan</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
