import {
  PTSPApplicationItem,
  PTSPReplyDocumentItem,
  PTSPQueueTicketItem,
  PTSPOnlineConsultationItem,
  KATALOG_6_MEJA_PTSP
} from '../../data/ptspDatabase';
import { cacheOfficialDocumentForOffline } from '../../utils/ptspServiceWorkerSync';

export interface TteValidationResultData {
  qrHash: string;
  ticketNo: string;
  nomorSurat: string;
  judulDokumen: string;
  namaPemohon: string;
  kesatuanInstansi: string;
  mejaNama: string;
  signerNama: string;
  signerPangkatNrp: string;
  signerJabatan: string;
  signedAt: string;
  isiRingkas: string;
  jenisDokumen: 'DOKUMEN BALASAN RESMI PTSP' | 'BERITA ACARA KONSULTASI ELEKTRONIK';
}

// Helper untuk menentukan Kode Register Induk & Formulir sesuai Buku II Mahkamah Agung RI Edisi Terbaru
export function getBukuIIRegisterMetadata(mejaId: number, jenisLayanan: string) {
  switch (mejaId) {
    case 1:
      return {
        kodeFormulir: 'MODEL PTSP-PID.01 / BUKU II MA-RI',
        bukuRegister: 'Register Induk Perkara Pidana Militer Banding/Kasasi/PK/Grasi (RP-BDG / RP-KAS / RP-PK)',
        strukturBerkas: 'Pemeriksaan Kelengkapan Bundel A (Berkas Perkara Tk.I) & Bundel B (Akta & Memori Upaya Hukum)',
        dasarBukuII:
          'Buku II Mahkamah Agung RI Edisi Revisi Terbaru (Pedoman Pelaksanaan Tugas dan Administrasi Pengadilan Militer - Bab Administrasi Perkara Pidana Militer) jo. UU No. 31 Tahun 1997 & SK KMA No. 359/KMA/SK/XII/2022'
      };
    case 2:
      return {
        kodeFormulir: 'MODEL PTSP-HK.02 / BUKU II MA-RI',
        bukuRegister: 'Register Kepaniteraan Hukum (Reg. SKTPD / Reg. Surat Kuasa Khusus / Reg. Waarmerking & Legalisasi)',
        strukturBerkas: 'Verifikasi Silang Buku Register Induk Pidana Militer, SIPP & Keabsahan Identitas Prajurit/Advokat',
        dasarBukuII:
          'Buku II Mahkamah Agung RI Edisi Revisi Terbaru (Bab Administrasi Kepaniteraan Hukum, Pendaftaran Surat Kuasa, Legalisasi & SK Tidak Pernah Dipidana)'
      };
    case 3:
      return {
        kodeFormulir: 'MODEL PTSP-UM.03 / BUKU II MA-RI',
        bukuRegister: 'Buku Agenda Naskah Dinas Elektronik & Register Keuangan Perkara / PNBP (Kode Klasifikasi W5-Mil)',
        strukturBerkas: 'Verifikasi Tata Naskah Dinas MA-RI, Dokumen Pengadaan & Pertanggungjawaban Keuangan DIPA',
        dasarBukuII:
          'Buku II Mahkamah Agung RI (Bab Administrasi Umum & Keuangan Pengadilan) jo. SK KMA tentang Tata Naskah Dinas Pengadilan'
      };
    case 4:
      return {
        kodeFormulir: 'MODEL PTSP-KP.04 / BUKU II MA-RI',
        bukuRegister: 'Register Administrasi Kepegawaian Militer (TNI AD/AL/AU) & ASN (SIKEP MA-RI / Ortala)',
        strukturBerkas: 'Berkas Usul Kenaikan Pangkat (UKP), SKEP Mutasi/Sprinlak, SPMT & Register Cuti/Izin Personel',
        dasarBukuII:
          'Buku II Mahkamah Agung RI (Bab Administrasi Kepegawaian, Organisasi & Tata Laksana Peradilan Militer)'
      };
    case 5:
      return {
        kodeFormulir: 'MODEL PTSP-PTIP.05 / BUKU II MA-RI',
        bukuRegister: 'Register Pelaporan Periodik Perkara (Laptah/Bulanan Buku II MA), Statistik SIPP & LHKPN',
        strukturBerkas: 'Validasi Data Statistik Perkara e-Pelaporan Badilmiltun, SAKIP/LKjIP & RKA-KL/DIPA',
        dasarBukuII:
          'Buku II Mahkamah Agung RI (Bab Pelaporan Perkara, Statistik Peradilan & Pengelolaan TI Pengadilan)'
      };
    default:
      return {
        kodeFormulir: 'MODEL PTSP-PPID.06 / BUKU II MA-RI (FORM MODEL A/B)',
        bukuRegister: 'Register Permohonan Informasi Publik (PPID Model A), Register Posbakum & Register Pengaduan SIWAS',
        strukturBerkas: 'Uji Konsekuensi Informasi Publik (SK KMA 2-144/2022), Advis Posbakum (PERMA 1/2014) & Telaah SIWAS (PERMA 9/2016)',
        dasarBukuII:
          'Buku II Mahkamah Agung RI jo. SK KMA No. 2-144/KMA/SK/VIII/2022, PERMA No. 1 Tahun 2014 (Posbakum) & PERMA No. 9 Tahun 2016 (SIWAS)'
      };
  }
}

