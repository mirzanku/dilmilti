export type RegulatoryCategory =
  | 'UNDANG_UNDANG'
  | 'PERMA'
  | 'SEMA'
  | 'SK_KMA'
  | 'SK_SEKMA'
  | 'SK_DIRJEN'
  | 'PEDOMAN_TEKNIS';

export interface RegulatoryArticle {
  pasal: string;
  judul?: string;
  isi: string;
}

export interface RegulatoryDocument {
  id: string;
  category: RegulatoryCategory;
  categoryLabel: string;
  nomor: string;
  tentang: string;
  tahun: number;
  status: string;
  ringkasan: string;
  substansiPenting: string[];
  pasalPasalKunci: RegulatoryArticle[];
  tautanResmi: string;
  kataKunci: string[];
}

export interface RegulatorySearchResult {
  document: RegulatoryDocument;
  score: number;
  matchedKeywords: string[];
  matchedArticles: RegulatoryArticle[];
}

export const REGULATORY_DATABASE: RegulatoryDocument[] = [
  // 1. SK KMA 159/2026 - Buku II Pedoman Teknis Administrasi & Pembinaan Peradilan Militer
  {
    id: 'reg-sk-kma-159-2026',
    category: 'SK_KMA',
    categoryLabel: 'Keputusan Ketua Mahkamah Agung RI',
    nomor: 'SK KMA Nomor 159/KMA/SK.HK2/VIII/2026',
    tentang: 'Buku II Pedoman Teknis Administrasi dan Pola Pembinaan Peradilan Militer',
    tahun: 2026,
    status: 'Berlaku',
    ringkasan: 'Pedoman teknis komprehensif Mahkamah Agung RI untuk administrasi peradilan militer tingkat pertama dan tingkat banding, memuat 29 komponen sistematika putusan, susunan berkas Bundel A & B, integrasi e-Berpadu & e-Simpan, batas waktu penahanan banding, serta prosedur Inzage.',
    substansiPenting: [
      '29 Komponen Sistematika Baku Putusan Pengadilan Militer Tinggi (Lampiran III).',
      'Susunan berkas Bundel A (24 dokumen perkara penyidik & penuntut) dan Bundel B (11 dokumen upaya hukum banding).',
      'Pelimpahan berkas perkara secara elektronik melalui e-Berpadu dan verifikasi Meja PTSP Kepaniteraan.',
      'Kewenangan penahanan tingkat banding: Ketua Majelis 30 hari, perpanjangan Kepala Pengadilan maks. 60 hari (total 90 hari). Penetapan status tahanan wajib dibuat dalam 3 hari.',
      'Prosedur hak mempelajari berkas perkara (Inzage) selama 7 hari kalender sebelum berkas dikirim.',
      'Standar One Day Publish dan penyelesaian minutasi putusan perkara selambat-lambatnya 14 hari kalender.',
      'Ketentuan pendampingan Penasihat Hukum: wajib bagi tindak pidana berancaman pidana mati atau >= 15 tahun penjara.'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Lampiran III Bab I',
        judul: 'Sistematika Putusan 29 Komponen',
        isi: 'Putusan Pengadilan Militer Tinggi wajib memuat 29 komponen baku, mulai dari nomor e-register SIPP, irah-irah Demi Keadilan Berdasarkan Ketuhanan Yang Maha Esa, riwayat penahanan, pertimbangan fakta hukum, kualifikasi tindak pidana, status barang bukti, hingga pembebanan biaya perkara.'
      },
      {
        pasal: 'Lampiran III Bab II',
        judul: 'Susunan Berkas Bundel A & B',
        isi: 'Bundel A memuat seluruh dokumen proses penyidikan dan persidangan tingkat pertama. Bundel B memuat Akta Permohonan Banding (maksimal 7 hari), Akta Pemberitahuan, Memori Banding (wajib bagi Oditur Militer), Kontra Memori, dan Surat Inzage.'
      },
      {
        pasal: 'Lampiran III Bab IV',
        judul: 'Penahanan & Pembantaran (Stuiting)',
        isi: 'Kewenangan penahanan beralih ke Pengadilan Militer Tinggi sejak permohonan banding diajukan. Penangguhan penahanan wajib menyertakan surat jaminan Papera. Pembantaran (Stuiting) berlaku bagi Terdakwa yang dirawat inap di rumah sakit berdasarkan surat keterangan dokter militer.'
      }
    ],
    tautanResmi: 'https://jdih.mahkamahagung.go.id',
    kataKunci: ['buku ii', 'sk kma 159', '159/kma/sk.hk2/viii/2026', 'sistematika putusan', 'bundel a', 'bundel b', 'inzage', 'penahanan banding', 'stuiting', 'pembantaran', 'e-berpadu', 'e-simpan', 'minutasi', 'one day publish']
  },

  // 2. PERMA 7/2022 jo PERMA 1/2019 - e-Court & e-Litigation
  {
    id: 'reg-perma-7-2022',
    category: 'PERMA',
    categoryLabel: 'Peraturan Mahkamah Agung RI',
    nomor: 'PERMA Nomor 7 Tahun 2022 jo. PERMA Nomor 1 Tahun 2019',
    tentang: 'Administrasi Perkara dan Persidangan di Pengadilan Secara Elektronik (e-Court & e-Litigation)',
    tahun: 2022,
    status: 'Berlaku',
    ringkasan: 'Regulasi induk modernisasi peradilan Mahkamah Agung RI yang mengatur penyelenggaraan peradilan digital: pendaftaran perkara online (e-Filing), pembayaran panjar elektronik (e-Payment), pemanggilan pihak (e-Summons), dan persidangan online (e-Litigation).',
    substansiPenting: [
      'Pendaftaran perkara gugatan STUM, permohonan, dan upaya hukum secara online di https://ecourt.mahkamahagung.go.id.',
      'Penerbitan nomor Virtual Account bank pemerintah (Bank Persepsi) secara otomatis melalui sistem e-SKUM.',
      'Penyampaian dokumen persidangan (gugatan, jawaban, replik, duplik, kesimpulan, dan bukti surat) secara elektronik.',
      'Pengucapan putusan/penetapan secara elektronik yang sah dan berkekuatan hukum mengikat.',
      'Berlaku bagi Pengguna Terdaftar (Advokat/Perwira Hukum Babinkum) dan Pengguna Lainnya (Perorangan/Prajurit).'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Pasal 1 Angka 6 & 7',
        judul: 'e-Filing & e-Payment',
        isi: 'Pengguna dapat mengunggah berkas permohonan atau gugatan dan menyelesaikan panjar biaya perkara secara mandiri melalui saluran pembayaran perbankan resmi mitra Mahkamah Agung.'
      },
      {
        pasal: 'Pasal 20 & 22',
        judul: 'e-Litigation & Putusan Elektronik',
        isi: 'Persidangan elektronik dilakukan atas persetujuan para pihak; putusan yang diucapkan secara elektronik dituangkan dalam bentuk salinan digital bertanda tangan elektronik dan berkekuatan hukum tetap.'
      }
    ],
    tautanResmi: 'https://ecourt.mahkamahagung.go.id',
    kataKunci: ['perma 7 tahun 2022', 'perma 1 tahun 2019', 'e-court', 'ecourt', 'e-litigation', 'e-filing', 'e-payment', 'e-summons', 'panjar perkara online', 'virtual account']
  },

  // 3. PERMA 1/2014 - Layanan Posbakum & Sidang Prodeo
  {
    id: 'reg-perma-1-2014',
    category: 'PERMA',
    categoryLabel: 'Peraturan Mahkamah Agung RI',
    nomor: 'PERMA Nomor 1 Tahun 2014',
    tentang: 'Pedoman Pemberian Layanan Hukum bagi Masyarakat Tidak Mampu di Pengadilan',
    tahun: 2014,
    status: 'Berlaku',
    ringkasan: 'Pedoman Mahkamah Agung RI untuk menjamin akses keadilan bagi masyarakat miskin dan prajurit berpenghasilan rendah melalui Pos Bantuan Hukum (Posbakum) cuma-cuma (Rp 0), Sidang di Luar Gedung Pengadilan, dan Pembebasan Biaya Perkara (Prodeo).',
    substansiPenting: [
      'Layanan Posbakum diberikan tanpa dipungut biaya apapun (Rp 0) di Meja PTSP Pengadilan.',
      'Layanan mencakup pemberian informasi, advis hukum, konsultasi, dan pembuatan dokumen hukum (seperti memori banding dan gugatan STUM).',
      'Syarat permohonan Sidang Prodeo: Surat Keterangan Tidak Mampu (SKTM) dari Lurah/Desa atau Surat Keterangan tidak mampu dari Komandan Satuan prajurit.',
      'Biaya perkara prodeo ditanggung oleh DIPA 05 Pengadilan Militer Tinggi V Makassar.'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Pasal 7 & 8',
        judul: 'Pembebasan Biaya Perkara (Prodeo)',
        isi: 'Setiap orang atau sekelompok orang yang tidak mampu secara ekonomi berhak memperoleh pembebasan biaya perkara dengan melampirkan SKTM atau surat keterangan resmi dari instansi terkait.'
      },
      {
        pasal: 'Pasal 22',
        judul: 'Layanan Pos Bantuan Hukum (Posbakum)',
        isi: 'Posbakum pengadilan memberikan layanan konsultasi hukum cuma-cuma, bantuan pembuatan dokumen hukum, serta rujukan advokat atau lembaga bantuan hukum.'
      }
    ],
    tautanResmi: 'https://jdih.mahkamahagung.go.id',
    kataKunci: ['perma 1 tahun 2014', 'posbakum', 'bantuan hukum gratis', 'prodeo', 'pembebasan biaya', 'sktm', 'cuma-cuma', 'masyarakat tidak mampu']
  },

  // 4. PERMA 9/2016 - SIWAS MA-RI & Whistleblowing System
  {
    id: 'reg-perma-9-2016',
    category: 'PERMA',
    categoryLabel: 'Peraturan Mahkamah Agung RI',
    nomor: 'PERMA Nomor 9 Tahun 2016',
    tentang: 'Pedoman Penanganan Pengaduan (Whistleblowing System) di Mahkamah Agung dan Badan Peradilan yang Berada di Bawahnya',
    tahun: 2016,
    status: 'Berlaku',
    ringkasan: 'Ketentuan resmi penanganan laporan dugaan pelanggaran kode etik, perilaku hakim, penyalahgunaan wewenang, dan pungutan liar melalui kanal aplikasi SIWAS Mahkamah Agung RI dengan jaminan perlindungan identitas pelapor.',
    substansiPenting: [
      'Mekanisme pelaporan pelanggaran etika dan disiplin aparatur pengadilan secara online di https://siwas.mahkamahagung.go.id.',
      'Identitas pelapor (Whistleblower) dijamin kerahasiaannya 100% dan dilindungi secara hukum.',
      'Laporan wajib ditindaklanjuti oleh Badan Pengawasan Mahkamah Agung RI (Bawas MA-RI).',
      'Mendukung pembangunan Zona Integritas menuju Wilayah Bebas dari Korupsi (WBK) dan WBBM.'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Pasal 3 & 4',
        judul: 'Kerahasiaan Identitas Pelapor',
        isi: 'Pejabat pengelola pengaduan wajib merahasiakan identitas pelapor dan isi pengaduan, kecuali pelapor secara tertulis menyatakan tidak keberatan identitasnya diungkapkan.'
      },
      {
        pasal: 'Pasal 10',
        judul: 'Tindak Lanjut & Verifikasi Bawas MA-RI',
        isi: 'Pengaduan yang memenuhi syarat bukti awal diperiksa oleh tim pemeriksa Badan Pengawasan MA-RI dalam batas waktu paling lambat 14 hari kerja.'
      }
    ],
    tautanResmi: 'https://siwas.mahkamahagung.go.id',
    kataKunci: ['perma 9 tahun 2016', 'siwas', 'pengaduan', 'whistleblowing', 'kode etik hakim', 'pungli', 'gratifikasi', 'perlindungan pelapor', 'bawas ma']
  },

  // 5. PERMA 7 & 8 Tahun 2016 - Disiplin Kerja & Pengawasan Atasan Langsung
  {
    id: 'reg-perma-7-8-2016',
    category: 'PERMA',
    categoryLabel: 'Peraturan Mahkamah Agung RI',
    nomor: 'PERMA Nomor 7 & 8 Tahun 2016',
    tentang: 'Penegakan Disiplin Kerja Hakim dan Pembinaan Pengawasan Melekat Atasan Langsung',
    tahun: 2016,
    status: 'Berlaku',
    ringkasan: 'Ketentuan kedisiplinan kerja hakim militer dan aparatur peradilan serta kewajiban pengawasan melekat oleh atasan langsung (Kadilmilti dan Panitera/Sekretaris) untuk mencegah pelanggaran.',
    substansiPenting: [
      'Kewajiban kepatuhan jam kerja, integritas putusan, dan larangan menerima gratifikasi dalam bentuk apapun.',
      'Tanggung jawab renteng atasan langsung jika lalai melakukan pengawasan terhadap staf di bawahnya.',
      'Sanksi disiplin bertingkat mulai dari teguran tertulis hingga usulan pemberhentian tidak dengan hormat.'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Pasal 2 PERMA 8/2016',
        judul: 'Pengawasan Melekat',
        isi: 'Setiap pimpinan satuan kerja wajib menyelenggarakan pengawasan berkala dan berkelanjutan terhadap pelaksanaan tugas bawahannya.'
      }
    ],
    tautanResmi: 'https://jdih.mahkamahagung.go.id',
    kataKunci: ['perma 7 tahun 2016', 'perma 8 tahun 2016', 'disiplin hakim', 'pengawasan melekat', 'zero gratifikasi', 'integritas aparatur']
  },

  // 6. SK KMA 2-144/2022 - Standar Pelayanan Informasi Publik (PPID)
  {
    id: 'reg-sk-kma-2-144-2022',
    category: 'SK_KMA',
    categoryLabel: 'Keputusan Ketua Mahkamah Agung RI',
    nomor: 'SK KMA Nomor 2-144/KMA/SK/VIII/2022',
    tentang: 'Standar Pelayanan Informasi Publik di Pengadilan',
    tahun: 2022,
    status: 'Berlaku',
    ringkasan: 'Standardisasi keterbukaan informasi publik peradilan di bawah Mahkamah Agung RI, membagi informasi menjadi 4 kategori (serta merta, berkala, tersedia setiap saat, dan dikecualikan), serta menetapkan SLA respon permohonan maksimal 10+7 hari kerja.',
    substansiPenting: [
      'Klasifikasi Daftar Informasi Publik (DIP) Pengadilan Militer Tinggi V Makassar.',
      'Informasi yang wajib diumumkan berkala: profil pengadilan, anggaran DIPA, laporan kinerja SAKIP, jadwal sidang, dan putusan berkekuatan hukum tetap.',
      'SLA pelayanan: PPID wajib menanggapi permohonan informasi dalam waktu 10 (sepuluh) hari kerja, dapat diperpanjang 7 (tujuh) hari kerja dengan pemberitahuan tertulis.',
      'Uji Konsekuensi bagi informasi yang dikecualikan (seperti rahasia musyawarah majelis hakim dan identitas anak/korban kesusilaan).'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Lampiran I Bab III',
        judul: 'Jangka Waktu Pelayanan Informasi',
        isi: 'PPID Pengadilan wajib menyampaikan pemberitahuan tertulis atas permohonan informasi selambat-lambatnya 10 hari kerja terhitung sejak diterimanya permohonan.'
      },
      {
        pasal: 'Lampiran I Bab IV',
        judul: 'Pengaburan Informasi (Anonimisasi)',
        isi: 'Dalam hal salinan putusan dipublikasikan kepada publik, pengadilan wajib melakukan pengaburan identitas korban kejahatan seksual, saksi terlindung, dan anak yang berkonflik dengan hukum.'
      }
    ],
    tautanResmi: 'https://eppid.mahkamahagung.go.id',
    kataKunci: ['sk kma 2-144', '2-144/kma/sk/viii/2022', 'ppid', 'informasi publik', 'uji konsekuensi', 'daftar informasi publik', 'dip', 'sla permohonan']
  },

  // 7. SK KMA 026/2012 - Standar Pelayanan Peradilan (PTSP)
  {
    id: 'reg-sk-kma-026-2012',
    category: 'SK_KMA',
    categoryLabel: 'Keputusan Ketua Mahkamah Agung RI',
    nomor: 'SK KMA Nomor 026/KMA/SK/II/2012',
    tentang: 'Standar Pelayanan Peradilan pada Pengadilan',
    tahun: 2012,
    status: 'Berlaku',
    ringkasan: 'Pedoman baku pelayanan pengadilan kepada masyarakat pencari keadilan pada meja Pelayanan Terpadu Satu Pintu (PTSP), mencakup Meja Pidana, Meja Hukum/PPID, Meja Umum/Surat, dan Meja Pengaduan.',
    substansiPenting: [
      'Penyelenggaraan meja PTSP terintegrasi dengan petugas yang berkompeten dan ramah (3S: Senyum, Salam, Sapa).',
      'Transparansi biaya perkara dan jadwal sidang.',
      'Penyediaan fasilitas ramah disabilitas (kursi roda, jalur pemandu, media braille, dan formulir audio).'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Bagian B',
        judul: 'Pelayanan Perkara Tingkat Banding',
        isi: 'Pengadilan tingkat banding berkewajiban memberikan kepastian informasi proses penelaahan berkas banding kepada pemohon atau kuasanya melalui Meja PTSP atau saluran elektronik.'
      }
    ],
    tautanResmi: 'https://jdih.mahkamahagung.go.id',
    kataKunci: ['sk kma 026', 'ptsp', 'standar pelayanan peradilan', 'meja pidana', 'meja hukum', 'disabilitas', '3s']
  },

  // 8. SK Dirjen Badilmiltun 593/2026 - Standardisasi Website Satker
  {
    id: 'reg-sk-dirjen-593-2026',
    category: 'SK_DIRJEN',
    categoryLabel: 'SK Direktur Jenderal Badilmiltun MA-RI',
    nomor: 'SK Dirjen Badilmiltun Nomor 593/DJMT/SK.TI2.1.1/VII/2026',
    tentang: 'Pedoman Standardisasi Website Pengadilan Tingkat Banding dan Tingkat Pertama di Lingkungan Peradilan Militer dan Peradilan Tata Usaha Negara',
    tahun: 2026,
    status: 'Berlaku',
    ringkasan: 'Pedoman resmi arsitektur antarmuka, navigasi menu, transparansi data, dan integrasi digital website satuan kerja di bawah Ditjen Badilmiltun Mahkamah Agung RI.',
    substansiPenting: [
      'Wajib memuat informasi profil resmi, dasar pembentukan satker (PP 22/2025), wilayah yurisdiksi, dan pimpinan.',
      'Wajib terintegrasi dengan SIPP, e-Court, Direktori Putusan, SIWAS, dan SP4N-LAPOR!.',
      'Penyediaan asisten virtual cerdas (PETA DILMILTI) untuk kemudahan akses informasi publik 24 jam nonstop.',
      'Kepatuhan atas standar aksesibilitas digital dan keamanan data nasional.'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Diktum Kedua',
        judul: 'Kewajiban Implementasi Standarisasi Website',
        isi: 'Seluruh satuan kerja pengadilan tingkat banding dan tingkat pertama di lingkungan Badilmiltun wajib menyesuaikan struktur menu, konten publikasi, dan keterhubungan layanan elektronik sesuai lampiran pedoman.'
      }
    ],
    tautanResmi: 'https://badilmiltun.mahkamahagung.go.id',
    kataKunci: ['sk dirjen badilmiltun 593', '593/djmt/sk.ti2.1.1/vii/2026', 'standardisasi website', 'peta dilmilti', 'badilmiltun', 'menu website']
  },

  // 9. UU 31 Tahun 1997 - Peradilan Militer
  {
    id: 'reg-uu-31-1997',
    category: 'UNDANG_UNDANG',
    categoryLabel: 'Undang-Undang Republik Indonesia',
    nomor: 'Undang-Undang Nomor 31 Tahun 1997',
    tentang: 'Peradilan Militer',
    tahun: 1997,
    status: 'Berlaku (Hukum Organik & Acara Peradilan Militer)',
    ringkasan: 'Undang-Undang organik fundamental yang mengatur susunan badan peradilan militer, kekuasaan mengadili tindak pidana keprajuritan, wewenang penuntutan Oditurat Militer, wewenang Papera dan Ankum, hukum acara pidana militer (penyelidikan, penahanan, persidangan, pembuktian), upaya hukum banding ke Pengadilan Militer Tinggi (7 hari), kasasi ke Mahkamah Agung RI (14 hari), peninjauan kembali (PK), sengketa Tata Usaha Militer (STUM), serta eksekusi putusan berkekuatan hukum tetap.',
    substansiPenting: [
      'Pasal 1 & 9: Yurisdiksi absolut peradilan militer atas tindak pidana yang dilakukan oleh prajurit TNI (AD, AL, AU), yang dipersamakan dengan prajurit, dan anggota golongan yang dipersamakan dengan prajurit berdasarkan undang-undang.',
      'Pasal 12 & 40-45: Struktur hierarki badan peradilan militer (Pengadilan Militer, Pengadilan Militer Tinggi, Pengadilan Militer Utama, Pengadilan Militer Pertempuran).',
      'Pasal 40: Pengadilan Militer (Dilmil) mengadili pada tingkat pertama perkara dengan Terdakwa berpangkat Kapten ke bawah.',
      'Pasal 41 & 42: Pengadilan Militer Tinggi (Dilmilti) mengadili pada tingkat pertama perkara dengan Terdakwa berpangkat Mayor ke atas (Pamen & Pati), memutus pada tingkat banding perkara dari Dilmil, serta memeriksa sengketa kewenangan mengadili.',
      'Pasal 46-60: Susunan dan fungsi Oditurat Militer (Otmil, Otmilti, Otjen, Otmilpur) sebagai badan penuntut umum militer dan pelaksana putusan hakim.',
      'Pasal 69-84: Wewenang penyidikan Polisi Militer, penangkapan (maks. 1 hari/20 hari) dan penahanan bertingkat oleh Atasan Yang Berhak Menghukum (Ankum) dan Perwira Penyerah Perkara (Papera).',
      'Pasal 122-124: Penyelesaian berkas perkara oleh Papera melalui Surat Keputusan Penyerahan Perkara (SKEP Pera) atau penyelesaian menurut hukum disiplin prajurit.',
      'Pasal 137-219: Hukum acara pidana militer di persidangan (acara biasa, acara cepat, acara singkat, pembuktian dengan minimal 2 alat bukti sah, dan penjatuhan putusan).',
      'Pasal 225-243: Upaya hukum banding: tenggang waktu permohonan banding 7 (tujuh) hari kalender, penyerahan memori banding, hak Inzage, dan pemeriksaan berkas oleh Pengadilan Militer Tinggi.',
      'Pasal 244-258: Upaya hukum Kasasi ke Mahkamah Agung RI diajukan dalam tenggang waktu 14 (empat belas) hari kalender sesudah putusan diberitahukan.',
      'Pasal 259-267: Upaya hukum luar biasa Peninjauan Kembali (PK) ke Mahkamah Agung atas putusan berkekuatan hukum tetap (BHT).',
      'Pasal 268-335: Hukum acara Sengketa Tata Usaha Militer (STUM) atas Keputusan Tata Usaha Angkatan Bersenjata (KTUAB) dengan tenggang waktu gugatan 90 hari kalender.',
      'Pasal 336-340: Pelaksanaan putusan (eksekusi pidana pokok, pidana tambahan pemecatan, denda, ganti rugi) oleh Oditur Militer setelah berkekuatan hukum tetap serta permohonan Grasi kepada Presiden.'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Pasal 1 Angka 1-7',
        judul: 'Ketentuan Umum Lembaga & Pejabat Militer',
        isi: 'Peradilan Militer adalah pelaksana kekuasaan kehakiman di lingkungan Angkatan Bersenjata. Oditurat adalah badan pelaksana kekuasaan pemerintahan negara di bidang penuntutan dan penyidikan di lingkungan Angkatan Bersenjata. Ankum adalah atasan yang diberi wewenang menjatuhkan hukuman disiplin. Papera adalah perwira yang berwenang menyerahkan perkara kepada pengadilan.'
      },
      {
        pasal: 'Pasal 9',
        judul: 'Kewenangan Absolut Peradilan Militer',
        isi: 'Pengadilan dalam lingkungan peradilan militer mengadili tindak pidana yang dilakukan oleh seseorang yang pada waktu melakukan tindak pidana adalah prajurit TNI, yang berdasarkan undang-undang dipersamakan dengan prajurit, anggota jawatan/golongan yang dipersamakan, atau orang yang atas penetapan Panglima harus diadili oleh Pengadilan Militer.'
      },
      {
        pasal: 'Pasal 41 & 42',
        judul: 'Kewenangan Pengadilan Militer Tinggi',
        isi: 'Pengadilan Militer Tinggi mengadili pada tingkat pertama tindak pidana oleh prajurit berpangkat Mayor ke atas (Pamen dan Pati), mengadili pada tingkat banding perkara dari Pengadilan Militer di daerah hukumnya, dan memutus pada tingkat pertama dan terakhir sengketa kewenangan mengadili antar-Pengadilan Militer.'
      },
      {
        pasal: 'Pasal 75 - 84',
        judul: 'Wewenang Penangkapan dan Penahanan',
        isi: 'Perintah penangkapan dilakukan untuk paling lama 1 (satu) hari. Penahanan dapat dilakukan oleh Ankum paling lama 20 hari, perpanjangan oleh Papera sampai dengan 180 hari (Tahap I s.d. VI), serta penahanan oleh Hakim Ketua Majelis di pengadilan.'
      },
      {
        pasal: 'Pasal 122 - 124',
        judul: 'Penyerahan Perkara oleh Papera (SKEP Pera)',
        isi: 'Setelah menerima berkas perkara dari Oditur Militer, Papera mengambil keputusan untuk: (a) menyerahkan perkara kepada Pengadilan Militer atau Pengadilan Militer Tinggi dengan Surat Keputusan Penyerahan Perkara; (b) menyelesaikan perkara menurut hukum disiplin militer; atau (c) menutup perkara demi kepentingan hukum atau kepentingan umum/militer.'
      },
      {
        pasal: 'Pasal 225',
        judul: 'Tenggang Waktu Permohonan Banding (7 Hari)',
        isi: 'Permohonan banding dapat diajukan oleh Terdakwa atau Oditur Militer dalam tenggang waktu 7 (tujuh) hari kalender sesudah putusan diucapkan, atau 7 hari sesudah putusan diberitahukan kepada Terdakwa yang tidak hadir dalam sidang pengucapan putusan.'
      },
      {
        pasal: 'Pasal 227 - 230',
        judul: 'Akta Banding, Memori Banding & Inzage',
        isi: 'Panitera membuat akta permohonan banding dan memberitahukannya kepada pihak lawan. Pemohon berhak menyerahkan memori banding. Para pihak diberi kesempatan mempelajari berkas perkara (Inzage) di kepaniteraan sebelum berkas dikirim ke Pengadilan Militer Tinggi.'
      },
      {
        pasal: 'Pasal 244 & 246',
        judul: 'Tenggang Waktu Permohonan Kasasi MA-RI (14 Hari)',
        isi: 'Permohonan kasasi ke Mahkamah Agung diajukan oleh pemohon kasasi dalam tenggang waktu 14 (empat belas) hari sesudah putusan pengadilan diberitahukan kepada Terdakwa atau Oditur Militer, wajib disertai memori kasasi dalam tenggang waktu 14 hari sesudah permohonan diajukan.'
      },
      {
        pasal: 'Pasal 259',
        judul: 'Upaya Hukum Luar Biasa Peninjauan Kembali (PK)',
        isi: 'Terhadap putusan pengadilan yang telah memperoleh kekuatan hukum tetap, terpidana atau ahli warisnya dapat mengajukan permintaan peninjauan kembali kepada Mahkamah Agung atas dasar adanya novum (keadaan baru), kekhilafan hakim, atau pertentangan putusan.'
      },
      {
        pasal: 'Pasal 268 & 273',
        judul: 'Sengketa Tata Usaha Militer & Tenggang Gugatan 90 Hari',
        isi: 'Sengketa Tata Usaha Militer adalah sengketa yang timbul dalam bidang Tata Usaha Angkatan Bersenjata antara seseorang atau badan hukum perdata dengan Pejabat Tata Usaha Militer sebagai akibat dikeluarkannya Keputusan Tata Usaha Angkatan Bersenjata (KTUAB). Gugatan diajukan dalam tenggang waktu 90 (sembilan puluh) hari terhitung sejak diterimanya KTUAB.'
      },
      {
        pasal: 'Pasal 336',
        judul: 'Pelaksanaan Putusan (Eksekusi oleh Oditur)',
        isi: 'Pelaksanaan putusan pengadilan yang telah memperoleh kekuatan hukum tetap dilakukan oleh Oditur Militer, untuk itu Panitera mengirimkan salinan putusan kepada Oditur Militer yang bersangkutan.'
      }
    ],
    tautanResmi: 'https://jdihn.go.id',
    kataKunci: [
      'uu 31 tahun 1997',
      'uu no 31 tahun 1997',
      'uu peradilan militer',
      'undang-undang peradilan militer',
      'pasal 1 uu 31',
      'pasal 9 uu 31',
      'pasal 40 uu 31',
      'pasal 41 uu 31',
      'pasal 42 uu 31',
      'pasal 75 uu 31',
      'pasal 122 uu 31',
      'pasal 225 uu 31',
      'pasal 244 uu 31',
      'pasal 259 uu 31',
      'pasal 268 uu 31',
      'pasal 336 uu 31',
      'tenggang waktu banding',
      'banding 7 hari',
      'kasasi 14 hari',
      'peninjauan kembali',
      'stum',
      'sengketa tata usaha militer',
      'ktuab',
      'oditurat militer',
      'otmil',
      'otmilti',
      'dilmilti',
      'dilmil',
      'papera',
      'ankum',
      'skep pera',
      'hukum acara pidana militer',
      'eksekusi putusan militer'
    ]
  },

  // 10. Kitab Undang-Undang Hukum Pidana Militer (KUHDPM)
  {
    id: 'reg-kuhdpm',
    category: 'UNDANG_UNDANG',
    categoryLabel: 'Kitab Undang-Undang Hukum Pidana Militer',
    nomor: 'KUHDPM (Kitab Undang-Undang Hukum Pidana Militer)',
    tentang: 'Ketentuan Pidana Khusus Militer',
    tahun: 1934,
    status: 'Berlaku (Lex Specialis)',
    ringkasan: 'Kodifikasi hukum pidana materiil khusus militer yang mengatur tindak pidana murni keprajuritan, pidana pokok, pidana tambahan pemecatan (PDTH), serta delik desersi dan insubordinasi.',
    substansiPenting: [
      'Pasal 6: Pidana tambahan khas militer meliputi Penurunan Pangkat dan Pemecatan dari Dinas Militer (PDTH).',
      'Pasal 87: Unsur tindak pidana Desersi: meninggalkan dinas militer tanpa izin pada masa damai >30 hari berturut-turut, diancam pidana penjara maks. 2 tahun 8 bulan serta lazim dipecat.',
      'Pasal 103: Pelanggaran perintah dinas atau penolakan mematuhi perintah atasan yang sah.',
      'Pasal 106 & 107: Tindak pidana insubordinasi dengan kekerasan atau ancaman kekerasan terhadap atasan.'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Pasal 87 ayat (1) ke-2',
        judul: 'Desersi Masa Damai Melebihi 30 Hari',
        isi: 'Diancam karena desersi dengan pidana penjara paling lama dua tahun delapan bulan, militer yang pergi dengan maksud melepaskan diri dari dinas atau dalam waktu damai tanpa izin pergi lebih dari tiga puluh hari berturut-turut.'
      }
    ],
    tautanResmi: 'https://jdihn.go.id',
    kataKunci: ['kuhdpm', 'kuhpm', 'pasal 87', 'desersi', 'insubordinasi', 'pemecatan dari dinas', 'pdth', 'pidana militer murni']
  },

  // 11. UU 48/2009 - Kekuasaan Kehakiman
  {
    id: 'reg-uu-48-2009',
    category: 'UNDANG_UNDANG',
    categoryLabel: 'Undang-Undang Republik Indonesia',
    nomor: 'Undang-Undang Nomor 48 Tahun 2009',
    tentang: 'Kekuasaan Kehakiman',
    tahun: 2009,
    status: 'Berlaku',
    ringkasan: 'Undang-Undang pokok yang mengatur kekuasaan kehakiman di Indonesia, independensi badan peradilan, asas peradilan cepat sederhana berbiaya ringan, dan perlakuan sama di depan hukum.',
    substansiPenting: [
      'Pasal 2: Asas peradilan dilakukan Demi Keadilan Berdasarkan Ketuhanan Yang Maha Esa, cepat, sederhana, dan berbiaya ringan.',
      'Pasal 4: Pengadilan mengadili menurut hukum dengan tidak membeda-bedakan orang (Equality Before the Law).',
      'Pasal 24: Hak Terdakwa didampingi penasihat hukum sejak penyelidikan hingga putusan berkekuatan hukum tetap.',
      'Pasal 56 & 57: Kewajiban pengadilan menyediakan bantuan hukum cuma-cuma (Posbakum) bagi masyarakat tidak mampu.'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Pasal 2 ayat (4)',
        judul: 'Asas Peradilan Cepat, Sederhana & Biaya Ringan',
        isi: 'Peradilan dilakukan dengan sederhana, cepat, dan biaya ringan.'
      },
      {
        pasal: 'Pasal 56',
        judul: 'Bantuan Hukum Cuma-cuma',
        isi: 'Setiap orang yang tersangkut perkara berhak memperoleh bantuan hukum; pengadilan wajib menyediakan pos bantuan hukum bagi yang tidak mampu.'
      }
    ],
    tautanResmi: 'https://jdihn.go.id',
    kataKunci: ['uu 48 tahun 2009', 'kekuasaan kehakiman', 'asas peradilan', 'equality before the law', 'bantuan hukum', 'posbakum']
  },

  // 12. PP 22 Tahun 2025 - Pembentukan Dilmilti IV & Dilmilti V Makassar
  {
    id: 'reg-pp-22-2025',
    category: 'UNDANG_UNDANG',
    categoryLabel: 'Peraturan Pemerintah Republik Indonesia',
    nomor: 'Peraturan Pemerintah Nomor 22 Tahun 2025',
    tentang: 'Pembentukan Pengadilan Militer Tinggi IV Balikpapan dan Pengadilan Militer Tinggi V Makassar',
    tahun: 2025,
    status: 'Berlaku',
    ringkasan: 'Dasar hukum pendirian dan yurisdiksi resmi Pengadilan Militer Tinggi V Makassar mencakup 12 provinsi di kawasan Indonesia Timur, membawahi 6 Pengadilan Militer tingkat pertama.',
    substansiPenting: [
      'Pasal 2 ayat (2): Daerah hukum Pengadilan Militer Tinggi V Makassar meliputi 12 Provinsi di Indonesia Timur (Sulsel, Sulbar, Sultra, Sulteng, Sulut, Gorontalo, Maluku, Maluku Utara, Papua, Papua Barat, Papua Tengah, Papua Pegunungan, Papua Selatan, Papua Barat Daya).',
      'Membawahi 6 satuan kerja tingkat pertama: Dilmil V-17 Makassar, Dilmil V-18 Kendari, Dilmil V-19 Manado, Dilmil V-20 Ambon, Dilmil V-21 Manokwari, dan Dilmil V-22 Jayapura.',
      'Diresmikan operasionalnya oleh Ketua Mahkamah Agung RI pada 9 Juli 2026.'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Pasal 2 ayat (2)',
        judul: 'Wilayah Yurisdiksi 12 Provinsi Indonesia Timur',
        isi: 'Pengadilan Militer Tinggi V Makassar berkedudukan di Makassar dan daerah hukumnya meliputi 12 provinsi di Indonesia Timur serta membawahi 6 pengadilan militer tingkat pertama.'
      }
    ],
    tautanResmi: 'https://jdihn.go.id',
    kataKunci: ['pp 22 tahun 2025', 'pp no 22 tahun 2025', 'pembentukan dilmilti v makassar', 'daerah hukum 12 provinsi', 'satker baru 2026']
  },

  // 13. SEMA 1/2022 jo SEMA 3/2023 - Rumusan Pleno Kamar Mahkamah Agung RI (Kamar Militer)
  {
    id: 'reg-sema-pleno-kamar-militer',
    category: 'SEMA',
    categoryLabel: 'Surat Edaran Mahkamah Agung RI',
    nomor: 'SEMA Nomor 1 Tahun 2022 jo. SEMA Nomor 3 Tahun 2023',
    tentang: 'Rumusan Hukum Hasil Rapat Pleno Kamar Mahkamah Agung RI Sebagai Pedoman Pelaksanaan Tugas Bagi Pengadilan',
    tahun: 2023,
    status: 'Berlaku',
    ringkasan: 'Pedoman teknis yudisial hasil pleno kamar Mahkamah Agung RI, khususnya Kamar Militer dan Kamar Pidana: penanganan perkara desersi in absentia, penjatuhan pidana tambahan pemecatan dari dinas militer (PDTH), serta pembatasan kewenangan kasasi.',
    substansiPenting: [
      'Kamar Militer: Perkara desersi tanpa kehadiran Terdakwa (in absentia) dapat diputus dengan pidana tambahan pemecatan dari dinas militer apabila Terdakwa telah dipanggil secara sah dan patut minimal 3 (tiga) kali berturut-turut melalui kesatuannya.',
      'Penjatuhan pidana tambahan pemecatan wajib mempertimbangkan dampak terhadap disiplin kesatuan, riwayat kedinasan prajurit, dan rekomendasi Papera.',
      'Ketentuan kepatuhan terhadap asas peradilan cepat dan standardisasi penulisan pertimbangan hukum putusan banding militer.'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Rumusan Hukum Kamar Militer',
        judul: 'Pemeriksaan Perkara In Absentia & Pemecatan',
        isi: 'Pengadilan Militer berwenang memutus perkara desersi secara in absentia dan menjatuhkan pidana tambahan pemecatan dari dinas keprajuritan setelah pemanggilan sah melalui kesatuan tidak diindahkan.'
      }
    ],
    tautanResmi: 'https://jdih.mahkamahagung.go.id',
    kataKunci: ['sema 1 tahun 2022', 'sema 3 tahun 2023', 'rumusan pleno kamar', 'kamar militer ma', 'in absentia', 'pemecatan prajurit', 'pdth', 'pedoman teknis yudisial']
  },

  // 14. PERMA 8/2022 - Upaya Hukum Kasasi & PK Secara Elektronik
  {
    id: 'reg-perma-8-2022',
    category: 'PERMA',
    categoryLabel: 'Peraturan Mahkamah Agung RI',
    nomor: 'PERMA Nomor 8 Tahun 2022 jo. PERMA Nomor 6 Tahun 2022',
    tentang: 'Tata Cara Pemeriksaan Upaya Hukum Kasasi dan Peninjauan Kembali di Mahkamah Agung Secara Elektronik',
    tahun: 2022,
    status: 'Berlaku',
    ringkasan: 'Regulasi Mahkamah Agung RI mengenai digitalisasi transmisi berkas perkara kasasi dan peninjauan kembali dari pengadilan pengaju (termasuk Pengadilan Militer Tinggi) ke Mahkamah Agung RI secara paperless melalui sistem informasi terintegrasi.',
    substansiPenting: [
      'Pelimpahan berkas perkara kasasi/PK (Bundel A dan B) dilakukan secara digital terenkripsi.',
      'Penetapan tanda terima elektronik sebagai bukti resmi penerimaan berkas di Mahkamah Agung.',
      'Mempercepat proses registrasi dan penyelesaian minutasi perkara kasasi/PK di MA-RI.'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Pasal 4 & 5',
        judul: 'Pengiriman Berkas Elektronik ke MA-RI',
        isi: 'Pengadilan pengaju mengirimkan berkas permohonan kasasi atau peninjauan kembali dalam format dokumen elektronik yang telah diverifikasi keabsahannya.'
      }
    ],
    tautanResmi: 'https://jdih.mahkamahagung.go.id',
    kataKunci: ['perma 8 tahun 2022', 'perma 6 tahun 2022', 'kasasi elektronik', 'pk elektronik', 'berkas digital ma', 'sipermari']
  },
  // 13. SK Sekma 14106/SEK/SK.HM1.1/X/2026 - Pedoman Media Massa & Media Sosial
  {
    id: 'reg-sk-sekma-14106-2026',
    category: 'SK_SEKMA',
    categoryLabel: 'Keputusan Sekretaris Mahkamah Agung RI',
    nomor: 'SK Sekma Nomor 14106/SEK/SK.HM1.1/X/2026',
    tentang: 'Pedoman Pengelolaan Media Massa dan Media Sosial di Lingkungan Mahkamah Agung dan Badan Peradilan yang Berada di Bawahnya',
    tahun: 2026,
    status: 'Berlaku (Ditetapkan 9 Oktober 2026)',
    ringkasan: 'Regulasi resmi Mahkamah Agung RI yang mengatur secara komprehensif pedoman kehumasan, tata kelola media massa dan akun media sosial resmi pengadilan, alur verifikasi konten berjenjang, etika interaksi dan penanganan komentar, tata kelola pemanfaatan Kecerdasan Buatan (Artificial Intelligence) dengan prinsip Human-in-the-Loop, serta 11 Langkah Standar Operasional Prosedur (SOP) Publikasi Media Sosial.',
    substansiPenting: [
      'Struktur Tim Pengelola Media Massa & Medsos Pengadilan Tingkat Banding: Pembina (Hakim/Jubir), Penanggung Jawab (Sekretaris Pengadilan), Koordinator (Kepala Bagian), Tim Produksi Konten, Administrator Media Massa, dan Administrator Media Sosial.',
      'Ketentuan Penulisan Artikel: Wajib memenuhi 5W+1H, struktur Lead, Isi, dan Ekor berita. Artikel hukum minimal 2 referensi ilmiah dan 800-1500 kata.',
      'Tata Kelola Kecerdasan Buatan (AI) Bab K: Wajib Human-in-the-Loop, dilarang merekayasa logo resmi dan foto pimpinan/aparatur, wajib mencantumkan keterangan/watermark pada materi visual generatif AI, wajib mengaburkan wajah pihak/anak, dan larangan mutlak deepfake.',
      'SOP Publikasi Media Sosial 11 Tahapan (Lampiran II): Perencanaan (2h), Instruksi (1h), Konsep (1h), Bahan (1h), Produksi (3h), Penyuntingan (1h), Koreksi (2h), Persetujuan (1h), Posting (1h), Laporan (1h), Evaluasi (1h).',
      'Mekanisme Koreksi & Ralat Transparan (Bab H): Pencantuman ralat/koreksi di akhir konten serta penyandingan informasi sebelum vs sesudah.',
      'Etika Interaksi & Komentar (Bab I): Format jawaban resmi [Jawaban/Tanggapan], kritik keluhan diarahkan ke SIWAS MA-RI (siwas.mahkamahagung.go.id), tidak menanggapi pokok perkara di media sosial, dan penutupan/penghapusan komentar hanya untuk hoax/SARA/fitnah/spam.',
      'Keamanan Akun Resmi (Bab F.6): Wajib menggunakan surel dan nomor dinas instansi, penggunaan logo resmi/gedung kantor, serta kewajiban mengaktifkan Autentikasi Dua Langkah (2FA).'
    ],
    pasalPasalKunci: [
      {
        pasal: 'Lampiran I Bab D',
        judul: 'Struktur Tim Pengelola Media Massa dan Medsos Pengadilan',
        isi: 'Pengadilan tingkat banding: Pembina dijabat oleh hakim atau juru bicara pengadilan, Penanggung jawab dijabat oleh Sekretaris Pengadilan, Koordinator dijabat oleh Kepala Bagian, dibantu Tim Produksi Konten (Perancang Infografis/Videografis, Fotografer/Videografer, Penulis Naskah, Editor Naskah, Penyusun Konten), Administrator Media Massa, dan Administrator Media Sosial.'
      },
      {
        pasal: 'Lampiran I Bab E & H',
        judul: 'Standar Penulisan Berita & Mekanisme Koreksi Transparan',
        isi: 'Artikel berita memuat 5W+1H dengan struktur Lead, Isi, dan Ekor berita. Jika terjadi kekeliruan, dilakukan koreksi transparan dengan mencantumkan keterangan ralat di akhir berita atau penyandingan informasi sebelum dan sesudah perbaikan.'
      },
      {
        pasal: 'Lampiran I Bab I',
        judul: 'Etika Interaksi, Tanggapan Resmi & Kanal SIWAS',
        isi: 'Pengelola merespons pertanyaan dengan format resmi Jawaban/Tanggapan. Kritik dan keluhan diarahkan ke Sistem Pengawasan (SIWAS) Mahkamah Agung. Dilarang menanggapi substansi perkara/putusan hakim di media sosial.'
      },
      {
        pasal: 'Lampiran I Bab K',
        judul: 'Tata Kelola Pemanfaatan Kecerdasan Buatan (AI)',
        isi: 'AI hanya sebagai alat bantu (tidak menggantikan kewenangan pejabat). Dilarang merekayasa logo resmi dan foto pimpinan. Wajib Human-in-the-Loop, wajib mencantumkan keterangan/watermark pada materi visual generatif AI, wajib mengaburkan wajah pihak/anak, serta larangan deepfake.'
      },
      {
        pasal: 'Lampiran II',
        judul: 'SOP Publikasi Media Sosial (11 Tahapan Kerja)',
        isi: 'Alur kerja baku publikasi: 1. Perencanaan (2h) -> 2. Instruksi (1h) -> 3. Konsep (1h) -> 4. Bahan (1h) -> 5. Produksi (3h) -> 6. Penyuntingan (1h) -> 7. Koreksi (2h) -> 8. Persetujuan (1h) -> 9. Posting (1h) -> 10. Laporan (1h) -> 11. Evaluasi (1h).'
      }
    ],
    tautanResmi: '/assets/aistudio/2026sk-sekma14106_a0e8391d.pdf',
    kataKunci: [
      'sk sekma 14106',
      '14106/sek/sk.hm1.1/x/2026',
      'pedoman media massa',
      'media sosial pengadilan',
      'sop medsos',
      'tata kelola ai peradilan',
      'kecerdasan buatan ma',
      'human in the loop',
      'etika komentar siwas',
      'koreksi berita',
      'humas pengadilan',
      'sobandi'
    ]
  }
];

