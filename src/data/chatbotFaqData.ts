export interface FaqItem {
  id: string;
  category: 'google' | 'banding' | 'stum' | 'dokumen' | 'posbakum' | 'ptsp' | 'hukum';
  categoryLabel: string;
  badge: string;
  question: string;
  shortDesc: string;
  previewAnswer: string;
}

export interface FaqCategory {
  id: 'semua' | 'google' | 'banding' | 'stum' | 'dokumen' | 'posbakum' | 'ptsp' | 'hukum';
  label: string;
  icon: string;
  description: string;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: 'semua', label: '🌟 Semua FAQ', icon: 'Sparkles', description: 'Daftar lengkap seluruh pertanyaan dan panduan resmi' },
  { id: 'google', label: '🌐 Google & Info Terbuka', icon: 'Search', description: 'Pertanyaan umum, berita, profil tokoh & pencarian Google' },
  { id: 'hukum', label: '📚 Hukum & Regulasi', icon: 'BookOpen', description: 'UU 31/1997, KUHDPM, KUHP Baru & PERMA/SEMA MA-RI' },
  { id: 'banding', label: '⚖️ Banding Pidana Militer', icon: 'Scale', description: 'Prosedur, tenggang waktu 7 hari, memori banding & SIPP' },
  { id: 'stum', label: '📜 Sengketa STUM', icon: 'FileText', description: 'Gugatan KTUAB, upaya administratif & tenggang 90 hari' },
  { id: 'dokumen', label: '📄 Dokumen & Pendaftaran', icon: 'FileText', description: 'Pendaftaran perkara di loket PTSP, panjar biaya & template surat' },
  { id: 'posbakum', label: '🤝 Posbakum Gratis', icon: 'Shield', description: 'Layanan advokasi cuma-cuma Rp 0 & sidang prodeo' },
  { id: 'ptsp', label: '🕒 PTSP & Pengaduan', icon: 'Clock', description: 'Jam layanan, kontak WhatsApp & pengawasan SIWAS MA-RI' },
];