export function buildApplicationReceiptHtml(app: PTSPApplicationItem): string {
  const meta = getBukuIIRegisterMetadata(app.meja_id, app.jenis_layanan);
  const qrData = encodeURIComponent(
    `VALID-REG-BUKU2:${app.ticket_no}|MEJA:${app.meja_id}|PEMOHON:${app.nama_pemohon}`
  );
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrData}`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Bukti Tanda Terima PTSP (Buku II MA-RI) - ${app.ticket_no}</title>
  <style>
    body { font-family: 'Times New Roman', Times, serif; color: #0f172a; margin: 20px; line-height: 1.45; }
    .container { max-width: 780px; margin: 0 auto; border: 2px solid #064e3b; padding: 24px 28px; position: relative; background: #fff; }
    .form-code { position: absolute; top: 14px; right: 20px; border: 1.5px solid #064e3b; padding: 3px 8px; font-family: Arial, sans-serif; font-size: 9.5px; font-weight: bold; background: #f0fdf4; color: #064e3b; }
    .kop { text-align: center; border-bottom: 3px double #0f172a; padding-bottom: 10px; margin-bottom: 14px; padding-top: 10px; }
    .kop h2 { margin: 0; font-size: 13.5px; text-transform: uppercase; letter-spacing: 0.4px; }
    .kop h1 { margin: 3px 0; font-size: 17.5px; color: #064e3b; text-transform: uppercase; }
    .kop p { margin: 2px 0; font-size: 10.5px; font-family: Arial, sans-serif; }
    .badge { display: inline-block; background: #fef3c7; border: 1px solid #d97706; color: #78350f; font-family: Arial, sans-serif; font-size: 10.5px; font-weight: bold; padding: 4px 10px; border-radius: 4px; margin-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11.5px; margin-bottom: 12px; }
    td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    td.label { width: 34%; font-weight: bold; color: #1e293b; background: #f8fafc; }
    .sop-box { background: #f0fdf4; border: 1px solid #86efac; padding: 10px 12px; border-radius: 6px; font-family: Arial, sans-serif; font-size: 10.5px; margin-bottom: 14px; }
    .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 12px; border-top: 1px dashed #94a3b8; font-family: Arial, sans-serif; font-size: 10.5px; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="form-code">${meta.kodeFormulir}</div>
    <div class="kop">
      <h2>MAHKAMAH AGUNG REPUBLIK INDONESIA</h2>
      <h2>DIREKTORAT JENDERAL BADAN PERADILAN MILITER DAN PERADILAN TATA USAHA NEGARA</h2>
      <h1>PENGADILAN MILITER TINGGI V MAKASSAR</h1>
      <p>Jl. Urip Sumoharjo KM. 7 No. 73, Panakkukang, Kota Makassar, Sulawesi Selatan 90232</p>
      <p>Pelayanan Terpadu Satu Pintu (PTSP) Elektronik | Standar Buku II Mahkamah Agung RI Edisi Terbaru</p>
    </div>

    <div style="text-align:center;">
      <div class="badge">AKTA / BUKTI TANDA TERIMA PENERIMAAN BERKAS PERMOHONAN PTSP</div>
      <h3 style="margin: 2px 0 12px 0; font-family: monospace; font-size: 18px; color: #065f46;">NOMOR REGISTER TIKET: ${app.ticket_no}</h3>
    </div>

    <table>
      <tr><td class="label">1. Meja PTSP Penerima</td><td>: <strong>${app.meja_nama}</strong></td></tr>
      <tr><td class="label">2. Buku Register Induk (Buku II MA)</td><td>: ${meta.bukuRegister}</td></tr>
      <tr><td class="label">3. Jenis Layanan / Permohonan</td><td>: <strong>${app.jenis_layanan}</strong></td></tr>
      <tr><td class="label">4. Identitas Pemohon</td><td>: <strong>${app.nama_pemohon}</strong> (${app.kategori_pemohon})</td></tr>
      <tr><td class="label">5. Pangkat / NRP / NIP / NIK</td><td>: ${app.pangkat_golongan || '-'} / ${app.nrp_nip_nik}</td></tr>
      <tr><td class="label">6. Kesatuan / Instansi Asal</td><td>: ${app.kesatuan_instansi}</td></tr>
      <tr><td class="label">7. Domisili Elektronik (WA / Email)</td><td>: ${app.no_wa} / ${app.email}</td></tr>
      <tr><td class="label">8. Nomor Perkara Terkait (Bundel A/B)</td><td>: ${app.nomor_perkara}</td></tr>
      <tr><td class="label">9. Pokok Uraian Permohonan</td><td>: ${app.uraian_permohonan}</td></tr>
      <tr><td class="label">10. Instrumen Kelengkapan Berkas</td><td>: ${app.berkas_nama || 'Dokumen Elektronik Terlampir'} (${meta.strukturBerkas})</td></tr>
      <tr><td class="label">11. Waktu Penerimaan & Status</td><td>: ${app.created_at} — Status: <strong>${app.status} (Tahap ${app.tahap_verifikasi}/4)</strong></td></tr>
      <tr><td class="label">12. Standar Biaya Layanan</td><td>: <strong>Rp 0,- (GRATIS / BEBAN NEGARA SESUAI PASAL 248 UU 31/1997 & SK KMA 2-144/2022)</strong></td></tr>
    </table>

    <div class="sop-box">
      <strong>Dasar Pedoman Buku II Mahkamah Agung RI & Maklumat Pelayanan:</strong><br/>
      ${meta.dasarBukuII}. Dokumen bukti penerimaan ini tersimpan otomatis di dalam <em>Offline Cache Service Worker</em> sehingga tetap dapat dibuka oleh Pemohon meskipun tanpa koneksi internet.
    </div>

    <div class="footer">
      <div style="max-width: 64%;">
        <strong>Petugas Meja Penerima PTSP:</strong>
        <p style="margin:4px 0;">Telah diperiksa kelengkapan awal administrasi sesuai Daftar Periksa (Checklist) SOP PTSP Buku II Mahkamah Agung RI.</p>
        <p style="margin:4px 0; font-weight:bold; color:#065f46;">Petugas Verifikator: ${app.petugas_verifikator || 'Petugas Jaga PTSP Dilmilti V Makassar'}</p>
      </div>
      <div style="text-align: center;">
        <img src="${qrImgUrl}" alt="QR Tiket" width="98" height="98" style="border:1px solid #cbd5e1; padding:4px;" />
        <div style="font-size:9.5px; font-family:monospace; margin-top:3px;">${app.ticket_no}</div>
      </div>
    </div>

    <div class="no-print" style="text-align:center; margin-top:14px;">
      <button onclick="window.print()" style="padding:8px 18px; background:#065f46; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Cetak / Simpan PDF (Standar Buku II MA)</button>
    </div>
  </div>
  <script>setTimeout(() => window.print(), 400);</script>
</body>
</html>`;
}

