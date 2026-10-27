import { DIPItem, NewsItem, RelatedWebsiteItem } from '../types';
const logoTransparent = '/images/dilmilti_v_logo_transparent.png';

export const COURT_IDENTITY = {
  name: 'PENGADILAN MILITER TINGGI V MAKASSAR',
  parent: 'MAHKAMAH AGUNG REPUBLIK INDONESIA',
  subParent: 'DIREKTORAT JENDERAL BADAN PERADILAN MILITER DAN PERADILAN TATA USAHA NEGARA',
  skStandardisasi: 'SK DIRJEN BADILMILTUN NOMOR: 593/DJMT/SK.TI2.1.1/VII/2026',
  address: 'Jalan Metro Tanjung Bunga Kompleks Mall Phinisi Point Makassar Sulawesi Selatan 90122',
  phone: '081144405554',
  whatsapp: '0811-4440-5554 (Layanan PTSP & SIPP WhatsApp Real-Time)',
  email: 'dilmiti5makassar@gmail.com',
  website: 'https://dilmilti-gez4.vercel.app',
  yurisdiksi: 'Daerah Hukum Pengadilan Militer Tinggi V Makassar Berdasarkan Peraturan Pemerintah Nomor 22 Tahun 2025 Meliputi 12 Provinsi di Indonesia Timur: Sulawesi Utara, Gorontalo, Sulawesi Tengah, Sulawesi Barat, Sulawesi Tenggara, Sulawesi Selatan, Maluku Utara, Maluku, Papua Barat Daya, Papua Barat, Papua Tengah, Papua Pegunungan, Papua, dan Papua Selatan; Serta Membawahi 6 Pengadilan Militer Tingkat Pertama: Dilmil V-17 Makassar, Dilmil V-18 Kendari, Dilmil V-19 Manado, Dilmil V-20 Ambon, Dilmil V-21 Manokwari, dan Dilmil V-22 Jayapura.',
  logoUrl: logoTransparent,
  bannerUrl: '/images/makassar_court_banner_1789442426023.jpg',
  slogan: 'REWAKO (Responsif, Energik, Wibawa, Adaptif, Kolaboratif, Objektif)',
  primaryColor: '#0D4A2B',
  secondaryColor: '#166534',
  accentGold: '#D4AF37',
  ikmSkor: 3.92,
  ikmPredikat: 'SANGAT BAIK',
  ikmResponden: 168,
  ipakSkor: 3.96,
  ipakPredikat: 'SANGAT BERSIH',
  ipakResponden: 168,
  surveiIkmUrl: 'https://survei.djmt.id/dilmilti_makassar',
  surveiIpakUrl: 'https://survei.djmt.id/dilmilti_makassar',
  facebookUrl: 'https://facebook.com/dilmilti5.makassar',
  instagramUrl: 'https://instagram.com/dilmilti5.makassar'
};

export const JURISDICTION_COURTS = [
  {
    code: 'Dilmil V-17',
    name: 'Pengadilan Militer V-17 Makassar',
    wilayah: 'Sulawesi Selatan & Sulawesi Barat (Kodam XIV/Hasanuddin, Lantamal VI, Koopsud II)',
    address: 'Jl. Perintis Kemerdekaan KM. 13, Kel. Daya, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan 90243',
    phone: '(0411) 512345'
  },
  {
    code: 'Dilmil V-18',
    name: 'Pengadilan Militer V-18 Kendari',
    wilayah: 'Sulawesi Tenggara (Diresmikan Serentak 9 Juli 2026 jo PP No. 23/2025)',
    address: 'Jl. Ahmad Yani No. 88, Kendari, Sultra',
    phone: '(0401) 312345'
  },
  {
    code: 'Dilmil V-19',
    name: 'Pengadilan Militer V-19 Manado',
    wilayah: 'Sulawesi Utara, Sulawesi Tengah & Gorontalo (Kodam XIII/Merdeka, Lantamal VIII)',
    address: 'Jl. Ksatria No. 12, Manado, Sulut',
    phone: '(0431) 852345'
  },
  {
    code: 'Dilmil V-20',
    name: 'Pengadilan Militer V-20 Ambon',
    wilayah: 'Provinsi Maluku & Maluku Utara (Kodam XV/Pattimura, Lantamal IX, Lanud Pattimura)',
    address: 'Jl. Laksdya Leo Wattimena, Ambon, Maluku',
    phone: '(0911) 341234'
  },
  {
    code: 'Dilmil V-21',
    name: 'Pengadilan Militer V-21 Manokwari',
    wilayah: 'Provinsi Papua Barat & Papua Barat Daya (Diresmikan Serentak 9 Juli 2026)',
    address: 'Jl. Siliwangi No. 45, Manokwari, Papua Barat',
    phone: '(0986) 211234'
  },
  {
    code: 'Dilmil V-22',
    name: 'Pengadilan Militer V-22 Jayapura',
    wilayah: 'Provinsi Papua, Papua Tengah, Papua Selatan & Papua Pegunungan (Kodam XVII/Cenderawasih, Lantamal X)',
    address: 'Jl. Dr. Sam Ratulangi No. 15, Jayapura, Papua',
    phone: '(0967) 531234'
  }
];