export const FAQ_ITEMS: FaqItem[] = [
  // 1. Google & Informasi Terbuka
  {
    id: 'faq-g0',
    category: 'google',
    categoryLabel: 'Google & Info Terbuka',
    badge: 'Penelusuran Regulasi',
    question: 'Bagaimana cara mencari dan menelusuri regulasi UU 31/1997, SIPP, putusan, dan web nasional di Chat AI?',
    shortDesc: 'Penelusuran cerdas terhubung Google Search, pangkalan regulasi UU 31/1997, dan Direktori Putusan MA',
    previewAnswer: 'Ketik langsung pertanyaan atau kata kunci penelusuran Anda di Chat AI (misal: "Cari UU 31/1997", "banding 7 hari", "sengketa STUM", "putusan desersi", atau nomor perkara). Chat AI akan otomatis menjalankan fungsi penelusuran real-time memindai pangkalan data regulasi MA-RI dan Google Search, lalu menyajikan rangkuman jawaban, kutipan pasal kunci, serta tautan sumber resmi yang dapat langsung diklik.'
  },
  {
    id: 'faq-g1',
    category: 'google',
    categoryLabel: 'Google & Info Terbuka',
    badge: 'Fitur Google AI',
    question: 'Bagaimana AI PETA DILMILTI mengambil jawaban dari Google Search dan sumber luar?',
    shortDesc: 'Terintegrasi Google Search Grounding untuk menjawab segala pertanyaan secara aktual',
    previewAnswer: 'AI PETA DILMILTI menggunakan teknologi Google Search Grounding dan API ensiklopedia publik. Setiap kali pengguna menanyakan informasi umum, regulasi nasional, atau berita terkini, AI secara otomatis menelusuri data di internet, menyaring fakta terverifikasi, dan menyertakan tautan sumber rujukan di bagian akhir balasan.'
  },
  {
    id: 'faq-g2',
    category: 'google',
    categoryLabel: 'Google & Info Terbuka',
    badge: 'Mabes TNI',
    question: 'Cari di Google: Siapakah pucuk pimpinan Mabes TNI saat ini dan bagaimana struktur komandonya?',
    shortDesc: 'Panglima TNI, Kepala Staf Angkatan (KASAD, KASAL, KASAU), dan badan pelaksana Mabes TNI',
    previewAnswer: 'Pucuk pimpinan Tentara Nasional Indonesia berada di bawah kendali Panglima TNI yang membawahi tiga matra: Kepala Staf Angkatan Darat (KASAD), Kepala Staf Angkatan Laut (KASAL), dan Kepala Staf Angkatan Udara (KASAU). Pembinaan hukum militer secara teknis dibina oleh Babinkum TNI di bawah supervisi Panglima TNI.'
  },
  {
    id: 'faq-g3',
    category: 'google',
    categoryLabel: 'Google & Info Terbuka',
    badge: 'Penelusuran Web',
    question: 'Bisakah saya menanyakan hal umum di luar peradilan militer, seperti cuaca Makassar atau berita nasional?',
    shortDesc: 'AI dapat menjawab pertanyaan pengetahuan umum, sains, cuaca, dan informasi publik',
    previewAnswer: 'Bisa! Asisten AI PETA DILMILTI dirancang untuk menjawab semua pertanyaan Anda. Jika menyangkut hal di luar lingkup internal satker (seperti info cuaca Sulawesi Selatan, sejarah militer, berita nasional, atau sains), AI akan menelusuri data langsung dari Google dan web terpercaya.'
  },
  {
    id: 'faq-g4',
    category: 'google',
    categoryLabel: 'Google & Info Terbuka',
    badge: 'Direktori MA-RI',
    question: 'Bagaimana cara mencari dan mengunduh salinan putusan kasasi atau banding di Direktori Putusan MA (Putusan3)?',
    shortDesc: 'Akses https://putusan3.mahkamahagung.go.id secara gratis',
    previewAnswer: 'Kunjungi situs resmi https://putusan3.mahkamahagung.go.id, pilih menu Pengadilan Militer Tinggi V Makassar atau Mahkamah Agung, masukkan kata kunci nomor perkara atau nama terdakwa, lalu klik tombol unduh dokumen PDF berkas putusan resmi berwatermark pengadilan.'
  },

  // 2. Hukum & Regulasi Nasional
  {
    id: 'faq-h-buku2',
    category: 'hukum',
    categoryLabel: 'Hukum & Regulasi',
    badge: 'Buku II MA-RI',
    question: 'Apa saja pedoman teknis Buku II SK KMA 159/2026 tentang administrasi peradilan militer?',
    shortDesc: '29 Komponen Sistematika Putusan, Bundel A (24 dok) & Bundel B (11 dok), hak Inzage 7 hari & penahanan',
    previewAnswer: 'SK KMA Nomor 159/KMA/SK.HK2/VIII/2026 (Buku II) mengatur: 1) Sistematika baku 29 komponen putusan Dilmilti; 2) Pengelolaan Bundel A (24 berkas penyidik/penuntut) dan Bundel B (11 dokumen upaya hukum banding); 3) Hak Inzage selama 7 hari kalender bagi terdakwa/penasihat hukum; 4) Kewenangan penahanan banding 30+60 hari; dan 5) Pembantaran (Stuiting) bagi terdakwa rawat inap.'
  },
  {
    id: 'faq-h-uu31',
    category: 'hukum',
    categoryLabel: 'Hukum & Regulasi',
    badge: 'UU 31/1997',
    question: 'Apa saja substansi pokok dan sistematika Undang-Undang Nomor 31 Tahun 1997 tentang Peradilan Militer?',
    shortDesc: 'Organisasi peradilan militer, yurisdiksi prajurit, wewenang Papera/Ankum, banding 7 hari & kasasi 14 hari',
    previewAnswer: 'UU No. 31 Tahun 1997 mengatur: 1) Susunan 4 badan peradilan militer (Dilmil, Dilmilti, Dilmiltama, Dilmilpur); 2) Kewenangan mengadili prajurit TNI (Pasal 9); 3) Wewenang Dilmilti mengadili tingkat pertama Mayor ke atas dan banding (Pasal 41-42); 4) Peran Oditurat Militer, Ankum & Papera (SKEP Pera); 5) Hukum acara pidana militer; 6) Banding tenggang waktu 7 hari (Pasal 225); 7) Kasasi ke MA 14 hari (Pasal 244); 8) Sengketa STUM atas KTUAB 90 hari (Pasal 268-335).'
  },
  {
    id: 'faq-h-wewenang-dilmilti',
    category: 'hukum',
    categoryLabel: 'Hukum & Regulasi',
    badge: 'Pasal 41-42 UU 31',
    question: 'Apa saja kewenangan Pengadilan Militer Tinggi V Makassar berdasarkan Pasal 41 & 42 UU No. 31 Tahun 1997?',
    shortDesc: 'Tingkat pertama tindak pidana prajurit Mayor ke atas (Pamen/Pati) dan tingkat banding dari 6 Dilmil',
    previewAnswer: 'Berdasarkan Pasal 41 dan 42 UU No. 31 Tahun 1997, Pengadilan Militer Tinggi V Makassar berwenang: 1) Mengadili pada tingkat pertama tindak pidana oleh prajurit berpangkat Mayor ke atas (Perwira Menengah & Perwira Tinggi); 2) Mengadili pada tingkat banding seluruh perkara pidana dari 6 Pengadilan Militer tingkat pertama di wilayah Indonesia Timur; dan 3) Memutus pada tingkat pertama dan terakhir sengketa kewenangan mengadili antar-Pengadilan Militer di daerah hukumnya.'
  },
  {
    id: 'faq-h0',
    category: 'hukum',
    categoryLabel: 'Hukum & Regulasi',
    badge: 'Aturan MA-RI',
    question: 'Apa saja aturan yang berlaku di Indonesia khususnya Mahkamah Agung dan badan peradilan?',
    shortDesc: 'UUD 1945, UU Kekuasaan Kehakiman 48/2009, UU Peradilan Militer 31/1997, PERMA, SEMA & SK KMA',
    previewAnswer: 'Penyelenggaraan peradilan berlandaskan Pasal 24 & 24A UUD NRI 1945, UU No. 48/2009 (Kekuasaan Kehakiman), UU No. 14/1985 jo UU No. 3/2009 (Mahkamah Agung), UU No. 31/1997 (Peradilan Militer), KUHDPM, serta Peraturan Mahkamah Agung mengikat seperti PERMA e-Court (No. 7/2022), Posbakum Gratis Rp 0 (No. 1/2014), dan SIWAS Pengawasan (No. 9/2016).'
  },
  {
    id: 'faq-h1',
    category: 'hukum',
    categoryLabel: 'Hukum & Regulasi',
    badge: 'UU 31/1997',
    question: 'Apa perbedaan tugas Polisi Militer, Oditurat Militer, dan Pengadilan Militer menurut UU No. 31 Tahun 1997?',
    shortDesc: 'Penyidik Polisi Militer vs Penuntut Oditur vs Hakim Pengadilan Militer',
    previewAnswer: 'Polisi Militer (Pomdam/Pomal/Pomau) bertindak sebagai penyidik tindak pidana prajurit; Oditurat Militer (Otmil/Otmilti) bertindak sebagai penuntut umum dan pelaksana putusan hakim; sedangkan Pengadilan Militer bertindak sebagai lembaga peradilan yudisial independen di bawah Mahkamah Agung yang mengadili dan memutus perkara.'
  },
  {
    id: 'faq-h2',
    category: 'hukum',
    categoryLabel: 'Hukum & Regulasi',
    badge: 'KUHDPM Pasal 87',
    question: 'Bagaimana sanksi dan unsur pidana desersi dalam Kitab Undang-Undang Hukum Pidana Militer (KUHDPM)?',
    shortDesc: 'Meninggalkan dinas militer tanpa izin >30 hari damai & ancaman pidana pokok serta pemecatan',
    previewAnswer: 'Pasal 87 KUHDPM mengatur militer yang dengan sengaja meninggalkan kesatuan tanpa izin lebih dari 30 hari berturut-turut pada masa damai diancam pidana penjara maksimal 2 tahun 8 bulan, dan umumnya dijatuhi pidana tambahan pemecatan dari dinas keprajuritan (PDTH).'
  },
  {
    id: 'faq-h3',
    category: 'hukum',
    categoryLabel: 'Hukum & Regulasi',
    badge: 'KUHP Baru 2026',
    question: 'Bagaimana keterkaitan KUHP Nasional Baru (UU No. 1 Tahun 2023) dengan tindak pidana prajurit TNI?',
    shortDesc: 'Prinsip Lex Specialis Derogat Legi Generali antara KUHP Nasional dan KUHDPM',
    previewAnswer: 'KUHP Baru (UU No. 1 Tahun 2023) berlaku sebagai ketentuan pidana materiil umum nasional. Namun untuk tindak pidana yang bersifat khas militer (murni militer) atau yang diatur secara khusus dalam KUHDPM dan UU No. 31 Tahun 1997, tetap berlaku asas Lex Specialis Derogat Legi Generali.'
  },
  {
    id: 'faq-h4',
    category: 'hukum',
    categoryLabel: 'Hukum & Regulasi',
    badge: 'Kasasi MA-RI',
    question: 'Apa syarat dan batas waktu permohonan Kasasi perkara pidana militer ke Mahkamah Agung RI?',
    shortDesc: 'Tenggang waktu 14 hari kalender setelah putusan banding diberitahukan resmi',
    previewAnswer: 'Permohonan kasasi diajukan dalam tenggang waktu 14 hari kalender sejak putusan banding diberitahukan secara sah. Pemohon wajib menandatangani Akta Kasasi dan menyerahkan Memori Kasasi dalam batas waktu 14 hari berikutnya melalui Kepaniteraan Dilmilti V Makassar.'
  },

  // 3. Banding Pidana Militer
  {
    id: 'faq-b1',
    category: 'banding',
    categoryLabel: 'Banding Militer',
    badge: 'Tenggang Waktu',
    question: 'Berapa batas waktu (tenggang hari) untuk menyatakan banding perkara pidana militer?',
    shortDesc: '7 (tujuh) hari kalender sejak putusan diucapkan atau diberitahukan',
    previewAnswer: 'Berdasarkan Pasal 225 UU No. 31 Tahun 1997, pernyataan banding wajib disampaikan dalam tenggang waktu 7 (tujuh) hari kalender setelah putusan dibacakan di muka sidang terbuka atau sejak putusan diberitahukan kepada terdakwa yang tidak hadir.'
  },
  {
    id: 'faq-b2',
    category: 'banding',
    categoryLabel: 'Banding Militer',
    badge: 'Alur Banding',
    question: 'Bagaimana alur pemeriksaan berkas perkara banding di Pengadilan Militer Tinggi V Makassar?',
    shortDesc: 'Pendaftaran akta di Dilmil pertama, pengiriman Bundel A & B, registrasi, majelis hakim banding',
    previewAnswer: 'Pemohon menyatakan banding di Pengadilan Militer tingkat pertama (III-16 Makassar, III-17 Manado, III-18 Ambon, atau III-19 Jayapura). Pengadilan tingkat pertama menyusun Bundel A dan Bundel B lalu mengirimkannya ke Dilmilti V Makassar untuk diregistrasi SIPP, ditunjuk Majelis Hakim Banding, dan diputus dalam sidang permusyawaratan.'
  },
  {
    id: 'faq-b3',
    category: 'banding',
    categoryLabel: 'Banding Militer',
    badge: 'Syarat Berkas',
    question: 'Dokumen apa saja yang harus diserahkan pemohon atau penasihat hukum saat mengajukan banding?',
    shortDesc: 'Akta Banding, Memori Banding, Surat Kuasa Khusus / Surat Perintah Pakum, KTA/KTP',
    previewAnswer: 'Dokumen wajib meliputi: 1) Akta Permohonan Banding dari Dilmil pengaju, 2) Memori Banding yang menguraikan alasan keberatan fakta/penerapan hukum, 3) Surat Kuasa Khusus (atau Sprin Babinkum bagi Perwira Hukum), dan 4) Tanda bukti identitas sah.'
  },
  {
    id: 'faq-b4',
    category: 'banding',
    categoryLabel: 'Banding Militer',
    badge: 'SIPP Online',
    question: 'Bagaimana cara melacak perkembangan perkara banding di website Dilmilti V Makassar?',
    shortDesc: 'Gunakan fitur Penelusuran Perkara SIPP atau ketikkan nomor register langsung ke chatbot AI',
    previewAnswer: 'Buka menu Informasi Perkara > Penelusuran Perkara (SIPP) di website resmi, atau ketik langsung nomor register perkara (misalnya 12-K/PMT.V/BDG) di chatbot AI ini untuk mengetahui susunan majelis hakim, tahapan proses, dan tanggal sidang terkini.'
  },

  // 4. Sengketa STUM (Tata Usaha Militer)
  {
    id: 'faq-s1',
    category: 'stum',
    categoryLabel: 'Sengketa STUM',
    badge: 'Objek STUM',
    question: 'Keputusan pejabat militer apa saja yang dapat digugat sebagai objek Sengketa Tata Usaha Militer (STUM)?',
    shortDesc: 'Keputusan Tata Usaha Angkatan Bersenjata (KTUAB) tertulis, konkret, individual, dan final',
    previewAnswer: 'Objek STUM adalah KTUAB yang diterbitkan oleh pejabat militer (Panglima TNI, KASAD, KASAL, KASAU, Pangdam, Danrem, Danlanud, Danlantamal) yang menimbulkan akibat hukum bagi prajurit/PNS TNI, seperti Surat Keputusan Pemecatan, Penurunan Pangkat, atau Mutasi Jabatan yang dinilai bertentangan dengan peraturan perundang-undangan.'
  },
  {
    id: 'faq-s2',
    category: 'stum',
    categoryLabel: 'Sengketa STUM',
    badge: 'Tenggang Waktu STUM',
    question: 'Berapa batas waktu maksimal pendaftaran gugatan STUM sejak surat keputusan diterima?',
    shortDesc: '90 (sembilan puluh) hari kalender sejak SK militer atau hasil upaya administratif diterima',
    previewAnswer: 'Gugatan sengketa STUM wajib diajukan ke Pengadilan Militer Tinggi V Makassar dalam jangka waktu 90 hari kalender sejak keputusan KTUAB atau jawaban atas upaya administratif diterima secara sah oleh pihak Penggugat.'
  },
  {
    id: 'faq-s3',
    category: 'stum',
    categoryLabel: 'Sengketa STUM',
    badge: 'Upaya Administratif',
    question: 'Apakah wajib menempuh upaya administratif sebelum mendaftarkan gugatan STUM ke pengadilan?',
    shortDesc: 'Wajib mengajukan surat keberatan / banding administratif kepada atasan pejabat penerbit SK',
    previewAnswer: 'Ya, sesuai prinsip hukum administrasi peradilan militer, penggugat terlebih dahulu mengajukan surat keberatan atau permohonan peninjauan kembali kepada atasan pejabat yang menerbitkan surat keputusan sebelum mengajukan gugatan ke Dilmilti V Makassar.'
  },

  // 5. Dokumen & Pendaftaran Perkara
  {
    id: 'faq-e1',
    category: 'dokumen',
    categoryLabel: 'Dokumen & Pendaftaran',
    badge: 'Pendaftaran PTSP',
    question: 'Bagaimana prosedur pendaftaran perkara di Pengadilan Militer Tinggi V Makassar?',
    shortDesc: 'Pendaftaran dilakukan langsung melalui loket Meja PTSP Kepaniteraan Dilmilti V Makassar',
    previewAnswer: 'Pendaftaran perkara banding pidana militer dan sengketa TUN Militer (STUM) diajukan langsung melalui loket Pelayanan Terpadu Satu Pintu (PTSP) Pengadilan Militer Tinggi V Makassar atau melalui Pengadilan Militer tingkat pertama pengaju. Dilmilti V belum menggunakan e-Court untuk pendaftaran perkara.'
  },
  {
    id: 'faq-e2',
    category: 'dokumen',
    categoryLabel: 'Dokumen & Pendaftaran',
    badge: 'Unduh Formulir',
    question: 'Di mana saya bisa mengunduh formulir resmi permohonan banding, surat kuasa, dan dokumen PPID?',
    shortDesc: 'Tersedia di Menu Dokumen & Laporan > Pusat Template Dokumen siap cetak Word & PDF',
    previewAnswer: 'Silakan kunjungi menu navigasi Dokumen & Laporan > Pusat Template Dokumen di website ini. Tersedia format siap pakai untuk: Blanko Permohonan Banding Pidana Militer, Blanko Surat Gugatan STUM, Blanko Surat Kuasa Khusus, Blanko Posbakum Gratis, serta Formulir Permohonan Informasi Publik PPID.'
  },
  {
    id: 'faq-e3',
    category: 'dokumen',
    categoryLabel: 'Dokumen & Pendaftaran',
    badge: 'Panjar Biaya',
    question: 'Bagaimana ketentuan biaya perkara pidana militer dan sengketa STUM?',
    shortDesc: 'Pidana militer Rp 0 (dibiayai negara Ps. 248 UU 31/1997); sengketa STUM disetor via loket PTSP',
    previewAnswer: 'Berdasarkan Pasal 248 UU No. 31 Tahun 1997, perkara pidana militer tidak dikenakan biaya (dibebankan kepada negara). Sedangkan untuk sengketa Tata Usaha Militer (STUM), panjar biaya perkara disetor langsung melalui rekening dinas resmi yang diterbitkan oleh Meja PTSP.'
  },

  // 6. Posbakum & Bantuan Hukum Cuma-Cuma
  {
    id: 'faq-p1',
    category: 'posbakum',
    categoryLabel: 'Posbakum Gratis',
    badge: 'Layanan Bebas Biaya',
    question: 'Apakah prajurit Tamtama dan Bintara bisa mendapat bantuan hukum gratis di Posbakum Dilmilti V Makassar?',
    shortDesc: 'Layanan konsultasi hukum Rp 0 (cuma-cuma) di ruang PTSP dan persidangan',
    previewAnswer: 'Tentu saja! Seluruh prajurit TNI (Tamtama, Bintara, Perwira) serta masyarakat pencari keadilan berhak menerima layanan Posbakum cuma-cuma tanpa dipungut biaya apapun (Rp 0) untuk pembuatan berkas hukum, permohonan banding, dan konsultasi hukum.'
  },
  {
    id: 'faq-p2',
    category: 'posbakum',
    categoryLabel: 'Posbakum Gratis',
    badge: 'Sidang Prodeo',
    question: 'Bagaimana cara mengajukan pembebasan seluruh biaya perkara (Sidang Prodeo)?',
    shortDesc: 'Melampirkan Surat Keterangan Tidak Mampu (SKTM) atau rekomendasi Komandan Satuan',
    previewAnswer: 'Pemohon cukup melampirkan identitas KTA/KTP serta Surat Keterangan Tidak Mampu (SKTM) dari Lurah/Desa atau surat keterangan tidak mampu dari Komandan Satuan pada saat mendaftarkan permohonan perkara di meja PTSP Dilmilti V Makassar.'
  },
  {
    id: 'faq-p3',
    category: 'posbakum',
    categoryLabel: 'Posbakum Gratis',
    badge: 'Hak Terdakwa',
    question: 'Apa saja hak-hak terdakwa prajurit TNI selama menjalani proses persidangan?',
    shortDesc: 'Didampingi Penasihat Hukum / Pakum Babinkum, hak membela diri, saksi a de charge, banding & kasasi',
    previewAnswer: 'Terdakwa prajurit berhak mendapatkan pendampingan Perwira Hukum (Pakum) Babinkum atau advokat sipil, hak memberikan keterangan bebas tanpa tekanan, hak menghadirkan saksi/ahli meringankan (a de charge), serta hak mengajukan upaya hukum banding dan kasasi.'
  },

  // 7. PTSP & Pengawasan SIWAS
  {
    id: 'faq-t1',
    category: 'ptsp',
    categoryLabel: 'PTSP & Pengaduan',
    badge: 'Jam Layanan',
    question: 'Berapa jam operasional Meja Pelayanan Terpadu Satu Pintu (PTSP) Dilmilti V Makassar?',
    shortDesc: 'Senin - Kamis: 08.00 - 16.30 WITA | Jumat: 08.00 - 17.00 WITA',
    previewAnswer: 'PTSP buka Senin–Kamis pukul 08.00–16.30 WITA (Istirahat 12.00–13.00 WITA) dan Jumat pukul 08.00–17.00 WITA (Istirahat 11.30–13.30 WITA). Layanan online (e-Court, SIPP, WhatsApp Bot) beroperasi 24 jam nonstop.'
  },
  {
    id: 'faq-t2',
    category: 'ptsp',
    categoryLabel: 'PTSP & Pengaduan',
    badge: 'Alamat & Kontak',
    question: 'Di mana alamat kantor dan nomor WhatsApp resmi Pengadilan Militer Tinggi V Makassar?',
    shortDesc: 'Kompleks Mall Phinisi Point Makassar & Hotline WhatsApp 0811-4440-5554',
    previewAnswer: 'Alamat kantor berada di Jalan Metro Tanjung Bunga Kompleks Mall Phinisi Point Makassar, Sulawesi Selatan 90122. Kontak WhatsApp resmi: 0811-4440-5554 dan email dilmiti5makassar@gmail.com.'
  },
  {
    id: 'faq-t3',
    category: 'ptsp',
    categoryLabel: 'PTSP & Pengaduan',
    badge: 'SIWAS MA-RI',
    question: 'Bagaimana cara menyampaikan pengaduan resmi atas pelayanan atau pelanggaran aparatur secara rahasia?',
    shortDesc: 'Portal online https://siwas.mahkamahagung.go.id & SP4N-LAPOR! identitas terlindungi penuh',
    previewAnswer: 'Pengaduan dapat dilaporkan secara online dan rahasia melalui aplikasi SIWAS Mahkamah Agung di https://siwas.mahkamahagung.go.id, portal SP4N-LAPOR! di https://www.lapor.go.id, atau Meja Pengaduan PTSP. Identitas pelapor dilindungi kerahasiaannya sesuai PERMA No. 9 Tahun 2016.'
  }
];