export function printApplicationReceipt(app: PTSPApplicationItem, skipPrintPopup = false) {
  const meta = getBukuIIRegisterMetadata(app.meja_id, app.jenis_layanan);
  const html = buildApplicationReceiptHtml(app);

  cacheOfficialDocumentForOffline({
    docId: `RECEIPT-${app.ticket_no}`,
    title: `Bukti Tanda Terima PTSP — ${app.jenis_layanan}`,
    nomorDokumen: app.ticket_no,
    kodeFormulirBukuII: meta.kodeFormulir,
    kategori: 'TANDA TERIMA REGISTRASI',
    ticketOrRef: app.ticket_no,
    pemohonNama: app.nama_pemohon,
    mejaNama: app.meja_nama,
    htmlContent: html
  });

  if (!skipPrintPopup) {
    openPrintPopup(html, `Tanda_Terima_BukuII_${app.ticket_no}`);
  }
  return html;
}

export function buildOfficialReplyDocumentHtml(
  app: PTSPApplicationItem,
  reply?: PTSPReplyDocumentItem
): string {
  const meta = getBukuIIRegisterMetadata(app.meja_id, app.jenis_layanan);
  const nomorSurat =
    reply?.nomor_surat_balasan || `W5-Mil/${Math.floor(100 + Math.random() * 800)}/HK.02.01/IX/2026`;
  const judul = reply?.judul_dokumen || `Produk Hasil Layanan ${app.jenis_layanan}`;
  const isi =
    reply?.isi_ringkas ||
    `Berdasarkan pemeriksaan Buku Register Induk Perkara sesuai Pedoman Buku II Mahkamah Agung RI dan Sistem Informasi Penelusuran Perkara (SIPP) pada ${app.meja_nama} atas permohonan Nomor Tiket ${app.ticket_no} atas nama ${app.nama_pemohon} (${app.kesatuan_instansi}), bersama ini Pengadilan Militer Tinggi V Makassar menerbitkan dokumen balasan resmi yang telah diverifikasi sah.`;
  const signerNama = reply?.tte_signer_nama || 'Letkol Chk S. Haryanto, S.H., M.H.';
  const signerJabatan = reply?.tte_signer_jabatan || 'Panitera Pengadilan Militer Tinggi V Makassar';
  const signerPangkat = reply?.tte_signer_pangkat_nrp || 'Letkol Chk NRP 11020023410882';
  const qrHash = reply?.tte_qr_hash || `BSRE-DILMILTI5-${app.ticket_no}`;
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    `VALID-TTE:${qrHash}|TIKET:${app.ticket_no}|PENANDATANGAN:${signerNama}`
  )}`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Dokumen Balasan Resmi TTE (Buku II MA-RI) - ${app.ticket_no}</title>
  <style>
    body { font-family: 'Times New Roman', Times, serif; color: #0f172a; margin: 24px; line-height: 1.5; }
    .sheet { max-width: 790px; margin: 0 auto; border: 2px solid #064e3b; padding: 28px 34px; position: relative; background: #fff; }
    .form-code { position: absolute; top: 14px; right: 22px; border: 1.5px solid #064e3b; padding: 3px 9px; font-family: Arial, sans-serif; font-size: 9.5px; font-weight: bold; background: #f0fdf4; color: #064e3b; }
    .kop { text-align: center; border-bottom: 3px double #0f172a; padding-bottom: 12px; margin-bottom: 18px; padding-top: 10px; }
    .kop h2 { margin: 0; font-size: 14px; text-transform: uppercase; }
    .kop h1 { margin: 4px 0; font-size: 18px; text-transform: uppercase; color: #064e3b; }
    .kop p { margin: 2px 0; font-size: 11px; font-family: Arial, sans-serif; }
    .title-box { text-align: center; margin: 14px 0 18px 0; }
    .title-box h3 { margin: 0; text-decoration: underline; font-size: 15px; text-transform: uppercase; }
    .title-box p { margin: 4px 0; font-size: 12.5px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 12.5px; }
    td { padding: 4px 6px; vertical-align: top; }
    .konsiderans { font-size: 12.5px; margin: 10px 0; text-align: justify; }
    .tte-box { margin-top: 22px; display: flex; justify-content: flex-end; }
    .tte-card { width: 350px; border: 1.5px solid #065f46; border-radius: 8px; padding: 12px; font-family: Arial, sans-serif; font-size: 11px; background: #f0fdf4; display: flex; gap: 10px; align-items: center; }
    .bsre-footer { margin-top: 22px; padding-top: 10px; border-top: 1px solid #cbd5e1; font-family: Arial, sans-serif; font-size: 10px; color: #475569; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="form-code">${meta.kodeFormulir}</div>
    <div class="kop">
      <h2>MAHKAMAH AGUNG REPUBLIK INDONESIA</h2>
      <h2>DIREKTORAT JENDERAL BADAN PERADILAN MILITER DAN PERADILAN TATA USAHA NEGARA</h2>
      <h1>PENGADILAN MILITER TINGGI V MAKASSAR</h1>
      <p>Jl. Urip Sumoharjo KM. 7 No. 73, Panakkukang, Kota Makassar, Sulawesi Selatan 90232</p>
      <p>Website: www.dilmilti5-makassar.go.id | Email: dilmilti5.makassar@mahkamahagung.go.id</p>
    </div>

    <div class="title-box">
      <h3>SURAT KETERANGAN / SALINAN PRODUK HUKUM PTSP ELEKTRONIK</h3>
      <p>Nomor Naskah Dinas: ${nomorSurat}</p>
      <div style="font-size:11px; font-family:Arial,sans-serif; color:#065f46; margin-top:2px;">
        Buku Register Induk: ${meta.bukuRegister}
      </div>
    </div>

    <div class="konsiderans">
      <strong>MEMBACA:</strong> Surat Permohonan Layanan yang terdaftar pada Portal Pelayanan Terpadu Satu Pintu (PTSP) Elektronik Pengadilan Militer Tinggi V Makassar Nomor Register Tiket <strong>${app.ticket_no}</strong> tanggal ${app.created_at};<br/>
      <strong>MENGINGAT:</strong> 1. Undang-Undang RI Nomor 31 Tahun 1997 tentang Peradilan Militer;<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. ${meta.dasarBukuII};<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. Keputusan Ketua Mahkamah Agung RI Nomor 2-144/KMA/SK/VIII/2022 tentang Standar Pelayanan Informasi Publik di Pengadilan.
    </div>

    <table>
      <tr><td style="width:33%; font-weight:bold;">Nomor Tiket & Meja PTSP</td><td>: <strong>${app.ticket_no}</strong> (${app.meja_nama})</td></tr>
      <tr><td style="font-weight:bold;">Jenis Layanan Buku II MA</td><td>: ${app.jenis_layanan}</td></tr>
      <tr><td style="font-weight:bold;">Nama Lengkap Pemohon</td><td>: <strong>${app.nama_pemohon}</strong> (${app.kategori_pemohon})</td></tr>
      <tr><td style="font-weight:bold;">Pangkat / NRP / NIP / NIK</td><td>: ${app.pangkat_golongan || '-'} / ${app.nrp_nip_nik}</td></tr>
      <tr><td style="font-weight:bold;">Kesatuan / Instansi</td><td>: ${app.kesatuan_instansi}</td></tr>
      <tr><td style="font-weight:bold;">Nomor Perkara Terkait</td><td>: ${app.nomor_perkara}</td></tr>
      <tr><td style="font-weight:bold;">Perihal Produk Dokumen</td><td>: <strong>${judul}</strong></td></tr>
    </table>

    <div style="background:#f8fafc; border-left:4px solid #065f46; padding:12px 16px; font-size:12.5px; margin: 14px 0; text-align:justify;">
      <strong>URAIAN HASIL VERIFIKASI REGISTER INDUK BUKU II MA & KETETAPAN RESMI:</strong><br/>
      ${isi}
    </div>

    ${
      app.catatan_petugas
        ? `<p style="font-size:12px;"><strong>Catatan Pemeriksaan Kepaniteraan/Petugas PTSP:</strong> ${app.catatan_petugas}</p>`
        : ''
    }

    <div class="tte-box">
      <div class="tte-card">
        <img src="${qrImgUrl}" alt="QR TTE" width="86" height="86" style="border:1px solid #065f46; background:#fff; padding:3px;" />
        <div>
          <div style="font-weight:bold; color:#065f46; font-size:9.5px; text-transform:uppercase;">Ditandatangani Secara Elektronik (TTE BSrE-BSSN)</div>
          <div style="font-weight:bold; color:#0f172a; margin-top:2px;">${signerJabatan}</div>
          <div style="margin-top:8px; font-weight:bold; text-decoration:underline;">${signerNama}</div>
          <div style="font-size:10px; color:#334155;">${signerPangkat}</div>
          <div style="font-size:9px; font-family:monospace; color:#047857; margin-top:3px;">Hash Validasi: ${qrHash}</div>
        </div>
      </div>
    </div>

    <div class="bsre-footer">
      • Sesuai Pedoman Buku II Mahkamah Agung RI &amp; SK KMA 359/KMA/SK/XII/2022, salinan dokumen elektronik yang ditandatangani dengan Tanda Tangan Elektronik (TTE) BSrE-BSSN memiliki kekuatan hukum yang sama dengan salinan resmi bermeterai.<br/>
      • Dokumen ini telah di-cache secara otomatis oleh Service Worker Portal PTSP sehingga dapat dibuka kembali secara offline kapan saja.
    </div>

    <div class="no-print" style="text-align:center; margin-top:16px;">
      <button onclick="window.print()" style="padding:8px 18px; background:#065f46; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Cetak / Simpan Dokumen PDF Resmi</button>
    </div>
  </div>
  <script>setTimeout(() => window.print(), 400);</script>
</body>
</html>`;
}