export const COURT_ACHIEVEMENTS = [
  {
    badge: 'PERESMIAN OPERASIONAL',
    title: 'Diresmikan Oleh Ketua Mahkamah Agung RI Sunarto',
    organizer: 'Mahkamah Agung Republik Indonesia',
    year: '9 Juli 2026',
    desc: 'Diresmikan serentak bersama 5 Satuan Kerja Baru di Gedung PTUN Makassar berdasarkan PP No. 22 Tahun 2025 & PP No. 23 Tahun 2025.'
  },
  {
    badge: 'JUARA I TERBAIK',
    title: 'Website Pengadilan Militer Terbaik Nasional',
    organizer: 'Ditjen Badilmiltun Mahkamah Agung RI',
    year: '2025 / 2026',
    desc: 'Benchmark implementasi standarisasi website peradilan militer, kepatuhan SK KMA 2-144, dan inovasi pelayanan digital publik.'
  },
  {
    badge: 'PREDIKAT WBK',
    title: 'Zona Integritas Bebas dari Korupsi Menuju WBBM',
    organizer: 'KemenPAN-RB RI & Bawas MA-RI',
    year: 'SMAP ISO 37001',
    desc: 'Zero tolerance pungli dan gratifikasi serta transparansi biaya perkara militer 100% akuntabel.'
  }
];

export const OPERATING_HOURS = [
  { day: 'Senin - Kamis', hours: '08.00 - 16.30 WITA', status: 'Buka', isCurrent: true },
  { day: 'Jumat', hours: '08.00 - 17.00 WITA', status: 'Buka', isCurrent: false },
  { day: 'Sabtu - Minggu', hours: 'Tutup (Hari Libur)', status: 'Tutup', isCurrent: false }
];

export const PUBLIC_SURVEY_DATA = {
  ikm: { skor: 3.92, predikat: 'SANGAT BAIK', responden: 168, totalResponden: 168 },
  ipak: { skor: 3.96, predikat: 'SANGAT BERSIH', responden: 168, totalResponden: 168 }
};

