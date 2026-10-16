import React, { useState, useEffect } from 'react';
import {
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Building2,
  UserCheck,
  Printer,
  ExternalLink,
  Sparkles,
  HelpCircle,
  FileCheck,
  Send,
  Ticket,
  Search,
  Scale,
  Award,
  Smartphone,
  ChevronRight,
  Info
} from 'lucide-react';
import { KATALOG_6_MEJA_PTSP } from '../../data/ptspDatabase';

interface StepDetail {
  stepNumber: number;
  title: string;
  subtitle: string;
  duration: string;
  biaya: string;
  actorPemohon: string;
  actorPetugas: string;
  syaratChecklist: string[];
  outputLangkah: string;
  tipsPenting: string;
  iconName: string;
}

interface MejaAlurData {
  mejaId: number;
  kodeAntrean: string;
  namaMeja: string;
  kategoriLayanan: string;
  contohLayananUtama: string;
  dasarHukum: string;
  steps: StepDetail[];
}

const ALUR_6_MEJA_DATA: MejaAlurData[] = [
  {
    mejaId: 1,
    kodeAntrean: 'A',
    namaMeja: 'Meja 1: Kepaniteraan Pidana Militer',
    kategoriLayanan: 'Banding, Kasasi, PK, Grasi, Salinan Putusan & Izin Besuk',
    contohLayananUtama: 'Permohonan Banding / Kasasi & Salinan Putusan BHT',
    dasarHukum: 'Pasal 248 UU No. 31/1997 & SEMA tentang Administrasi Perkara Pidana Militer',
    steps: [
      {
        stepNumber: 1,
        title: 'Pengambilan Antrean & Penyiapan Berkas',
        subtitle: 'Persiapan administrasi perkara dari satuan/pihak pemohon',
        duration: '5 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Pemohon mengambil nomor antrean Loket A (mesin antrean lobby atau via aplikasi PTSP Online) dan menyiapkan akta permohonan upaya hukum.',
        actorPetugas: 'Petugas PTSP memanggil nomor antrean Loket A dan menyambut pemohon dengan standar 5S (Senyum, Salam, Sapa, Sopan, Santun).',
        syaratChecklist: [
          'Akta Permohonan Banding dari Pengadilan Militer pengaju',
          'Dokumen Memori Banding / Kasasi / PK (asli & softcopy PDF)',
          'Surat Kuasa Khusus bermeterai atau Surat Perintah Penugasan Oditur Militer',
          'Identitas diri Pemohon (KTA TNI / KTP / Berita Acara Sumpah Advokat)'
        ],
        outputLangkah: 'Nomor Antrean Loket A & Nomor Urut Verifikasi',
        tipsPenting: 'Pastikan memori upaya hukum diajukan sebelum batas waktu 14 (empat belas) hari kalender sejak akta permohonan ditandatangani.',
        iconName: 'Ticket'
      },
      {
        stepNumber: 2,
        title: 'Pemeriksaan & Registrasi Berkas di Loket',
        subtitle: 'Penelitian syarat formal dan kelengkapan berkas perkara',
        duration: '10 - 15 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Menyerahkan dokumen fisik dan softcopy kepada petugas meja 1 untuk dilakukan verifikasi kelengkapan berkas (checklist).',
        actorPetugas: 'Memeriksa tenggang waktu, memeriksa kelengkapan bundel A dan bundel B perkara, menginput data pemohon ke Sistem Register Perkara & SIPP.',
        syaratChecklist: [
          'Pemeriksaan kesesuaian identitas Terdakwa / Oditur Militer',
          'Pengecekan kelengkapan salinan putusan pengadilan militer tingkat pertama',
          'Verifikasi format penulisan memori banding sesuai ketentuan peradilan militer'
        ],
        outputLangkah: 'Tanda Terima Berkas Perkara Resmi & Nomor Tiket PTSP',
        tipsPenting: 'Simpan struk nomor tiket untuk pelacakan status berkas secara online melalui menu Lacak Tiket.',
        iconName: 'FileCheck'
      },
      {
        stepNumber: 3,
        title: 'Verifikasi Teknis Panmud & Distribusi Majelis',
        subtitle: 'Pemeriksaan yuridis formal oleh Panitera Muda Pidana Militer',
        duration: '1 Hari Kerja',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Pemohon dapat memantau pergerakan berkas secara real-time melalui web SIPP atau notifikasi WhatsApp otomatis.',
        actorPetugas: 'Panmud Pidana meneliti berkas perkara, membuat resume register perkara banding/kasasi, dan meneruskan kepada Panitera/Kepala Pengadilan untuk penetapan Majelis Hakim.',
        syaratChecklist: [
          'Verifikasi materiil isi memori dan kontra memori banding',
          'Pengecekan status penahanan terdakwa (jika ditahan di Staltahmil)',
          'Pencatatan ke dalam buku register perkara induk Pengadilan Militer Tinggi'
        ],
        outputLangkah: 'Lembar Disposisi Panmud & Penetapan Majelis Hakim Banding',
        tipsPenting: 'Jika terdakwa berstatus ditahan, koordinasikan surat penetapan perpanjangan penahanan dengan petugas Meja 1.',
        iconName: 'Scale'
      },
      {
        stepNumber: 4,
        title: 'Pengesahan & Penerbitan Dokumen Resmi (TTE)',
        subtitle: 'Penerbitan akta penerimaan atau salinan putusan ber-TTE BSrE',
        duration: '15 - 30 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Menunggu konfirmasi penyelesaian berkas atau notifikasi unduh dokumen elektronik.',
        actorPetugas: 'Panitera menandatangani akta penerimaan upaya hukum, salinan putusan BHT, atau surat izin besuk menggunakan Tanda Tangan Elektronik (TTE) tersertifikasi BSSN.',
        syaratChecklist: [
          'Penerbitan Akta Pemberitahuan Memori Banding kepada Termohon',
          'Penyematan QR Code TTE resmi Mahkamah Agung & BSrE BSSN',
          'Pencetakan salinan resmi berkas perkara'
        ],
        outputLangkah: 'Dokumen Berita Acara / Salinan Putusan Resmi Ber-TTE QR Code',
        tipsPenting: 'Keaslian dokumen ber-TTE dapat diverifikasi langsung melalui scanner QR Code di aplikasi PTSP Online.',
        iconName: 'ShieldCheck'
      },
      {
        stepNumber: 5,
        title: 'Penyerahan Produk Layanan & Survei Kepuasan (IKM)',
        subtitle: 'Penyerahan tanda bukti hasil dan pengisian evaluasi layanan',
        duration: '5 Menit',
        biaya: 'Rp 0,- (100% Bebas Biaya)',
        actorPemohon: 'Menerima dokumen fisik di loket PTSP atau mengunduh PDF ber-TTE di ponsel, serta mengisi kuesioner Indeks Kepuasan Masyarakat (IKM/IPAK) selama 1 menit.',
        actorPetugas: 'Menyerahkan produk layanan, mencatat tanda terima akhir pada buku ekspedisi digital, dan mengucapkan terima kasih.',
        syaratChecklist: [
          'Menandatangani bukti serah terima produk kepaniteraan pidana',
          'Pengisian survei digital IKM/IPAK melalui tablet survei loket atau link web'
        ],
        outputLangkah: 'Produk Layanan Sah Selesai & Bukti Pengisian Survei IKM',
        tipsPenting: 'Seluruh pelayanan peradilan militer bebas pungutan liar, gratifikasi, dan biaya calo. Laporkan pelanggaran ke SIWAS MA-RI.',
        iconName: 'Award'
      }
    ]
  },
  {
    mejaId: 2,
    kodeAntrean: 'B',
    namaMeja: 'Meja 2: Kepaniteraan Hukum & Legalisasi',
    kategoriLayanan: 'SK Tidak Pernah Dipidana (SKTPD), Legalisasi Dokumen & Riset Ilmiah',
    contohLayananUtama: 'Penerbitan SKTPD Prajurit TNI & Legalisasi Putusan',
    dasarHukum: 'Jukmin TNI & SK KMA tentang Standar Pelayanan Kepaniteraan Hukum',
    steps: [
      {
        stepNumber: 1,
        title: 'Pengambilan Antrean Loket B & Penyerahan Surat Pengantar',
        subtitle: 'Pendaftaran permohonan SKTPD atau permohonan legalisasi',
        duration: '3 - 5 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Mengambil tiket antrean Loket B dan menyiapkan surat pengantar dari Komandan Satuan (Dansat) untuk prajurit TNI atau surat permohonan legalisasi.',
        actorPetugas: 'Memanggil pemohon dan memeriksa kelengkapan surat pengantar kesatuan.',
        syaratChecklist: [
          'Surat Pengantar dari Komandan Satuan (Dansat / Ankum)',
          'Fotokopi KTA TNI & KTP Pemohon',
          'Pas foto pakaian dinas (PDH) background merah ukuran 4x6 (2 lembar)',
          'Untuk legalisasi: Dokumen asli dan fotokopi yang akan dilegalisasi'
        ],
        outputLangkah: 'Nomor Tiket Antrean Loket B & Tanda Masuk Berkas',
        tipsPenting: 'Untuk prajurit yang hendak mengikuti Dikreg Seskoad/Seskoal/Seskoau/Diktukpa, pastikan nama dan NRP sesuai dengan KTA.',
        iconName: 'Ticket'
      },
      {
        stepNumber: 2,
        title: 'Verifikasi Database Perkara Pidana Militer (SIPP)',
        subtitle: 'Pengecekan riwayat perkara prajurit se-Indonesia Timur',
        duration: '10 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Menunggu proses penelusuran database perkara militer oleh petugas kepaniteraan hukum.',
        actorPetugas: 'Melakukan penelusuran data pada Direktori Putusan, Buku Register Induk Perkara Dilmilti V Makassar, dan SIPP gabungan Dilmil tingkat pertama.',
        syaratChecklist: [
          'Penelusuran nama dan NRP pemohon pada sistem perkara peradilan militer',
          'Pemeriksaan apakah pemohon sedang dalam proses penyidikan oditurat atau sidang',
          'Penyusunan Berita Acara Hasil Penelusuran Perkara'
        ],
        outputLangkah: 'Surat Keterangan Hasil Penelusuran Bebas Catatan Pidana',
        tipsPenting: 'Jika pernah ada perkara terdahulu yang telah divonis bebas/selesai, lampirkan petikan putusan yang berkekuatan hukum tetap.',
        iconName: 'Search'
      },
      {
        stepNumber: 3,
        title: 'Penyusunan Draf SKTPD / Peneraan Cap Waarmerking',
        subtitle: 'Pembuatan dokumen naskah dinas resmi kepaniteraan hukum',
        duration: '10 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Duduk di ruang tunggu ber-AC yang nyaman dengan fasilitas air mineral dan WiFi gratis.',
        actorPetugas: 'Mengetik draf SKTPD resmi bernomor register kepaniteraan hukum atau melakukan peneraan cap legalisasi/waarmerking pada dokumen.',
        syaratChecklist: [
          'Pencantuman nomor register surat dinas resmi Pengadilan Militer Tinggi V',
          'Penulisan peruntukan SKTPD (contoh: Syarat Seleksi Pendidikan / Kenaikan Pangkat)',
          'Verifikasi draf oleh Panitera Pengganti Meja 2'
        ],
        outputLangkah: 'Draf SKTPD Terverifikasi & Dokumen Terlegalisasi',
        tipsPenting: 'Periksa kebenaran ejaan nama, pangkat, korps, NRP, dan kesatuan sebelum dokumen disahkan.',
        iconName: 'FileText'
      },
      {
        stepNumber: 4,
        title: 'Penandatanganan Elektronik (TTE) oleh Panitera',
        subtitle: 'Pengesahan yuridis berkekuatan hukum resmi',
        duration: '5 - 10 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Menerima pemberitahuan bahwa dokumen telah selesai ditandatangani oleh Panitera.',
        actorPetugas: 'Panitera Dilmilti V Makassar menandatangani SKTPD menggunakan sertifikat elektronik BSSN (BSrE) atau tanda tangan basah bersegel dinas.',
        syaratChecklist: [
          'Pemberian stempel dinas timbul / QR Code TTE resmi',
          'Pencatatan ke dalam Buku Register SKTPD Tahun Berjalan',
          'Pengunggahan salinan arsip digital ke basis data pengadilan'
        ],
        outputLangkah: 'SKTPD Resmi Ber-TTE / Dokumen Waarmerking Sah',
        tipsPenting: 'SKTPD ber-TTE memiliki kekuatan pembuktian sempurna dan berlaku di seluruh jajaran Mabes TNI, Angkatan, dan instansi negara.',
        iconName: 'ShieldCheck'
      },
      {
        stepNumber: 5,
        title: 'Penyerahan SKTPD & Pengisian Survei Persepsi Korupsi (IPAK)',
        subtitle: 'Penyerahan hasil dan komitmen zona integritas bebas korupsi',
        duration: '3 Menit',
        biaya: 'Rp 0,- (Bebas Biaya)',
        actorPemohon: 'Menerima SKTPD asli bertanda tangan dinas, membubuhkan paraf tanda terima, dan memberikan rating bintang kepuasan.',
        actorPetugas: 'Menyerahkan SKTPD dalam map resmi Pengadilan Militer Tinggi V Makassar.',
        syaratChecklist: [
          'Tanda tangan pada buku ekspedisi penerimaan produk layanan',
          'Pengisian survei digital Indeks Persepsi Anti Korupsi (IPAK)'
        ],
        outputLangkah: 'Surat Keterangan Asli Selesai Di Tangan Pemohon',
        tipsPenting: 'Layanan SKTPD di Pengadilan Militer Tinggi V Makassar selesai dalam hitungan 15-30 menit tanpa dipungut biaya sepeserpun.',
        iconName: 'Award'
      }
    ]
  },
  {
    mejaId: 3,
    kodeAntrean: 'C',
    namaMeja: 'Meja 3: Kesekretariatan / Umum & Keuangan',
    kategoriLayanan: 'Surat Masuk Kedinasan, Pengadaan Barang/Jasa & Kasir Keuangan Perkara',
    contohLayananUtama: 'Penerimaan Surat Masuk Resmi & Pengembalian Sisa Panjar',
    dasarHukum: 'Tata Naskah Dinas MA-RI & Ketentuan Pengelolaan Keuangan Negara',
    steps: [
      {
        stepNumber: 1,
        title: 'Pengambilan Antrean Loket C & Registrasi Kurir/Tamu',
        subtitle: 'Penerimaan surat kedinasan TNI/Polri/Instansi atau pihak berperkara',
        duration: '3 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Petugas penghubung (kurir/ekspedisi kesatuan) atau pihak perkara mengambil antrean Loket C.',
        actorPetugas: 'Menyapa kurir dan meminta buku ekspedisi dinas pengirim.',
        syaratChecklist: [
          'Surat resmi dinas berkop kesatuan / amplop bersegel rahasia',
          'Buku ekspedisi pengantar dinas kesatuan',
          'Identitas kurir / petugas penghubung'
        ],
        outputLangkah: 'Nomor Antrean Loket C',
        tipsPenting: 'Untuk surat berkategori Rahasia / Tertutup, pastikan lak/segel amplop dalam kondisi utuh tidak cacat.',
        iconName: 'Ticket'
      },
      {
        stepNumber: 2,
        title: 'Pencatatan Buku Agenda & Scanning Digital (E-Office)',
        subtitle: 'Digitalisasi naskah dinas masuk ke sistem informasi persuratan',
        duration: '5 - 10 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Menunggu proses pemberian barcode dan nomor agenda surat.',
        actorPetugas: 'Mencatat nomor surat, asal surat, perihal, tanggal surat ke buku agenda surat masuk digital dan memindai (scan) naskah dinas.',
        syaratChecklist: [
          'Pencatatan tanggal dan jam penerimaan secara presisi',
          'Pemberian stempel agenda persuratan dinas pada lembar surat',
          'Scanning berkas PDF resolusi 300 DPI untuk arsip elektronik'
        ],
        outputLangkah: 'Nomor Agenda Surat Masuk & Barcode Ekspedisi',
        tipsPenting: 'Simpan tanda terima ber-barcode untuk memantau disposisi pimpinan terhadap surat yang dikirim.',
        iconName: 'FileCheck'
      },
      {
        stepNumber: 3,
        title: 'Penerbitan Lembar Disposisi Elektronik',
        subtitle: 'Penyampaian naskah dinas kepada Kepala / Sekretaris Dilmilti V',
        duration: '10 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Kurir kesatuan dapat melanjutkan dinas setelah bukti terima disahkan.',
        actorPetugas: 'Menerbitkan lembar disposisi persuratan dan meneruskan dokumen secara fisik maupun aplikasi e-Office kepada pimpinan.',
        syaratChecklist: [
          'Pencetakan lembar disposisi dinas terstandar',
          'Penyampaian ke ruang Kepala Pengadilan / Sekretaris'
        ],
        outputLangkah: 'Lembar Disposisi Pimpinan Pengadilan',
        tipsPenting: 'Surat kilat atau panggilan sidang darurat langsung didisposisikan pada kesempatan pertama.',
        iconName: 'Send'
      },
      {
        stepNumber: 4,
        title: 'Layanan Keuangan & Konfirmasi Panjar / Sisa Panjar',
        subtitle: 'Khusus sengketa Tata Usaha Militer (TUN) atau urusan keuangan',
        duration: '10 Menit',
        biaya: 'Sesuai Bukti Bank / Rp 0,-',
        actorPemohon: 'Pihak yang mengajukan permohonan sisa panjar menyerahkan nomor rekening dan identitas.',
        actorPetugas: 'Kasir memeriksa buku jurnal keuangan perkara dan melakukan proses pengembalian sisa panjar secara transfer perbankan.',
        syaratChecklist: [
          'Kuitansi panjar biaya perkara asli',
          'Nomor rekening bank atas nama pemohon / kuasa hukum',
          'Salinan putusan perkara TUN yang telah berkekuatan hukum tetap'
        ],
        outputLangkah: 'Bukti Transfer Bank & Kuitansi Pengembalian Sisa Panjar',
        tipsPenting: 'Pengembalian sisa panjar perkara dilakukan non-tunai langsung ke rekening bank pemohon.',
        iconName: 'Building2'
      },
      {
        stepNumber: 5,
        title: 'Pencatatan Selesai & Tanda Terima Akhir',
        subtitle: 'Penyelesaian administrasi kesekretariatan dan ekspedisi',
        duration: '2 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Menerima kembali buku ekspedisi dinas bertanda tangan dan berstempel resmi Pengadilan Militer Tinggi V Makassar.',
        actorPetugas: 'Membubuhkan cap tanda terima dinas dan menyerahkan kembali kepada kurir pengirim.',
        syaratChecklist: [
          'Peneraan cap dinas resmi tanggal penerimaan',
          'Pemberian paraf petugas jaga Meja 3'
        ],
        outputLangkah: 'Buku Ekspedisi Terstempel & Tanda Terima Resmi',
        tipsPenting: 'Layanan persuratan kedinasan di Dilmilti V Makassar terintegrasi dengan e-Office Mahkamah Agung.',
        iconName: 'Award'
      }
    ]
  },
  {
    mejaId: 4,
    kodeAntrean: 'D',
    namaMeja: 'Meja 4: Kepegawaian, Organisasi & Tata Laksana',
    kategoriLayanan: 'Kenaikan Pangkat (UKP) Militer/ASN, Mutasi Personel & Izin/Cuti',
    contohLayananUtama: 'Pengajuan Usul Kenaikan Pangkat (UKP) & Cuti Dinas',
    dasarHukum: 'Peraturan Panglima TNI tentang Pembinaan Personel & Manajemen ASN MA-RI',
    steps: [
      {
        stepNumber: 1,
        title: 'Pengambilan Antrean Loket D & Konsultasi Berkas Personel',
        subtitle: 'Penerimaan berkas administrasi personel aparatur peradilan militer',
        duration: '5 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Prajurit atau ASN mengambil antrean Loket D dan membawa dokumen riwayat kepangkatan.',
        actorPetugas: 'Menyapa pemohon dan memverifikasi kelayakan periode kenaikan pangkat atau izin.',
        syaratChecklist: [
          'SK Pangkat Terakhir dan SK Jabatan Struktural/Fungsional',
          'Daftar Penilaian Prestasi Kerja (e-Kinerja / Dapen TNI)',
          'Riwayat Hidup Personel (RHP / DRH)',
          'Surat Izin / Usulan dari atasan langsung'
        ],
        outputLangkah: 'Nomor Antrean Loket D & Tanda Periksa Berkas',
        tipsPenting: 'Perhatikan batas waktu batas akhir (deadline) usulan UKP periode 1 April atau 1 Oktober.',
        iconName: 'Ticket'
      },
      {
        stepNumber: 2,
        title: 'Pengecekan Sistem Informasi Kepegawaian (SIKep)',
        subtitle: 'Sinkronisasi data aparatur dengan database Mabes TNI & Mahkamah Agung',
        duration: '10 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Memeriksa kelengkapan data digital di aplikasi SIKep bersama petugas.',
        actorPetugas: 'Mengecek data profil personel, masa kerja golongan, angka kredit (untuk jabatan fungsional), dan riwayat diklat.',
        syaratChecklist: [
          'Kesesuaian data SIKep MA-RI dengan data Spers Mabes TNI',
          'Pemeriksaan masa dalam pangkat (MDP) prajurit',
          'Surat keterangan tidak sedang menjalani hukuman disiplin'
        ],
        outputLangkah: 'Lembar Verifikasi Kelayakan Personel SIKep',
        tipsPenting: 'Perbarui riwayat jabatan dan riwayat pendidikan di SIKep secara berkala agar usulan tidak terhambat.',
        iconName: 'Search'
      },
      {
        stepNumber: 3,
        title: 'Penyusunan Surat Pengantar Satuan Kerja',
        subtitle: 'Penyusunan nota usulan dinas ke Dirjen Badilmiltun / Babinkum TNI',
        duration: '15 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Menunggu proses pembuatan nota pengantar resmi kepala satuan kerja.',
        actorPetugas: 'Kasubbag Kepegawaian menyusun surat pengantar usul kenaikan pangkat (UKP) atau surat keputusan cuti pegawai.',
        syaratChecklist: [
          'Penyusunan lampiran nominatif daftar nama prajurit/ASN yang diusulkan',
          'Pemberian nomor surat naskah dinas kepegawaian'
        ],
        outputLangkah: 'Draf Surat Pengantar Satker & Lembar Nominatif UKP',
        tipsPenting: 'Untuk pengajuan cuti tahunan, dapat dilakukan mandiri melalui modul e-Cuti di portal internal.',
        iconName: 'FileText'
      },
      {
        stepNumber: 4,
        title: 'Pengesahan Pimpinan & Penandatanganan Berkas',
        subtitle: 'Persetujuan resmi Kepala Pengadilan Militer Tinggi V Makassar',
        duration: '1 Hari Kerja',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Menerima konfirmasi bahwa berkas telah disetujui pimpinan.',
        actorPetugas: 'Kepala Pengadilan Militer Tinggi V Makassar menandatangani surat pengantar UKP atau izin cuti secara digital (TTE).',
        syaratChecklist: [
          'Penandatanganan TTE bersertifikat elektronik BSrE',
          'Pengunggahan berkas digital ke sistem SIKepegawaian terpusat'
        ],
        outputLangkah: 'Surat Usulan Resmi Ber-TTE / Surat Izin Cuti Sah',
        tipsPenting: 'Salinan SK Cuti dapat langsung diunduh dan dicetak sendiri oleh pegawai dari mana saja.',
        iconName: 'ShieldCheck'
      },
      {
        stepNumber: 5,
        title: 'Penyampaian Tanda Terima & Survei Kepuasan Aparatur',
        subtitle: 'Penyerahan tembusan surat dinas dan evaluasi internal',
        duration: '3 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Menerima tembusan surat pengantar UKP atau surat izin cuti yang sah.',
        actorPetugas: 'Mendokumentasikan berkas ke arsip kepegawaian dan meminta rating pelayanan internal.',
        syaratChecklist: [
          'Pengarsipan pada buku register mutasi/UKP dinas',
          'Pemberian rating kepuasan layanan kepegawaian'
        ],
        outputLangkah: 'Tembusan Surat Resmi Diterima Pemohon',
        tipsPenting: 'Layanan kepegawaian Dilmilti V Makassar berkomitmen pada profesionalisme dan zero-gratifikasi.',
        iconName: 'Award'
      }
    ]
  },
  {
    mejaId: 5,
    kodeAntrean: 'E',
    namaMeja: 'Meja 5: Perencanaan, TI & Pelaporan (PTIP)',
    kategoriLayanan: 'Statistik Perkara, Laporan SAKIP/DIPA & Dukungan Sidang Virtual',
    contohLayananUtama: 'Permintaan Data Statistik Perkara & Jadwal Sidang Teleconference',
    dasarHukum: 'UU Keterbukaan Informasi & Keputusan Dirjen Badilmiltun tentang SPBE Peradilan',
    steps: [
      {
        stepNumber: 1,
        title: 'Pengambilan Antrean Loket E & Penyampaian Kebutuhan Data',
        subtitle: 'Penerimaan permohonan data statistik perkara atau teleconference sidang',
        duration: '3 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Peneliti, akademisi, satuan militer, atau humas mengambil tiket antrean Loket E.',
        actorPetugas: 'Menyapa pemohon dan menanyakan rincian data statistik atau dukungan teknis yang diperlukan.',
        syaratChecklist: [
          'Surat permohonan data resmi dari kesatuan TNI / perguruan tinggi / instansi',
          'Identitas peneliti atau pejabat penghubung yang meminta data',
          'Rincian periode data (contoh: Statistik Perkara Pidana Militer TA 2024 - 2026)'
        ],
        outputLangkah: 'Nomor Antrean Loket E & Lembar Permintaan Data',
        tipsPenting: 'Data statistik perkara yang disajikan bersifat anonim dan tidak memuat identitas pribadi terdakwa/korban yang dirahasiakan.',
        iconName: 'Ticket'
      },
      {
        stepNumber: 2,
        title: 'Penarikan & Pengolahan Data dari Database SIPP Terpadu',
        subtitle: 'Ekstraksi data perkara peradilan militer wilayah hukum Indonesia Timur',
        duration: '10 - 15 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Menunggu proses rekapitulasi data statistik oleh staf Teknologi Informasi.',
        actorPetugas: 'Staf PTIP melakukan query data perkara pada SIPP web, merekapitulasi jumlah perkara masuk, putus, sisa, jenis tindak pidana militer, dan tingkat penyelesaian.',
        syaratChecklist: [
          'Penyaringan data berdasarkan yurisdiksi dan tahun perkara',
          'Pembuatan tabel rekapitulasi statistik dan grafik visual',
          'Pemeriksaan keakuratan data dengan laporan bulanan kepaniteraan'
        ],
        outputLangkah: 'Draf Laporan Statistik Perkara Resmi (Excel / PDF)',
        tipsPenting: 'Pengadilan Militer Tinggi V Makassar mencakup wilayah yurisdiksi seluruh Indonesia Timur.',
        iconName: 'Search'
      },
      {
        stepNumber: 3,
        title: 'Verifikasi & Uji Kelayakan Publikasi oleh Kasubbag PTIP',
        subtitle: 'Pemeriksaan kepatuhan standar transparansi data pengadilan',
        duration: '10 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Melihat pratinjau data rekapitulasi statistik pada monitor pelayanan.',
        actorPetugas: 'Kasubbag PTIP memeriksa kebenaran angka statistik dan memastikan data tidak melanggar ketentuan rahasia militer/negara.',
        syaratChecklist: [
          'Verifikasi kesesuaian angka dengan laporan SAKIP dan Laporan Tahunan',
          'Pemberian pengantar klasifikasi data publik terbuka'
        ],
        outputLangkah: 'Persetujuan Dokumen Rekapitulasi Statistik',
        tipsPenting: 'Data statistik dapat disajikan dalam format data mentah (CSV/Excel) atau dokumen laporan resmi (PDF).',
        iconName: 'FileCheck'
      },
      {
        stepNumber: 4,
        title: 'Pengesahan Tanda Tangan Elektronik (TTE) Naskah Data',
        subtitle: 'Pemberian legalitas dokumen resmi perencanaan dan TI',
        duration: '5 - 10 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Menerima konfirmasi bahwa berkas statistik telah disahkan secara elektronik.',
        actorPetugas: 'Pejabat struktural menandatangani dokumen statistik menggunakan sertifikat elektronik BSSN ber-QR Code.',
        syaratChecklist: [
          'Pemberian nomor naskah dinas resmi subbagian PTIP',
          'Penyematan barcode TTE BSrE resmi pengadilan'
        ],
        outputLangkah: 'Buku Rekapitulasi Statistik Resmi Ber-TTE QR Code',
        tipsPenting: 'Dokumen elektronik ber-TTE ini dapat langsung digunakan sebagai referensi skripsi, tesis, riset militer, atau laporan satuan.',
        iconName: 'ShieldCheck'
      },
      {
        stepNumber: 5,
        title: 'Penyerahan File/Cetak & Survei Kualitas Layanan TI',
        subtitle: 'Penyerahan berkas dan umpan balik kepuasan keterbukaan data',
        duration: '2 Menit',
        biaya: 'Rp 0,- (100% Gratis)',
        actorPemohon: 'Menerima berkas cetak dan softcopy via email / flashdisk / unduh web, serta mengisi rating survei pelayanan.',
        actorPetugas: 'Menyerahkan dokumen data statistik resmi dan mencatat dalam buku kendali layanan informasi TI.',
        syaratChecklist: [
          'Tanda terima penyerahan berkas data statistik',
          'Pengisian survei kepuasan layanan teknologi informasi'
        ],
        outputLangkah: 'Dokumen Statistik Sah di Tangan Pemohon & Bukti Survei',
        tipsPenting: 'Anda juga dapat mengakses data perkara secara mandiri 24 jam di portal SIPP dan Open Data Pengadilan.',
        iconName: 'Award'
      }
    ]
  },
  {
    mejaId: 6,
    kodeAntrean: 'F',
    namaMeja: 'Meja 6: Informasi, Pengaduan PPID & Posbakum',
    kategoriLayanan: 'Permohonan Informasi Publik PPID (SK KMA 2-144), Pengaduan SIWAS & Posbakum Cuma-cuma',
    contohLayananUtama: 'Permohonan Informasi PPID & Konsultasi Bantuan Hukum Gratis',
    dasarHukum: 'UU No. 14/2008 tentang KIP & SK KMA No. 2-144/KMA/SK/VIII/2022',
    steps: [
      {
        stepNumber: 1,
        title: 'Pengambilan Antrean Loket F & Pengisian Formulir PPID / Posbakum',
        subtitle: 'Penerimaan permohonan informasi publik atau konsultasi bantuan hukum',
        duration: '5 Menit',
        biaya: 'Rp 0,- (100% Cuma-cuma)',
        actorPemohon: 'Mengambil antrean Loket F dan mengisi formulir permohonan informasi publik (DIP) atau mendaftar konsultasi hukum Posbakum.',
        actorPetugas: 'Menyapa pemohon dengan ramah, memberikan lembar formulir permohonan, dan membantu pengisian jika pemohon memerlukan pendampingan.',
        syaratChecklist: [
          'Identitas Pemohon (KTA TNI / KTP / Surat Kuasa)',
          'Surat permohonan tertulis atau mengisi formulir resmi Meja 6',
          'Penjelasan tujuan permohonan informasi publik yang diminta'
        ],
        outputLangkah: 'Formulir Permohonan PPID Bertandatangan & Nomor Antrean Loket F',
        tipsPenting: 'Layanan konsultasi hukum di Pos Bantuan Hukum (Posbakum) Pengadilan Militer Tinggi V Makassar 100% GRATIS tanpa biaya pengacara.',
        iconName: 'Ticket'
      },
      {
        stepNumber: 2,
        title: 'Verifikasi Kategori Informasi (Uji Konsekuensi & Keterbukaan)',
        subtitle: 'Pengecekan apakah informasi berkategori terbuka, berkala, atau dikecualikan',
        duration: '10 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Menjelaskan kebutuhan informasi publik yang dicari kepada Petugas Informasi PPID.',
        actorPetugas: 'Memeriksa Daftar Informasi Publik (DIP) Pengadilan Militer Tinggi V Makassar sesuai SK KMA 2-144/2022.',
        syaratChecklist: [
          'Pencocokan permohonan dengan Daftar Informasi Publik (DIP)',
          'Memastikan informasi bukan rahasia pertahanan negara yang dikecualikan undang-undang',
          'Pencatatan ke dalam Register Permohonan Informasi Publik'
        ],
        outputLangkah: 'Tanda Terima Permohonan Informasi Publik Resmi Ber-Barcode',
        tipsPenting: 'Sesuai UU KIP dan SK KMA 2-144, pengadilan wajib memberikan jawaban paling lambat 10 (sepuluh) hari kerja.',
        iconName: 'Search'
      },
      {
        stepNumber: 3,
        title: 'Penyiapan Dokumen Informasi atau Sesi Konsultasi Advokat',
        subtitle: 'Pencarian salinan dokumen publik atau konsultasi langsung dengan advokat',
        duration: '15 - 20 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Untuk Posbakum: Bertatap muka langsung dengan advokat piket di ruang mediasi/konsultasi ramah hukum.',
        actorPetugas: 'Petugas PPID mengkoordinasikan penggandaan dokumen dengan bagian kepaniteraan/kesekretariatan.',
        syaratChecklist: [
          'Penyiapan salinan berkas informasi publik (PDF / Cetak)',
          'Untuk Posbakum: Pembuatan draf dokumen hukum permohonan / gugatan bagi prajurit/masyarakat'
        ],
        outputLangkah: 'Naskah Informasi Publik Terverifikasi / Surat Rekomendasi Posbakum',
        tipsPenting: 'Pemohon juga dapat melakukan konsultasi tatap muka virtual dari rumah melalui menu Konsultasi Virtual di PTSP Online.',
        iconName: 'FileText'
      },
      {
        stepNumber: 4,
        title: 'Penerbitan Surat Pemberitahuan Tertulis PPID Ber-TTE',
        subtitle: 'Pengesahan surat jawaban resmi oleh Pejabat Pengelola Informasi & Dokumentasi',
        duration: '10 Menit',
        biaya: 'Rp 0,- (Gratis)',
        actorPemohon: 'Menunggu penerbitan lembar surat pemberitahuan tertulis.',
        actorPetugas: 'PPID Pelaksana menerbitkan Surat Pemberitahuan Tertulis yang disahkan secara elektronik dengan tanda tangan digital BSrE BSSN.',
        syaratChecklist: [
          'Pemberian nomor register resmi Surat PPID',
          'Penyematan QR Code verifikasi dokumen elektronik',
          'Pencatatan rincian informasi yang diserahkan'
        ],
        outputLangkah: 'Surat Pemberitahuan Tertulis PPID Sah Ber-TTE',
        tipsPenting: 'Salinan dokumen informasi publik elektronik (PDF) diberikan tanpa biaya penggandaan apapun.',
        iconName: 'ShieldCheck'
      },
      {
        stepNumber: 5,
        title: 'Penyerahan Informasi & Survei Integritas Pelayanan (IKM & SIWAS)',
        subtitle: 'Penyerahan dokumen informasi dan jaminan hak pengaduan masyarakat',
        duration: '3 Menit',
        biaya: 'Rp 0,- (100% Bebas Biaya)',
        actorPemohon: 'Menerima dokumen informasi publik yang dimohonkan, menandatangani bukti terima, dan mengisi kuesioner transparansi pengadilan.',
        actorPetugas: 'Menyerahkan dokumen resmi, memberikan kontak saluran pengaduan resmi SIWAS MA-RI jika terdapat ketidakpuasan, dan mengucapkan terima kasih.',
        syaratChecklist: [
          'Tanda tangan bukti penyerahan produk informasi publik',
          'Pengisian survei kepuasan masyarakat (IKM) pada tablet survei'
        ],
        outputLangkah: 'Dokumen Informasi Lengkap Diterima & Bukti Survei IKM',
        tipsPenting: 'Jika permohonan informasi ditolak karena dikecualikan, pemohon berhak mengajukan Keberatan kepada Atasan PPID dalam 30 hari kerja.',
        iconName: 'Award'
      }
    ]
  }
];

