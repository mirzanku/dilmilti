import { PerkaraSIPP, JadwalSidangItem } from '../types';

export const INITIAL_PERKARA_SIPP: PerkaraSIPP[] = [
  {
    id: 'perkara-01',
    nomorPerkara: '24-K/PMT.V/BDG/AD/VIII/2026',
    nomorRegisterOditurat: 'REG-OD-08/OT.IV/2026',
    jenisPerkara: 'Tindak Pidana Militer (Banding)',
    klasifikasi: 'Pelanggaran Disiplin/Desersi',
    tingkatPerkara: 'Banding',
    tanggalDaftar: '12 Agustus 2026',
    statusPerkara: 'Pemeriksaan',
    terdakwa: {
      nama: 'Kapten Inf Hendra Wardana, S.T.Han.',
      pangkat: 'Kapten',
      korps: 'Inf',
      nrp: '11090028470487',
      kesatuan: 'Kodam XIV/Hasanuddin - Brigif 11/Badik Sakti',
      matra: 'TNI AD'
    },
    oditurMiliter: 'Kolonel Chk Bambang Setyawan, S.H., M.H. (Oditurat Militer Tinggi IV Makassar)',
    majelisHakim: {
      ketua: 'Kolonel Chk Sultan, S.H. (Wakadilmilti V Makassar)',
      anggota1: 'Kolonel Chk Sugeng Aryanto, S.H., M.H.',
      anggota2: 'Kolonel Chk Agus Husin, S.H., M.H.'
    },
    paniteraPengganti: 'Kapten Chk Rusjana, S.H.',
    jadwalSidangBerikutnya: {
      tanggal: '18 September 2026',
      jam: '09:30 WITA',
      ruang: 'Ruang Sidang Utama Kartika Dilmilti V',
      agenda: 'Pemeriksaan Keterangan Saksi Ahli & Komandan Satuan'
    },
    amarPutusan: 'Perkara dalam proses pemeriksaan majelis banding.',
    tahapanPerkara: [
      { tanggal: '12 Agustus 2026', agenda: 'Penerimaan Berkas Banding dari Pengadilan Militer V-17 Makassar', keterangan: 'Berkas perkara dan memori banding diterima lengkap', selesai: true },
      { tanggal: '19 Agustus 2026', agenda: 'Penetapan Majelis Hakim & Panitera Pengganti', keterangan: 'Penetapan Ketua Dilmilti V No. TAP/24-K/PMT.V/2026', selesai: true },
      { tanggal: '26 Agustus 2026', agenda: 'Sidang Pertama: Pembacaan Memori Banding', keterangan: 'Terdakwa hadir didampingi Penasihat Hukum Kumdam', selesai: true },
      { tanggal: '08 September 2026', agenda: 'Pemeriksaan Alat Bukti Surat & Saksi Fakta', keterangan: 'Saksi Oditur Militer didengarkan keterangannya', selesai: true },
      { tanggal: '18 September 2026', agenda: 'Pemeriksaan Saksi Ahli Militer', keterangan: 'Dijadwalkan di Ruang Sidang Kartika', selesai: false }
    ]
  },
  {
    id: 'perkara-02',
    nomorPerkara: '18-K/PMT.V/AD/VII/2026',
    nomorRegisterOditurat: 'REG-OD-14/OT.IV/2026',
    jenisPerkara: 'Tindak Pidana Khusus Militer (Tingkat Pertama)',
    klasifikasi: 'Tindak Pidana Khusus Militer',
    tingkatPerkara: 'Tingkat Pertama',
    tanggalDaftar: '21 Juli 2026',
    statusPerkara: 'Tuntutan Oditur',
    terdakwa: {
      nama: 'Mayor Cba Rahmat Hidayat, S.E.',
      pangkat: 'Mayor',
      korps: 'Cba',
      nrp: '11030019230581',
      kesatuan: 'Bekangdam XIV/Hasanuddin',
      matra: 'TNI AD'
    },
    oditurMiliter: 'Kolonel Sus Hendro Wijaya, S.H., M.H.',
    majelisHakim: {
      ketua: 'Kolonel Chk Sugeng Aryanto, S.H., M.H.',
      anggota1: 'Kolonel Chk Agus Husin, S.H., M.H.',
      anggota2: 'Kolonel Kum Mustofa, S.H., M.H.'
    },
    paniteraPengganti: 'Mayor Chk Mahpul Saepuloh, S.H.',
    jadwalSidangBerikutnya: {
      tanggal: '16 September 2026',
      jam: '10:00 WITA',
      ruang: 'Ruang Sidang Garuda (Militer)',
      agenda: 'Pembacaan Surat Tuntutan (Requisitoir) oleh Oditur Militer Tinggi'
    },
    amarPutusan: 'Sidang pembacaan tuntutan perkara.',
    tahapanPerkara: [
      { tanggal: '21 Juli 2026', agenda: 'Pelimpahan Berkas Perkara Perwira Menengah', keterangan: 'Register perkara tingkat pertama wewenang Dilmilti V', selesai: true },
      { tanggal: '28 Juli 2026', agenda: 'Sidang Pembacaan Surat Dakwaan Oditur', keterangan: 'Didakwa Pasal 126 KUHPM jo Pasal 55 KUHP', selesai: true },
      { tanggal: '11 Agustus 2026', agenda: 'Eksepsi Penasihat Hukum Terdakwa', keterangan: 'Eksepsi ditolak majelis dalam putusan sela', selesai: true },
      { tanggal: '25 Agustus 2026', agenda: 'Pemeriksaan 4 Orang Saksi', keterangan: 'Saksi Oditur dan Saksi Mahkota didengar keterangannya', selesai: true },
      { tanggal: '16 September 2026', agenda: 'Tuntutan Pidana Oditur Militer', keterangan: 'Jadwal sidang penetapan', selesai: false }
    ]
  },
  {
    id: 'perkara-03',
    nomorPerkara: '12-TUN/PMT.V/2026',
    nomorRegisterOditurat: 'REG-TUN-02/PMT.V/2026',
    jenisPerkara: 'Sengketa Tata Usaha Militer (Banding)',
    klasifikasi: 'Sengketa Kepegawaian TNI/TUN',
    tingkatPerkara: 'Banding',
    tanggalDaftar: '04 Juni 2026',
    statusPerkara: 'Putusan Diucapkan',
    terdakwa: {
      nama: 'Letkol Laut (T) Kurniawan Prasetya',
      pangkat: 'Letkol',
      korps: 'Laut (T)',
      nrp: '14233/P',
      kesatuan: 'Lantamal VI Makassar - Koarmada II',
      matra: 'TNI AL'
    },
    oditurMiliter: 'Kuasa Hukum Pangkoarmada II (Tergugat/Terbanding)',
    majelisHakim: {
      ketua: 'Kolonel Chk Sultan, S.H.',
      anggota1: 'Kolonel Chk Sugeng Aryanto, S.H., M.H.',
      anggota2: 'Kolonel Kum Mustofa, S.H., M.H.'
    },
    paniteraPengganti: 'Kolonel Kum M. Nirwan Said, S.H., M.H.',
    amarPutusan: 'MENGADILI: 1. Menerima permohonan banding dari Penggugat/Pembanding; 2. Membatalkan Putusan Dilmil III-16 Makassar; 3. Menyatakan Batal Keputusan Tata Usaha Militer mengenai Pemberhentian Dengan Hormat; 4. Mewajibkan Tergugat merehabilitasi hak dan martabat Pembanding.',
    tanggalPutusan: '28 Agustus 2026',
    petikanUrl: '#petikan-12-tun-2026',
    tahapanPerkara: [
      { tanggal: '04 Juni 2026', agenda: 'Pendaftaran Berkas Permohonan Banding Sengketa TUN', keterangan: 'Daftar melalui e-Court Dilmilti V', selesai: true },
      { tanggal: '18 Juni 2026', agenda: 'Pemeriksaan Persiapan Majelis Hakim Banding', keterangan: 'Verifikasi objek sengketa SK Militer', selesai: true },
      { tanggal: '09 Juli 2026', agenda: 'Musyawarah Majelis Hakim Militer Tinggi', keterangan: 'Musyawarah hakim tertutup', selesai: true },
      { tanggal: '28 Agustus 2026', agenda: 'Sidang Pengucapan Putusan Banding', keterangan: 'Putusan dibacakan terbuka untuk umum, e-Court notification sent', selesai: true }
    ]
  },
  {
    id: 'perkara-04',
    nomorPerkara: '09-K/PMT.V/BDG/AU/2026',
    nomorRegisterOditurat: 'REG-OD-05/OT.IV/2026',
    jenisPerkara: 'Tindak Pidana Militer (Banding)',
    klasifikasi: 'Pelanggaran Disiplin/Desersi',
    tingkatPerkara: 'Banding',
    tanggalDaftar: '15 Mei 2026',
    statusPerkara: 'BHT (Inkracht)',
    terdakwa: {
      nama: 'Mayor Pas Erwin Nugroho',
      pangkat: 'Mayor',
      korps: 'Pas',
      nrp: '528912',
      kesatuan: 'Kopasgat TNI AU - Wing Komando II',
      matra: 'TNI AU'
    },
    oditurMiliter: 'Kolonel Sus Hendro Wijaya, S.H., M.H.',
    majelisHakim: {
      ketua: 'Kolonel Kum Mustofa, S.H., M.H.',
      anggota1: 'Kolonel Chk Sugeng Aryanto, S.H., M.H.',
      anggota2: 'Kolonel Chk Agus Husin, S.H., M.H.'
    },
    paniteraPengganti: 'Kapten Chk Rusjana, S.H.',
    amarPutusan: 'MENGADILI: Menguatkan Putusan Pengadilan Militer III-17 Manado No. 14-K/PM.III-17/AU/III/2026. Menjatuhkan pidana penjara selama 1 (satu) tahun dan pidana tambahan dipecat dari dinas militer TNI AU.',
    tanggalPutusan: '15 Juli 2026',
    petikanUrl: '#petikan-09-k-2026',
    tahapanPerkara: [
      { tanggal: '15 Mei 2026', agenda: 'Penerimaan Berkas Banding', keterangan: 'Pelimpahan berkas kasasi/banding lengkap', selesai: true },
      { tanggal: '02 Juni 2026', agenda: 'Pemeriksaan Alat Bukti & Berita Acara', keterangan: 'Pemeriksaan berkas dan tanggapan oditur', selesai: true },
      { tanggal: '15 Juli 2026', agenda: 'Pengucapan Putusan Banding', keterangan: 'Menguatkan putusan tingkat pertama', selesai: true },
      { tanggal: '30 Juli 2026', agenda: 'Berkas Telah Berkekuatan Hukum Tetap (BHT)', keterangan: 'Para pihak menerima putusan, petikan dikirim ke Ankum', selesai: true }
    ]
  },
  {
    id: 'perkara-05',
    nomorPerkara: '31-K/PMT.V/AD/IX/2026',
    nomorRegisterOditurat: 'REG-OD-22/OT.IV/2026',
    jenisPerkara: 'Tindak Pidana Umum Militer (Tingkat Pertama)',
    klasifikasi: 'Tindak Pidana Umum',
    tingkatPerkara: 'Tingkat Pertama',
    tanggalDaftar: '02 September 2026',
    statusPerkara: 'Pemeriksaan',
    terdakwa: {
      nama: 'Letkol Inf Agus Supriyadi, M.Han.',
      pangkat: 'Letkol',
      korps: 'Inf',
      nrp: '11020031890179',
      kesatuan: 'Korem 141/Toddopuli Kodam XIV',
      matra: 'TNI AD'
    },
    oditurMiliter: 'Kolonel Chk Bambang Setyawan, S.H., M.H.',
    majelisHakim: {
      ketua: 'Kolonel Chk Sultan, S.H.',
      anggota1: 'Kolonel Chk Sugeng Aryanto, S.H., M.H.',
      anggota2: 'Kolonel Chk Agus Husin, S.H., M.H.'
    },
    paniteraPengganti: 'Kapten Chk Rusjana, S.H.',
    jadwalSidangBerikutnya: {
      tanggal: '17 September 2026',
      jam: '09:00 WITA',
      ruang: 'Ruang Sidang Utama Kartika Dilmilti V',
      agenda: 'Sidang Pertama: Pembacaan Surat Dakwaan Oditur Militer Tinggi'
    },
    amarPutusan: 'Perkara baru diregistrasi, menunggu sidang perdana.',
    tahapanPerkara: [
      { tanggal: '02 September 2026', agenda: 'Pelimpahan Berkas Perkara Dari Oditurat Militer Tinggi IV', keterangan: 'Diterima Panitera Muda Pidana Militer', selesai: true },
      { tanggal: '04 September 2026', agenda: 'Penetapan Hari Sidang (PHS) & Penunjukan Majelis', keterangan: 'Sidang ditetapkan Kamis, 17 September 2026', selesai: true },
      { tanggal: '08 September 2026', agenda: 'Penyampaian Relaas Panggilan Sidang Elektronik (e-Summons)', keterangan: 'Terkirim kepada Oditur dan Komandan Satuan Terdakwa', selesai: true },
      { tanggal: '17 September 2026', agenda: 'Sidang Perdana: Pembacaan Dakwaan', keterangan: 'Terjadwal di Ruang Kartika', selesai: false }
    ]
  }
];