export const RELATED_WEBSITES: RelatedWebsiteItem[] = [
  { id: 'w-sipp-sub', name: 'SIPP Resmi (Daftar Perkara)', url: 'https://sipp.dilmilti-makassar.go.id/list_perkara/', role: 'Penelusuran Berkas & Amar Putusan', category: 'Layanan Publik' },
  { id: 'w-jadwal-sub', name: 'Jadwal Sidang Resmi', url: 'https://sipp.dilmilti-makassar.go.id/list_jadwal_sidang', role: 'Agenda Persidangan Real-Time', category: 'Layanan Publik' },
  { id: 'w1', name: 'Mahkamah Agung RI', url: 'https://mahkamahagung.go.id', role: 'Induk Lembaga', category: 'Mahkamah Agung' },
  { id: 'w2', name: 'Ditjen Badilmiltun MA-RI', url: 'https://badilmiltun.mahkamahagung.go.id', role: 'Pembina Teknis & Admin', category: 'Mahkamah Agung' },
  { id: 'w3', name: 'Direktori Putusan MA-RI', url: 'https://putusan3.mahkamahagung.go.id', role: 'Publikasi Salinan Putusan Resmi', category: 'Layanan Publik' },
  { id: 'w4', name: 'SIWAS Mahkamah Agung', url: 'https://siwas.mahkamahagung.go.id', role: 'Pengaduan Pungli & Etika', category: 'Pengawasan' },
  { id: 'w5', name: 'JDIH Mahkamah Agung', url: 'https://jdih.mahkamahagung.go.id', role: 'Jaringan Dokumentasi Hukum', category: 'Mahkamah Agung' },
  { id: 'w6', name: 'JDIH Nasional (JDIHN)', url: 'https://jdihn.go.id', role: 'Database Undang-Undang RI & UU 31/1997', category: 'Mahkamah Agung' }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-sk-sekma-14106-2026',
    judul: 'Mahkamah Agung Terbitkan SK Sekma No. 14106/2026: Pedoman Pengelolaan Media Massa, Media Sosial, dan Tata Kelola AI Peradilan',
    kategori: 'Siaran Pers & Regulasi',
    tanggal: '2026-10-10',
    penulis: 'Afni Syafaatun, S.A.P., M.A.P. (Pranata Humas)',
    editorPenyunting: 'Muhammad Arfah Afendi, S.E., M.M. (Koordinator Pengelola)',
    ringkasan: 'Sekretaris Mahkamah Agung RI resmi menetapkan Keputusan Nomor 14106/SEK/SK.HM1.1/X/2026 tentang Pedoman Pengelolaan Media Massa dan Media Sosial di Lingkungan Mahkamah Agung dan Badan Peradilan di Bawahnya, memuat aturan SOP 11 langkah, verifikasi berjenjang, dan tata kelola Kecerdasan Buatan (AI).',
    leadBerita: 'JAKARTA / MAKASSAR - Sekretaris Mahkamah Agung Republik Indonesia resmi menetapkan Keputusan Nomor 14106/SEK/SK.HM1.1/X/2026 tertanggal 9 Oktober 2026 tentang Pedoman Pengelolaan Media Massa dan Media Sosial di Lingkungan Mahkamah Agung dan Badan Peradilan yang Berada di Bawahnya guna memperkuat kredibilitas, independensi peradilan, perlindungan data pribadi, dan etika komunikasi publik.',
    isi: `JAKARTA / MAKASSAR - Mahkamah Agung Republik Indonesia melalui Pelaksana Tugas (Plt.) Sekretaris Mahkamah Agung RI, Sobandi, secara resmi menandatangani Keputusan Sekretaris Mahkamah Agung RI Nomor: 14106/SEK/SK.HM1.1/X/2026 tentang Pedoman Pengelolaan Media Massa dan Media Sosial di Lingkungan Mahkamah Agung dan Badan Peradilan yang Berada di Bawahnya pada Jumat, 9 Oktober 2026.

Regulasi penting ini ditetapkan dalam rangka mewujudkan tata kelola kehumasan peradilan yang profesional, transparan, beretika, dan akuntabel di era transformasi digital, selaras dengan prinsip independensi peradilan dan Undang-Undang Nomor 77 Tahun 2022 tentang Pelindungan Data Pribadi.

POIN PENTING & RUANG LINGKUP PEDOMAN:
Keputusan ini terdiri atas 2 (dua) lampiran utama:
1. Lampiran I: Pedoman Pengelolaan Media Massa dan Media Sosial (Bab A s.d. M)
2. Lampiran II: Standar Operasional Prosedur (SOP) Publikasi Media Sosial yang memuat 11 alur tahapan baku kerja.

STRUKTUR TIM PENGELOLA DI PENGADILAN TINGKAT BANDING:
Sesuai Lampiran I Bab D angka 1 s.d. 6, struktur tim pengelola pada Pengadilan Militer Tinggi V Makassar terdiri atas:
1. Pembina: Dijabat oleh Hakim atau Juru Bicara Pengadilan yang ditunjuk Kepala Pengadilan.
2. Penanggung Jawab: Dijabat oleh Sekretaris Pengadilan.
3. Koordinator Pengelola: Dijabat oleh Kepala Bagian yang ditunjuk pimpinan.
4. Tim Produksi Konten: Perancang Infografis & Videografis, Fotografer & Videografer, Penulis Naskah (unsur 5W+1H), Editor Naskah, dan Penyusun Konten (menerapkan kaidah SEO & Tagar).
5. Administrator Media Massa & Administrator Media Sosial: Bertanggung jawab atas kanal rilis resmi dan pengelolaan akun dinas dengan proteksi Autentikasi Dua Langkah (2FA).

TATA KELOLA PEMANFAATAN KECERDASAN BUATAN (AI) BAB K:
Mahkamah Agung menegaskan bahwa Kecerdasan Buatan (termasuk Generative AI) hanya berfungsi sebagai alat bantu kerja dan tidak menggantikan kewenangan pejabat. Terdapat larangan keras merekayasa logo resmi dan foto pimpinan/aparatur peradilan yang mengubah identitas dan makna. Selain itu, setiap materi visual yang sepenuhnya dihasilkan AI generatif wajib mencantumkan keterangan resmi: "Dibuat dengan Bantuan Kecerdasan Buatan (AI)".

ETIKA KOMUNIKASI & MODERASI INTERAKSI:
Pengelola akun resmi wajib menjawab tanggapan masyarakat dengan format resmi "[Jawaban/Tanggapan]". Adapun kritik dan keluhan mengenai layanan peradilan diarahkan langsung ke kanal pengaduan resmi Sistem Pengawasan (SIWAS) Mahkamah Agung RI. Pengadilan ditegaskan tidak menanggapi substansi perkara maupun putusan hakim di media sosial guna menjaga kemandirian yudisial.`,
    ekorBerita: 'Pengadilan Militer Tinggi V Makassar berkomitmen penuh mengimplementasikan seluruh ketentuan SK Sekma Nomor 14106/SEK/SK.HM1.1/X/2026 ini pada seluruh saluran informasi website, media sosial resmi, dan publikasi kehumasan peradilan.',
    gambarUrl: '/images/makassar_court_banner_1789442426023.jpg',
    views: '2410',
    isFeatured: true,
    siaranPersPdfUrl: '/assets/aistudio/2026sk-sekma14106_a0e8391d.pdf',
    comments: [
      {
        id: 'cmt-sk-1',
        authorName: 'Kolonel Kum M. Nirwan Said, S.H., M.H.',
        authorRole: 'Panitera Dilmilti V Makassar',
        content: 'Pemberlakuan SK Sekma No. 14106/2026 menjadi panduan yang sangat komprehensif bagi seluruh aparatur peradilan dalam menjaga integritas, marwah peradilan militer, dan tata kelola media sosial kedinasan.',
        createdAt: '10 Okt 2026 • 10:30 WITA'
      }
    ]
  },
  {
    id: 'news-peresmian-2026',
    judul: 'Ketua Mahkamah Agung RI Sunarto Resmikan Operasional Pengadilan Militer Tinggi V Makassar',
    kategori: 'Berita Utama',
    tanggal: '2026-07-09',
    penulis: 'Tim Humas Dilmilti V Makassar',
    editorPenyunting: 'Sekretaris Dilmilti V Makassar',
    ringkasan: 'Ketua Mahkamah Agung RI Sunarto secara resmi meresmikan operasional Pengadilan Militer Tinggi V Makassar dipusatkan di Gedung Pengadilan Tata Usaha Negara (PTUN) Makassar pada Kamis, 9 Juli 2026.',
    leadBerita: 'MAKASSAR - Ketua Mahkamah Agung Republik Indonesia, Prof. Dr. H. Sunarto, S.H., M.H., meresmikan operasional Pengadilan Militer Tinggi V Makassar yang dipusatkan di Gedung PTUN Makassar pada Kamis, 9 Juli 2026.',
    isi: `MAKASSAR - Ketua Mahkamah Agung Republik Indonesia, Prof. Dr. H. Sunarto, S.H., M.H., meresmikan operasional Pengadilan Militer Tinggi V Makassar yang dipusatkan di Gedung Pengadilan Tata Usaha Negara (PTUN) Makassar, Jalan Metro Tanjung Bunga Kompleks Mall Phinisi Point Makassar, Sulawesi Selatan pada Kamis, 9 Juli 2026.

Peresmian ini merupakan bentuk tindak lanjut dan implementasi nyata dari Peraturan Pemerintah Nomor 22 Tahun 2025 tentang Pembentukan Pengadilan Militer Tinggi IV Balikpapan dan Pengadilan Militer Tinggi V Makassar, serta Peraturan Pemerintah Nomor 23 Tahun 2025.

LIMA SATUAN KERJA BARU DIRESMIKAN SERENTAK:
Dalam momentum bersejarah tersebut, Ketua Mahkamah Agung RI meresmikan 5 (lima) satuan kerja peradilan militer baru secara serentak, yaitu:
1. Pengadilan Militer Tinggi V Makassar
2. Pengadilan Militer Tinggi IV Balikpapan
3. Pengadilan Militer I-03 Pekanbaru
4. Pengadilan Militer V-18 Kendari
5. Pengadilan Militer V-21 Manokwari

YURISDIKSI LUAS DI INDONESIA TIMUR:
Berdasarkan Pasal 2 ayat (2) PP No. 22 Tahun 2025, daerah hukum Pengadilan Militer Tinggi V Makassar mencakup 12 (dua belas) provinsi di Indonesia Timur, yaitu: Provinsi Sulawesi Utara, Gorontalo, Sulawesi Tengah, Sulawesi Barat, Sulawesi Tenggara, Sulawesi Selatan, Maluku Utara, Maluku, Papua Barat Daya, Papua Barat, Papua Tengah, Papua Pegunungan, Papua, dan Papua Selatan.

Gedung kantor Pengadilan Militer Tinggi V Makassar berlokasi di Jl. Perintis Kemerdekaan KM. 13, Kel. Daya, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan 90243, dengan email resmi dilmiti5makassar@gmail.com.

Dengan diresmikannya operasional ini, Pengadilan Militer Tinggi V Makassar siap menyelenggarakan peradilan militer tingkat banding dan sengketa tata usaha militer yang agung, berkeadilan, dan modern bagi prajurit TNI serta pencari keadilan.`,
    ekorBerita: 'Operasional satker baru ini didukung penuh fasilitas modern dan sistem peradilan militer elektronik.',
    gambarUrl: '/images/makassar_court_banner_1789442426023.jpg',
    views: '1420',
    isFeatured: false,
    comments: [
      {
        id: 'cmt-seed-1',
        authorName: 'Kapten Inf Andi Baso Pallawa, S.T.Han.',
        authorRole: 'Prajurit TNI AD (Kodam XIV/Hasanuddin)',
        content: 'Selamat atas diresmikannya operasional Pengadilan Militer Tinggi V Makassar. Kehadiran satker banding di Makassar sangat memudahkan akses keadilan dan koordinasi hukum bagi satuan di wilayah Indonesia Timur.',
        createdAt: '10 Jul 2026 • 09:15 WITA'
      },
      {
        id: 'cmt-seed-2',
        authorName: 'M. Ramli Syam, S.H., M.H.',
        authorRole: 'Advokat & Praktisi Hukum',
        content: 'Apresiasi tinggi atas transparansi informasi perkara dan layanan PTSP digital yang terintegrasi. Semoga terus mempertahankan predikat pelayanan prima.',
        createdAt: '12 Jul 2026 • 14:20 WITA'
      }
    ]
  }
];

