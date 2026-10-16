// Data Model & Master Dataset: INDIKATOR KINERJA UTAMA PENGADILAN TINGKAT BANDING LINGKUNGAN PERADILAN MILITER UTAMA DAN MILITER TINGGI TAHUN 2025-2029
// Berdasarkan KEPUTUSAN SEKRETARIS MAHKAMAH AGUNG REPUBLIK INDONESIA NOMOR 27101/SEK/SK.RA1.3/X/2025 TANGGAL 31 OKTOBER 2025 (LAMPIRAN III)

export interface IkuKomponenBobot {
  nama: string;
  bobot: number; // in percent (e.g. 40)
  target: number;
  realisasi: number;
  keterangan?: string;
}

export interface IkuDataSourceFile {
  id: string;
  namaFile: string;
  tipe: 'EXCEL' | 'CSV' | 'JSON' | 'PDF' | 'DOCX' | 'SAKIP_DOC';
  ukuran: string;
  tanggalUpload: string;
  pengunggah: string;
  indikatorTerkait: string[];
  deskripsi: string;
  status: 'TERVERIFIKASI' | 'DIPARSING' | 'TERHUBUNG';
  kontenSnippet?: string;
  extractedMetrics?: Record<string, number>;
}

export interface IkuMiliterIndicator {
  id: string;
  kode: string;
  noUrut: string;
  tujuanNo: number;
  tujuanJudul: string;
  sasaranNo: number;
  sasaranJudul: string;
  namaIndikator: string;
  penjelasan: string;
  rumusPerhitungan: string;
  dasarHukum: string[];
  penanggungJawab: 'Panitera' | 'Sekretaris' | 'Panitera dan Sekretaris';
  sumberData: string;
  satuan: '%' | 'Indeks (1-4)' | 'Nilai (0-100)' | 'Indeks (0-100)';
  
  // Targets 2025-2029
  target2025: number;
  target2026: number;
  target2027: number;
  target2028: number;
  target2029: number;
  
  // Realizations
  realisasi2025: number;
  realisasi2026: number;
  realisasi2027: number;
  realisasi2028: number;
  realisasi2029: number;

  // Quarterly Data (for Year 2026 live tracking)
  quarterly2026: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };

  komponenBobot?: IkuKomponenBobot[];
  catatanSop?: string[];
  kategori: 'Kepaniteraan' | 'Kesekretariatan';
  levelCapaian2026: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Peningkatan';
}

export const SK_SEKMA_INFO = {
  nomor: '27101/SEK/SK.RA1.3/X/2025',
  tanggal: '31 Oktober 2025',
  judul: 'PENETAPAN INDIKATOR KINERJA UTAMA PENGADILAN TINGKAT BANDING DAN PENGADILAN TINGKAT PERTAMA DI LINGKUNGAN MAHKAMAH AGUNG REPUBLIK INDONESIA TAHUN 2025-2029',
  lampiran: 'LAMPIRAN III (PENGADILAN TINGKAT BANDING LINGKUNGAN PERADILAN MILITER UTAMA DAN MILITER TINGGI)',
  pejabat: 'Sekretaris Mahkamah Agung Republik Indonesia (Sugiyanto)',
  masaBerlaku: '2025 - 2029'
};

