export interface GalleryPhoto {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: 'kegiatan-dinas' | 'kunjungan' | 'sidang' | 'pembinaan' | 'upacara';
  categoryLabel: string;
  location: string;
  officials: string[];
  imageUrl: string;
  desc: string;
  photographer: string;
  views: number;
}

export const GALLERY_CATEGORIES = [
  { id: 'semua', label: 'Semua Dokumentasi', icon: 'Grid' },
  { id: 'kunjungan', label: 'Kunjungan & Audiensi', icon: 'Users' },
  { id: 'kegiatan-dinas', label: 'Kegiatan Dinas', icon: 'Briefcase' },
  { id: 'sidang', label: 'Persidangan & Sidang Keliling', icon: 'Scale' },
  { id: 'pembinaan', label: 'Pembinaan & Bimtek', icon: 'GraduationCap' },
  { id: 'upacara', label: 'Upacara & Peringatan', icon: 'Award' }
] as const;

export const INITIAL_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'gal-visit-1',
    title: 'Kunjungan Kerja Pimpinan Mahkamah Agung RI dalam Rangka Pengawasan Daerah di Dilmilti V Makassar',
    date: '02 Oktober 2026',
    time: '09.30 WITA',
    category: 'kunjungan',
    categoryLabel: 'Kunjungan Resmi',
    location: 'Lobi Utama & Ruang Sidang Utama Garuda Dilmilti V Makassar',
    officials: [
      'Pimpinan Mahkamah Agung RI',
      'Kepala Pengadilan Militer Tinggi V Makassar',
      'Wakil Kepala & Seluruh Hakim Militer Tinggi',
      'Sekretaris & Panitera Dilmilti V Makassar'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
    desc: 'Kunjungan kerja pimpinan Mahkamah Agung RI disambut dengan jajar kehormatan dan pengalungan bunga. Rangkaian kegiatan meliputi peninjauan sarana digital PTSP, kesiapan ruang sidang terpadu teleconference, serta pengarahan terkait integritas yustisial dan pelayanan prima bagi pencari keadilan di wilayah Indonesia Timur.',
    photographer: 'Tim Humas & Protokol Dilmilti V',
    views: 842
  },
  {
    id: 'gal-visit-2',
    title: 'Audiensi & Kunjungan Silaturahmi Pangdam XIV/Hasanuddin ke Pengadilan Militer Tinggi V Makassar',
    date: '25 September 2026',
    time: '10.15 WITA',
    category: 'kunjungan',
    categoryLabel: 'Kunjungan & Audiensi',
    location: 'Ruang Tamu Terbuka Pimpinan Dilmilti V Makassar',
    officials: [
      'Pangdam XIV/Hasanuddin beserta Asisten',
      'Kepala Pengadilan Militer Tinggi V Makassar',
      'Danpomdam XIV/Hasanuddin',
      'Kakumdam XIV/Hasanuddin'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop&q=80',
    desc: 'Pertemuan silaturahmi dan koordinasi kelembagaan dalam rangka memperkuat sinergitas penegakan hukum militer, tata tertib disiplin prajurit, serta percepatan pelimpahan berkas perkara pidana militer di wilayah Komando Daerah Militer XIV/Hasanuddin.',
    photographer: 'Penrem & Humas Dilmilti V',
    views: 654
  },
  {
    id: 'gal-visit-3',
    title: 'Kunjungan Kerja Tim Evaluasi KemenPAN-RB Verifikasi Lapangan Zona Integritas Menuju WBBM',
    date: '18 September 2026',
    time: '08.45 WITA',
    category: 'kunjungan',
    categoryLabel: 'Kunjungan Evaluasi',
    location: 'Area PTSP, Pojok Ramah Disabilitas, & Ruang Command Center',
    officials: [
      'Tim Penilai Nasional (TPN) KemenPAN-RB',
      'Kepala Dilmilti V Makassar & Ketua Tim ZI',
      'Koordinator 6 Area Perubahan Zona Integritas'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80',
    desc: 'Tim KemenPAN-RB melaksanakan uji petik pelayanan publik, wawancara langsung dengan prajurit pencari keadilan di ruang tunggu PTSP, serta peninjauan fasilitas modern seperti antrean digital berbasis QR Code, inovasi PETA DILMILTI AI, dan integritas bebas gratifikasi (SMAP ISO 37001).',
    photographer: 'Tim Dokumentasi Reformasi Birokrasi',
    views: 920
  },
  {
    id: 'gal-visit-4',
    title: 'Kunjungan Kerja Danlantamal VI Makassar dalam Rangka Penguatan Penegakan Hukum Matra Laut',
    date: '11 September 2026',
    time: '13.30 WITA',
    category: 'kunjungan',
    categoryLabel: 'Kunjungan Militer',
    location: 'Gedung Pengadilan Militer Tinggi V Makassar',
    officials: [
      'Komandan Lantamal VI Makassar',
      'Danpomal Lantamal VI',
      'Kepala Pengadilan Militer Tinggi V Makassar',
      'Hakim Militer Tinggi'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=80',
    desc: 'Audiensi mempererat hubungan koordinasi peradilan militer dengan pangkalan TNI AL, membahas penyelenggaraan sidang keliling di wilayah kepulauan dan penanganan sengketa tata usaha militer (STUM) menyangkut hak kepegawaian prajurit matra laut.',
    photographer: 'Dispen Lantamal VI & Protokol',
    views: 512
  },
  {
    id: 'gal-visit-5',
    title: 'Kunjungan Studi Lapangan & Kuliah Yustisial Taruna Akademi Militer & Mahasiswa Fakultas Hukum',
    date: '04 September 2026',
    time: '09.00 WITA',
    category: 'kunjungan',
    categoryLabel: 'Kunjungan Akademik',
    location: 'Ruang Sidang Utama & Perpustakaan Hukum Dilmilti V',
    officials: [
      'Dosen Pembimbing Akademik & Taruna Militer',
      'Hakim Militer Tinggi Pemandu Materi',
      'Panitera Muda Pidana & Panitera Muda Hukum'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80',
    desc: 'Sebanyak 45 taruna dan mahasiswa hukum mengikuti pemaparan mengenai kedudukan Peradilan Militer di bawah naungan Mahkamah Agung RI, simulasi persidangan pidana militer menurut UU No. 31 Tahun 1997, serta pengenalan sistem keterbukaan informasi peradilan.',
    photographer: 'Humas & IT Dilmilti V',
    views: 438
  },
  {
    id: 'gal-dinas-1',
    title: 'Apel Pagi Dinas & Deklarasi Komitmen Bersama Zona Integritas Bebas Korupsi & Gratifikasi',
    date: '28 September 2026',
    time: '07.30 WITA',
    category: 'kegiatan-dinas',
    categoryLabel: 'Kegiatan Kedinasan',
    location: 'Lapangan Apel Gedung Dilmilti V Makassar',
    officials: [
      'Kepala Pengadilan Militer Tinggi V Makassar (Pembina Apel)',
      'Seluruh Hakim Militer Tinggi',
      'Pejabat Struktural, Fungsional & Seluruh Staf Aparatur'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=1200&auto=format&fit=crop&q=80',
    desc: 'Pelaksanaan apel pagi rutin kedinasan dirangkaikan dengan penegasan kembali 8 Nilai Utama Mahkamah Agung, kepatuhan kode etik hakim dan pegawai, serta kesiapan pelayanan prima Meja PTSP menyongsong penilaian WBBM.',
    photographer: 'Subbag Kepegawaian & IT',
    views: 730
  },
  {
    id: 'gal-dinas-2',
    title: 'Pelantikan & Pengambilan Sumpah Jabatan Hakim Militer Tinggi Dilmilti V Makassar',
    date: '15 September 2026',
    time: '10.00 WITA',
    category: 'kegiatan-dinas',
    categoryLabel: 'Pelantikan Pejabat',
    location: 'Ruang Sidang Utama Garuda Dilmilti V Makassar',
    officials: [
      'Kepala Pengadilan Militer Tinggi V Makassar',
      'Saksi Rohaniwan & Para Hakim Militer Tinggi',
      'Tamu Undangan Oditurat Militer Tinggi IV Makassar'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80',
    desc: 'Pengambilan sumpah jabatan dan pelantikan Hakim Militer Tinggi yang baru berlangsung khidmat dengan menerapkan protokol resmi Mahkamah Agung RI, diikuti dengan penandatanganan pakta integritas dan serah terima kalung jabatan yustisial.',
    photographer: 'Tim Dokumentasi Kepegawaian',
    views: 615
  },
  {
    id: 'gal-dinas-3',
    title: 'Rapat Dinas Bulanan & Evaluasi Kinerja Penanganan Perkara SIPP Periode Triwulan III',
    date: '08 September 2026',
    time: '13.30 WITA',
    category: 'kegiatan-dinas',
    categoryLabel: 'Rapat Dinas',
    location: 'Ruang Rapat Pimpinan Dilmilti V Makassar',
    officials: [
      'Kepala Pengadilan Militer Tinggi V Makassar',
      'Panitera & Sekretaris Dilmilti V',
      'Seluruh Panitera Pengganti & Staf Kepaniteraan'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
    desc: 'Evaluasi ketepatan waktu minutasi berkas perkara banding, publikasi putusan pada Direktori Putusan MA, penyelesaian laporan berkala komprehensif, serta optimalisasi penyampaian notifikasi perkara WhatsApp Gateway kepada para pihak.',
    photographer: 'Subbag PTIP Dilmilti V',
    views: 388
  },
  {
    id: 'gal-sidang-1',
    title: 'Sidang Keliling Dinas Militer di Pangkalan TNI AU Sultan Hasanuddin Maros',
    date: '22 September 2026',
    time: '09.00 WITA',
    category: 'sidang',
    categoryLabel: 'Sidang Keliling',
    location: 'Aula Serbaguna Lanud Sultan Hasanuddin Maros',
    officials: [
      'Majelis Hakim Militer Pengadilan Militer Tinggi V',
      'Oditur Militer Penuntut',
      'Penasihat Hukum Prajurit (Kakum Lanud)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
    desc: 'Penyelenggaraan sidang keliling di luar gedung pengadilan untuk memberikan kemudahan akses peradilan bagi satuan-satuan militer yang berlokasi jauh dari ibu kota provinsi, sekaligus edukasi hukum preventif bagi seluruh personel pangkalan udara.',
    photographer: 'Kepaniteraan Pidana Dilmilti V',
    views: 780
  },
  {
    id: 'gal-sidang-2',
    title: 'Persidangan Majelis Hakim Banding Militer Terbuka untuk Umum Perkara Desersi & STUM',
    date: '14 September 2026',
    time: '10.00 WITA',
    category: 'sidang',
    categoryLabel: 'Persidangan Yustisial',
    location: 'Ruang Sidang Utama Dilmilti V Makassar',
    officials: [
      'Majelis Hakim Militer Tinggi (3 Hakim)',
      'Panitera Pengganti Militer',
      'Pihak Pemohon Banding & Penggugat'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=1200&auto=format&fit=crop&q=80',
    desc: 'Pemeriksaan perkara permohonan banding tindak pidana desersi serta sengketa Surat Keputusan Tata Usaha Militer (KTUAB) dengan mengedepankan prinsip keadilan, transparansi yustisial, dan kepastian hukum berlandaskan UU No. 31 Tahun 1997.',
    photographer: 'Kepaniteraan Dilmilti V',
    views: 594
  },
  {
    id: 'gal-bimtek-1',
    title: 'Bimbingan Teknis Administrasi Perkara & Digitalisasi e-Berpadu se-Wilayah Hukum Dilmilti V',
    date: '10 September 2026',
    time: '08.30 WITA',
    category: 'pembinaan',
    categoryLabel: 'Pembinaan Satker',
    location: 'Hotel Claro Makassar & Media Center Dilmilti V',
    officials: [
      'Dirjen Badilmiltun MA-RI (Keynote Speaker daring)',
      'Kepala Dilmilti V Makassar',
      'Kepala & Panitera Dilmil III-16 Makassar, III-17 Manado, III-18 Ambon, III-19 Jayapura'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80',
    desc: 'Kegiatan pembinaan teknis yustisial terpadu yang melibatkan pimpinan dan operator IT dari 4 Pengadilan Militer tingkat pertama di wilayah Indonesia Timur guna menyeragamkan standar minutasi perkara, sinkronisasi SIPP, dan keamanan dokumen BSrE.',
    photographer: 'Panitia Bimtek Wilayah Timur',
    views: 672
  },
  {
    id: 'gal-upacara-1',
    title: 'Upacara Peringatan Hari Ulang Tahun Mahkamah Agung Republik Indonesia ke-81',
    date: '19 Agustus 2026',
    time: '08.00 WITA',
    category: 'upacara',
    categoryLabel: 'Upacara Kenegaraan',
    location: 'Halaman Depan Gedung Pengadilan Militer Tinggi V Makassar',
    officials: [
      'Kepala Pengadilan Militer Tinggi V Makassar (Inspektur Upacara)',
      'Kepala Pengadilan Militer III-16 Makassar',
      'Para Hakim Militer, Pejabat Struktural & Anggota Dharmayukti Karini'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
    desc: 'Peringatan HUT Mahkamah Agung RI ke-81 mengusung tema "Peradilan Tangguh, Indonesia Maju". Acara dilanjutkan dengan pemotongan tumpeng rasa syukur, pemberian penghargaan Satyalancana Karya Satya bagi aparatur berprestasi, dan bakti sosial kemasyarakatan.',
    photographer: 'Humas & Dharmayukti Karini',
    views: 890
  }
];