export function printOfficialReplyDocument(
  app: PTSPApplicationItem,
  reply?: PTSPReplyDocumentItem,
  skipPrintPopup = false
) {
  const meta = getBukuIIRegisterMetadata(app.meja_id, app.jenis_layanan);
  const nomorSurat =
    reply?.nomor_surat_balasan || `W5-Mil/${Math.floor(100 + Math.random() * 800)}/HK.02.01/IX/2026`;
  const judul = reply?.judul_dokumen || `Produk Hasil Layanan ${app.jenis_layanan}`;
  const html = buildOfficialReplyDocumentHtml(app, reply);

  cacheOfficialDocumentForOffline({
    docId: `REPLY-TTE-${app.ticket_no}`,
    title: judul,
    nomorDokumen: nomorSurat,
    kodeFormulirBukuII: meta.kodeFormulir,
    kategori: 'DOKUMEN BALASAN RESMI TTE',
    ticketOrRef: app.ticket_no,
    pemohonNama: app.nama_pemohon,
    mejaNama: app.meja_nama,
    htmlContent: html
  });

  if (!skipPrintPopup) {
    openPrintPopup(html, `Dokumen_Balasan_TTE_BukuII_${app.ticket_no}`);
  }
  return html;
}

export function printQueueTicketSlip(ticket: PTSPQueueTicketItem) {
  const meta = getBukuIIRegisterMetadata(ticket.meja_id, ticket.keperluan);
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
    `ANTREAN-PTSP:${ticket.nomor_antrean}|${ticket.meja_nama}|${ticket.nama_pemohon}`
  )}`;

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Struk Antrean PTSP - ${ticket.nomor_antrean}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #0f172a; margin: 16px; }
    .slip { width: 330px; margin: 0 auto; border: 2px dashed #064e3b; padding: 18px; text-align: center; background: #fff; }
    .num { font-size: 46px; font-weight: 900; color: #064e3b; margin: 10px 0; font-family: monospace; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="slip">
    <div style="font-size:9px; font-family:monospace; color:#065f46; font-weight:bold;">${meta.kodeFormulir}</div>
    <div style="font-size:11px; font-weight:bold; text-transform:uppercase; margin-top:2px;">PENGADILAN MILITER TINGGI V MAKASSAR</div>
    <div style="font-size:10px; color:#475569; margin-bottom:8px;">PORTAL ANTREAN DIGITAL PTSP 6 MEJA (BUKU II MA-RI)</div>
    <hr style="border:none; border-top:1px solid #cbd5e1;" />
    <div style="font-size:11px; font-weight:bold; margin-top:8px;">${ticket.meja_nama}</div>
    <div class="num">${ticket.nomor_antrean}</div>
    <div style="font-size:11px; font-weight:bold; color:#b45309;">${ticket.loket_tujuan}</div>
    <hr style="border:none; border-top:1px solid #cbd5e1; margin:10px 0;" />
    <div style="font-size:11px; text-align:left; line-height:1.5;">
      <strong>Pemohon:</strong> ${ticket.nama_pemohon}<br/>
      <strong>Kesatuan:</strong> ${ticket.kesatuan_instansi}<br/>
      <strong>Keperluan:</strong> ${ticket.keperluan}<br/>
      <strong>Waktu Ambil:</strong> ${ticket.waktu_ambil} (Est: ${ticket.estimasi_panggil})
    </div>
    <div style="margin-top:12px;">
      <img src="${qrImgUrl}" width="96" height="96" alt="QR Antrean" />
    </div>
    <div style="font-size:9px; color:#64748b; margin-top:8px;">Silakan menunggu panggilan suara otomatis pada layar monitor ruang tunggu PTSP. Layanan Rp 0,- (Bebas Pungli).</div>
    <div class="no-print" style="margin-top:12px;">
      <button onclick="window.print()" style="padding:6px 14px; background:#065f46; color:#fff; border:none; border-radius:4px; cursor:pointer;">Cetak Struk</button>
    </div>
  </div>
  <script>setTimeout(() => window.print(), 350);</script>
</body>
</html>`;

  cacheOfficialDocumentForOffline({
    docId: `QUEUE-${ticket.nomor_antrean}`,
    title: `Struk Antrean Loket ${ticket.nomor_antrean} (${ticket.meja_nama})`,
    nomorDokumen: ticket.nomor_antrean,
    kodeFormulirBukuII: meta.kodeFormulir,
    kategori: 'STRUK ANTREAN PTSP',
    ticketOrRef: ticket.nomor_antrean,
    pemohonNama: ticket.nama_pemohon,
    mejaNama: ticket.meja_nama,
    htmlContent: html
  });

  openPrintPopup(html, `Antrean_${ticket.nomor_antrean}`);
}

