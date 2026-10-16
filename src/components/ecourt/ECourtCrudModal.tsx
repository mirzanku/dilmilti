import React, { useState } from 'react';
import { X, Save, RotateCcw, Check, Sparkles, Sliders, FileText, CreditCard, Mail, Video, HelpCircle } from 'lucide-react';
import { ECourtPageContent } from '../../types';

interface ECourtCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ECourtPageContent;
  onSave: (newContent: ECourtPageContent) => void;
  onReset: () => void;
}

export function ECourtCrudModal({
  isOpen,
  onClose,
  content,
  onSave,
  onReset
}: ECourtCrudModalProps) {
  const [activeTab, setActiveTab] = useState<'header' | 'overview' | 'efiling' | 'epayment' | 'esummons' | 'elitigation' | 'bantuan'>('header');
  const [formData, setFormData] = useState<ECourtPageContent>(content);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    setFormData(content);
  }, [content, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh halaman e-Court ke format bawaan resmi Mahkamah Agung RI?')) {
      onReset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-blue-950 px-2 py-0.5 rounded-full">
                  Admin CRUD
                </span>
                <span className="text-xs text-blue-200 font-semibold">Pengaturan Konten Halaman</span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                Kelola Seluruh Halaman Layanan Perkara Elektronik
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer"
              title="Reset ke pengaturan default Mahkamah Agung"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-1 overflow-x-auto text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('header')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'header' ? 'bg-blue-900 text-white shadow-xs' : 'hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Header & Banner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-blue-900 text-white shadow-xs' : 'hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Overview & Dasar Hukum</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('efiling')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'efiling' ? 'bg-blue-900 text-white shadow-xs' : 'hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. e-Filing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('epayment')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'epayment' ? 'bg-blue-900 text-white shadow-xs' : 'hover:bg-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>2. e-Payment</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('esummons')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'esummons' ? 'bg-blue-900 text-white shadow-xs' : 'hover:bg-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>3. e-Summons</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('elitigation')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'elitigation' ? 'bg-blue-900 text-white shadow-xs' : 'hover:bg-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>4. e-Litigation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bantuan')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'bantuan' ? 'bg-blue-900 text-white shadow-xs' : 'hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>5. Meja e-Court</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* TAB 1: HEADER & BANNER */}
          {activeTab === 'header' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Atas</label>
                  <input
                    type="text"
                    value={formData.header.badge}
                    onChange={(e) => setFormData({
                      ...formData,
                      header: { ...formData.header, badge: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dasar Hukum Singkat</label>
                  <input
                    type="text"
                    value={formData.header.dasarHukum}
                    onChange={(e) => setFormData({
                      ...formData,
                      header: { ...formData.header, dasarHukum: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instansi Induk</label>
                <input
                  type="text"
                  value={formData.header.instansi}
                  onChange={(e) => setFormData({
                    ...formData,
                    header: { ...formData.header, instansi: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Utama Banner</label>
                <input
                  type="text"
                  value={formData.header.judul}
                  onChange={(e) => setFormData({
                    ...formData,
                    header: { ...formData.header, judul: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Banner</label>
                <textarea
                  rows={3}
                  value={formData.header.deskripsi}
                  onChange={(e) => setFormData({
                    ...formData,
                    header: { ...formData.header, deskripsi: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teks Tombol Portal e-Court</label>
                  <input
                    type="text"
                    value={formData.header.portalButtonText}
                    onChange={(e) => setFormData({
                      ...formData,
                      header: { ...formData.header, portalButtonText: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Tautan Portal Resmi</label>
                  <input
                    type="text"
                    value={formData.header.portalUrl}
                    onChange={(e) => setFormData({
                      ...formData,
                      header: { ...formData.header, portalUrl: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teks Tombol Panduan Pengguna</label>
                  <input
                    type="text"
                    value={formData.header.panduanButtonText}
                    onChange={(e) => setFormData({
                      ...formData,
                      header: { ...formData.header, panduanButtonText: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Tautan Panduan Pengguna</label>
                  <input
                    type="text"
                    value={formData.header.panduanUrl}
                    onChange={(e) => setFormData({
                      ...formData,
                      header: { ...formData.header, panduanUrl: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pemberitahuan Resmi Sistem Terpusat</label>
                <textarea
                  rows={3}
                  value={formData.header.pemberitahuanResmi}
                  onChange={(e) => setFormData({
                    ...formData,
                    header: { ...formData.header, pemberitahuanResmi: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Overview</label>
                <input
                  type="text"
                  value={formData.overview.judul}
                  onChange={(e) => setFormData({
                    ...formData,
                    overview: { ...formData.overview, judul: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subjudul Overview</label>
                <input
                  type="text"
                  value={formData.overview.subjudul}
                  onChange={(e) => setFormData({
                    ...formData,
                    overview: { ...formData.overview, subjudul: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Penjelasan Umum e-Court</label>
                <textarea
                  rows={4}
                  value={formData.overview.penjelasanUmum}
                  onChange={(e) => setFormData({
                    ...formData,
                    overview: { ...formData.overview, penjelasanUmum: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>
          )}

          {/* TAB 3: E-FILING */}
          {activeTab === 'efiling' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Tab e-Filing</label>
                <input
                  type="text"
                  value={formData.efiling.judul}
                  onChange={(e) => setFormData({
                    ...formData,
                    efiling: { ...formData.efiling, judul: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subjudul e-Filing</label>
                <input
                  type="text"
                  value={formData.efiling.subjudul}
                  onChange={(e) => setFormData({
                    ...formData,
                    efiling: { ...formData.efiling, subjudul: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Pendaftaran Akun Portal e-Court</label>
                <input
                  type="text"
                  value={formData.efiling.urlDaftarPortal}
                  onChange={(e) => setFormData({
                    ...formData,
                    efiling: { ...formData.efiling, urlDaftarPortal: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>
          )}

          {/* TAB 4: E-PAYMENT */}
          {activeTab === 'epayment' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Tab e-Payment</label>
                <input
                  type="text"
                  value={formData.epayment.judul}
                  onChange={(e) => setFormData({
                    ...formData,
                    epayment: { ...formData.epayment, judul: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subjudul e-Payment</label>
                <input
                  type="text"
                  value={formData.epayment.subjudul}
                  onChange={(e) => setFormData({
                    ...formData,
                    epayment: { ...formData.epayment, subjudul: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Otomatisasi Virtual Account SIPP</label>
                <textarea
                  rows={3}
                  value={formData.epayment.catatanOtomatisasi}
                  onChange={(e) => setFormData({
                    ...formData,
                    epayment: { ...formData.epayment, catatanOtomatisasi: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>
          )}

          {/* TAB 5: E-SUMMONS */}
          {activeTab === 'esummons' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Tab e-Summons</label>
                <input
                  type="text"
                  value={formData.esummons.judul}
                  onChange={(e) => setFormData({
                    ...formData,
                    esummons: { ...formData.esummons, judul: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subjudul e-Summons</label>
                <input
                  type="text"
                  value={formData.esummons.subjudul}
                  onChange={(e) => setFormData({
                    ...formData,
                    esummons: { ...formData.esummons, subjudul: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ketentuan Keabsahan Hukum Domisili Elektronik</label>
                <textarea
                  rows={4}
                  value={formData.esummons.ketentuanPanggilan}
                  onChange={(e) => setFormData({
                    ...formData,
                    esummons: { ...formData.esummons, ketentuanPanggilan: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>
          )}

          {/* TAB 6: E-LITIGATION */}
          {activeTab === 'elitigation' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Tab e-Litigation</label>
                <input
                  type="text"
                  value={formData.elitigation.judul}
                  onChange={(e) => setFormData({
                    ...formData,
                    elitigation: { ...formData.elitigation, judul: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subjudul e-Litigation</label>
                <input
                  type="text"
                  value={formData.elitigation.subjudul}
                  onChange={(e) => setFormData({
                    ...formData,
                    elitigation: { ...formData.elitigation, subjudul: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Ruang Sidang Virtual</label>
                <input
                  type="text"
                  value={formData.elitigation.ruangSidangVirtual.judul}
                  onChange={(e) => setFormData({
                    ...formData,
                    elitigation: {
                      ...formData.elitigation,
                      ruangSidangVirtual: { ...formData.elitigation.ruangSidangVirtual, judul: e.target.value }
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Ruang Sidang Virtual</label>
                <textarea
                  rows={2}
                  value={formData.elitigation.ruangSidangVirtual.deskripsi}
                  onChange={(e) => setFormData({
                    ...formData,
                    elitigation: {
                      ...formData.elitigation,
                      ruangSidangVirtual: { ...formData.elitigation.ruangSidangVirtual, deskripsi: e.target.value }
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Tautan Teleconference (Zoom / Webex)</label>
                <textarea
                  rows={2}
                  value={formData.elitigation.ruangSidangVirtual.catatanTeleconference}
                  onChange={(e) => setFormData({
                    ...formData,
                    elitigation: {
                      ...formData.elitigation,
                      ruangSidangVirtual: { ...formData.elitigation.ruangSidangVirtual, catatanTeleconference: e.target.value }
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>
          )}

          {/* TAB 7: BANTUAN & MEJA E-COURT */}
          {activeTab === 'bantuan' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Judul Layanan Bantuan</label>
                  <input
                    type="text"
                    value={formData.bantuan.judul}
                    onChange={(e) => setFormData({
                      ...formData,
                      bantuan: { ...formData.bantuan, judul: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Helpdesk / Unit</label>
                  <input
                    type="text"
                    value={formData.bantuan.mejaEcourt.namaHelpdesk}
                    onChange={(e) => setFormData({
                      ...formData,
                      bantuan: {
                        ...formData.bantuan,
                        mejaEcourt: { ...formData.bantuan.mejaEcourt, namaHelpdesk: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subjudul Bantuan</label>
                <input
                  type="text"
                  value={formData.bantuan.subjudul}
                  onChange={(e) => setFormData({
                    ...formData,
                    bantuan: { ...formData.bantuan, subjudul: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lokasi Ruang Meja e-Court</label>
                  <input
                    type="text"
                    value={formData.bantuan.mejaEcourt.lokasi}
                    onChange={(e) => setFormData({
                      ...formData,
                      bantuan: {
                        ...formData.bantuan,
                        mejaEcourt: { ...formData.bantuan.mejaEcourt, lokasi: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Resmi Helpdesk</label>
                  <input
                    type="text"
                    value={formData.bantuan.mejaEcourt.noWhatsapp}
                    onChange={(e) => setFormData({
                      ...formData,
                      bantuan: {
                        ...formData.bantuan,
                        mejaEcourt: { ...formData.bantuan.mejaEcourt, noWhatsapp: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jam Layanan (Senin - Kamis)</label>
                  <input
                    type="text"
                    value={formData.bantuan.mejaEcourt.jamLayananSeninKamis}
                    onChange={(e) => setFormData({
                      ...formData,
                      bantuan: {
                        ...formData.bantuan,
                        mejaEcourt: { ...formData.bantuan.mejaEcourt, jamLayananSeninKamis: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jam Layanan (Jumat)</label>
                  <input
                    type="text"
                    value={formData.bantuan.mejaEcourt.jamLayananJumat}
                    onChange={(e) => setFormData({
                      ...formData,
                      bantuan: {
                        ...formData.bantuan,
                        mejaEcourt: { ...formData.bantuan.mejaEcourt, jamLayananJumat: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Fisik</label>
                <input
                  type="text"
                  value={formData.bantuan.mejaEcourt.alamat}
                  onChange={(e) => setFormData({
                    ...formData,
                    bantuan: {
                      ...formData.bantuan,
                      mejaEcourt: { ...formData.bantuan.mejaEcourt, alamat: e.target.value }
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Terakhir diperbarui: {content.updatedAt || 'Hari ini'}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