export const INITIAL_IKU_MILITER_LIST: IkuMiliterIndicator[] = [
  // ================= TUJUAN 1 / SASARAN 1 (KEPANITERAAN) =================
  {
    id: 'iku-1-1',
    kode: 'IKU 1.1',
    noUrut: '1.1',
    tujuanNo: 1,
    tujuanJudul: 'Mewujudkan Badan Peradilan yang Mandiri dalam Pelayanan dan Penegakan Hukum yang Berkepastian, Setara dan Berkeadilan',
    sasaranNo: 1,
    sasaranJudul: 'Terwujudnya peradilan yang efektif, transparan, akuntabel, responsif dan modern',
    namaIndikator: 'Persentase penyelesaian perkara secara tepat waktu',
    penjelasan: 'Perhitungan penyelesaian perkara tingkat banding secara tepat waktu sejak nomor register hingga perkara diminutasi sesuai ketentuan peraturan perundang-undangan dan penyelesaian perbedaan pendapat pada Dilmiltama.',
    rumusPerhitungan: '(Jumlah perkara yang diselesaikan tepat waktu / Jumlah perkara yang diselesaikan) x 100%',
    dasarHukum: [
      'Surat Edaran Mahkamah Agung (SEMA) Nomor 2 Tahun 2014 tanggal 13 Maret 2014 tentang Penyelesaian Perkara di Pengadilan Tingkat Pertama dan Tingkat Banding Pada 4 (Empat) Lingkungan Peradilan',
      'SOP Dilmiltama (hal. 7): Penyelesaian perkara perbedaan pendapat diselesaikan paling lambat dalam waktu 3 (tiga) bulan sampai dengan minutasi untuk tingkat banding',
      'SK Dirjen Badilmiltun Mahkamah Agung RI tentang Standarisasi Administrasi Perkara Banding'
    ],
    penanggungJawab: 'Panitera',
    sumberData: 'Laporan Bulanan dan Laporan Tahunan Kepaniteraan',
    satuan: '%',
    target2025: 90.0,
    target2026: 92.0,
    target2027: 94.0,
    target2028: 96.0,
    target2029: 98.0,
    realisasi2025: 95.8,
    realisasi2026: 97.5,
    realisasi2027: 0,
    realisasi2028: 0,
    realisasi2029: 0,
    quarterly2026: { q1: 96.2, q2: 97.0, q3: 98.1, q4: 97.5 },
    kategori: 'Kepaniteraan',
    levelCapaian2026: 'Sangat Baik',
    catatanSop: [
      'Jumlah Perkara Yang Ada = Jumlah Perkara Diterima Tahun Berjalan + Sisa Perkara Tahun Sebelumnya',
      'Penyelesaian perkara tingkat banding dihitung sejak register hingga minutasi resmi',
      'Perkara dengan pemanggilan di luar negeri / media massa dikecualikan dari batasan ini'
    ]
  },
  {
    id: 'iku-1-2',
    kode: 'IKU 1.2',
    noUrut: '1.2',
    tujuanNo: 1,
    tujuanJudul: 'Mewujudkan Badan Peradilan yang Mandiri dalam Pelayanan dan Penegakan Hukum yang Berkepastian, Setara dan Berkeadilan',
    sasaranNo: 1,
    sasaranJudul: 'Terwujudnya peradilan yang efektif, transparan, akuntabel, responsif dan modern',
    namaIndikator: 'Persentase pengiriman salinan putusan tepat waktu oleh pengadilan tingkat banding kepada pengadilan pengaju',
    penjelasan: 'Kinerja pengiriman salinan putusan kepada pengadilan pengaju (4 Dilmil Tingkat I) dihitung secara elektronik melalui SIP sejak perkara diputus atau surat tercatat/pihak ketiga dalam batas 7 hari kerja.',
    rumusPerhitungan: '(Jumlah salinan putusan yang dikirimkan ke pengadilan pengaju secara tepat waktu / Jumlah perkara yang diputus) x 100%',
    dasarHukum: [
      'Undang-Undang Nomor 31 Tahun 1997 tentang Peradilan Militer Pasal 230 ayat (1): Salinan putusan pengadilan tingkat banding beserta berkas perkara dikirimkan kepada pengadilan pengaju dalam waktu 7 (tujuh) hari sesudah putusan dijatuhkan',
      'Surat Keputusan Ketua Mahkamah Agung Nomor 026/KMA/SK/II/2012 tentang Standar Pelayanan Peradilan (Jangka Waktu Pengiriman Salinan Putusan)'
    ],
    penanggungJawab: 'Panitera',
    sumberData: 'Laporan Bulanan dan Laporan Tahunan Kepaniteraan',
    satuan: '%',
    target2025: 90.0,
    target2026: 92.0,
    target2027: 95.0,
    target2028: 97.0,
    target2029: 100.0,
    realisasi2025: 96.4,
    realisasi2026: 98.8,
    realisasi2027: 0,
    realisasi2028: 0,
    realisasi2029: 0,
    quarterly2026: { q1: 97.5, q2: 98.5, q3: 99.2, q4: 98.8 },
    kategori: 'Kepaniteraan',
    levelCapaian2026: 'Sangat Baik',
    catatanSop: [
      'Metode elektronik dihitung sejak perkara diputus sampai diupload pada SIP',
      'Metode fisik/tercatat dihitung sejak diputus sampai dikirim ke pengadilan pengaju (Dilmil Makassar, Dilmil Manado, Dilmil Ambon, Dilmil Jayapura)'
    ]
  },
  {
    id: 'iku-1-3',
    kode: 'IKU 1.3',
    noUrut: '1.3',
    tujuanNo: 1,
    tujuanJudul: 'Mewujudkan Badan Peradilan yang Mandiri dalam Pelayanan dan Penegakan Hukum yang Berkepastian, Setara dan Berkeadilan',
    sasaranNo: 1,
    sasaranJudul: 'Terwujudnya peradilan yang efektif, transparan, akuntabel, responsif dan modern',
    namaIndikator: 'Persentase putusan pengadilan yang diunggah pada direktori putusan',
    penjelasan: 'Mengukur kepatuhan pengadilan tingkat banding untuk melakukan publikasi dan unggah putusan pada Direktori Putusan Mahkamah Agung RI paling lambat pada saat perkara diminutasi.',
    rumusPerhitungan: '(Jumlah putusan yang diunggah pada direktori putusan / Jumlah putusan yang telah diminutasi) x 100%',
    dasarHukum: [
      'Surat Keputusan Ketua Mahkamah Agung Nomor 2-144/KMA/SK/VIII/2022 tentang Standar Pelayanan Informasi Publik di Pengadilan',
      'Keputusan Dirjen Badilmiltun tentang Kebijakan Keterbukaan Informasi Putusan Peradilan Militer'
    ],
    penanggungJawab: 'Panitera',
    sumberData: 'Laporan Bulanan dan Laporan Tahunan Kepaniteraan / Direktori Putusan MA-RI',
    satuan: '%',
    target2025: 100.0,
    target2026: 100.0,
    target2027: 100.0,
    target2028: 100.0,
    target2029: 100.0,
    realisasi2025: 100.0,
    realisasi2026: 100.0,
    realisasi2027: 0,
    realisasi2028: 0,
    realisasi2029: 0,
    quarterly2026: { q1: 100.0, q2: 100.0, q3: 100.0, q4: 100.0 },
    kategori: 'Kepaniteraan',
    levelCapaian2026: 'Sangat Baik',
    catatanSop: [
      'Kepatuhan 100% anonymisasi / pengaburan identitas sesuai SK KMA 2-144/2022',
      'Unggah wajib tuntas bersamaan saat berkas minutasi ditandatangani Panitera'
    ]
  },
  {
    id: 'iku-1-4',
    kode: 'IKU 1.4',
    noUrut: '1.4',
    tujuanNo: 1,
    tujuanJudul: 'Mewujudkan Badan Peradilan yang Mandiri dalam Pelayanan dan Penegakan Hukum yang Berkepastian, Setara dan Berkeadilan',
    sasaranNo: 1,
    sasaranJudul: 'Terwujudnya peradilan yang efektif, transparan, akuntabel, responsif dan modern',
    namaIndikator: 'Persentase perkara yang berhasil diselesaikan melalui pendekatan keadilan restoratif',
    penjelasan: 'Penerapan pendekatan restorative justice pada tindak pidana ringan, kerugian korban <= Rp2.500.000 / UMP, delik aduan, ancaman pidana <= 5 tahun, diversi anak, dan kecelakaan lalu lintas dengan pemulihan hak korban.',
    rumusPerhitungan: '(Jumlah perkara yang berhasil diselesaikan melalui pendekatan keadilan restoratif / Jumlah perkara yang memenuhi kriteria penerapan keadilan restoratif) x 100%',
    dasarHukum: [
      'Peraturan Mahkamah Agung (PERMA) Nomor 1 Tahun 2024 tentang Pedoman Mengadili Perkara Pidana Berdasarkan Keadilan Restoratif (Restorative Justice)',
      'Undang-Undang Nomor 11 Tahun 2012 tentang Sistem Peradilan Pidana Anak (Diversi)',
      'Pedoman Jaksa Agung / Oditurat Jenderal TNI terkait Penghentian Penuntutan Keadilan Restoratif'
    ],
    penanggungJawab: 'Panitera',
    sumberData: 'Laporan Bulanan dan Laporan Tahunan Kepaniteraan',
    satuan: '%',
    target2025: 75.0,
    target2026: 80.0,
    target2027: 85.0,
    target2028: 90.0,
    target2029: 95.0,
    realisasi2025: 83.3,
    realisasi2026: 88.9,
    realisasi2027: 0,
    realisasi2028: 0,
    realisasi2029: 0,
    quarterly2026: { q1: 85.0, q2: 87.5, q3: 90.0, q4: 88.9 },
    kategori: 'Kepaniteraan',
    levelCapaian2026: 'Sangat Baik',
    catatanSop: [
      'Kriteria: tipiring kerugian <= 2,5 juta / UMP, delik aduan, ancaman hukuman maks 5 tahun, diversi anak, laka lantas kejahatan',
      'Pengecualian Hakim: Terdakwa/korban menolak perdamaian, ada relasi kuasa tidak seimbang, residivis kurun waktu 3 tahun',
      'Hasil: Pemulihan korban dalam amar putusan, penjatuhan pidana percobaan / pengawasan / kerja sosial'
    ]
  },

  // ================= TUJUAN 1 / SASARAN 2 (KEPANITERAAN & KESEKRETARIATAN) =================
  {
    id: 'iku-2-1',
    kode: 'IKU 2.1',
    noUrut: '2.1',
    tujuanNo: 1,
    tujuanJudul: 'Mewujudkan Badan Peradilan yang Mandiri dalam Pelayanan dan Penegakan Hukum yang Berkepastian, Setara dan Berkeadilan',
    sasaranNo: 2,
    sasaranJudul: 'Meningkatnya Tingkat Keyakinan dan Kepercayaan Publik',
    namaIndikator: 'Indeks kepuasan pengguna layanan pengadilan berdasarkan standar layanan yang ditetapkan',
    penjelasan: 'Pengukuran kepuasan masyarakat pencari keadilan dan instansi militer terhadap 9 kriteria standar layanan pengadilan (persyaratan, mekanisme, waktu, biaya, produk, kompetensi, perilaku, pengaduan, sarpras).',
    rumusPerhitungan: 'Indeks Kepuasan Pengguna Layanan Pengadilan (Skala 1.00 - 4.00 atau konversi 0 - 100)',
    dasarHukum: [
      'Surat Keputusan Ketua Mahkamah Agung Nomor 026/KMA/SK/II/2012 tentang Standar Pelayanan Peradilan',
      'PermenPAN-RB Nomor 14 Tahun 2017 tentang Pedoman Penyusunan Survei Kepuasan Masyarakat Unit Penyelenggara Pelayanan Publik',
      'SK Dirjen Badilmiltun tentang Indeks Kepuasan Masyarakat (IKM) dan Indeks Persepsi Anti Korupsi (IPAK)'
    ],
    penanggungJawab: 'Panitera dan Sekretaris',
    sumberData: 'Laporan Tahunan dan Hasil Survei Triwulanan IKM/IPAK',
    satuan: 'Indeks (1-4)',
    target2025: 3.85,
    target2026: 3.88,
    target2027: 3.90,
    target2028: 3.92,
    target2029: 3.95,
    realisasi2025: 3.92,
    realisasi2026: 3.95,
    realisasi2027: 0,
    realisasi2028: 0,
    realisasi2029: 0,
    quarterly2026: { q1: 3.93, q2: 3.94, q3: 3.96, q4: 3.95 },
    kategori: 'Kepaniteraan',
    levelCapaian2026: 'Sangat Baik',
    catatanSop: [
      'Meliputi 4 Rumpun Layanan SK KMA 026/2012: Pelayanan Administrasi Persidangan, Bantuan Hukum Posbakum, Pelayanan Pengaduan, Pelayanan Informasi PPID',
      'Dilengkapi fasilitas prioritas disabilitas dan kelompok rentan'
    ]
  },

  // ================= TUJUAN 2 / SASARAN 3 (KESEKRETARIATAN) =================
  {
    id: 'iku-3-1',
    kode: 'IKU 3.1',
    noUrut: '3.1',
    tujuanNo: 2,
    tujuanJudul: 'Mewujudkan Badan Peradilan yang transparan, akuntabel, modern dan profesional',
    sasaranNo: 3,
    sasaranJudul: 'Terwujudnya Manajemen Peradilan yang Transparan dan Profesional',
    namaIndikator: 'Indeks Profesionalitas Aparatur Sipil Negara (IP ASN) Satuan Kerja Pengadilan',
    penjelasan: 'Pengukuran komprehensif atas kualitas profesionalitas ASN dan personel pengadilan berdasarkan 4 dimensi utama: Kualifikasi Pendidikan, Kompetensi Diklat, Kinerja SKP, dan Penegakan Disiplin.',
    rumusPerhitungan: 'Nilai IP ASN = (Kualifikasi x 25%) + (Kompetensi x 40%) + (Kinerja x 30%) + (Disiplin x 5%)',
    dasarHukum: [
      'Peraturan Badan Kepegawaian Negara (BKN) Nomor 8 Tahun 2019 tentang Pedoman Pengukuran Indeks Profesionalitas ASN',
      'Keputusan Sekretaris Mahkamah Agung RI tentang Standar Kompetensi Jabatan Aparatur Peradilan'
    ],
    penanggungJawab: 'Sekretaris',
    sumberData: 'Laporan Tahunan Sub Bagian Kepegawaian dan SIASN BKN',
    satuan: 'Nilai (0-100)',
    target2025: 85.0,
    target2026: 87.5,
    target2027: 90.0,
    target2028: 92.5,
    target2029: 95.0,
    realisasi2025: 89.4,
    realisasi2026: 92.35,
    realisasi2027: 0,
    realisasi2028: 0,
    realisasi2029: 0,
    quarterly2026: { q1: 90.5, q2: 91.8, q3: 92.5, q4: 92.35 },
    komponenBobot: [
      { nama: 'Kompetensi (Diklat Teknis/Fungsional/Seminar)', bobot: 40, target: 40.0, realisasi: 37.2, keterangan: 'Realisasi 37.2 / 40.0 poin (93%)' },
      { nama: 'Kinerja (Penilaian Kinerja SKP E-Kinerja BKN)', bobot: 30, target: 30.0, realisasi: 28.5, keterangan: 'Realisasi 28.5 / 30.0 poin (95%)' },
      { nama: 'Kualifikasi (Pendidikan Formal Sarjana & Magister)', bobot: 25, target: 25.0, realisasi: 21.65, keterangan: 'Realisasi 21.65 / 25.0 poin (86.6%)' },
      { nama: 'Disiplin (Ketaatan Jam Kerja & Zero Hukuman Disiplin)', bobot: 5, target: 5.0, realisasi: 5.0, keterangan: 'Realisasi Penuh 5.0 / 5.0 poin (100%)' }
    ],
    kategori: 'Kesekretariatan',
    levelCapaian2026: 'Sangat Baik',
    catatanSop: [
      'Seluruh pegawai wajib memenuhi minimal 20 JP pengembangan kompetensi per tahun',
      'Zero Toleransi pelanggaran disiplin PP 94/2021 dan Kode Etik Pegawai MA-RI'
    ]
  },
  {
    id: 'iku-3-2',
    kode: 'IKU 3.2',
    noUrut: '3.2',
    tujuanNo: 2,
    tujuanJudul: 'Mewujudkan Badan Peradilan yang transparan, akuntabel, modern dan profesional',
    sasaranNo: 3,
    sasaranJudul: 'Terwujudnya Manajemen Peradilan yang Transparan dan Profesional',
    namaIndikator: 'Nilai Indikator Kinerja Pelaksanaan Anggaran (IKPA) Satuan Kerja Pengadilan',
    penjelasan: 'Pengukuran kualitas tata kelola pelaksanaan anggaran belanja DIPA 01 (Badan Urusan Administrasi) dan DIPA 04 (Ditjen Badilmiltun) tahun berjalan berdasarkan 8 indikator Kementerian Keuangan.',
    rumusPerhitungan: 'Nilai Komposit IKPA = Revisi DIPA (10%) + Penyerapan (20%) + Tagihan (10%) + Deviasi Hal III (15%) + Kontraktual (10%) + UP/TUP (10%) + Capaian Output (25%) - Pengurangan Dispensasi SPM',
    dasarHukum: [
      'Peraturan Ditjen Perbendaharaan Kementerian Keuangan Nomor Per-5/PB/2024 tentang Petunjuk Teknis Penilaian Indikator Kinerja Pelaksanaan Anggaran Belanja K/L',
      'Peraturan Menteri Keuangan tentang Tata Cara Pembayaran dan Pelaksanaan APBN'
    ],
    penanggungJawab: 'Sekretaris',
    sumberData: 'Laporan Bulanan, Semester, Triwulan, Tahunan dan Portal OMSPAN / MonSAKTI Kemenkeu',
    satuan: 'Nilai (0-100)',
    target2025: 95.0,
    target2026: 96.0,
    target2027: 97.0,
    target2028: 98.0,
    target2029: 99.0,
    realisasi2025: 97.8,
    realisasi2026: 98.65,
    realisasi2027: 0,
    realisasi2028: 0,
    realisasi2029: 0,
    quarterly2026: { q1: 98.1, q2: 98.5, q3: 99.0, q4: 98.65 },
    komponenBobot: [
      { nama: 'Capaian Output Rincian Output (RO)', bobot: 25, target: 25.0, realisasi: 24.85, keterangan: 'Target ketercapaian volume keluaran' },
      { nama: 'Penyerapan Anggaran (DIPA 01 & 04)', bobot: 20, target: 20.0, realisasi: 19.80, keterangan: 'Tingkat realisasi anggaran sesuai trajectory' },
      { nama: 'Deviasi Halaman III DIPA', bobot: 15, target: 15.0, realisasi: 14.65, keterangan: 'Kesesuaian RPD bulanan dengan realisasi' },
      { nama: 'Revisi DIPA', bobot: 10, target: 10.0, realisasi: 10.0, keterangan: 'Kepatuhan batas maksimal revisi per triwulan' },
      { nama: 'Penyelesaian Tagihan SPM 17 Hari', bobot: 10, target: 10.0, realisasi: 9.95, keterangan: 'Ketepatan waktu penerbitan SP2D' },
      { nama: 'Belanja Kontraktual', bobot: 10, target: 10.0, realisasi: 9.85, keterangan: 'Pendaftaran kontrak tepat waktu < 3 hari' },
      { nama: 'Pengelolaan UP & TUP', bobot: 10, target: 10.0, realisasi: 9.90, keterangan: 'Revolving GUP tepat waktu minimal 1x sebulan' },
      { nama: 'Dispensasi SPM (Pengurang)', bobot: 0, target: 0, realisasi: 0, keterangan: 'Zero dispensasi (0 pengurangan)' }
    ],
    kategori: 'Kesekretariatan',
    levelCapaian2026: 'Sangat Baik',
    catatanSop: [
      'Pemantauan harian melalui aplikasi MonSAKTI dan OMSPAN Kemenkeu',
      'Satker Pengadilan Militer Tinggi V Makassar meraih predikat IKPA Sangat Baik dengan nilai 98.65'
    ]
  },
  {
    id: 'iku-3-3',
    kode: 'IKU 3.3',
    noUrut: '3.3',
    tujuanNo: 2,
    tujuanJudul: 'Mewujudkan Badan Peradilan yang transparan, akuntabel, modern dan profesional',
    sasaranNo: 3,
    sasaranJudul: 'Terwujudnya Manajemen Peradilan yang Transparan dan Profesional',
    namaIndikator: 'Nilai Kinerja Perencanaan Anggaran',
    penjelasan: 'Pengukuran akurasi dan keselarasan perencanaan penganggaran yang terdiri dari aspek Efektifitas (75%) dan aspek Efisiensi (25%) satker.',
    rumusPerhitungan: 'Nilai Perencanaan = [Efektifitas 75%: Sasaran K/L (25%) + IKP Eselon I (25%) + RO Satker (30%)] + [Efisiensi 25%: Agregasi Efisiensi Satker]',
    dasarHukum: [
      'Peraturan Menteri Perencanaan Pembangunan Nasional / Bappenas tentang Tata Cara Evaluasi Kinerja Perencanaan Pembangunan',
      'Keputusan Sekretaris Mahkamah Agung tentang Petunjuk Penyusunan RKA-K/L Pengadilan'
    ],
    penanggungJawab: 'Sekretaris',
    sumberData: 'Laporan Bulanan, Semester, Triwulan, Tahunan dan Aplikasi SMART DJA Kemenkeu',
    satuan: 'Nilai (0-100)',
    target2025: 90.0,
    target2026: 92.0,
    target2027: 94.0,
    target2028: 96.0,
    target2029: 98.0,
    realisasi2025: 94.2,
    realisasi2026: 96.4,
    realisasi2027: 0,
    realisasi2028: 0,
    realisasi2029: 0,
    quarterly2026: { q1: 95.0, q2: 96.2, q3: 97.0, q4: 96.4 },
    komponenBobot: [
      { nama: 'Efektifitas Perencanaan (Sasaran K/L, IKP Eselon I, RO Satker)', bobot: 75, target: 75.0, realisasi: 72.8, keterangan: 'Kesesuaian program dengan Renstra 2025-2029' },
      { nama: 'Efisiensi Anggaran (Optimalisasi output dengan alokasi biaya)', bobot: 25, target: 25.0, realisasi: 23.6, keterangan: 'Penghematan wajar tanpa mengurangi kualitas layanan' }
    ],
    kategori: 'Kesekretariatan',
    levelCapaian2026: 'Sangat Baik',
    catatanSop: [
      'Sinkronisasi aplikasi SAKTI, SMART DJA, dan KRISNA Bappenas',
      'Evaluasi berkala bersama Biro Perencanaan Mahkamah Agung RI'
    ]
  },
  {
    id: 'iku-3-4',
    kode: 'IKU 3.4',
    noUrut: '3.4',
    tujuanNo: 2,
    tujuanJudul: 'Mewujudkan Badan Peradilan yang transparan, akuntabel, modern dan profesional',
    sasaranNo: 3,
    sasaranJudul: 'Terwujudnya Manajemen Peradilan yang Transparan dan Profesional',
    namaIndikator: 'Nilai Indikator Pengelolaan Aset (IPA) Satuan Kerja Pengadilan',
    penjelasan: 'Indeks Pengelolaan Aset untuk mengukur kualitas tata kelola Barang Milik Negara (BMN), ketertiban inventarisasi, sertifikasi tanah gedung kantor, dan pemanfaatan BMN tahun berjalan.',
    rumusPerhitungan: 'Indeks Kualitas Tata Kelola BMN (Kompilasi Standar KPKNL / DJKN Kemenkeu)',
    dasarHukum: [
      'Keputusan Menteri Keuangan Nomor 112/KM.6/2024 tentang Kinerja Pengelolaan Barang Milik Negara Tahun 2024',
      'Peraturan Pemerintah Nomor 28 Tahun 2020 tentang perubahan atas Peraturan Pemerintah Nomor 27 Tahun 2014 tentang Pengelolaan Barang Milik Negara/Daerah'
    ],
    penanggungJawab: 'Sekretaris',
    sumberData: 'Laporan Tahunan BMN, Aplikasi E-Sadewa MA-RI, SIMAN DJKN, MonSAKTI, dan Laporan Realisasi Anggaran',
    satuan: 'Nilai (0-100)',
    target2025: 85.0,
    target2026: 88.0,
    target2027: 90.0,
    target2028: 92.0,
    target2029: 95.0,
    realisasi2025: 91.5,
    realisasi2026: 94.6,
    realisasi2027: 0,
    realisasi2028: 0,
    realisasi2029: 0,
    quarterly2026: { q1: 93.0, q2: 94.2, q3: 95.1, q4: 94.6 },
    kategori: 'Kesekretariatan',
    levelCapaian2026: 'Sangat Baik',
    catatanSop: [
      'Rekonsiliasi berkala BMN semesteran bersama KPKNL Makassar',
      'Integrasi penuh sistem E-Sadewa Mahkamah Agung RI'
    ]
  }
];