export function buildConsultationMinutesHtml(cons: PTSPOnlineConsultationItem): string {
  const qrHash = cons.notulensi_qr_hash || `BA-KONSUL-${cons.room_code}-BSRE`;
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    `VALID-TTE:${qrHash}|TIKET:${cons.room_code}|PETUGAS:${cons.nama_petugas}`
  )}`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Berita Acara Konsultasi Elektronik (Buku II MA-RI) - ${cons.room_code}</title>
  <style>
    body { font-family: 'Times New Roman', Times, serif; color: #0f172a; margin: 24px; line-height: 1.5; }
    .sheet { max-width: 780px; margin: 0 auto; border: 2px solid #064e3b; padding: 28px; position: relative; background: #fff; }
    .form-code { position: absolute; top: 14px; right: 20px; border: 1.5px solid #064e3b; padding: 3px 8px; font-family: Arial, sans-serif; font-size: 9.5px; font-weight: bold; background: #f0fdf4; color: #064e3b; }
    .kop { text-align: center; border-bottom: 3px double #0f172a; padding-bottom: 10px; margin-bottom: 18px; padding-top: 10px; }
    .kop h2 { margin: 0; font-size: 14px; }
    .kop h1 { margin: 4px 0; font-size: 18px; color: #064e3b; }
    .kop p { margin: 2px 0; font-size: 11px; font-family: Arial, sans-serif; }
    table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin: 12px 0; }
    td { padding: 5px 6px; vertical-align: top; border-bottom: 1px solid #e2e8f0; }
    .box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; font-size: 12.5px; margin-top: 6px; white-space: pre-line; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="form-code">MODEL BA-KONSUL.05 / BUKU II MA-RI</div>
    <div class="kop">
      <h2>MAHKAMAH AGUNG REPUBLIK INDONESIA</h2>
      <h2>DIREKTORAT JENDERAL BADAN PERADILAN MILITER DAN PERADILAN TATA USAHA NEGARA</h2>
      <h1>PENGADILAN MILITER TINGGI V MAKASSAR</h1>
      <p>Jl. Urip Sumoharjo KM. 7 No. 73, Kota Makassar | Portal Konsultasi Tatap Muka Online PTSP</p>
    </div>

    <div style="text-align:center; margin-bottom:16px;">
      <h3 style="margin:0; text-decoration:underline; text-transform:uppercase;">BERITA ACARA / NOTULENSI KONSULTASI HUKUM & LAYANAN PTSP</h3>
      <div style="font-size:12.5px; font-weight:bold; margin-top:4px;">Nomor Register Ruang Virtual: ${cons.room_code} (Sesuai Pedoman Buku II MA-RI & PERMA No. 1 Tahun 2014)</div>
    </div>

    <table>
      <tr><td style="width:32%; font-weight:bold;">Meja Layanan PTSP</td><td>: ${cons.meja_nama}</td></tr>
      <tr><td style="font-weight:bold;">Waktu Pelaksanaan</td><td>: ${cons.jadwal_tanggal} Pukul ${cons.jadwal_jam}</td></tr>
      <tr><td style="font-weight:bold;">Nama Pemohon</td><td>: <strong>${cons.nama_pemohon}</strong> (${cons.kategori_pemohon})</td></tr>
      <tr><td style="font-weight:bold;">NRP / NIP / NIK</td><td>: ${cons.nrp_nip_nik}</td></tr>
      <tr><td style="font-weight:bold;">Kesatuan / Instansi</td><td>: ${cons.kesatuan_instansi}</td></tr>
      <tr><td style="font-weight:bold;">Petugas PTSP Melayani</td><td>: <strong>${cons.nama_petugas}</strong> (${cons.jabatan_petugas})</td></tr>
      <tr><td style="font-weight:bold;">Topik Konsultasi</td><td>: ${cons.topik_konsultasi}</td></tr>
    </table>

    <div style="margin-top:14px;">
      <strong style="font-size:12.5px;">A. Ringkasan Pokok Permasalahan / Materi Konsultasi Pemohon:</strong>
      <div class="box">${cons.notulensi_ringkasan || 'Telah dilaksanakan konsultasi tatap muka daring melalui ruang virtual PTSP dengan lancar.'}</div>
    </div>

    <div style="margin-top:14px;">
      <strong style="font-size:12.5px;">B. Advis Prosedur Hukum / Tindak Lanjut Sesuai Buku II Mahkamah Agung RI:</strong>
      <div class="box">${cons.notulensi_rekomendasi || 'Pemohon telah diberikan penjelasan prosedur sesuai standar pelayanan peradilan militer Buku II Mahkamah Agung RI.'}</div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:22px; padding-top:14px; border-top:1px dashed #94a3b8; font-family:Arial, sans-serif; font-size:11px;">
      <div style="max-width:60%;">
        <strong>Pengesahan Digital (TTE BSrE-BSSN):</strong><br/>
        Berita Acara Konsultasi Elektronik ini ditandatangani secara digital oleh Petugas PTSP Pengadilan Militer Tinggi V Makassar pada ${cons.notulensi_signed_at || cons.jadwal_tanggal} dan tersimpan di dalam Offline Cache perangkat.
      </div>
      <div style="text-align:center;">
        <img src="${qrImgUrl}" width="92" height="92" alt="QR Berita Acara" style="border:1px solid #064e3b; padding:3px;" />
        <div style="font-weight:bold; margin-top:4px;">${cons.nama_petugas}</div>
        <div style="font-size:9px; font-family:monospace; color:#047857;">${qrHash}</div>
      </div>
    </div>

    <div class="no-print" style="text-align:center; margin-top:16px;">
      <button onclick="window.print()" style="padding:8px 18px; background:#065f46; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Cetak Berita Acara (PDF)</button>
    </div>
  </div>
  <script>setTimeout(() => window.print(), 400);</script>
</body>
</html>`;
}

