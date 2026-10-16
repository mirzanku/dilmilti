import React from 'react';
import { FileDown, FileText, CheckCircle2, FolderOpen } from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import { SakipDipaDocumentItem } from '../types';

interface PageReportDownloadBarProps {
  categoryKey: string;
  subTabKey?: string;
  title?: string;
  onNavigateToDocuments?: () => void;
}

export default function PageReportDownloadBar({
  categoryKey,
  subTabKey = '',
  title,
  onNavigateToDocuments
}: PageReportDownloadBarProps) {
  const allDocs = CourtDB.getSakipDipaDocuments();

  // Filter relevant reports based on the active menu and submenu
  const relevantDocs = React.useMemo(() => {
    const sub = subTabKey.toLowerCase();

    if (categoryKey === 'tentang') {
      if (sub.includes('hakim') || sub.includes('panitera') || sub.includes('kepaniteraan') || sub.includes('sekretaris') || sub.includes('kesekretariatan') || sub.includes('pegawai') || sub.includes('pejabat')) {
        return allDocs.filter(d => d.kategori === 'LHKPN' || d.judul.toLowerCase().includes('lhkpn') || d.judul.toLowerCase().includes('pegawai') || d.judul.toLowerCase().includes('kinerja'));
      }
      return allDocs.filter(d => d.kategori === 'SAKIP' || d.kategori === 'LHKPN').slice(0, 3);
    }

    if (categoryKey === 'publik') {
      if (sub.includes('standar') || sub.includes('maklumat') || sub.includes('ptsp') || sub.includes('jenis') || sub.includes('kompensasi')) {
        return allDocs.filter(d => d.kategori === 'STANDAR_PELAYANAN' || d.kategori === 'MAKLUMAT' || d.kategori === 'SK_SOP');
      }
      if (sub.includes('survei') || sub.includes('ikm') || sub.includes('ipak')) {
        return allDocs.filter(d => d.kategori === 'LAPORAN_SURVEI' || d.judul.toLowerCase().includes('survei') || d.judul.toLowerCase().includes('ikm'));
      }
      if (sub.includes('statistik') || sub.includes('perkara')) {
        return allDocs.filter(d => d.kategori === 'LAPORAN_PERKARA' || d.judul.toLowerCase().includes('perkara'));
      }
      return allDocs.filter(d => ['STANDAR_PELAYANAN', 'LAPORAN_SURVEI', 'LAPORAN_PERKARA'].includes(d.kategori)).slice(0, 3);
    }

    if (categoryKey === 'hukum') {
      if (sub.includes('posbakum') || sub.includes('prodeo')) {
        return allDocs.filter(d => d.kategori === 'LAPORAN_POSBAKUM' || d.judul.toLowerCase().includes('posbakum') || d.judul.toLowerCase().includes('prodeo'));
      }
      return allDocs.filter(d => d.kategori === 'LAPORAN_POSBAKUM' || d.kategori === 'LAPORAN_PERKARA' || d.kategori === 'SK_SOP').slice(0, 3);
    }

    if (categoryKey === 'ppid') {
      if (sub.includes('keuangan') || sub.includes('dipa')) {
        return allDocs.filter(d => d.kategori === 'DIPA');
      }
      if (sub.includes('lakip') || sub.includes('renstra') || sub.includes('program')) {
        return allDocs.filter(d => d.kategori === 'SAKIP');
      }
      if (sub.includes('lhkpn') || sub.includes('lhkan')) {
        return allDocs.filter(d => d.kategori === 'LHKPN');
      }
      return allDocs.filter(d => d.kategori === 'PPID' || d.kategori === 'SAKIP' || d.kategori === 'DIPA').slice(0, 3);
    }

    if (categoryKey === 'reformasi') {
      return allDocs.filter(d => d.kategori === 'LAPORAN_EVIDEN_ZI' || d.kategori === 'SAKIP' || d.kategori === 'LAPORAN_SURVEI').slice(0, 3);
    }

    if (categoryKey === 'berita') {
      return allDocs.filter(d => d.kategori === 'PPID' || d.kategori === 'STANDAR_PELAYANAN').slice(0, 2);
    }

    return allDocs.slice(0, 3);
  }, [allDocs, categoryKey, subTabKey]);

  const handleDownloadReport = (doc: SakipDipaDocumentItem) => {
    if (doc.fileUrl && doc.fileUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = doc.fileUrl;
      a.download = doc.fileName || `${doc.judul}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    const content = `MAHKAMAH AGUNG REPUBLIK INDONESIA
DIREKTORAT JENDERAL BADAN PERADILAN MILITER DAN PERADILAN TATA USAHA NEGARA
PENGADILAN MILITER TINGGI V MAKASSAR
Jl. Perintis Kemerdekaan KM. 13, Daya, Biringkanaya, Kota Makassar 90243
================================================================================

DOKUMEN LAPORAN RESMI SATUAN KERJA

Judul Laporan        : ${doc.judul}
Nomor Dokumen / SK   : ${doc.nomorDokumen || 'W5-Mil.01/OT.01.1/LAP/2026'}
Kategori Laporan     : ${doc.kategori}${doc.subKategori ? ` - ${doc.subKategori}` : ''}
Tahun Anggaran       : ${doc.tahun}
Unit Penanggung Jawab: ${doc.penanggungJawab}
Tanggal Publikasi    : ${doc.tanggalUpload}
Spesifikasi Berkas   : ${doc.fileType} (${doc.fileSize})
${doc.nilaiAnggaran ? `Alokasi / Realisasi  : ${doc.nilaiAnggaran}\n` : ''}${doc.persentaseKepatuhan ? `Capaian Kinerja      : ${doc.persentaseKepatuhan}\n` : ''}
--------------------------------------------------------------------------------
RINGKASAN EKSEKUTIF LAPORAN:
${doc.deskripsi}

--------------------------------------------------------------------------------
Dokumen ini diunduh secara sah melalui Portal Keterbukaan Informasi Publik
Pengadilan Militer Tinggi V Makassar sesuai SK KMA No. 2-144/KMA/SK/VIII/2022.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanName = (doc.fileName || doc.judul).replace(/[^a-zA-Z0-9._-]/g, '_');
    a.download = cleanName.endsWith('.txt') || cleanName.endsWith('.pdf') ? cleanName : `${cleanName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (relevantDocs.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-emerald-800/20 p-4 shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0A3D24] text-amber-300 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              {title || 'Unduh File Laporan & Dokumen Resmi Halaman Ini'}
            </h4>
            <p className="text-[11px] text-slate-500">
              Klik tombol unduh di bawah untuk menyimpan salinan laporan resmi satuan kerja
            </p>
          </div>
        </div>

        {onNavigateToDocuments && (
          <button
            type="button"
            onClick={onNavigateToDocuments}
            className="text-xs font-bold text-[#0A3D24] hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Semua Arsip Laporan</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {relevantDocs.slice(0, 3).map((doc) => (
          <div
            key={doc.id}
            className="p-3 rounded-lg bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-600/40 transition-all flex items-center justify-between gap-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">{doc.subKategori || doc.kategori}</span>
                <span>·</span>
                <span className="font-mono">TA {doc.tahun}</span>
              </div>
              <div className="text-xs font-bold text-slate-900 truncate mt-0.5" title={doc.judul}>
                {doc.judul}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {doc.fileType} · {doc.fileSize}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDownloadReport(doc)}
              className="px-3 py-1.5 rounded-lg bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-[11px] flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors shadow-2xs"
              title={`Unduh ${doc.judul}`}
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Unduh</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