export const INITIAL_DIP: DIPItem[] = [
  {
    id: 'dip-pp-22-2025',
    no: 1,
    namaInformasi: 'Salinan Peraturan Pemerintah Nomor 22 Tahun 2025 tentang Pembentukan Dilmilti IV Balikpapan & Dilmilti V Makassar',
    ringkasan: 'Peraturan Pemerintah Republik Indonesia Nomor 22 Tahun 2025 tentang Pembentukan Pengadilan Militer Tinggi IV Balikpapan dan Pengadilan Militer Tinggi V Makassar.',
    unitKerja: 'PPID Utama Dilmilti V Makassar',
    penanggungJawab: 'Pejabat Pengelola Informasi & Dokumentasi (PPID)',
    waktuTempat: 'Jakarta / Makassar, 2025/2026',
    bentukTersedia: 'Elektronik (PDF)',
    retensiAktif: '5 Tahun',
    retensiInaktif: '10 Tahun',
    kategori: 'Serta Merta',
    ukuranFile: '2.4 MB',
    downloadUrl: 'https://dilmilti5-makassar.go.id/dokumen/PP_Nomor_22_Tahun_2025.pdf',
    fileUrl: 'https://dilmilti5-makassar.go.id/dokumen/PP_Nomor_22_Tahun_2025.pdf',
    fileName: 'PP_Nomor_22_Tahun_2025.pdf'
  }
];

export const SAMPLE_NEWS_ITEMS = INITIAL_NEWS;
export const SAMPLE_DIP_ITEMS = INITIAL_DIP;