export function printConsultationMinutes(cons: PTSPOnlineConsultationItem, skipPrintPopup = false) {
  const html = buildConsultationMinutesHtml(cons);

  cacheOfficialDocumentForOffline({
    docId: `BA-KONSUL-${cons.room_code}`,
    title: `Berita Acara Konsultasi PTSP — ${cons.topik_konsultasi}`,
    nomorDokumen: `BA/${cons.room_code}/PTSP/IX/2026`,
    kodeFormulirBukuII: 'MODEL BA-KONSUL.05 / BUKU II MA-RI',
    kategori: 'BERITA ACARA KONSULTASI',
    ticketOrRef: cons.room_code,
    pemohonNama: cons.nama_pemohon,
    mejaNama: cons.meja_nama,
    htmlContent: html
  });

  if (!skipPrintPopup) {
    openPrintPopup(html, `Berita_Acara_BukuII_${cons.room_code}`);
  }
  return html;
}

export function printTteValidationCertificate(cert: TteValidationResultData) {
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    `VALID-TTE:${cert.qrHash}|TIKET:${cert.ticketNo}|SURAT:${cert.nomorSurat}`
  )}`;

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Sertifikat Validasi TTE (Buku II MA-RI) - ${cert.qrHash}</title>
  <style>
    body { font-family: 'Times New Roman', Times, serif; color: #0f172a; margin: 24px; line-height: 1.5; }
    .sheet { max-width: 780px; margin: 0 auto; border: 3px double #065f46; padding: 28px; background: #ffffff; position: relative; }
    .form-code { position: absolute; top: 14px; right: 20px; border: 1.5px solid #064e3b; padding: 3px 8px; font-family: Arial, sans-serif; font-size: 9.5px; font-weight: bold; background: #f0fdf4; color: #064e3b; }
    .kop { text-align: center; border-bottom: 2px solid #065f46; padding-bottom: 12px; margin-bottom: 18px; padding-top: 10px; }
    .kop h2 { margin: 0; font-size: 14px; text-transform: uppercase; }
    .kop h1 { margin: 4px 0; font-size: 18px; color: #064e3b; text-transform: uppercase; }
    .kop p { margin: 2px 0; font-size: 11px; font-family: Arial, sans-serif; }
    .valid-banner { background: #ecfdf5; border: 2px solid #10b981; color: #065f46; padding: 12px; border-radius: 8px; text-align: center; font-family: Arial, sans-serif; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px; margin: 12px 0; }
    td { padding: 7px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    td.label { width: 34%; font-weight: bold; color: #334155; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="form-code">MODEL SERT-TTE.07 / BUKU II MA-RI</div>
    <div class="kop">
      <h2>MAHKAMAH AGUNG REPUBLIK INDONESIA</h2>
      <h2>DIREKTORAT JENDERAL BADAN PERADILAN MILITER DAN PERADILAN TATA USAHA NEGARA</h2>
      <h1>PENGADILAN MILITER TINGGI V MAKASSAR</h1>
      <p>Sistem Verifikasi & Validasi Tanda Tangan Elektronik (TTE BSrE - BSSN RI) • Standar Buku II MA-RI</p>
    </div>

    <div class="valid-banner">
      <div style="font-size:15px; font-weight:900; letter-spacing:0.5px;">✓ DOKUMEN ELEKTRONIK ASLI & TERVERIFIKASI SAH (VALID)</div>
      <div style="font-size:11px; margin-top:3px; font-family:monospace;">ID Hash Kriptografi: <strong>${cert.qrHash}</strong> | Integritas: SHA-256 Terverifikasi Utuh</div>
    </div>

    <table>
      <tr><td class="label">Kategori Dokumen Buku II MA</td><td>: <strong>${cert.jenisDokumen}</strong></td></tr>
      <tr><td class="label">Nomor Surat / Naskah Dinas</td><td>: <strong>${cert.nomorSurat}</strong></td></tr>
      <tr><td class="label">Nomor Tiket Registrasi</td><td>: ${cert.ticketNo}</td></tr>
      <tr><td class="label">Judul / Perihal Dokumen</td><td>: ${cert.judulDokumen}</td></tr>
      <tr><td class="label">Meja Layanan Penerbit</td><td>: ${cert.mejaNama}</td></tr>
      <tr><td class="label">Diterbitkan Untuk Pemohon</td><td>: <strong>${cert.namaPemohon}</strong> (${cert.kesatuanInstansi})</td></tr>
      <tr><td class="label">Pejabat Penandatangan TTE</td><td>: <strong>${cert.signerNama}</strong></td></tr>
      <tr><td class="label">Pangkat / NRP / NIP</td><td>: ${cert.signerPangkatNrp}</td></tr>
      <tr><td class="label">Jabatan Penandatangan</td><td>: ${cert.signerJabatan}</td></tr>
      <tr><td class="label">Otoritas Sertifikat Digital</td><td>: Balai Sertifikasi Elektronik (BSrE) - Badan Siber dan Sandi Negara (BSSN)</td></tr>
      <tr><td class="label">Waktu Penandatanganan</td><td>: ${cert.signedAt}</td></tr>
    </table>

    <div style="background:#f8fafc; border-left:4px solid #065f46; padding:10px 14px; font-family:Arial, sans-serif; font-size:12px; margin-top:12px;">
      <strong>Ringkasan Isi Dokumen Terverifikasi:</strong><br/>
      ${cert.isiRingkas}
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:12px; border-top:1px dashed #94a3b8; font-family:Arial, sans-serif; font-size:10px; color:#475569;">
      <div style="max-width:65%;">
        Sertifikat Validasi TTE ini diterbitkan otomatis oleh Portal PTSP Elektronik Pengadilan Militer Tinggi V Makassar sesuai Pedoman Buku II Mahkamah Agung RI dan Pasal 5 Ayat (1) UU ITE.
      </div>
      <div style="text-align:center;">
        <img src="${qrImgUrl}" width="90" height="90" alt="QR Validasi" style="border:1px solid #065f46; padding:3px;" />
      </div>
    </div>

    <div class="no-print" style="text-align:center; margin-top:16px;">
      <button onclick="window.print()" style="padding:8px 18px; background:#065f46; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Cetak Sertifikat Validasi TTE</button>
    </div>
  </div>
  <script>setTimeout(() => window.print(), 400);</script>
</body>
</html>`;

  cacheOfficialDocumentForOffline({
    docId: `CERT-TTE-${cert.ticketNo}`,
    title: `Sertifikat Validasi TTE — ${cert.nomorSurat}`,
    nomorDokumen: cert.qrHash,
    kodeFormulirBukuII: 'MODEL SERT-TTE.07 / BUKU II MA-RI',
    kategori: 'SERTIFIKAT VALIDASI TTE',
    ticketOrRef: cert.ticketNo,
    pemohonNama: cert.namaPemohon,
    mejaNama: cert.mejaNama,
    htmlContent: html
  });

  openPrintPopup(html, `Sertifikat_Validasi_TTE_${cert.ticketNo}`);
}