interface PtspInfografisAlurSectionProps {
  onNavigateToPtspOnline?: (tab?: string, serviceName?: string) => void;
  onNavigateToSection?: (section: any, subTab?: string) => void;
}

export default function PtspInfografisAlurSection({
  onNavigateToPtspOnline,
  onNavigateToSection
}: PtspInfografisAlurSectionProps) {
  const [selectedMejaId, setSelectedMejaId] = useState<number>(1);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [modePelayanan, setModePelayanan] = useState<'offline' | 'online'>('offline');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const activeMejaAlur =
    ALUR_6_MEJA_DATA.find((m) => m.mejaId === selectedMejaId) || ALUR_6_MEJA_DATA[0];
  const activeStep = activeMejaAlur.steps[activeStepIndex] || activeMejaAlur.steps[0];

  // Auto-play stepper if enabled
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % activeMejaAlur.steps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, activeMejaAlur.steps.length]);

  const handleNextStep = () => {
    if (activeStepIndex < activeMejaAlur.steps.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    } else {
      setActiveStepIndex(0);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
    } else {
      setActiveStepIndex(activeMejaAlur.steps.length - 1);
    }
  };

  const handlePrintInfografis = () => {
    const printWin = window.open('', '_blank', 'width=950,height=800');
    if (!printWin) return;
    printWin.document.write(`
      <html>
        <head>
          <title>Infografis Alur Pelayanan - ${activeMejaAlur.namaMeja}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 32px; color: #111; line-height: 1.5; font-size: 11pt; }
            .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 20px; }
            .kop h2 { margin: 0; font-size: 15pt; text-transform: uppercase; }
            .kop p { margin: 2px 0; font-size: 10pt; }
            .badge-box { background: #f0fdf4; border: 1px solid #16a34a; padding: 10px; margin-bottom: 16px; border-radius: 6px; }
            .step-row { border: 1px solid #cbd5e1; padding: 12px; margin-bottom: 12px; border-radius: 8px; page-break-inside: avoid; }
            .step-header { font-weight: bold; font-size: 12pt; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px; }
            ul { margin: 6px 0 6px 20px; padding: 0; }
            .footer { margin-top: 24px; text-align: right; font-size: 10pt; }
          </style>
        </head>
        <body>
          <div class="kop">
            <h2>MAHKAMAH AGUNG REPUBLIK INDONESIA</h2>
            <h2>PENGADILAN MILITER TINGGI V MAKASSAR</h2>
            <p>Pusat Pelayanan Terpadu Satu Pintu (PTSP) • Jl. Urip Sumoharjo KM 7, Makassar</p>
          </div>
          <div class="badge-box">
            <strong>INFOGRAFIS STANDAR PROSEDUR OPERASIONAL (SOP) PELAYANAN</strong><br/>
            <strong>Unit Meja:</strong> ${activeMejaAlur.namaMeja} (Loket ${activeMejaAlur.kodeAntrean})<br/>
            <strong>Kategori Layanan:</strong> ${activeMejaAlur.kategoriLayanan}<br/>
            <strong>Biaya Resmi:</strong> Rp 0,- (100% Bebas Biaya Dibiayai Negara - Pasal 248 UU 31/1997)
          </div>

          ${activeMejaAlur.steps
            .map(
              (s) => `
            <div class="step-row">
              <div class="step-header">LANGKAH ${s.stepNumber}: ${s.title.toUpperCase()} (SLA: ${s.duration})</div>
              <p><strong>Sub-proses:</strong> ${s.subtitle}</p>
              <p><strong>Tindakan Pemohon:</strong> ${s.actorPemohon}</p>
              <p><strong>Tindakan Petugas:</strong> ${s.actorPetugas}</p>
              <p><strong>Checklist Syarat / Berkas:</strong></p>
              <ul>
                ${s.syaratChecklist.map((c) => `<li>${c}</li>`).join('')}
              </ul>
              <p><strong>Output Dokumen:</strong> ${s.outputLangkah}</p>
              <p><strong>Tips Penting:</strong> <em>${s.tipsPenting}</em></p>
            </div>
          `
            )
            .join('')}

          <div class="footer">
            <p>Ditetapkan di Makassar<br/><strong>Panitera & Sekretaris Pengadilan Militer Tinggi V Makassar</strong></p>
          </div>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
    }, 400);
  };

  return (
    <section id="infografis-alur-ptsp-section" className="space-y-6 animate-fadeIn">
      {/* 1. Header Banner Infografis */}
      <div className="bg-gradient-to-br from-[#072617] via-[#0B3A23] to-slate-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/50 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>PANDUAN VISUAL PELAYANAN PUBLIK & PERADILAN MILITER</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
              Infografis Langkah-demi-Langkah Alur Pelayanan 6 Meja PTSP
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Panduan interaktif bagi Prajurit TNI, Oditur Militer, Penasihat Hukum, dan Masyarakat Umum untuk memahami proses pengurusan layanan dari awal hingga penyerahan dokumen resmi secara transparan, pasti, dan bebas biaya.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handlePrintInfografis}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-2 cursor-pointer transition-all shadow-sm"
              title="Cetak Infografis Alur Pelayanan Ini"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak Alur (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateToPtspOnline) {
                  onNavigateToPtspOnline('permohonan');
                } else if (onNavigateToSection) {
                  onNavigateToSection('ptsp-online', 'permohonan');
                }
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-md"
            >
              <span>Ajukan Permohonan di PTSP Online</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector: Tatap Muka di Kantor vs Mandiri Online */}
        <div className="pt-4 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold">Pilih Model Alur:</span>
            <div className="inline-flex rounded-xl bg-slate-900/90 p-1 border border-emerald-500/30">
              <button
                type="button"
                onClick={() => setModePelayanan('offline')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  modePelayanan === 'offline'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🏢 Datang Langsung ke Loket Kantor
              </button>
              <button
                type="button"
                onClick={() => setModePelayanan('online')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  modePelayanan === 'online'
                    ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🌐 Mandiri via Aplikasi PTSP Online
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-emerald-200">
            <span>Standar Biaya: <strong className="text-amber-300">Rp 0,- (Bebas Biaya)</strong></span>
            <span>•</span>
            <span>Total SLA: <strong className="text-white">15 - 30 Menit</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Meja Switcher Tabs (Meja 1 s.d Meja 6) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {ALUR_6_MEJA_DATA.map((meja) => {
          const isSelected = meja.mejaId === selectedMejaId;
          return (
            <button
              key={meja.mejaId}
              type="button"
              onClick={() => {
                setSelectedMejaId(meja.mejaId);
                setActiveStepIndex(0);
              }}
              className={`p-3 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#0D4A2B] text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono font-black text-xs px-2 py-0.5 rounded ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  LOKET {meja.kodeAntrean}
                </span>
                <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                  5 Langkah
                </span>
              </div>

              <div className="mt-2 font-black text-xs line-clamp-1">{meja.namaMeja.split(':')[0]}</div>
              <div className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                {meja.kategoriLayanan.split(',')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Infographic Stepper Progress Bar & Stepper Nodes */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded font-mono font-black text-[10px] uppercase tracking-wider bg-emerald-100 text-[#0D4A2B]">
                LOKET MEJA {activeMejaAlur.kodeAntrean}
              </span>
              <span className="text-xs font-bold text-slate-500">Dasar Hukum: {activeMejaAlur.dasarHukum}</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              {activeMejaAlur.namaMeja} — <span className="text-emerald-700">{activeMejaAlur.contohLayananUtama}</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isAutoPlaying
                  ? 'bg-amber-400 text-slate-950 border-amber-500 font-black'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
              }`}
            >
              {isAutoPlaying ? '⏸ Jeda Putar Otomatis' : '▶ Putar Alur Otomatis'}
            </button>
          </div>
        </div>

        {/* Visual Stepper Nodes Strip */}
        <div className="relative">
          {/* Connector Line behind nodes */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 -z-0 hidden md:block" />
          <div
            className="absolute top-5 left-6 h-1 bg-emerald-600 -z-0 hidden md:block transition-all duration-500"
            style={{ width: `${(activeStepIndex / (activeMejaAlur.steps.length - 1)) * 90}%` }}
          />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 relative z-10">
            {activeMejaAlur.steps.map((st, idx) => {
              const isActive = idx === activeStepIndex;
              const isPast = idx < activeStepIndex;
              return (
                <button
                  key={st.stepNumber}
                  type="button"
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={`p-3 rounded-2xl text-left transition-all border cursor-pointer relative ${
                    isActive
                      ? 'bg-[#0D4A2B] text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                      : isPast
                      ? 'bg-emerald-50 text-slate-800 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-black text-xs ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isPast ? '✓' : st.stepNumber}
                    </span>
                    <span className={`text-[10px] font-bold ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                      {st.duration}
                    </span>
                  </div>

                  <div className="mt-2 font-bold text-xs line-clamp-1">{st.title}</div>
                  <div className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`}>
                    Tahap 0{st.stepNumber}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Active Step Detailed Spotlight Card */}
        <div className="bg-slate-50/80 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          {/* Step Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#0D4A2B] text-amber-300 flex items-center justify-center font-black text-xl shrink-0 shadow-md font-mono">
                0{activeStep.stepNumber}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  LANGKAH {activeStep.stepNumber} DARI 5
                </span>
                <h4 className="text-lg sm:text-xl font-black text-slate-900 mt-1">{activeStep.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{activeStep.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Estimasi: {activeStep.duration}</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-100 border border-emerald-300 text-xs font-black text-emerald-900">
                {activeStep.biaya}
              </span>
            </div>
          </div>

          {/* Action Comparison: Pemohon vs Petugas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Pemohon Role */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wide">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs">
                  👤
                </span>
                <span>Peran &amp; Tindakan Pemohon:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{activeStep.actorPemohon}</p>
              
              {modePelayanan === 'online' && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                  <Smartphone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Jika Lewat PTSP Online:</strong> Anda cukup mengunggah berkas format PDF secara mandiri dari smartphone/laptop tanpa harus datang ke kantor pengadilan.
                  </span>
                </div>
              )}
            </div>

            {/* Petugas Meja Role */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wide">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">
                  🏛️
                </span>
                <span>Tindakan Petugas Loket PTSP:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{activeStep.actorPetugas}</p>
              
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Standar Pelayanan:</strong> Petugas terikat Pakta Integritas Zona Integritas (WBK/WBBM) dan dilarang menerima imbalan dalam bentuk apapun.
                </span>
              </div>
            </div>
          </div>

          {/* Checklist Syarat & Dokumen Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Checklist Syarat */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Syarat &amp; Dokumen yang Diperiksa di Langkah Ini:</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {activeStep.syaratChecklist.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Output Dokumen & Tips Penting */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-900 text-white space-y-1.5 shadow-xs">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>Output / Dokumen yang Dihasilkan pada Langkah Ini:</span>
                </div>
                <div className="font-extrabold text-sm text-white">{activeStep.outputLangkah}</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-700" />
                  <span>Tips Praktis agar Pelayanan Cepat &amp; Tepat:</span>
                </div>
                <div className="text-xs text-amber-950 font-medium leading-relaxed">
                  {activeStep.tipsPenting}
                </div>
              </div>
            </div>
          </div>

          {/* Step Navigation Controls (Prev & Next Step Buttons) */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-2 cursor-pointer transition-all shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Langkah Sebelumnya</span>
            </button>

            <div className="flex items-center gap-1.5">
              {activeMejaAlur.steps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setActiveStepIndex(i);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    i === activeStepIndex ? 'w-6 bg-emerald-700' : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={`Lompat ke Langkah ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-[#0D4A2B] hover:bg-emerald-800 text-amber-300 font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm"
            >
              <span>{activeStepIndex === activeMejaAlur.steps.length - 1 ? 'Ulangi dari Langkah 1' : 'Langkah Selanjutnya'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5. Summary Info Badges (Transparansi Pelayanan) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0D4A2B] flex items-center justify-center font-black">
              1
            </span>
            <div>
              <div className="font-extrabold text-slate-900">100% Bebas Pungli &amp; Calo</div>
              <div className="text-[11px] text-slate-500">Seluruh meja pelayanan diawasi CCTV &amp; SIWAS</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
              2
            </span>
            <div>
              <div className="font-extrabold text-slate-900">Validasi Digital QR TTE BSrE</div>
              <div className="text-[11px] text-slate-500">Output dokumen sah tanpa perlu cap basah</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-black">
              3
            </span>
            <div>
              <div className="font-extrabold text-slate-900">Tersedia Modul PTSP Online</div>
              <div className="text-[11px] text-slate-500">Bisa diakses dari kesatuan kapan saja</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