export const INITIAL_DATA_SOURCE_FILES: IkuDataSourceFile[] = [
  {
    id: 'src-file-1',
    namaFile: 'SK_SEKMA_27101_IKU_2025_2029.pdf',
    tipe: 'PDF',
    ukuran: '4.8 MB',
    tanggalUpload: '31 Okt 2025',
    pengunggah: 'Sekretaris MA-RI / Biro Perencanaan',
    indikatorTerkait: ['IKU 1.1', 'IKU 1.2', 'IKU 1.3', 'IKU 1.4', 'IKU 2.1', 'IKU 3.1', 'IKU 3.2', 'IKU 3.3', 'IKU 3.4'],
    deskripsi: 'Salinan Keputusan Sekretaris Mahkamah Agung RI No. 27101/SEK/SK.RA1.3/X/2025 tentang Penetapan IKU 2025-2029 Lampiran III Peradilan Militer Tinggi.',
    status: 'TERVERIFIKASI',
    kontenSnippet: 'Lampiran III: IKU Pengadilan Tingkat Banding Lingkungan Peradilan Militer Utama dan Militer Tinggi Tahun 2025-2029. Memuat 8 indikator utama.'
  },
  {
    id: 'src-file-2',
    namaFile: 'Laporan_Kinerja_LKjIP_Dilmilti_V_2025_2026.xlsx',
    tipe: 'EXCEL',
    ukuran: '840 KB',
    tanggalUpload: '15 Jan 2026',
    pengunggah: 'Sub Bagian Perencanaan, TI dan Pelaporan',
    indikatorTerkait: ['IKU 1.1', 'IKU 1.2', 'IKU 1.3', 'IKU 1.4', 'IKU 3.2', 'IKU 3.3'],
    deskripsi: 'Data Realisasi Penyelesaian Perkara, Minutasi SIPP, dan Capaian Kinerja Anggaran DIPA 01 & DIPA 04 Tahun 2025/2026.',
    status: 'TERVERIFIKASI',
    extractedMetrics: {
      'IKU 1.1': 97.5,
      'IKU 1.2': 98.8,
      'IKU 1.3': 100.0,
      'IKU 1.4': 88.9,
      'IKU 3.2': 98.65,
      'IKU 3.3': 96.4
    }
  },
  {
    id: 'src-file-3',
    namaFile: 'Rekap_IP_ASN_dan_IKPA_Monev_Triwulan_2026.csv',
    tipe: 'CSV',
    ukuran: '125 KB',
    tanggalUpload: '02 Okt 2026',
    pengunggah: 'Sub Bagian Kepegawaian dan Umum',
    indikatorTerkait: ['IKU 3.1', 'IKU 3.2', 'IKU 3.4'],
    deskripsi: 'Data Indeks Profesionalitas ASN 4 Dimensi, Skor IKPA MonSAKTI, dan Indeks Pengelolaan Aset BMN Triwulan III 2026.',
    status: 'TERHUBUNG',
    extractedMetrics: {
      'IKU 3.1': 92.35,
      'IKU 3.2': 98.65,
      'IKU 3.4': 94.6
    }
  },
  {
    id: 'src-file-4',
    namaFile: 'Laporan_Survei_Kepuasan_IKM_IPAK_2026.json',
    tipe: 'JSON',
    ukuran: '45 KB',
    tanggalUpload: '04 Okt 2026',
    pengunggah: 'Petugas PTSP & Tim Reformasi Birokrasi',
    indikatorTerkait: ['IKU 2.1'],
    deskripsi: 'Hasil tabulasi responden survei kepuasan 6 meja PTSP, Posbakum, dan Layanan Informasi Pengadilan Militer Tinggi V.',
    status: 'TERVERIFIKASI',
    extractedMetrics: {
      'IKU 2.1': 3.95
    }
  }
];