// ============================================================================
// CETAK / SIMPAN DOKUMEN SOP 6 MEJA PTSP SESUAI BUKU II MAHKAMAH AGUNG RI TERBARU
// ============================================================================
export function buildBukuIISopPtspHtml(mejaId?: number): string {
  const targetMejas = mejaId
    ? KATALOG_6_MEJA_PTSP.filter((m) => m.mejaId === mejaId)
    : KATALOG_6_MEJA_PTSP;

  const mejaRowsHtml = targetMejas
    .map((m) => {
      const meta = getBukuIIRegisterMetadata(m.mejaId, m.subNama);
      const layananItems = m.layananList
        .map(
          (l, idx) => `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td><strong>${l.nama}</strong><br/><span style="font-size:10px;color:#065f46;">Kode: ${meta.kodeFormulir}</span></td>
          <td><ul style="margin:0;padding-left:15px;">${l.syarat.map((s) => `<li>${s}</li>`).join('')}</ul></td>
          <td>${meta.bukuRegister}</td>
          <td style="text-align:center;"><strong>${l.sla}</strong><br/>${l.biaya}</td>
          <td>${l.outputDokumen}</td>
        </tr>`
        )
        .join('');

      return `
      <div style="margin-top:18px; page-break-inside:avoid;">
        <div style="background:#064e3b; color:#fff; padding:7px 12px; font-family:Arial,sans-serif; font-size:12px; font-weight:bold; border-radius:4px 4px 0 0;">
          LOKET ${m.kodeAntrean} — ${m.namaMeja.toUpperCase()} (${m.penanggungJawab})
        </div>
        <div style="background:#f0fdf4; border:1px solid #86efac; border-top:none; padding:6px 12px; font-family:Arial,sans-serif; font-size:10.5px;">
          <strong>Dasar Buku II MA-RI:</strong> ${meta.dasarBukuII}<br/>
          <strong>Instrumen Pemeriksaan:</strong> ${meta.strukturBerkas}
        </div>
        <table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:11px; margin-top:0;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="border:1px solid #cbd5e1; padding:5px; width:4%;">No</th>
              <th style="border:1px solid #cbd5e1; padding:5px; width:22%;">Jenis Layanan PTSP</th>
              <th style="border:1px solid #cbd5e1; padding:5px; width:26%;">Syarat Kelengkapan (Bundel A/B)</th>
              <th style="border:1px solid #cbd5e1; padding:5px; width:20%;">Buku Register Induk (Buku II MA)</th>
              <th style="border:1px solid #cbd5e1; padding:5px; width:12%;">SLA & Biaya</th>
              <th style="border:1px solid #cbd5e1; padding:5px; width:16%;">Produk / Akta Keluaran</th>
            </tr>
          </thead>
          <tbody>
            ${layananItems}
          </tbody>
        </table>
      </div>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>SOP PTSP Sesuai Buku II Mahkamah Agung RI Edisi Terbaru</title>
  <style>
    body { font-family: 'Times New Roman', Times, serif; color: #0f172a; margin: 22px; line-height: 1.45; }
    .sheet { max-width: 960px; margin: 0 auto; border: 2px solid #064e3b; padding: 26px 30px; background: #fff; position: relative; }
    .form-code { position: absolute; top: 14px; right: 20px; border: 1.5px solid #064e3b; padding: 3px 8px; font-family: Arial, sans-serif; font-size: 9.5px; font-weight: bold; background: #fef3c7; color: #78350f; }
    .kop { text-align: center; border-bottom: 3px double #0f172a; padding-bottom: 10px; margin-bottom: 16px; padding-top: 8px; }
    .kop h2 { margin: 0; font-size: 14px; text-transform: uppercase; }
    .kop h1 { margin: 4px 0; font-size: 18px; color: #064e3b; text-transform: uppercase; }
    .kop p { margin: 2px 0; font-size: 11px; font-family: Arial, sans-serif; }
    td { border: 1px solid #cbd5e1; padding: 6px; vertical-align: top; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="form-code">PEDOMAN SOP-PTSP / BUKU II MA-RI TERBARU</div>
    <div class="kop">
      <h2>MAHKAMAH AGUNG REPUBLIK INDONESIA</h2>
      <h2>DIREKTORAT JENDERAL BADAN PERADILAN MILITER DAN PERADILAN TATA USAHA NEGARA</h2>
      <h1>PENGADILAN MILITER TINGGI V MAKASSAR</h1>
      <p>STANDAR OPERASIONAL PROSEDUR (SOP) PELAYANAN TERPADU SATU PINTU (PTSP) 6 MEJA</p>
      <p>Sesuai Buku II Mahkamah Agung RI Edisi Revisi Terbaru, SK KMA No. 2-144/KMA/SK/VIII/2022 &amp; SK KMA No. 359/KMA/SK/XII/2022</p>
    </div>

    <div style="font-family:Arial,sans-serif; font-size:11.5px; background:#f8fafc; border:1px solid #cbd5e1; padding:12px; border-radius:6px; margin-bottom:14px;">
      <strong>ALUR BAKU PELAYANAN SATU PINTU SESUAI BUKU II MAHKAMAH AGUNG RI:</strong>
      <ol style="margin:6px 0 0 0; padding-left:18px; line-height:1.6;">
        <li><strong>Tahap 1 (Penerimaan Satu Pintu):</strong> Pemohon mengajukan permohonan di Loket Fisik PTSP / Portal PTSP Elektronik dan menerima Nomor Antrean / Nomor Tiket QR Code.</li>
        <li><strong>Tahap 2 (Pemeriksaan Kelengkapan Bundel A &amp; Bundel B):</strong> Petugas Meja PTSP memeriksa kelengkapan syarat formil dan materiil sesuai Daftar Periksa (Checklist) Buku II MA-RI.</li>
        <li><strong>Tahap 3 (Pencatatan Buku Register Induk &amp; SIPP):</strong> Pencatatan ke dalam Buku Register Induk Kepaniteraan/Kesekretariatan serta pemutakhiran status pada Sistem Informasi Penelusuran Perkara (SIPP).</li>
        <li><strong>Tahap 4 (Verifikasi Pejabat &amp; Pengesahan TTE BSrE-BSSN):</strong> Panitera Muda / Kasubbag memverifikasi draf produk hukum untuk ditandatangani secara elektronik (TTE) oleh Kepala Pengadilan / Panitera / Sekretaris.</li>
        <li><strong>Tahap 5 (Penyerahan Produk Layanan &amp; Arsip Offline):</strong> Pemohon mengunduh Dokumen Balasan Resmi Ber-TTE yang otomatis tersimpan di <em>Offline Cache Service Worker</em> perangkat pemohon.</li>
      </ol>
    </div>

    ${mejaRowsHtml}

    <div style="margin-top:20px; display:flex; justify-content:space-between; font-family:Arial,sans-serif; font-size:11px; padding-top:12px; border-top:1px dashed #94a3b8;">
      <div>
        <strong>Standar Biaya Pelayanan:</strong> Rp 0,- (Gratis / Beban Negara sesuai Pasal 248 UU No. 31 Tahun 1997)<br/>
        <strong>Status Ketersediaan Offline:</strong> Tersimpan di Service Worker Cache (Dapat Dibuka Tanpa Internet)
      </div>
      <div style="text-align:right;">
        Ditetapkan di: Makassar<br/>
        <strong>Kepala Pengadilan Militer Tinggi V Makassar</strong><br/>
        <em>Dto. TTE BSrE-BSSN</em><br/>
        <strong>Brigadir Jenderal TNI Faridah Hastuti, S.H., M.H.</strong>
      </div>
    </div>

    <div class="no-print" style="text-align:center; margin-top:16px;">
      <button onclick="window.print()" style="padding:8px 18px; background:#065f46; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Cetak / Simpan PDF SOP Buku II MA-RI</button>
    </div>
  </div>
  <script>setTimeout(() => window.print(), 400);</script>
</body>
</html>`;
}

export function printBukuIISopPtspDocument(mejaId?: number, skipPrintPopup = false) {
  const html = buildBukuIISopPtspHtml(mejaId);
  const docId = mejaId ? `SOP-BUKU2-MEJA-${mejaId}` : 'SOP-BUKU2-6-MEJA-LENGKAP';
  const title = mejaId
    ? `SOP PTSP Buku II MA-RI — Meja ${mejaId}`
    : 'Dokumen Induk SOP 6 Meja PTSP Sesuai Buku II Mahkamah Agung RI Edisi Terbaru';

  cacheOfficialDocumentForOffline({
    docId,
    title,
    nomorDokumen: `W5-Mil.01/SOP.BUKU-II/I/2026/${mejaId || 'ALL'}`,
    kodeFormulirBukuII: 'PEDOMAN SOP-PTSP / BUKU II MA-RI',
    kategori: 'SOP & PEDOMAN BUKU II MA-RI',
    ticketOrRef: docId,
    pemohonNama: 'Publik / Aparatur Peradilan Militer',
    mejaNama: mejaId ? `Meja ${mejaId} PTSP` : 'Seluruh 6 Meja PTSP',
    htmlContent: html
  });

  if (!skipPrintPopup) {
    openPrintPopup(html, `SOP_PTSP_Buku_II_MA_${mejaId || 'Lengkap'}`);
  }
  return html;
}

// Pre-cache all existing completed official documents & Buku II SOP into the Service Worker Cache on load
export function prefetchAllOfficialDocsForOffline(
  applications: PTSPApplicationItem[],
  replies: PTSPReplyDocumentItem[],
  consultations: PTSPOnlineConsultationItem[]
) {
  try {
    // 1. Cache SOP Buku II Mahkamah Agung RI Lengkap
    printBukuIISopPtspDocument(undefined, true);

    // 2. Cache Completed Reply Documents & Application Receipts
    applications.forEach((app) => {
      printApplicationReceipt(app, true);
      if (app.status === 'Selesai') {
        const rep = replies.find((r) => r.ticket_no === app.ticket_no);
        printOfficialReplyDocument(app, rep, true);
      }
    });

    // 3. Cache Signed Consultation Minutes
    consultations.forEach((cons) => {
      if (cons.notulensi_signed) {
        printConsultationMinutes(cons, true);
      }
    });
  } catch {}
}

export function openPrintPopup(htmlContent: string, filenameFallback: string) {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.src = url;
  document.body.appendChild(iframe);

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filenameFallback}.html`;
      a.click();
    }
  }, 600);
}