export const POPULAR_QUICK_CHIPS = [
  { label: '⚖️ UU No. 31/1997 Peradilan Militer', text: 'Apa saja pokok aturan dan wewenang pengadilan militer dalam UU No. 31 Tahun 1997?' },
  { label: '📘 Buku II Pedoman MA (SK KMA 159)', text: 'Apa saja pedoman teknis Buku II SK KMA 159/2026 mengenai sistematika putusan, Bundel A/B, dan hak Inzage?' },
  { label: '🏛️ Aturan MA & Peradilan', text: 'Apa saja aturan yang berlaku di Indonesia khususnya Mahkamah Agung dan badan peradilan?' },
  { label: '🌐 Google: Struktur Mabes TNI', text: 'Bagaimana struktur pimpinan Mabes TNI dan hubungannya dengan peradilan militer menurut informasi resmi?' },
  { label: '⚖️ Batas Waktu Banding Militer', text: 'Berapa batas waktu (tenggang hari) untuk mengajukan permohonan banding perkara pidana militer?' },
  { label: '📜 Syarat Objek Gugatan STUM', text: 'Keputusan pejabat militer apa saja yang dapat digugat sebagai objek Sengketa Tata Usaha Militer (STUM)?' },
  { label: '🏛️ Pendaftaran Perkara di PTSP', text: 'Bagaimana prosedur pendaftaran perkara banding dan sengketa STUM di Meja PTSP Dilmilti V Makassar?' },
  { label: '📄 Unduh Template Dokumen', text: 'Di mana saya bisa mengunduh formulir resmi permohonan banding, surat kuasa, dan dokumen PPID?' },
  { label: '🤝 Bantuan Posbakum Gratis Rp 0', text: 'Apakah prajurit Tamtama dan Bintara bisa mendapat bantuan hukum gratis di Posbakum Dilmilti V Makassar?' },
  { label: '🕒 Jam Layanan PTSP & Kontak', text: 'Berapa jam operasional Meja PTSP Dilmilti V Makassar dan bagaimana cara konsultasi via WhatsApp?' },
  { label: '🛡️ Lapor Pengaduan SIWAS MA', text: 'Bagaimana cara menyampaikan pengaduan resmi melalui SIWAS Mahkamah Agung RI?' }
];