export const INITIAL_JADWAL_SIDANG: JadwalSidangItem[] = [
  {
    id: 'sidang-01',
    nomorPerkara: '18-K/PMT.V/AD/VII/2026',
    terdakwa: 'Mayor Cba Rahmat Hidayat, S.E.',
    kesatuan: 'Bekangdam XIV/Hasanuddin (TNI AD)',
    tanggal: '16 September 2026',
    waktu: '10:00 - 12:30 WITA',
    ruangSidang: 'Ruang Sidang Garuda (Tingkat I)',
    agenda: 'Pembacaan Surat Tuntutan (Requisitoir) Oditur Militer Tinggi',
    majelisHakim: 'Kolonel Chk Sugeng Aryanto, S.H., M.H.',
    oditur: 'Kolonel Sus Hendro Wijaya, S.H., M.H.',
    status: 'Sedang Berlangsung'
  },
  {
    id: 'sidang-02',
    nomorPerkara: '31-K/PMT.V/AD/IX/2026',
    terdakwa: 'Letkol Inf Agus Supriyadi, M.Han.',
    kesatuan: 'Korem 141/Toddopuli (TNI AD)',
    tanggal: '17 September 2026',
    waktu: '09:00 - 11:30 WITA',
    ruangSidang: 'Ruang Sidang Utama Kartika',
    agenda: 'Sidang Pertama: Pembacaan Surat Dakwaan Oditur Militer',
    majelisHakim: 'Kolonel Chk Sultan, S.H.',
    oditur: 'Kolonel Chk Bambang Setyawan, S.H., M.H.',
    status: 'Akan Datang'
  },
  {
    id: 'sidang-03',
    nomorPerkara: '24-K/PMT.V/BDG/AD/VIII/2026',
    terdakwa: 'Kapten Inf Hendra Wardana, S.T.Han.',
    kesatuan: 'Brigif 11/Badik Sakti (TNI AD)',
    tanggal: '18 September 2026',
    waktu: '09:30 - 12:00 WITA',
    ruangSidang: 'Ruang Sidang Utama Kartika',
    agenda: 'Pemeriksaan Keterangan Saksi Ahli & Komandan Satuan',
    majelisHakim: 'Kolonel Chk Sultan, S.H.',
    oditur: 'Kolonel Chk Bambang Setyawan, S.H., M.H.',
    status: 'Akan Datang'
  },
  {
    id: 'sidang-04',
    nomorPerkara: '12-TUN/PMT.V/2026',
    terdakwa: 'Letkol Laut (T) Kurniawan Prasetya (Pembanding)',
    kesatuan: 'Lantamal VI Makassar (TNI AL)',
    tanggal: '28 Agustus 2026',
    waktu: '10:00 - 11:15 WITA',
    ruangSidang: 'Ruang Sidang Elektronik / Teleconference',
    agenda: 'Sidang Pembacaan Putusan Akhir Sengketa TUN Militer',
    majelisHakim: 'Kolonel Chk Sultan, S.H.',
    oditur: 'Kuasa Hukum Pangkoarmada II',
    status: 'Selesai'
  }
];