/**
 * searchRegulatoryDatabase
 * Performs automated search across the system's stored regulatory and technical guidelines database.
 */
export function searchRegulatoryDatabase(query: string, maxResults = 3): RegulatorySearchResult[] {
  const cleanQ = (query || '').toLowerCase().trim();
  if (!cleanQ) return [];

  const tokens = cleanQ.split(/\s+/).filter(t => t.length > 2);
  const results: RegulatorySearchResult[] = [];

  for (const doc of REGULATORY_DATABASE) {
    let score = 0;
    const matchedKeywords: string[] = [];
    const matchedArticles: RegulatoryArticle[] = [];

    const docFullText = [
      doc.nomor,
      doc.tentang,
      doc.ringkasan,
      ...doc.substansiPenting,
      ...doc.kataKunci
    ].join(' ').toLowerCase();

    // 1. Exact match on number or key phrase
    if (doc.nomor.toLowerCase().includes(cleanQ)) {
      score += 60;
      matchedKeywords.push(doc.nomor);
    }
    if (doc.tentang.toLowerCase().includes(cleanQ)) {
      score += 45;
      matchedKeywords.push(doc.tentang);
    }

    // 2. Keyword exact matches
    for (const kw of doc.kataKunci) {
      if (cleanQ.includes(kw) || kw.includes(cleanQ)) {
        score += 35;
        matchedKeywords.push(kw);
      }
    }

    // 3. Token-based matching
    for (const token of tokens) {
      if (docFullText.includes(token)) {
        score += 8;
      }
    }

    // 4. Match specific articles
    for (const art of doc.pasalPasalKunci) {
      const artText = `${art.pasal} ${art.judul || ''} ${art.isi}`.toLowerCase();
      let artMatch = false;
      if (cleanQ.includes(art.pasal.toLowerCase())) {
        score += 40;
        artMatch = true;
      } else {
        const matchingTokens = tokens.filter(t => artText.includes(t));
        if (matchingTokens.length >= 2) {
          score += 15;
          artMatch = true;
        }
      }
      if (artMatch && !matchedArticles.includes(art)) {
        matchedArticles.push(art);
      }
    }

    // High intent boosts
    if ((cleanQ.includes('buku ii') || cleanQ.includes('pedoman teknis administrasi')) && doc.id === 'reg-sk-kma-159-2026') score += 55;
    if ((cleanQ.includes('sistematika putusan') || cleanQ.includes('29 komponen')) && doc.id === 'reg-sk-kma-159-2026') score += 65;
    if ((cleanQ.includes('bundel a') || cleanQ.includes('bundel b')) && doc.id === 'reg-sk-kma-159-2026') score += 65;
    if ((cleanQ.includes('inzage') || cleanQ.includes('mempelajari berkas')) && doc.id === 'reg-sk-kma-159-2026') score += 55;
    if ((cleanQ.includes('stuiting') || cleanQ.includes('pembantaran') || cleanQ.includes('penahanan banding')) && doc.id === 'reg-sk-kma-159-2026') score += 55;
    if ((cleanQ.includes('e-court') || cleanQ.includes('ecourt') || cleanQ.includes('e-litigation') || cleanQ.includes('e-payment')) && doc.id === 'reg-perma-7-2022') score += 50;
    if ((cleanQ.includes('posbakum') || cleanQ.includes('prodeo') || cleanQ.includes('bantuan hukum')) && doc.id === 'reg-perma-1-2014') score += 50;
    if ((cleanQ.includes('siwas') || cleanQ.includes('pengaduan') || cleanQ.includes('whistleblowing')) && doc.id === 'reg-perma-9-2016') score += 50;
    if ((cleanQ.includes('ppid') || cleanQ.includes('informasi publik') || cleanQ.includes('uji konsekuensi')) && doc.id === 'reg-sk-kma-2-144-2022') score += 50;
    if ((cleanQ.includes('desersi') || cleanQ.includes('pasal 87') || cleanQ.includes('kuhdpm')) && doc.id === 'reg-kuhdpm') score += 50;
    if ((cleanQ.includes('uu 31') || cleanQ.includes('31/1997') || cleanQ.includes('uu peradilan militer') || cleanQ.includes('peradilan militer') || cleanQ.includes('oditurat') || cleanQ.includes('papera') || cleanQ.includes('ankum') || cleanQ.includes('banding') || cleanQ.includes('7 hari') || cleanQ.includes('stum') || cleanQ.includes('ktuab') || cleanQ.includes('wewenang dilmilti')) && doc.id === 'reg-uu-31-1997') score += 65;
    if ((cleanQ.includes('pp 22') || cleanQ.includes('12 provinsi') || cleanQ.includes('pembentukan')) && doc.id === 'reg-pp-22-2025') score += 50;
    if ((cleanQ.includes('sema') || cleanQ.includes('pleno kamar') || cleanQ.includes('in absentia')) && doc.id === 'reg-sema-pleno-kamar-militer') score += 50;
    if ((cleanQ.includes('kasasi elektronik') || cleanQ.includes('pk elektronik') || cleanQ.includes('perma 8')) && doc.id === 'reg-perma-8-2022') score += 50;

    if (score >= 20) {
      results.push({
        document: doc,
        score,
        matchedKeywords: Array.from(new Set(matchedKeywords)),
        matchedArticles
      });
    }
  }

  // Sort by score descending and return top matches
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

/**
 * formatRegulatoryReferencesMarkdown
 * Formats matched regulatory items into clean, authoritative Markdown citations with direct links.
 */
export function formatRegulatoryReferencesMarkdown(matches: RegulatorySearchResult[]): string {
  if (!matches || matches.length === 0) return '';

  const blocks: string[] = [];
  blocks.push('📜 **Rujukan Resmi Pangkalan Data Regulasi & Pedoman Teknis MA-RI (Tersimpan di Sistem):**');

  for (const m of matches) {
    const doc = m.document;
    let text = `- 🏛️ **[${doc.nomor}](${doc.tautanResmi})**\n  *Tentang: ${doc.tentang}*`;
    
    if (m.matchedArticles.length > 0) {
      const topArt = m.matchedArticles[0];
      text += `\n  - 📌 **${topArt.pasal}${topArt.judul ? ` (${topArt.judul})` : ''}:** ${topArt.isi}`;
    } else if (doc.substansiPenting.length > 0) {
      text += `\n  - 💡 **Pedoman Baku:** ${doc.substansiPenting[0]}`;
    }

    blocks.push(text);
  }

  return blocks.join('\n');
}
