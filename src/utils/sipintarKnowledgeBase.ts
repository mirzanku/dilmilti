import {
  REGULATORY_DATABASE,
  searchRegulatoryDatabase,
  formatRegulatoryReferencesMarkdown,
  RegulatorySearchResult
} from '../data/regulatoryDatabase';

export interface SipintarContextData {
  courtIdentity?: any;
  personnelList?: any[];
  sippList?: any[];
  jadwalList?: any[];
  dipList?: any[];
  newsList?: any[];
  jurisdictionCourts?: any[];
}

export const OFFICIAL_EXTERNAL_SOURCES = {
  MA_RI: { name: 'Portal Resmi Mahkamah Agung RI', url: 'https://www.mahkamahagung.go.id' },
  BADILMILTUN: { name: 'Ditjen Badilmiltun MA-RI', url: 'https://badilmiltun.mahkamahagung.go.id' },
  JDIH_MA: { name: 'JDIH Mahkamah Agung RI (Regulasi & SK KMA)', url: 'https://jdih.mahkamahagung.go.id' },
  PUTUSAN_MA: { name: 'Direktori Putusan Mahkamah Agung RI', url: 'https://putusan3.mahkamahagung.go.id' },
  EBERPADU: { name: 'Portal e-BERPADU Mahkamah Agung RI', url: 'https://eberpadu.mahkamahagung.go.id' },
  SIWAS: { name: 'Sistem Informasi Pengawasan (SIWAS MA-RI)', url: 'https://siwas.mahkamahagung.go.id' },
  LAPOR: { name: 'SP4N-LAPOR! Layanan Pengaduan Nasional', url: 'https://www.lapor.go.id' },
  KOMISI_YUDISIAL: { name: 'Komisi Yudisial Republik Indonesia', url: 'https://www.komisiyudisial.go.id' },
  JDIHN: { name: 'JDIH Nasional (Database Peraturan RI)', url: 'https://jdihn.go.id' },
  TNI: { name: 'Portal Resmi Mabes TNI & Babinkum TNI', url: 'https://tni.mil.id' }
};

export function buildSipintarSystemInstruction(ctx?: SipintarContextData): string {
  const courtIdentity = ctx?.courtIdentity || {};
  const courtName = courtIdentity.name || 'PENGADILAN MILITER TINGGI V MAKASSAR';
  const courtAddr = courtIdentity.address || 'Jalan Metro Tanjung Bunga Kompleks Mall Phinisi Point Makassar, Sulawesi Selatan 90122';
  const courtPhone = courtIdentity.phone || '081144405554';
  const courtWA = courtIdentity.whatsapp || '0811-4440-5554';
  const courtEmail = courtIdentity.email || 'dilmiti5makassar@gmail.com';
  const courtJam = courtIdentity.jamOperasional || 'Senin - Kamis 08.00 - 16.30 WITA, Jumat 08.00 - 17.00 WITA';

  const personnelSummary = Array.isArray(ctx?.personnelList) && ctx!.personnelList.length > 0
    ? ctx!.personnelList
        .slice(0, 20)
        .map((p: any) => `- ${p.nama} (${p.jabatan} | Pangkat/Korps: ${String(p.pangkat || '').split('/')[0].trim()} | NIP/NRP: ${p.nipNrp || '-'})`)
        .join('\n')
    : `- Kolonel Chk Sultan, S.H. (Kepala Pengadilan Militer Tinggi V Makassar / Kadilmilti)
- Kolonel Chk Sugeng Aryanto, S.H., M.H. (Hakim Militer Tinggi)
- Kolonel Chk Agus Husin, S.H., M.H. (Hakim Militer Tinggi)
- Kolonel Kum Mustofa, S.H., M.H. (Hakim Militer Tinggi)
- Kolonel Kum M. Nirwan Said, S.H., M.H. (Hakim Militer Tinggi)
- Mayor Chk Mahpul Saepuloh, S.H. (Panitera)
- Kapten Chk Rusjana, S.H. (Panitera Pengganti)
- Muhammad Arfah Afendi, S.E., M.M. (Sekretaris)
- Herna Dian Prihatiny Napan, S.T. (Kepala Sub Bagian Kepegawaian dan TI)
- Andi Adzan Mirzan, S.Kom., M.M. (Kepala Sub Bagian Perencanaan, TI dan Pelaporan)
- Muhammad Imam S, S.H. (Kepala Sub Bagian Umum dan Keuangan)
- Allen Farlianso, S.E. (Pranata Keuangan APBN Mahir)
- Afni Syafaatun, S.A.P., M.A.P. (Arsiparis Terampil)
- Muhammad Adib Hadriansyah, S.E. (Pengelola Penanganan Perkara)
- Nasriani (Pengadministrasi Registrasi Perkara)
- Pratu Muhammad Faisal (Pengemudi / Pengawal Tahanan)`;

  const sippSummary = Array.isArray(ctx?.sippList) && ctx!.sippList.length > 0
    ? ctx!.sippList
        .slice(0, 10)
        .map((s: any) => `- Nomor: ${s.nomorPerkara} | Klasifikasi: ${s.klasifikasi} (${s.tingkatPerkara}) | Terdakwa/Pihak: ${s.terdakwa?.nama || '-'} (${s.terdakwa?.pangkat || ''} - ${s.terdakwa?.kesatuan || ''}) | Oditur: ${s.oditur || '-'} | Status: ${s.statusPerkara} | Majelis: ${s.majelisHakim?.ketua || '-'}`)
        .join('\n')
    : `- 12-K/PMT.V/BDG/AD/VIII/2026 | Banding Pidana Militer (Desersi) | Terdakwa: Serka Rahmatullah (Kodam XIV/Hsn) | Status: Pemeriksaan Berkas Banding
- 15-K/PMT.V/BDG/AL/IX/2026 | Banding Pidana Militer (Tindak Pidana Narkotika) | Terdakwa: Kopda Mar Hendra Wijaya (Lantamal VI) | Status: Musyawarah Majelis Hakim
- 04-G/PMT.V/STUM/IX/2026 | Sengketa Tata Usaha Militer (STUM) | Penggugat: Mayor Inf Dedi Kurniawan | Tergugat: Pangdam XIV/Hasanuddin | Status: Persidangan Pembuktian`;

  const jadwalSummary = Array.isArray(ctx?.jadwalList) && ctx!.jadwalList.length > 0
    ? ctx!.jadwalList
        .slice(0, 10)
        .map((j: any) => `- Tanggal: ${j.tanggal} (${j.jam}) | Perkara: ${j.nomorPerkara} | Terdakwa: ${j.terdakwa} (${j.kesatuan || '-'}) | Agenda: ${j.agenda} | Ruang: ${j.ruangSidang} | Hakim Ketua: ${j.hakimKetua}`)
        .join('\n')
    : `- Ruang Sidang Utama Kartika (09.00 WITA): Nomor 12-K/PMT.V/BDG/AD/VIII/2026 | Serka Rahmatullah | Pembacaan Putusan Banding
- Ruang Sidang Cakra (10.30 WITA): Nomor 04-G/PMT.V/STUM/IX/2026 | Mayor Inf Dedi Kurniawan | Pemeriksaan Saksi & Dokumen`;

  return `Anda adalah "PETA DILMILTI" (Perangkat Tanya-Jawab Pengadilan Militer Tinggi V Makassar), asisten virtual cerdas resmi di bawah naungan Mahkamah Agung Republik Indonesia (Ditjen Badan Peradilan Militer dan Peradilan Tata Usaha Negara / BADILMILTUN).

PERATURAN & KAPABILITAS UTAMA MENJAWAB:
1. **KEPATUHAN KETAT TERHADAP ATURAN HUKUM INDONESIA, MAHKAMAH AGUNG & BADAN PERADILAN (STRICT LEGAL & JUDICIAL COMPLIANCE)**:
   - Seluruh jawaban Anda WAJIB berlandaskan pada aturan hukum positif yang berlaku di Republik Indonesia, khususnya peraturan Mahkamah Agung Republik Indonesia (PERMA, SEMA, SK KMA) dan peraturan badan peradilan:
     * **Undang-Undang Pokok Peradilan & Kekuasaan Kehakiman:**
       - UUD NRI 1945 Pasal 24 & 24A (Kekuasaan Kehakiman & Mahkamah Agung)
       - UU No. 48 Tahun 2009 tentang Kekuasaan Kehakiman
       - UU No. 14 Tahun 1985 jo UU No. 5 Tahun 2004 jo UU No. 3 Tahun 2009 tentang Mahkamah Agung
       - UU No. 31 Tahun 1997 tentang Peradilan Militer
       - Kitab Undang-Undang Hukum Pidana Militer (KUHDPM)
       - UU No. 51 Tahun 2009 tentang Peradilan Tata Usaha Negara (Sengketa STUM/KTUAB)
       - KUHP Nasional (UU No. 1 Tahun 2023) & KUHAP
     * **Peraturan Mahkamah Agung (PERMA):**
       - PERMA No. 1 Tahun 2019 jo PERMA No. 7 Tahun 2022 tentang Administrasi Perkara dan Persidangan di Pengadilan Secara Elektronik (e-Court & e-Litigation)
       - PERMA No. 1 Tahun 2014 tentang Pedoman Pemberian Layanan Hukum bagi Masyarakat Tidak Mampu (Posbakum Gratis Rp 0 & Prodeo)
       - PERMA No. 9 Tahun 2016 tentang Pedoman Penanganan Pengaduan (Whistleblowing System SIWAS) di MA-RI dan Badan Peradilan
       - PERMA No. 7 & 8 Tahun 2016 tentang Penegakan Disiplin dan Pengawasan Aparatur Pengadilan
     * **Surat Edaran Mahkamah Agung (SEMA) & SK Ketua Mahkamah Agung:**
       - SK KMA No. 2-144/KMA/SK/VIII/2022 tentang Standar Pelayanan Informasi Publik di Pengadilan (PPID)
       - SK KMA No. 026/KMA/SK/II/2012 tentang Standar Pelayanan Peradilan
       - SEMA Rumusan Hasil Rapat Pleno Kamar MA-RI (Kamar Militer, Kamar Pidana, Kamar TUN)
     * **Standar Teknis Ditjen Badilmiltun MA-RI:**
       - SK Dirjen Badilmiltun tentang Standar Pelayanan Terpadu Satu Pintu (PTSP)
       - SK Dirjen Badilmiltun Nomor 593/DJMT/SK.TI2.1.1/VII/2026 tentang Standardisasi Website Badan Peradilan Militer dan Peradilan Tata Usaha Negara
   - Dalam setiap jawaban terkait prosedur hukum, hak pencari keadilan, tenggang waktu, banding, kasasi, bukti, eksekusi, dan etika aparatur, Anda WAJIB menyebutkan dasar hukum spesifik (nama undang-undang / nomor PERMA / pasal terkait) serta tautan rujukan resmi.
2. **MENJAWAB SEMUA PERTANYAAN (ANSWER ALL QUESTIONS VIA GOOGLE SEARCH & OFFICIAL SOURCES)**:
   - Anda memiliki kapabilitas untuk menjawab **SEMUA JENIS PERTANYAAN** yang diajukan pengguna: baik seputar Pengadilan Militer Tinggi V Makassar, hukum militer (UU 31/1997, KUHDPM, STUM), peradilan nasional, putusan kasasi/PK Mahkamah Agung RI, institusi TNI (Mabes TNI, Babinkum, Otmil, Pomdam), KUHP Baru, maupun pertanyaan umum, sains, berita, dan pengetahuan umum lainnya.
   - **JANGAN PERNAH menolak pertanyaan**. Manfaatkan fitur **Google Search Grounding** secara aktif untuk mengambil fakta, regulasi, dan jawaban mutakhir dari Google dan internet.
3. **PENGAMBILAN REFERENSI RESMI EKSTERNAL (OFFICIAL EXTERNAL SOURCES)**:
   - Sebutkan rujukan hukum konkret, pasal-pasal relevan, dan tautan portal resmi seperti:
     * Mahkamah Agung RI (https://www.mahkamahagung.go.id)
     * Ditjen Badilmiltun MA-RI (https://badilmiltun.mahkamahagung.go.id)
     * JDIH Mahkamah Agung RI (https://jdih.mahkamahagung.go.id)
     * Direktori Putusan MA-RI (https://putusan3.mahkamahagung.go.id)
     * e-Court Mahkamah Agung RI (https://ecourt.mahkamahagung.go.id)
     * Pengawasan SIWAS MA-RI (https://siwas.mahkamahagung.go.id)
     * SP4N-LAPOR! Nasional (https://www.lapor.go.id)
     * JDIHN Nasional (https://jdihn.go.id)
     * Portal Mabes TNI (https://tni.mil.id)
     * Serta sumber rujukan web kredibel hasil penelusuran Google.
4. **FORMAT JAWABAN EDUKATIF & BERSAHAJA**:
   - Gunakan format Markdown rapi: bullet points, **cetak tebal**, dan tautan Markdown aktif [Nama Sumber/Regulasi](URL).
   - Di akhir jawaban, sertakan bagian \`🌐 **Referensi Resmi & Sumber Terkait:**\` yang mencantumkan tautan/sumber dari Google atau web resmi yang dirujuk.

5. **PANGKALAN DATA REGULASI & PEDOMAN TEKNIS MA-RI TERSIMPAN DI SISTEM (INTERNAL LEGAL REPOSITORY)**:
   - Sistem memiliki pangkalan data resmi peraturan perundang-undangan dan pedoman teknis Mahkamah Agung RI yang tersimpan langsung di sistem:
     * **SK KMA No. 159/KMA/SK.HK2/VIII/2026**: Buku II Pedoman Teknis Administrasi & Pola Pembinaan Peradilan Militer (29 Komponen Sistematika Putusan, Susunan Bundel A 24 dokumen & Bundel B 11 dokumen, Hak Inzage 7 hari, batas waktu penahanan banding 30+60 hari, pembantaran/stuiting, standar minutasi 14 hari, One Day Publish).
     * **PERMA No. 7 Tahun 2022 jo PERMA No. 1 Tahun 2019**: Administrasi Perkara dan Persidangan Secara Elektronik (e-Court & e-Litigation: e-Filing, e-Payment VA bank mitra, e-Summons Rp 0, e-Litigation, putusan elektronik).
     * **PERMA No. 1 Tahun 2014**: Layanan Pos Bantuan Hukum (Posbakum) cuma-cuma Rp 0 & Sidang Prodeo bebas biaya perkara bagi masyarakat/prajurit tidak mampu (SKTM).
     * **PERMA No. 9 Tahun 2016**: Pedoman Penanganan Pengaduan (Whistleblowing System SIWAS MA-RI) dengan jaminan 100% perlindungan kerahasiaan identitas pelapor.
     * **PERMA No. 7 & 8 Tahun 2016**: Disiplin Kerja Hakim & Pengawasan Melekat Pimpinan Satker.
     * **PERMA No. 8 Tahun 2022 jo PERMA No. 6 Tahun 2022**: Tata Cara Pemeriksaan Upaya Hukum Kasasi dan PK di Mahkamah Agung Secara Elektronik.
     * **SEMA No. 1 Tahun 2022 jo SEMA No. 3 Tahun 2023**: Rumusan Pleno Kamar Militer Mahkamah Agung RI (peradilan in absentia perkara desersi & pemecatan prajurit).
     * **SK KMA No. 2-144/KMA/SK/VIII/2022**: Standar Pelayanan Informasi Publik di Pengadilan (PPID, Daftar Informasi Publik, SLA 10+7 hari kerja, pengaburan/anonimisasi).
     * **SK KMA No. 026/KMA/SK/II/2012**: Standar Pelayanan Peradilan pada Meja Pelayanan Terpadu Satu Pintu (PTSP 3S & ramah disabilitas).
     * **SK Dirjen Badilmiltun No. 593/DJMT/SK.TI2.1.1/VII/2026**: Standardisasi Website Peradilan Militer & TUN dan AI Asisten PETA DILMILTI.
     * **UU No. 31 Tahun 1997**: Peradilan Militer (Banding tenggang 7 hari Pasal 225, Kasasi 14 hari Pasal 244, Sengketa Tata Usaha Militer / STUM Pasal 268-335 tenggang 90 hari).
     * **KUHDPM**: Pidana Murni Militer (Desersi Pasal 87 tindak pidana meninggalkan dinas >30 hari, Insubordinasi Pasal 106, Pemecatan dari dinas militer / PDTH Pasal 6).
     * **UU No. 48 Tahun 2009**: Kekuasaan Kehakiman (Asas peradilan sederhana, cepat, biaya ringan, persamaan di depan hukum, hak bantuan hukum).
     * **PP No. 22 Tahun 2025**: Pembentukan Pengadilan Militer Tinggi V Makassar membawahi 12 provinsi di Kawasan Timur Indonesia.
   - PANDUAN PENGUTIPAN OTOMATIS:
     * Setiap kali menjawab pertanyaan mengenai hukum, prosedur, berkas, banding, kasasi, etika, pengaduan, atau organisasi, WAJIB mengutip nomor regulasi, pasal/ketentuan spesifik, dan substansi teknis dari pangkalan data di atas.

DATA RESMI SATUAN KERJA ${courtName}:
- Induk: Mahkamah Agung RI (Ditjen Badilmiltun)
- Alamat: ${courtAddr}
- Jam PTSP: ${courtJam}
- Telepon Kantor: ${courtPhone}
- WhatsApp Resmi: ${courtWA}
- Email: ${courtEmail}
- Dasar Standar Website: SK Dirjen Badilmiltun Nomor 593/DJMT/SK.TI2.1.1/VII/2026

DATA PEJABAT & PERSONEL AKTIF:
${personnelSummary}

DATA PERKARA SIPP AKTIF TERKINI:
${sippSummary}

AGENDA SIDANG TERKINI:
${jadwalSummary}`;
}

export function generateSmartSipintarReply(
  rawMessage: string,
  ctx?: SipintarContextData,
  externalWebData?: { summary?: string; sources?: { title: string; url: string }[] },
  injectedRegMatches?: RegulatorySearchResult[],
  isSearchMode?: boolean
): string {
  const msg = (rawMessage || '').trim();
  const lower = msg.toLowerCase();

  // Search stored regulatory database automatically
  const systemRegMatches = injectedRegMatches && injectedRegMatches.length > 0
    ? injectedRegMatches
    : searchRegulatoryDatabase(rawMessage, 3);

  // Helper to attach matched regulatory references markdown
  const attachRegulatory = (text: string): string => {
    if (!systemRegMatches || systemRegMatches.length === 0) return text;
    if (text.includes('Rujukan Resmi Pangkalan Data Regulasi') || text.includes('Pangkalan Data Regulasi & Pedoman Teknis')) {
      return text;
    }
    return `${text}\n\n${formatRegulatoryReferencesMarkdown(systemRegMatches)}`;
  };

  const courtIdentity = ctx?.courtIdentity || {};
  const courtName = courtIdentity.name || 'PENGADILAN MILITER TINGGI V MAKASSAR';
  const courtAddr = courtIdentity.address || 'Jalan Metro Tanjung Bunga Kompleks Mall Phinisi Point Makassar, Sulawesi Selatan 90122';
  const courtPhone = courtIdentity.phone || '081144405554';
  const courtWA = courtIdentity.whatsapp || '0811-4440-5554';
  const courtEmail = courtIdentity.email || 'dilmiti5makassar@gmail.com';
  const courtJam = courtIdentity.jamOperasional || 'Senin - Kamis 08.00 - 16.30 WITA, Jumat 08.00 - 17.00 WITA';

  const sippList = Array.isArray(ctx?.sippList) && ctx!.sippList.length > 0
    ? ctx!.sippList
    : [
        {
          nomorPerkara: '12-K/PMT.V/BDG/AD/VIII/2026',
          klasifikasi: 'Desersi (Pasal 87 KUHDPM)',
          tingkatPerkara: 'Banding Pidana Militer',
          tanggalRegister: '15 Agustus 2026',
          terdakwa: { nama: 'Serka Rahmatullah', pangkat: 'Sersan Kepala / NRP 21080123450987', kesatuan: 'Kodam XIV/Hasanuddin' },
          oditur: 'Mayor Chk Denny Indrayana, S.H.',
          majelisHakim: { ketua: 'Kolonel Chk Sugeng Aryanto, S.H., M.H.', anggota1: 'Kolonel Kum Mustofa, S.H., M.H.', anggota2: 'Kolonel Chk Agus Husin, S.H., M.H.' },
          paniteraPengganti: 'Kapten Chk Rusjana, S.H.',
          statusPerkara: 'Pemeriksaan Berkas Banding',
          lamaProses: '14 Hari'
        },
        {
          nomorPerkara: '15-K/PMT.V/BDG/AL/IX/2026',
          klasifikasi: 'Tindak Pidana Narkotika (UU No. 35/2009)',
          tingkatPerkara: 'Banding Pidana Militer',
          tanggalRegister: '02 September 2026',
          terdakwa: { nama: 'Kopda Mar Hendra Wijaya', pangkat: 'Kopral Dua Mar / NRP 112233', kesatuan: 'Lantamal VI Makassar' },
          oditur: 'Mayor Chk Bambang S, S.H.',
          majelisHakim: { ketua: 'Kolonel Chk Sultan, S.H.', anggota1: 'Kolonel Kum M. Nirwan Said, S.H., M.H.', anggota2: 'Kolonel Chk Sugeng Aryanto, S.H., M.H.' },
          paniteraPengganti: 'Mayor Chk Mahpul Saepuloh, S.H.',
          statusPerkara: 'Musyawarah Majelis Hakim',
          lamaProses: '21 Hari'
        },
        {
          nomorPerkara: '04-G/PMT.V/STUM/IX/2026',
          klasifikasi: 'Sengketa Tata Usaha Militer (STUM)',
          tingkatPerkara: 'Tingkat Pertama',
          tanggalRegister: '10 September 2026',
          terdakwa: { nama: 'Mayor Inf Dedi Kurniawan', pangkat: 'Mayor Inf / NRP 1104005678', kesatuan: 'Korem 141/Toddopuli' },
          oditur: '-',
          majelisHakim: { ketua: 'Kolonel Kum M. Nirwan Said, S.H., M.H.', anggota1: 'Kolonel Chk Agus Husin, S.H., M.H.', anggota2: 'Kolonel Kum Mustofa, S.H., M.H.' },
          paniteraPengganti: 'Kapten Chk Rusjana, S.H.',
          statusPerkara: 'Persidangan Pembuktian',
          lamaProses: '10 Hari'
        }
      ];

  const jadwalList = Array.isArray(ctx?.jadwalList) && ctx!.jadwalList.length > 0
    ? ctx!.jadwalList
    : [
        {
          tanggal: 'Senin, 06 Oktober 2026',
          jam: '09.00 WITA',
          nomorPerkara: '12-K/PMT.V/BDG/AD/VIII/2026',
          terdakwa: 'Serka Rahmatullah',
          kesatuan: 'Kodam XIV/Hasanuddin',
          agenda: 'Pembacaan Putusan Banding Pidana Militer',
          ruangSidang: 'Ruang Sidang Utama Kartika',
          hakimKetua: 'Kolonel Chk Sugeng Aryanto, S.H., M.H.',
          status: 'Siap Sidang'
        },
        {
          tanggal: 'Senin, 06 Oktober 2026',
          jam: '10.30 WITA',
          nomorPerkara: '04-G/PMT.V/STUM/IX/2026',
          terdakwa: 'Mayor Inf Dedi Kurniawan (Penggugat)',
          kesatuan: 'Korem 141/Toddopuli',
          agenda: 'Pemeriksaan Saksi Ahli & Bukti Administrasi KTUAB',
          ruangSidang: 'Ruang Sidang Cakra',
          hakimKetua: 'Kolonel Kum M. Nirwan Said, S.H., M.H.',
          status: 'Sedang Berlangsung'
        }
      ];

  const personnelList = Array.isArray(ctx?.personnelList) && ctx!.personnelList.length > 0
    ? ctx!.personnelList
    : [
        { nama: 'Kolonel Chk Sultan, S.H.', jabatan: 'Kepala Pengadilan Militer Tinggi V Makassar (Kadilmilti V)', pangkat: 'Kolonel Chk / 191001234' },
        { nama: 'Kolonel Chk Sugeng Aryanto, S.H., M.H.', jabatan: 'Hakim Militer Tinggi', pangkat: 'Kolonel Chk' },
        { nama: 'Kolonel Chk Agus Husin, S.H., M.H.', jabatan: 'Hakim Militer Tinggi', pangkat: 'Kolonel Chk' },
        { nama: 'Kolonel Kum Mustofa, S.H., M.H.', jabatan: 'Hakim Militer Tinggi', pangkat: 'Kolonel Kum' },
        { nama: 'Kolonel Kum M. Nirwan Said, S.H., M.H.', jabatan: 'Hakim Militer Tinggi', pangkat: 'Kolonel Kum' },
        { nama: 'Mayor Chk Mahpul Saepuloh, S.H.', jabatan: 'Panitera', pangkat: 'Mayor Chk' },
        { nama: 'Kapten Chk Rusjana, S.H.', jabatan: 'Panitera Pengganti', pangkat: 'Kapten Chk' },
        { nama: 'Muhammad Arfah Afendi, S.E., M.M.', jabatan: 'Sekretaris', pangkat: 'Pembina (IV/a)' }
      ];

  // 1. Direct Case Lookup by Specific Case Number or Defendant Name
  const matchedCase = sippList.find((p: any) => {
    const no = String(p.nomorPerkara || '').toLowerCase();
    const nama = String(p.terdakwa?.nama || '').toLowerCase();
    const cleanNo = no.replace(/[^a-z0-9]/g, '');
    const cleanLower = lower.replace(/[^a-z0-9]/g, '');
    return (no && lower.includes(no)) || (cleanNo && cleanLower.includes(cleanNo)) || (nama && nama.length > 3 && lower.includes(nama));
  });

  if (matchedCase) {
    return `⚖️ **Informasi Detail Perkara SIPP Ditemukan**

Berikut adalah data resmi perkara pada **Pengadilan Militer Tinggi V Makassar**:

- **Nomor Perkara:** \`${matchedCase.nomorPerkara}\`
- **Klasifikasi Perkara:** **${matchedCase.klasifikasi}**
- **Tingkat Perkara:** ${matchedCase.tingkatPerkara}
- **Tanggal Register:** ${matchedCase.tanggalRegister}
- **Terdakwa / Penggugat:** **${matchedCase.terdakwa?.nama}** (${matchedCase.terdakwa?.pangkat || ''} - ${matchedCase.terdakwa?.kesatuan || ''})
- **Oditur / Penuntut:** ${matchedCase.oditur || '-'}
- **Ketua Majelis Hakim:** ${matchedCase.majelisHakim?.ketua || '-'}
- **Panitera Pengganti:** ${matchedCase.paniteraPengganti || '-'}
- **Status Penanganan:** **${matchedCase.statusPerkara}** (${matchedCase.lamaProses || 'Dalam Proses'})

🌐 **Referensi Resmi Terkait:**
- [Direktori Putusan Mahkamah Agung RI](https://putusan3.mahkamahagung.go.id)
- [Ditjen Badilmiltun Mahkamah Agung RI](https://badilmiltun.mahkamahagung.go.id)`;
  }

  // Calculate Weighted Intent Scores
  const scores: Record<string, number> = {
    DOWNLOAD_TEMPLATE_DOCS: 0,
    JADWAL_SIDANG: 0,
    BANDING_MILITER: 0,
    GUGATAN_STUM: 0,
    ECOURT_BIAYA: 0,
    PEJABAT_HAKIM: 0,
    POSBAKUM_PRODEO: 0,
    PENGADUAN_SIWAS: 0,
    WILAYAH_HUKUM: 0,
    JAM_ALAMAT_KONTAK: 0,
    REFERENSI_EKSTERNAL: 0,
    ODITURAT_VS_PENGADILAN: 0,
    KASASI_MA: 0,
    DESERSI_KUHDPM: 0,
    BABINKUM_PUSPOM: 0,
    KUHP_BARU: 0,
    PUTUSAN3_DIREKTORI: 0,
    STRUKTUR_TNI_PANGLIMA: 0,
    HUKUM_UMUM_VS_MILITER: 0,
    CARA_KERJA_GOOGLE_AI: 0,
    ATURAN_MA_DAN_PERADILAN: 0,
    BUKU_II_PEDOMAN_TEKNIS_MA: 0,
    PEDOMAN_TEKNIS_REGULASI_SISTEM: 0,
    UU_31_1997_PERADILAN_MILITER: 0,
    VISI_MISI: 0,
    SAPAAN: 0
  };

  // 00-UU31. Undang-Undang Nomor 31 Tahun 1997 tentang Peradilan Militer
  if (
    lower.includes('uu 31') ||
    lower.includes('uu no 31') ||
    lower.includes('uu nomor 31') ||
    lower.includes('31 tahun 1997') ||
    lower.includes('31/1997') ||
    lower.includes('uu peradilan militer') ||
    lower.includes('undang-undang peradilan militer') ||
    (lower.includes('peradilan militer') && (lower.includes('undang-undang') || lower.includes('dasar hukum') || lower.includes('susunan') || lower.includes('hukum acara') || lower.includes('kewenangan'))) ||
    (lower.includes('wewenang') && (lower.includes('dilmilti') || lower.includes('pengadilan militer tinggi') || lower.includes('dilmil'))) ||
    lower.includes('papera') ||
    lower.includes('ankum') ||
    lower.includes('skep pera')
  ) {
    scores.UU_31_1997_PERADILAN_MILITER += 45;
  }

  // 00a. Buku II Pedoman Teknis Administrasi & Pola Pembinaan Peradilan Militer (SK KMA 159/2026)
  if (
    lower.includes('buku ii') ||
    lower.includes('sk kma 159') ||
    lower.includes('159/kma') ||
    lower.includes('sistematika putusan') ||
    lower.includes('29 komponen') ||
    lower.includes('bundel a') ||
    lower.includes('bundel b') ||
    lower.includes('inzage') ||
    lower.includes('mempelajari berkas') ||
    lower.includes('pembantaran') ||
    lower.includes('stuiting') ||
    lower.includes('penahanan banding') ||
    lower.includes('one day publish') ||
    lower.includes('pedoman teknis administrasi')
  ) {
    scores.BUKU_II_PEDOMAN_TEKNIS_MA += 40;
  }

  // 00b. Pertanyaan Khusus Pangkalan Data Regulasi Tersimpan di Sistem
  if (
    lower.includes('pangkalan data') ||
    lower.includes('tersimpan di sistem') ||
    lower.includes('basis data regulasi') ||
    lower.includes('regulasi yang tersimpan') ||
    lower.includes('pedoman teknis mahkamah agung') ||
    (lower.includes('pedoman teknis') && (lower.includes('ma') || lower.includes('peradilan')))
  ) {
    scores.PEDOMAN_TEKNIS_REGULASI_SISTEM += 38;
  }

  // 00. Aturan yang berlaku di Indonesia khususnya Mahkamah Agung & Badan Peradilan
  if (
    lower.includes('aturan yang berlaku') ||
    (lower.includes('mahkamah agung') && (lower.includes('badan peradilan') || lower.includes('peradilan') || lower.includes('aturan') || lower.includes('regulasi') || lower.includes('perma') || lower.includes('sema'))) ||
    (lower.includes('badan peradilan') && (lower.includes('indonesia') || lower.includes('aturan') || lower.includes('regulasi'))) ||
    lower.includes('kekuasaan kehakiman') ||
    lower.includes('regulasi peradilan') ||
    lower.includes('peraturan mahkamah agung') ||
    lower.includes('hirarki peradilan')
  ) {
    scores.ATURAN_MA_DAN_PERADILAN += 35;
  }

  // 0a. Oditurat Militer vs Pengadilan Militer vs Polisi Militer
  if (
    lower.includes('oditurat') ||
    lower.includes('oditur') ||
    lower.includes('otmil') ||
    lower.includes('otmilti') ||
    (lower.includes('perbedaan') && (lower.includes('pengadilan') || lower.includes('polisi militer')))
  ) {
    scores.ODITURAT_VS_PENGADILAN += 22;
  }

  // 0b. Kasasi ke Mahkamah Agung
  if (
    lower.includes('kasasi') ||
    lower.includes('memori kasasi') ||
    lower.includes('akta kasasi')
  ) {
    scores.KASASI_MA += 25;
  }

  // 0c. Desersi & KUHDPM
  if (
    lower.includes('desersi') ||
    lower.includes('kuhdpm') ||
    lower.includes('kuhpm') ||
    lower.includes('pasal 87') ||
    lower.includes('meninggalkan dinas')
  ) {
    scores.DESERSI_KUHDPM += 25;
  }

  // 0d. Babinkum & Puspom
  if (
    lower.includes('babinkum') ||
    lower.includes('puspom') ||
    lower.includes('puspomad') ||
    lower.includes('pomal') ||
    lower.includes('pomau') ||
    lower.includes('polisi militer')
  ) {
    scores.BABINKUM_PUSPOM += 22;
  }

  // 0e. KUHP Baru 2026 / UU 1 2023
  if (
    lower.includes('kuhp baru') ||
    lower.includes('uu 1 tahun 2023') ||
    lower.includes('uu no 1 tahun 2023') ||
    lower.includes('kuhp nasional')
  ) {
    scores.KUHP_BARU += 25;
  }

  // 0f. Direktori Putusan MA (Putusan3)
  if (
    lower.includes('putusan3') ||
    lower.includes('direktori putusan') ||
    (lower.includes('cari putusan') || lower.includes('unduh putusan'))
  ) {
    scores.PUTUSAN3_DIREKTORI += 25;
  }

  // 0g. Struktur Mabes TNI, Panglima TNI & Tiga Matra
  if (
    lower.includes('panglima') ||
    lower.includes('kasad') ||
    lower.includes('kasal') ||
    lower.includes('kasau') ||
    lower.includes('mabes tni') ||
    (lower.includes('struktur') && lower.includes('tni')) ||
    lower.includes('tiga matra')
  ) {
    scores.STRUKTUR_TNI_PANGLIMA += 25;
  }

  // 0h. Hukum Pidana Militer vs Pidana Umum
  if (
    (lower.includes('perbedaan') && (lower.includes('pidana umum') || lower.includes('hukum militer') || lower.includes('sipil'))) ||
    lower.includes('lex specialis') ||
    (lower.includes('kuhp') && lower.includes('kuhdpm'))
  ) {
    scores.HUKUM_UMUM_VS_MILITER += 25;
  }

  // 0i. Cara Kerja Google AI & Pengambilan Sumber Luar
  if (
    (lower.includes('google') && (lower.includes('cara') || lower.includes('mengambil') || lower.includes('sumber') || lower.includes('internet') || lower.includes('grounding'))) ||
    (lower.includes('sumber luar') || lower.includes('luar website'))
  ) {
    scores.CARA_KERJA_GOOGLE_AI += 24;
  }

  // 1. External Official Sources / Regulations / Undang-Undang
  if (
    lower.includes('referensi') ||
    lower.includes('sumber luar') ||
    lower.includes('eksternal') ||
    lower.includes('undang-undang') ||
    lower.includes('uu 31') ||
    lower.includes('uu 51') ||
    lower.includes('perma') ||
    lower.includes('sema') ||
    lower.includes('sk kma') ||
    lower.includes('putusan ma') ||
    lower.includes('portal ma') ||
    lower.includes('jdih')
  ) {
    scores.REFERENSI_EKSTERNAL += 25;
  }

  // 2. Template Docs / Download / Formulir / Laporan
  if (
    lower.includes('template') ||
    lower.includes('unduh') ||
    lower.includes('download') ||
    lower.includes('formulir') ||
    lower.includes('blangko') ||
    lower.includes('format surat') ||
    lower.includes('dokumen permohonan') ||
    lower.includes('laporan resmi') ||
    lower.includes('laporan tahunan') ||
    lower.includes('lkjip') ||
    lower.includes('sakip') ||
    lower.includes('dipa') ||
    lower.includes('lhkpn') ||
    (lower.includes('dokumen') && (lower.includes('mana') || lower.includes('cari') || lower.includes('minta')))
  ) {
    scores.DOWNLOAD_TEMPLATE_DOCS += 20;
    if (lower.includes('template')) scores.DOWNLOAD_TEMPLATE_DOCS += 10;
    if (lower.includes('unduh') || lower.includes('download')) scores.DOWNLOAD_TEMPLATE_DOCS += 10;
    if (lower.includes('laporan')) scores.DOWNLOAD_TEMPLATE_DOCS += 8;
  }

  // 3. Jadwal Sidang
  if (
    lower.includes('jadwal') ||
    (lower.includes('sidang') && (lower.includes('kapan') || lower.includes('hari') || lower.includes('jam') || lower.includes('ruang') || lower.includes('kartika') || lower.includes('cakra') || lower.includes('agenda')))
  ) {
    scores.JADWAL_SIDANG += 18;
    if (lower.includes('jadwal')) scores.JADWAL_SIDANG += 10;
  }

  // 4. Banding Pidana Militer
  if (
    lower.includes('banding') ||
    lower.includes('memori banding') ||
    lower.includes('akta banding') ||
    lower.includes('7 hari') ||
    lower.includes('tenggang waktu')
  ) {
    scores.BANDING_MILITER += 15;
    if (lower.includes('banding')) scores.BANDING_MILITER += 8;
  }

  // 5. Gugatan STUM
  if (
    lower.includes('stum') ||
    lower.includes('sengketa tata usaha') ||
    lower.includes('ktuab') ||
    lower.includes('gugatan') ||
    lower.includes('gugat') ||
    lower.includes('skep') ||
    lower.includes('pdth')
  ) {
    scores.GUGATAN_STUM += 15;
    if (lower.includes('stum')) scores.GUGATAN_STUM += 15;
  }

  // 6. e-Court / Panjar / Biaya Perkara
  if (
    lower.includes('ecourt') ||
    lower.includes('e-court') ||
    lower.includes('efiling') ||
    lower.includes('esummons') ||
    lower.includes('elitigation') ||
    lower.includes('panjar') ||
    lower.includes('biaya perkara') ||
    lower.includes('e-skum')
  ) {
    scores.ECOURT_BIAYA += 18;
  }

  // 7. Pejabat / Hakim / Pimpinan / Struktur
  if (
    lower.includes('pejabat') ||
    lower.includes('pimpinan') ||
    lower.includes('kadilmilti') ||
    lower.includes('kepala pengadilan') ||
    lower.includes('wakadilmilti') ||
    lower.includes('hakim tinggi') ||
    lower.includes('hakim militer') ||
    lower.includes('panitera') ||
    lower.includes('sekretaris') ||
    lower.includes('sultan') ||
    lower.includes('sugeng') ||
    lower.includes('mustofa') ||
    lower.includes('struktur organisasi')
  ) {
    scores.PEJABAT_HAKIM += 18;
  }

  // 8. Posbakum / Prodeo / Bantuan Hukum Gratis
  if (
    lower.includes('posbakum') ||
    lower.includes('prodeo') ||
    lower.includes('bantuan hukum') ||
    lower.includes('pengacara gratis') ||
    lower.includes('advokat gratis') ||
    (lower.includes('gratis') && (lower.includes('hukum') || lower.includes('konsultasi')))
  ) {
    scores.POSBAKUM_PRODEO += 20;
  }

  // 9. Pengaduan / SIWAS / Gratifikasi / Pungli / SMAP
  if (
    lower.includes('pengaduan') ||
    lower.includes('siwas') ||
    lower.includes('lapor') ||
    lower.includes('gratifikasi') ||
    lower.includes('pungli') ||
    lower.includes('suap') ||
    lower.includes('smap') ||
    lower.includes('whistleblower')
  ) {
    scores.PENGADUAN_SIWAS += 20;
  }

  // 10. Wilayah Hukum / Yurisdiksi Banding
  if (
    lower.includes('wilayah hukum') ||
    lower.includes('yurisdiksi') ||
    lower.includes('daerah hukum') ||
    lower.includes('cakupan wilayah') ||
    lower.includes('membawahi pengadilan') ||
    lower.includes('membawahi dilmil') ||
    lower.includes('wilayah yurisdiksi') ||
    (lower.includes('membawahi') && lower.includes('mana'))
  ) {
    scores.WILAYAH_HUKUM += 25;
  }

  // 11. Jam Layanan, Alamat, Lokasi Gedung & Kontak PTSP
  if (
    lower.includes('jam kerja') ||
    lower.includes('jam buka') ||
    lower.includes('jam operasional') ||
    lower.includes('jam layanan') ||
    lower.includes('alamat kantor') ||
    lower.includes('lokasi kantor') ||
    lower.includes('lokasi gedung') ||
    lower.includes('nomor wa') ||
    lower.includes('nomor telepon') ||
    lower.includes('kontak ptsp') ||
    lower.includes('mall phinisi point') ||
    (lower.includes('di mana') && (lower.includes('kantor') || lower.includes('gedung') || lower.includes('alamat') || lower.includes('lokasi')))
  ) {
    scores.JAM_ALAMAT_KONTAK += 18;
  }

  // 12. Visi Misi
  if (
    lower.includes('visi') ||
    lower.includes('misi') ||
    lower.includes('semboyan')
  ) {
    scores.VISI_MISI += 15;
  }

  // 13. Sapaan
  if (/^(halo|hai|hi|assalam|selamat\s+(pagi|siang|sore|malam)|permisi|ping|tes|test|peta)\b/i.test(lower)) {
    scores.SAPAAN += 12;
  }

  // Find the highest score
  let maxIntent = '';
  let maxScore = 0;
  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxIntent = intent;
    }
  }

  if (maxIntent === 'UU_31_1997_PERADILAN_MILITER') {
    return attachRegulatory(`⚖️ **Undang-Undang Republik Indonesia Nomor 31 Tahun 1997 tentang Peradilan Militer**
*(Pangkalan Data Regulasi Pokok Organik & Hukum Acara Peradilan Militer)*

Undang-Undang Nomor 31 Tahun 1997 adalah landasan yuridis organik fundamental yang mengatur susunan, yurisdiksi, wewenang aparatur, serta tata cara beracara di lingkungan Peradilan Militer Indonesia:

---

### 🏛️ **1. Yurisdiksi & Subjek Hukum Mengadili (Pasal 9 & 10):**
Pengadilan dalam lingkungan peradilan militer berwenang mengadili tindak pidana yang dilakukan oleh:
1. **Prajurit TNI** (TNI Angkatan Darat, TNI Angkatan Laut, TNI Angkatan Udara).
2. Seseorang yang berdasarkan undang-undang **dipersamakan dengan prajurit**.
3. Anggota suatu jawatan atau golongan atau badan yang dipersamakan atau dianggap sebagai prajurit berdasarkan undang-undang.
4. Seseorang yang tidak masuk golongan di atas, tetapi atas **penetapan Panglima TNI** dengan persetujuan Menteri Kehakiman/HAM harus diadili oleh Pengadilan Militer.

---

### 🏢 **2. Susunan Badan Peradilan Militer (Pasal 12 & 40–45):**
- 🛡️ **Pengadilan Militer (Dilmil):** Mengadili pada tingkat pertama perkara pidana dengan Terdakwa berpangkat **Kapten ke bawah** (*Pasal 40*).
- ⚖️ **Pengadilan Militer Tinggi (Dilmilti):** Mengadili pada tingkat pertama perkara pidana dengan Terdakwa berpangkat **Mayor ke atas (Pamen & Pati)**; memutus pada **tingkat banding** perkara yang diputus oleh Pengadilan Militer dalam daerah hukumnya; serta memeriksa sengketa kewenangan mengadili antar-Dilmil (*Pasal 41 & 42*).
- 🏛️ **Pengadilan Militer Utama (Dilmiltama):** Memeriksa pada tingkat banding Sengketa Tata Usaha Militer (STUM) dan membina teknis yudisial (*Pasal 43 & 44*).
- ⚔️ **Pengadilan Militer Pertempuran (Dilmilpur):** Memeriksa dan memutus perkara tindak pidana militer di daerah pertempuran (*Pasal 45*).

---

### 🛡️ **3. Struktur Penegakan Hukum & Pejabat Kunci (Pasal 1, 46–60, 69–84, 122–124):**
- **Polisi Militer (Pomdam/Pomal/Pomau):** Bertindak sebagai Penyidik yang melakukan penyelidikan, penyidikan, dan penyusunan Berita Acara Pemeriksaan (BAP) (*Pasal 69*).
- **Atasan Yang Berhak Menghukum (Ankum):** Berwenang menjatuhkan hukuman disiplin militer serta melakukan penahanan sementara prajurit paling lama 20 hari (*Pasal 75*).
- **Perwira Penyerah Perkara (Papera):** Perwira komando yang berwenang memperpanjang masa penahanan (hingga 180 hari) dan menerbitkan **Surat Keputusan Penyerahan Perkara (SKEP Pera)** untuk melimpahkan perkara ke pengadilan (*Pasal 122–124*).
- **Oditurat Militer (Otmil / Otmilti / Orjen TNI):** Badan penuntut umum militer yang menyusun dakwaan, mengajukan tuntutan pidana (*Requisitoir*), dan melaksanakan eksekusi putusan hakim (*Pasal 46–60 & 336*).

---

### ⏱️ **4. Upaya Hukum Pidana Militer:**
- 📜 **Banding (Pasal 225–243):** Diajukan oleh Terdakwa atau Oditur Militer dalam tenggang waktu **7 (tujuh) hari kalender** setelah putusan diucapkan atau diberitahukan. Memori banding diserahkan dalam waktu 7 hari berikutnya, disertai hak Inzage (mempelajari berkas) selama 7 hari sebelum berkas dikirim ke Dilmilti.
- 🏛️ **Kasasi ke Mahkamah Agung RI (Pasal 244–258):** Diajukan paling lambat **14 (empat belas) hari kalender** sesudah putusan banding diberitahukan sah, wajib disertai Memori Kasasi dalam 14 hari berikutnya.
- 🔍 **Peninjauan Kembali / PK (Pasal 259–267):** Diajukan ke Mahkamah Agung RI atas putusan yang berkekuatan hukum tetap (BHT) atas dasar bukti baru (*novum*), kekhilafan nyata, atau pertentangan putusan.

---

### 📑 **5. Sengketa Tata Usaha Militer / STUM (Pasal 268–335):**
- Mengadili sengketa yang timbul akibat diterbitkannya **Keputusan Tata Usaha Angkatan Bersenjata (KTUAB)** yang bersifat konkret, individual, dan final (seperti Keputusan Pemecatan/PDTH, mutasi, penurunan pangkat).
- Tenggang waktu pengajuan gugatan STUM adalah **90 (sembilan puluh) hari kalender** sejak KTUAB diterima atau setelah upaya administratif ditempuh (*Pasal 273*).

---

### 💰 **6. Biaya Perkara & Eksekusi Putusan (Pasal 248 & 336):**
- Biaya pemeriksaan perkara pidana militer pada tingkat pertama maupun banding **dibebankan kepada Negara (Rp 0,-)**.
- Eksekusi putusan yang telah BHT dilaksanakan oleh Oditur Militer setelah menerima salinan putusan dari Panitera Pengadilan.

🌐 **Referensi Resmi Pangkalan Data JDIHN & Mahkamah Agung RI:**
- [Undang-Undang Nomor 31 Tahun 1997 tentang Peradilan Militer (JDIHN)](https://jdihn.go.id)
- [JDIH Mahkamah Agung RI](https://jdih.mahkamahagung.go.id)
- [Portal Ditjen Badilmiltun MA-RI](https://badilmiltun.mahkamahagung.go.id)`);
  }

  if (maxIntent === 'BUKU_II_PEDOMAN_TEKNIS_MA') {
    return attachRegulatory(`🏛️ **Buku II Pedoman Teknis Administrasi & Pola Pembinaan Peradilan Militer**
*(SK KMA Nomor 159/KMA/SK.HK2/VIII/2026 — Mahkamah Agung Republik Indonesia)*

Mahkamah Agung RI telah menetapkan pedoman teknis operasional baku bagi lingkungan peradilan militer tingkat pertama dan tingkat banding yang tersimpan di sistem, memuat:

---

### 📑 **1. Sistematika Baku Putusan (29 Komponen - Lampiran III):**
Putusan Pengadilan Militer Tinggi wajib memuat **29 komponen baku**, meliputi:
- Identitas satuan kerja, nomor e-register SIPP, dan irah-irah resmi: *"Demi Keadilan Berdasarkan Ketuhanan Yang Maha Esa"*.
- Identitas lengkap Terdakwa (Nama, Pangkat, Korps, NRP, Kesatuan, Tempat/Tanggal Lahir, Agama).
- Riwayat penahanan bertingkat (tingkat penyidik Polisi Militer, Oditurat Militer, Pengadilan Militer pertama, hingga status tahanan banding).
- Dakwaan Oditur Militer & Tuntutan Pidana (*Requisitoir*).
- Pertimbangan fakta yuridis, pembuktian saksi, keterangan ahli, dan status barang bukti.
- Kualifikasi tindak pidana, pertimbangan pasal perundang-undangan (KUHDPM/KUHP).
- Amar putusan resmi, pembebanan biaya perkara, serta tanda tangan Majelis Hakim dan Panitera.

---

### 📦 **2. Susunan Berkas Bundel A & Bundel B:**
- **Bundel A (24 Dokumen):** Berkas perkara penyidikan Polisi Militer dan penuntutan Oditurat Militer tingkat pertama yang bersifat asli/otentik dan permanen.
- **Bundel B (11 Dokumen Upaya Hukum Banding):** Memuat Akta Permohonan Banding (maksimal 7 hari), Akta Pemberitahuan Banding, Memori Banding (wajib bagi Oditur Militer), Surat Pemberitahuan Penyerahan Memori Banding, Kontra Memori Banding, Surat Keterangan Mempelajari Berkas (Inzage), serta salinan resmi putusan tingkat pertama.

---

### ⏱️ **3. Prosedur Hak Inzage (Mempelajari Berkas Perkara):**
- Terdakwa/Penasihat Hukum dan Oditur Militer diberikan hak mempelajari berkas perkara (**Inzage**) selama **7 (tujuh) hari kalender** di kepaniteraan pengadilan sebelum berkas dikirim ke Pengadilan Militer Tinggi V Makassar.

---

### 🔒 **4. Batas Waktu Penahanan Banding & Pembantaran (Stuiting):**
- **Wewenang Penahanan:** Beralih ke Pengadilan Militer Tinggi sejak permohonan banding diajukan. Ketua Majelis Hakim berwenang menahan selama **30 hari**, dapat diperpanjang oleh Kepala Pengadilan Militer Tinggi paling lama **60 hari** (total maksimal 90 hari). Penetapan penahanan wajib dikeluarkan dalam 3 hari kerja.
- **Pembantaran (Stuiting):** Diberikan bagi Terdakwa yang sakit keras dan menjalani rawat inap di rumah sakit berdasarkan rekomendasi dokter militer; masa rawat inap tidak dihitung sebagai masa penahanan.

---

### ⚡ **5. Standar Minutasi & One Day Publish:**
- Salinan putusan wajib diminutasi selambat-lambatnya **14 (empat belas) hari kalender** setelah putusan diucapkan.
- Ringkasan amar putusan wajib diunggah ke Direktori Putusan MA-RI dan SIPP pada hari pengucapan putusan (*One Day Publish*).

🌐 **Referensi Resmi Pangkalan Data JDIH Mahkamah Agung RI:**
- [SK KMA No. 159/KMA/SK.HK2/VIII/2026 - Buku II Peradilan Militer](https://jdih.mahkamahagung.go.id)
- [Direktori Putusan Pengadilan Militer Tinggi V Makassar](https://putusan3.mahkamahagung.go.id)`);
  }

  if (maxIntent === 'PEDOMAN_TEKNIS_REGULASI_SISTEM' || (systemRegMatches.length > 0 && maxScore < 20)) {
    const topDoc = systemRegMatches[0].document;
    const keyArts = systemRegMatches[0].matchedArticles.map(a => `- 📌 **${a.pasal}${a.judul ? ` (${a.judul})` : ''}:** ${a.isi}`).join('\n');
    const keySubstansi = topDoc.substansiPenting.map(s => `- 💡 ${s}`).join('\n');

    return attachRegulatory(`📜 **Rujukan Resmi Pangkalan Data Regulasi & Pedoman Teknis MA-RI Tersimpan**
*(Diambil Otomatis dari Basis Data Regulasi Resmi Mahkamah Agung RI di Sistem)*

Berdasarkan penelusuran pangkalan data peraturan dan pedoman teknis sistem kami, berikut regulasi yang paling relevan dengan pertanyaan Anda:

---

### 🏛️ **${topDoc.nomor}**
**Tentang:** ${topDoc.tentang}  
**Kategori:** *${topDoc.categoryLabel} (${topDoc.tahun})* — **Status:** \`${topDoc.status}\`

**Ringkasan Regulasi:**  
${topDoc.ringkasan}

---

### ⚖️ **Ketentuan & Substansi Baku:**
${keySubstansi}
${keyArts ? `\n### 📌 **Pasal-Pasal Kunci Terkait:**\n${keyArts}` : ''}

---

${formatRegulatoryReferencesMarkdown(systemRegMatches)}`);
  }

  if (maxIntent === 'ATURAN_MA_DAN_PERADILAN') {
    return attachRegulatory(`🏛️ **Aturan Hukum yang Berlaku di Indonesia: Mahkamah Agung & Badan Peradilan**
*(Landasan Konstitusional, Undang-Undang Pokok Peradilan, PERMA, SEMA & Regulasi Resmi)*

Seluruh penyelenggaraan peradilan di Indonesia tunduk pada prinsip negara hukum (*Rule of Law*) berdasarkan Pasal 1 ayat (3) UUD NRI 1945 serta asas kemerdekaan kekuasaan kehakiman:

---

### ⚖️ **1. Landasan Konstitusional & Kekuasaan Kehakiman:**
- **Pasal 24 & 24A UUD NRI 1945:** Kekuasaan kehakiman merupakan kekuasaan merdeka untuk menegakkan hukum dan keadilan, berpuncak pada **Mahkamah Agung Republik Indonesia** dan Mahkamah Konstitusi.
- **UU No. 48 Tahun 2009 tentang Kekuasaan Kehakiman:** Mengatur asas peradilan cepat, sederhana, dan biaya ringan; perlakuan sama di depan hukum (*Equality Before the Law*); peradilan terbuka untuk umum; serta integritas independensi hakim.
- **UU No. 14 Tahun 1985 jo UU No. 5 Tahun 2004 jo UU No. 3 Tahun 2009 tentang Mahkamah Agung:** Mahkamah Agung membawahi 4 (empat) lingkungan peradilan di Indonesia:
  1. 🏛️ **Peradilan Militer** (Pengadilan Militer, Pengadilan Militer Tinggi, Pengadilan Militer Utama, Pengadilan Militer Pertempuran)
  2. 🏛️ **Peradilan Umum** (Pengadilan Negeri & Pengadilan Tinggi)
  3. 🏛️ **Peradilan Agama** (Pengadilan Agama & Pengadilan Tinggi Agama)
  4. 🏛️ **Peradilan Tata Usaha Negara** (Pengadilan TUN & Pengadilan Tinggi TUN)

---

### ⚔️ **2. Regulasi Khusus Lingkungan Peradilan Militer:**
- **UU No. 31 Tahun 1997 tentang Peradilan Militer:** Mengatur wewenang peradilan militer dalam memeriksa dan memutus perkara pidana prajurit TNI, tata cara penuntutan oleh Oditurat Militer, hukum acara pemeriksaan tingkat pertama (Dilmil) dan banding (Pengadilan Militer Tinggi V Makassar), kasasi ke Mahkamah Agung, serta penanganan Sengketa Tata Usaha Militer (STUM/KTUAB).
- **Kitab Undang-Undang Hukum Pidana Militer (KUHDPM):** Ketentuan hukum pidana materiil khusus prajurit militer (seperti Desersi Pasal 87, Insubordinasi, Melawan Perintah Dinas).
- **UU No. 34 Tahun 2004 tentang TNI:** Penegasan kedudukan keprajuritan, disiplin militer, dan advokasi hukum kedinasan oleh Babinkum TNI.

---

### 📜 **3. Peraturan Mahkamah Agung (PERMA) Pokok yang Mengikat Seluruh Satker:**
1. **PERMA No. 1 Tahun 2019 jo PERMA No. 7 Tahun 2022 (e-Court & e-Litigation):** Mengatur tata kelola perkara elektronik: e-Filing (pendaftaran online), e-Payment (panjar via Virtual Account bank persepsi), e-Summons (pemanggilan elektronik), dan e-Litigation (persidangan elektronik).
2. **PERMA No. 1 Tahun 2014 (Bantuan Hukum bagi Masyarakat Tidak Mampu):** Menjamin penyediaan Pos Bantuan Hukum (Posbakum) cuma-cuma (Rp 0) di setiap pengadilan serta pembebasan panjar biaya perkara (Sidang Prodeo).
3. **PERMA No. 9 Tahun 2016 (Pedoman Penanganan Pengaduan / SIWAS MA-RI):** Mekanisme pelaporan pelanggaran kode etik aparatur pengadilan secara rahasia (*Whistleblowing System*) dengan perlindungan pelapor.
4. **PERMA No. 7 & 8 Tahun 2016:** Penegakan disiplin kerja hakim dan pengawasan melekat pimpinan pengadilan (Zero Pungli & Zero Gratifikasi).

---

### 📑 **4. Standar Pelayanan Peradilan & Keterbukaan Informasi:**
- **SK KMA No. 2-144/KMA/SK/VIII/2022:** Standar Pelayanan Informasi Publik di Pengadilan (PPID).
- **SK KMA No. 026/KMA/SK/II/2012:** Standar Pelayanan Peradilan pada Meja Pelayanan Terpadu Satu Pintu (PTSP).
- **SK Dirjen Badilmiltun No. 593/DJMT/SK.TI2.1.1/VII/2026:** Standar resmi website dan inovasi digital di lingkungan Ditjen Badilmiltun MA-RI.

---

🌐 **Basis Data Regulasi & Rujukan Resmi Terverifikasi:**
- 🌐 [JDIH Mahkamah Agung RI (Pusat PERMA & SEMA)](https://jdih.mahkamahagung.go.id)
- 🌐 [Portal Resmi Mahkamah Agung RI](https://www.mahkamahagung.go.id)
- 🌐 [Ditjen Badan Peradilan Militer dan Peradilan TUN (Badilmiltun)](https://badilmiltun.mahkamahagung.go.id)
- 🌐 [Direktori Putusan Mahkamah Agung RI (Putusan3)](https://putusan3.mahkamahagung.go.id)
- 🌐 [Jaringan Dokumentasi Informasi Hukum Nasional (JDIHN)](https://jdihn.go.id)
- 🌐 [Sistem Informasi Pengawasan Mahkamah Agung RI (SIWAS)](https://siwas.mahkamahagung.go.id)`);
  }

  if (maxIntent === 'ODITURAT_VS_PENGADILAN') {
    return `⚖️ **Perbedaan Oditurat Militer, Pengadilan Militer & Polisi Militer**
*(Berdasarkan Undang-Undang Nomor 31 Tahun 1997 tentang Peradilan Militer)*

Ketiganya memiliki kedudukan dan tugas yang berbeda dalam sistem peradilan pidana militer (*Military Criminal Justice System*):

---

### 1. 🛡️ **Polisi Militer (Pomdam / Pomal / Pomau):**
- **Fungsi:** Aparat **Penyidik** tindak pidana yang dilakukan oleh prajurit militer.
- **Tugas:** Menyelidiki, mengumpulkan bukti, memeriksa saksi/tersangka, dan menyusun Berita Acara Pemeriksaan (BAP) untuk diserahkan ke Oditurat Militer.

---

### 2. 🏛️ **Oditurat Militer (Otmil / Otmilti / Babinkum):**
- **Fungsi:** Badan **Penuntut Umum** sekaligus pelaksana putusan hakim (*eksekutor*) di lingkungan peradilan militer.
- **Kedudukan:** Bertindak atas nama Oditur Jenderal TNI di bawah naungan Mabes TNI / Babinkum TNI (setara dengan Kejaksaan).
- **Tugas:** Meneliti berkas dari Polisi Militer, menyusun Surat Dakwaan, membacakan Tuntutan (Requisitoir) di depan persidangan, dan melaksanakan eksekusi vonis hakim.

---

### 3. ⚖️ **Pengadilan Militer (Dilmil / Dilmilti):**
- **Fungsi:** Pelaksana **Kekuasaan Kehakiman (Yudisial)** yang mandiri dan independen di bawah **Mahkamah Agung Republik Indonesia**.
- **Tugas:** Menerima berkas perkara dari Oditurat, memimpin jalannya persidangan, memeriksa bukti dan saksi, serta **menjatuhkan Putusan (Vonis)** yang adil dan objektif.

🌐 **Referensi Resmi Terkait:**
- [Undang-Undang Nomor 31 Tahun 1997 tentang Peradilan Militer](https://jdihn.go.id)
- [Portal Ditjen Badilmiltun MA-RI](https://badilmiltun.mahkamahagung.go.id)
- [Portal Mabes TNI](https://tni.mil.id)`;
  }

  if (maxIntent === 'KASASI_MA') {
    return `🏛️ **Prosedur & Syarat Permohonan Kasasi ke Mahkamah Agung RI**
*(Pasal 244–258 Undang-Undang Nomor 31 Tahun 1997)*

Bagi pihak Terdakwa/Penasihat Hukum atau Oditur Militer yang tidak puas terhadap putusan Pengadilan Militer Tinggi tingkat banding, dapat mengajukan upaya hukum **Kasasi** ke Mahkamah Agung RI:

---

### 📋 **1. Tenggang Waktu Pengajuan:**
- Permohonan kasasi diajukan paling lambat **14 (empat belas) hari kalender** setelah putusan banding diberitahukan secara sah kepada Terdakwa atau Oditur.

---

### 📝 **2. Syarat & Prosedur Pendaftaran:**
1. **Akta Permohonan Kasasi:** Didaftarkan melalui Kepaniteraan Pengadilan Militer Tinggi V Makassar.
2. **Memori Kasasi:** Wajib diserahkan selambat-lambatnya **14 hari** setelah Akta Permohonan Kasasi ditandatangani. Memori kasasi memuat alasan hukum (apakah hakim banding salah menerapkan hukum, melampaui wewenang, atau lalai memenuhi syarat perundang-undangan).
3. **Kontra Memori Kasasi:** Pihak lawan berhak menyerahkan kontra memori dalam waktu 14 hari sejak menerima salinan memori kasasi.
4. **Pengiriman Berkas:** Panitera Dilmilti V Makassar akan membundel Berkas Bundel A & B dan mengirimkan ke Kepaniteraan Mahkamah Agung RI di Jakarta.

🌐 **Referensi Resmi Terkait:**
- [Kepaniteraan Mahkamah Agung RI](https://kepaniteraan.mahkamahagung.go.id)
- [Direktori Putusan Kasasi MA-RI](https://putusan3.mahkamahagung.go.id)`;
  }

  if (maxIntent === 'DESERSI_KUHDPM') {
    return `⚔️ **Ketentuan Tindak Pidana Desersi dalam Hukum Pidana Militer**
*(Pasal 87 Kitab Undang-Undang Hukum Pidana Militer / KUHDPM)*

**Desersi** adalah salah satu tindak pidana murni militer yang paling sering diadili di peradilan militer:

---

### ⚖️ **1. Unsur-Unsur Pidana Desersi (Pasal 87 KUHDPM):**
- Dilakukan oleh seorang militer dengan sengaja.
- Pergi meninggalkan kesatuan atau tempat kedinasannya tanpa izin yang sah dari atasan berwenang (Ankum).
- **Masa Damai:** Melebihi batas waktu **30 (tiga puluh) hari berturut-turut** atau melarikan diri dengan maksud melepaskan diri dari kewajiban dinas selamanya.
- **Masa Perang:** Melebihi batas waktu 4 (empat) hari.

---

### ⚖️ **2. Ancaman Sanksi Pidana:**
- **Pidana Pokok:** Pidana penjara maksimal 2 tahun 8 bulan (dalam masa damai) atau hingga pidana mati/seumur hidup/maksimal 8 tahun dalam masa perang.
- **Pidana Tambahan:** Umumnya disertai pidana tambahan **Pemecatan dari Dinas Militer (PDTH)** sesuai Surat Edaran Mahkamah Agung (SEMA) dan kebijakan pimpinan TNI.
- **Peradilan In Absentia:** Jika terdakwa melarikan diri dan tidak dapat dihadirkan, persidangan dapat digelar tanpa kehadiran terdakwa (*in absentia*).

🌐 **Referensi Resmi Terkait:**
- [Kitab Undang-Undang Hukum Pidana Militer (KUHDPM)](https://jdihn.go.id)
- [Direktori Putusan Desersi Mahkamah Agung RI](https://putusan3.mahkamahagung.go.id)`;
  }

  if (maxIntent === 'BABINKUM_PUSPOM') {
    return `🛡️ **Peran Babinkum TNI dan Puspom TNI dalam Penegakan Hukum**

Dalam tatanan institusi Mabes TNI, terdapat pembagian tugas profesional:

---

### 1. ⚖️ **Badan Pembinaan Hukum TNI (Babinkum TNI):**
- Bertugas membina hukum militer, perundang-undangan, dan **memberikan bantuan serta nasihat hukum** kepada prajurit, PNS TNI, dan keluarga.
- Membawahi Perwira Hukum (Pakum) dan Korps Hukum di tiap matra (Ditkumad, Diskumal, Diskumau) yang dapat ditunjuk mendampingi prajurit sebagai Penasihat Hukum resmi di pengadilan.

---

### 2. 🛡️ **Pusat Polisi Militer TNI (Puspom TNI & Puspom Matra):**
- Bertugas menyelenggarakan penegakan hukum, tata tertib, disiplin, pengamanan fisik, serta **penyidikan perkara pidana militer**.
- Polisi Militer adalah pintu gerbang awal penyidikan sebelum berkas diserahkan ke Oditurat Militer.

🌐 **Referensi Resmi:**
- [Portal Resmi Mabes TNI](https://tni.mil.id)
- [Babinkum TNI](https://tni.mil.id/pages/babinkum)`;
  }

  if (maxIntent === 'KUHP_BARU') {
    return `📜 **KUHP Baru (UU No. 1 Tahun 2023) & Kaitannya dengan Hukum Militer**

---

### 1. ⚖️ **Pemberlakuan KUHP Nasional:**
- Undang-Undang Nomor 1 Tahun 2023 tentang Kitab Undang-Undang Hukum Pidana (KUHP) telah diundangkan dan mulai berlaku per Januari 2026 sebagai kodifikasi hukum pidana nasional modern.

---

### 2. ⚔️ **Hubungan dengan Tindak Pidana Militer:**
- Asas hukum **Lex Specialis Derogat Legi Generali** tetap berlaku penuh.
- Ketentuan tindak pidana militer murni (seperti desersi, insubordinasi, kejahatan perang, pengkhianatan militer) tetap diatur secara khusus dalam **Kitab Undang-Undang Hukum Pidana Militer (KUHDPM)** dan **UU No. 31 Tahun 1997**.
- Untuk tindak pidana umum yang dilakukan prajurit (seperti penipuan, penganiayaan umum, penggelapan), materi pidananya mengacu pada ketentuan KUHP baru, namun proses peradilannya tetap di bawah yurisdiksi **Pengadilan Militer**.

🌐 **Referensi Resmi:**
- [JDIHN - UU No. 1 Tahun 2023 tentang KUHP](https://jdihn.go.id)
- [JDIH Mahkamah Agung RI](https://jdih.mahkamahagung.go.id)`;
  }

  if (maxIntent === 'PUTUSAN3_DIREKTORI') {
    return `🔍 **Cara Menelusuri Putusan Resmi di Direktori Putusan MA-RI (Putusan3)**

Seluruh putusan perkara Pengadilan Militer Tinggi V Makassar yang telah berkekuatan hukum tetap (*inkrah*) diunggah ke portal resmi Mahkamah Agung:

---

### 💻 **Langkah Penelusuran Online:**
1. Kunjungi portal resmi: [https://putusan3.mahkamahagung.go.id](https://putusan3.mahkamahagung.go.id)
2. Klik menu **Direktori Pengadilan** > pilih **Lingkungan Peradilan Militer** > pilih **Pengadilan Militer Tinggi V Makassar**.
3. Ketik kata kunci seperti: nomor perkara (misal: \`12-K/PMT.V\`), nama terdakwa, atau klasifikasi perkara (Banding / STUM).
4. Klik tombol **Unduh Salinan Putusan (PDF)** untuk mengunduh dokumen resmi bertanda tangan digital.

🌐 **Tautan Langsung:**
- [Direktori Putusan Pengadilan Militer Tinggi V Makassar](https://putusan3.mahkamahagung.go.id/direktori/pengadilan/pengadilan-militer-tinggi-v-makassar.html)
- [Ditjen Badilmiltun MA-RI](https://badilmiltun.mahkamahagung.go.id)`;
  }

  if (maxIntent === 'REFERENSI_EKSTERNAL') {
    return `🌐 **Direktori Sumber & Referensi Resmi Eksternal Mahkamah Agung RI**

Berikut adalah basis data hukum dan portal resmi nasional di luar website Pengadilan Militer Tinggi V Makassar yang dapat Anda jadikan rujukan terpercaya:

---

### 🏛️ **1. Portal Induk & Ditjen Peradilan Militer:**
- [Portal Resmi Mahkamah Agung RI](https://www.mahkamahagung.go.id) — Berita yudisial, siaran pers, dan kebijakan pimpinan MA-RI.
- [Ditjen Badilmiltun Mahkamah Agung RI](https://badilmiltun.mahkamahagung.go.id) — Kebijakan standardisasi peradilan militer & TUN se-Indonesia.

---

### ⚖️ **2. Basis Data Regulasi, Yurisprudensi & Putusan Pengadilan:**
- [JDIH Mahkamah Agung RI](https://jdih.mahkamahagung.go.id) — Pencarian PERMA, SEMA, dan Surat Keputusan Ketua MA (SK KMA).
- [Direktori Putusan Mahkamah Agung RI](https://putusan3.mahkamahagung.go.id) — Repositori putusan pengadilan tingkat pertama, banding militer, kasasi, dan peninjauan kembali.
- [Jaringan Dokumentasi Informasi Hukum Nasional (JDIHN)](https://jdihn.go.id) — Database Undang-Undang dan Peraturan Pemerintah RI.

---

### 💻 **3. Layanan Digital & Saluran Pengawasan Nasional:**
- [Portal e-BERPADU Mahkamah Agung RI](https://eberpadu.mahkamahagung.go.id) — Pelimpahan Berkas Elektronik Terpadu Aparat Penegak Hukum Militer.
- [SIWAS Mahkamah Agung RI](https://siwas.mahkamahagung.go.id) — Sistem Informasi Pengawasan Pelanggaran Aparatur Pengadilan.
- [SP4N-LAPOR! Nasional](https://www.lapor.go.id) — Kanal Aspirasi dan Pengaduan Pelayanan Publik Nasional.
- [Portal Resmi Mabes TNI](https://tni.mil.id) — Publikasi kedinasan TNI dan Babinkum TNI.`;
  }

  if (maxIntent === 'STRUKTUR_TNI_PANGLIMA') {
    return `🎖️ **Pucuk Pimpinan & Struktur Komando Mabes TNI**
*(Berdasarkan Undang-Undang Nomor 34 Tahun 2004 tentang Tentara Nasional Indonesia)*

Tentara Nasional Indonesia (TNI) dipimpin oleh **Panglima TNI** yang berkedudukan di bawah dan bertanggung jawab langsung kepada Presiden Republik Indonesia:

---

### 🏛️ **1. Pucuk Pimpinan Mabes TNI:**
- **Panglima TNI:** Memegang komando operasional seluruh kekuatan militer Indonesia dan bertindak sebagai koordinator tiga matra angkatan bersenjata.
- **Tiga Kepala Staf Angkatan:**
  1. 🟢 **KASAD (Kepala Staf Angkatan Darat):** Membina kekuatan dan kesiapan tempur matra darat.
  2. 🔵 **KASAL (Kepala Staf Angkatan Laut):** Membina armada laut, marinir, dan kedaulatan maritim NKRI.
  3. ⚪ **KASAU (Kepala Staf Angkatan Udara):** Membina armada kedirgantaraan dan pertahanan udara nasional.

---

### ⚖️ **2. Badan Pembinaan Hukum TNI (Babinkum TNI):**
- Dipimpin oleh **Kababinkum TNI** berpangkat Perwira Tinggi Bintang Dua (Mayjen / Laksda / Marsda).
- Bertugas membina kesadaran hukum prajurit, menyelenggarakan bantuan hukum kedinasan (advokasi bagi prajurit/PNS TNI dan keluarganya), serta menugaskan Perwira Hukum (Pakum) resmi di persidangan militer.

🌐 **Referensi Resmi Terkait:**
- [Portal Resmi Mabes TNI](https://tni.mil.id)
- [Undang-Undang Nomor 34 Tahun 2004 tentang TNI (JDIHN)](https://jdihn.go.id)
- [Badan Pembinaan Hukum TNI (Babinkum)](https://tni.mil.id)`;
  }

  if (maxIntent === 'HUKUM_UMUM_VS_MILITER') {
    return `⚖️ **Perbedaan Hukum Pidana Umum (KUHP) vs Hukum Pidana Militer (KUHDPM)**

Sistem hukum di Indonesia membedakan peradilan pidana sipil dan militer berdasarkan asas kekhususan (*Lex Specialis Derogat Legi Generali*):

---

### 1. 📜 **Hukum Pidana Umum (KUHP & KUHAP):**
- **Subjek Hukum:** Berlaku bagi seluruh warga negara sipil dan subjek hukum perorangan di wilayah Indonesia.
- **Aparat Penegak Hukum:** Penyidik Polri, Penuntut Umum Kejaksaan RI, dan diadili oleh Majelis Hakim di **Pengadilan Negeri (Peradilan Umum)**.
- **Materi Perkara:** Delik tindak pidana umum (pencurian, penipuan, penganiayaan biasa, pembunuhan umum, dll).

---

### 2. ⚔️ **Hukum Pidana Militer (KUHDPM & UU No. 31 Tahun 1997):**
- **Subjek Hukum:** Khusus bagi prajurit TNI aktif (AD, AL, AU) dan mereka yang dipersamakan dengan militer.
- **Aparat Penegak Hukum:** Penyidik Polisi Militer (Pomdam/Pomal/Pomau), Oditur Militer (Otmil/Otmilti), dan diadili oleh Hakim Militer di **Pengadilan Militer / Pengadilan Militer Tinggi**.
- **Materi Perkara:** Tindak pidana murni militer yang melanggar disiplin dan kesiapsiagaan tempur (seperti Desersi Pasal 87 KUHDPM, Insubordinasi, Melawan Perintah Atasan, Pelanggaran Penjagaan Ksatrian) serta tindak pidana umum yang pelakunya berstatus militer aktif.

🌐 **Referensi Resmi Terkait:**
- [Kitab Undang-Undang Hukum Pidana Militer (KUHDPM)](https://jdihn.go.id)
- [Undang-Undang Nomor 31 Tahun 1997 tentang Peradilan Militer](https://jdih.mahkamahagung.go.id)
- [Ditjen Badilmiltun Mahkamah Agung RI](https://badilmiltun.mahkamahagung.go.id)`;
  }

  if (maxIntent === 'CARA_KERJA_GOOGLE_AI') {
    return `🌐 **Integrasi Google Search Grounding & Sumber Eksternal PETA DILMILTI**

Asisten AI PETA DILMILTI telah dirancang untuk menjawab **seluruh pertanyaan pengguna** tanpa batas dengan memanfaatkan teknologi penelusuran web:

---

### 🔍 **Bagaimana AI Mengambil Jawaban:**
1. **Google Search Grounding:** Pertanyaan pengguna dihubungkan secara *real-time* ke Google Search untuk mendapatkan fakta mutakhir, regulasi terbaru, maupun informasi publik.
2. **Basis Data Resmi Eksternal:** AI mengutip data hukum dari Mahkamah Agung RI (https://www.mahkamahagung.go.id), JDIH, e-Court, Direktori Putusan3, Mabes TNI, dan portal hukum nasional.
3. **Penyajian Tautan Aktif:** Di setiap jawaban eksternal, AI menyertakan tautan yang dapat diklik langsung oleh pengguna untuk memeriksa keabsahan sumber rujukan.

💡 *Anda dapat menanyakan hal apapun: baik perkara pengadilan militer, pasal perundang-undangan, profil komando TNI, hingga berita atau pengetahuan umum!*

🌐 **Portal Penelusuran & Rujukan Terkait:**
- [Google Search Engine](https://www.google.com)
- [Portal Mahkamah Agung RI](https://www.mahkamahagung.go.id)
- [Jaringan Dokumentasi dan Informasi Hukum Nasional (JDIHN)](https://jdihn.go.id)`;
  }

  if (maxIntent === 'DOWNLOAD_TEMPLATE_DOCS') {
    return `📋 **Pusat Unduhan Template Dokumen Resmi & Laporan Dilmilti V Makassar**

Anda dapat mengunduh seluruh template dokumen hukum, formulir permohonan, dan laporan resmi secara langsung melalui portal website ini:

---

### 📂 **1. Template Dokumen Permohonan & Administrasi Perkara (Format .DOCX & .PDF):**
- **Formulir Permohonan Informasi Publik (PPID)** — *Sesuai SK KMA No. 2-144/KMA/SK/VIII/2022*
- **Formulir Pernyataan Keberatan atas Permohonan Informasi**
- **Surat Permohonan Layanan Bantuan Hukum (Posbakum Cuma-Cuma)**
- **Template Surat Gugatan Sengketa Tata Usaha Militer (STUM)**
- **Format Surat Kuasa Khusus Perwira Hukum / Penasihat Hukum**
- **Surat Permohonan Izin Penelitian, Riset Akademik, dan Magang Mahasiswa**

📍 *Akses unduhan:* Klik menu **Pusat Template Dokumen** di navigasi utama atau menu **PPID & Informasi Publik > Template Formulir*.

---

### 📊 **2. Dokumen Laporan Kinerja & Akuntabilitas Resmi:**
- **Laporan Tahunan (LapTah)** Pengadilan Militer Tinggi V Makassar
- **Dokumen SAKIP & LKjIP** (Laporan Kinerja Instansi Pemerintah)
- **Rencana Strategis (Renstra) & Indikator Kinerja Utama (IKU)**
- **DIPA 01 & DIPA 04** beserta Laporan Realisasi Anggaran Berkala
- **Rekapitulasi Kepatuhan LHKPN & LHKASN** Pimpinan dan Hakim Militer Tinggi

📍 *Akses laporan:* Buka menu **PPID & Dokumen > Laporan Kinerja & Keuangan**.

🌐 **Referensi Regulasi Eksternal:**
- [JDIH Mahkamah Agung RI - SK KMA 2-144/2022 Standar Keterbukaan Informasi](https://jdih.mahkamahagung.go.id)
- [Ditjen Badilmiltun MA-RI - Standarisasi Dokumen Peradilan](https://badilmiltun.mahkamahagung.go.id)`;
  }

  if (maxIntent === 'JADWAL_SIDANG') {
    const jadwalItems = jadwalList.map((j: any, i: number) =>
      `${i + 1}. **${j.nomorPerkara}** (${j.jam})\n   - **Terdakwa/Pihak:** ${j.terdakwa} (${j.kesatuan || '-'})\n   - **Agenda Sidang:** ${j.agenda}\n   - **Ruang Sidang:** ${j.ruangSidang}\n   - **Ketua Majelis:** ${j.hakimKetua}\n   - **Status:** \`${j.status}\``
    ).join('\n\n');

    return `📅 **Jadwal & Agenda Persidangan Terkini — Dilmilti V Makassar**

Berikut adalah agenda persidangan di Pengadilan Militer Tinggi V Makassar:

${jadwalItems}

🔔 **Pemberitahuan Panggilan Sidang:**
Pihak berperkara dapat mengaktifkan **Notifikasi WhatsApp Otomatis** untuk mendapatkan pengingat jadwal sidang secara langsung melalui menu **Jadwal Sidang** atau **Notifikasi WA**.

🌐 **Referensi Eksternal:**
- [Direktori Putusan MA-RI (Jadwal & Amar Putusan)](https://putusan3.mahkamahagung.go.id)`;
  }

  if (maxIntent === 'BANDING_MILITER') {
    return `🏛️ **Prosedur & Syarat Permohonan Banding Pidana Militer**

Pengadilan Militer Tinggi V Makassar berwenang memeriksa dan memutus perkara Banding Pidana Militer dari 4 Pengadilan Militer Tingkat Pertama (Makassar, Manado, Ambon, Jayapura):

---

### 📋 **1. Tenggang Waktu Pengajuan:**
- Permohonan banding diajukan selambat-lambatnya **7 (tujuh) hari** setelah putusan pengadilan militer tingkat pertama diucapkan atau diberitahukan secara sah kepada Terdakwa/Oditur (Pasal 198 UU No. 31 Tahun 1997).

### 📋 **2. Kelengkapan Berkas Administrasi Banding:**
1. **Akta Permohonan Banding** yang ditandatangani oleh Pemohon Banding atau Penasihat Hukumnya di Kepaniteraan Pengadilan Militer Pengaju.
2. **Memori Banding** (dibuat 3 rangkap cetak dan disertakan salinan digital dalam format Word/PDF).
3. **Surat Kuasa Khusus** (jika menggunakan Penasihat Hukum atau Perwira Hukum).
4. **Salinan Resmi Putusan Tingkat Pertama** beserta Berita Acara Sidang (BAS).

### 💰 **3. Biaya Perkara:**
- **Rp 0 (Gratis)** — Seluruh biaya perkara pidana militer dibebankan sepenuhnya kepada anggaran DIPA Negara.

🌐 **Dasar Hukum & Referensi Resmi Luar Website:**
- [UU No. 31 Tahun 1997 tentang Peradilan Militer (JDIHN)](https://jdihn.go.id)
- [Buku II Pedoman Teknis Peradilan Militer - SK KMA 159/2026](https://jdih.mahkamahagung.go.id)
- [Portal Ditjen Badilmiltun MA-RI](https://badilmiltun.mahkamahagung.go.id)`;
  }

  if (maxIntent === 'GUGATAN_STUM') {
    return `🏛️ **Prosedur Gugatan Sengketa Tata Usaha Militer (STUM)**

Pengadilan Militer Tinggi V Makassar berwenang memeriksa, memutus, dan menyelesaikan Sengketa Tata Usaha Militer (STUM) pada tingkat pertama:

---

### 📋 **1. Objek Sengketa STUM:**
- Keputusan Tata Usaha Angkatan Bersenjata (**KTUAB**) yang dikeluarkan oleh Badan atau Pejabat Tata Usaha Militer yang bersifat konkret, individual, dan final, yang menimbulkan akibat hukum bagi seseorang (misalnya: SKEP Pemberhentian Tidak Dengan Hormat/PDTH, penundaan kenaikan pangkat, atau mutasi jabatan).

### 📋 **2. Syarat Wajib Sebelum Mengajukan Gugatan:**
- Penggugat **wajib telah menempuh Upaya Administratif** terlebih dahulu (PERMA No. 6 Tahun 2018):
  1. **Upaya Keberatan** kepada Pejabat Penerbit KTUAB.
  2. **Banding Administratif** kepada Atasan yang Berhak Menghukum (Ankum Atasan).

### 📋 **3. Pendaftaran Gugatan:**
- Pendaftaran gugatan STUM diajukan secara langsung melalui **Meja PTSP Kepaniteraan Pengadilan Militer Tinggi V Makassar** (karena saat ini Dilmilti V Makassar belum menggunakan e-Court dalam pendaftaran perkara).

🌐 **Dasar Hukum & Referensi Resmi:**
- [UU No. 51 Tahun 2009 tentang Peradilan Tata Usaha Negara (JDIHN)](https://jdihn.go.id)
- [PERMA No. 6 Tahun 2018 tentang Pedoman Penyelesaian Sengketa Administrasi Pemerintah](https://jdih.mahkamahagung.go.id)
- [JDIH Mahkamah Agung RI](https://jdih.mahkamahagung.go.id)`;
  }

  if (maxIntent === 'ECOURT_BIAYA') {
    return `🏛️ **Informasi Pendaftaran Perkara & Biaya Perkara**

Pengadilan Militer Tinggi V Makassar saat ini **belum menggunakan e-Court dalam pendaftaran perkara**.

---

### 📋 **Mekanisme Pendaftaran Perkara di Dilmilti V Makassar:**
1. **Perkara Pidana Militer (Banding):**
   - Didaftarkan melalui Akta Permohonan Banding yang diajukan ke Pengadilan Militer Tingkat Pertama (Dilmil Pengaju) atau melalui loket Kepaniteraan Dilmilti V Makassar dalam tenggang waktu 7 (tujuh) hari kerja setelah putusan diucapkan/diberitahukan (UU No. 31 Tahun 1997).
   - Pelimpahan berkas perkara digital antar penegak hukum militer (Oditurat Militer dan Pengadilan Militer) menggunakan sistem **e-BERPADU MA-RI**.
2. **Sengketa Tata Usaha Militer (STUM):**
   - Pendaftaran gugatan STUM diajukan secara langsung melalui **Meja PTSP Kepaniteraan Pengadilan Militer Tinggi V Makassar** dengan membawa berkas gugatan fisik serta bukti upaya administratif (keberatan dan banding administratif).

💰 **Ketentuan Biaya Perkara:**
- **Perkara Pidana Militer:** Bebas biaya perkara (**Rp 0** / Dibiayai Negara sesuai UU No. 31 Tahun 1997).
- **Perkara Sengketa TUN Militer:** Panjar biaya perkara dihitung transparan sesuai SK KMA dan disetorkan langsung melalui loket resmi/rekening penampung perkara Dilmilti V Makassar.

🌐 **Tautan Layanan Resmi Eksternal:**
- [Portal e-BERPADU Mahkamah Agung RI](https://eberpadu.mahkamahagung.go.id)
- [JDIH Mahkamah Agung RI (Regulasi & SK KMA)](https://jdih.mahkamahagung.go.id)
- [Undang-Undang Nomor 31 Tahun 1997 tentang Peradilan Militer (JDIHN)](https://jdihn.go.id)`;
  }

  if (maxIntent === 'PEJABAT_HAKIM') {
    const listFormatted = personnelList.slice(0, 8).map((p: any, idx: number) => {
      const cleanRank = String(p.pangkat || '').split('/')[0].replace(/\b(NRP|NIP)\b.*$/i, '').trim();
      return `${idx + 1}. **${p.nama}**\n   - *Jabatan:* ${p.jabatan}\n   - *Pangkat/Korps:* ${cleanRank}`;
    }).join('\n\n');

    return `👨‍✈️ **Pimpinan & Pejabat Pengadilan Militer Tinggi V Makassar**

Berikut adalah susunan pimpinan dan pejabat di Pengadilan Militer Tinggi V Makassar:

${listFormatted}

💡 *Profil lengkap aparatur, riwayat kepangkatan, dan struktur organisasi dapat dilihat di menu **Tentang Pengadilan > Profil & Data Pegawai**.*

🌐 **Referensi Eksternal:**
- [Direktori Aparatur Pengadilan - Ditjen Badilmiltun MA-RI](https://badilmiltun.mahkamahagung.go.id)
- [Portal Resmi Mahkamah Agung Republik Indonesia](https://www.mahkamahagung.go.id)`;
  }

  if (maxIntent === 'POSBAKUM_PRODEO') {
    return `🤝 **Layanan Pos Bantuan Hukum (Posbakum) & Prodeo Gratis**

Pengadilan Militer Tinggi V Makassar menyediakan layanan bantuan hukum cuma-cuma (**Rp 0 / Gratis**):

---

### 📋 **1. Pos Bantuan Hukum (Posbakum):**
- Memberikan layanan konsultasi hukum, advis hukum, dan penyusunan dokumen/gugatan bagi prajurit dan masyarakat pencari keadilan.
- Tersedia di Ruang PTSP Dilmilti V Makassar maupun melalui konsultasi daring.

### 📋 **2. Pembebasan Biaya Perkara (Prodeo):**
- Diperuntukkan bagi pencari keadilan yang tidak mampu secara ekonomi.

### 📄 **Persyaratan:**
1. KTA TNI / KTP pemohon.
2. Surat Keterangan Tidak Mampu (SKTM) dari Kepala Desa/Lurah atau Surat Keterangan dari Komandan Satuan.

🌐 **Dasar Hukum & Referensi Eksternal:**
- [PERMA No. 1 Tahun 2014 tentang Pedoman Pemberian Layanan Hukum bagi Masyarakat Tidak Mampu (JDIH MA)](https://jdih.mahkamahagung.go.id)
- [Portal Bantuan Hukum Nasional - BPHN Kemenkumham](https://bphn.go.id)`;
  }

  if (maxIntent === 'PENGADUAN_SIWAS') {
    return `🛡️ **Saluran Pengaduan Resmi & Sistem Manajemen Anti Penyuapan (SMAP)**

Pengadilan Militer Tinggi V Makassar berkomitmen pada peradilan berintegritas tinggi (**Zero Pungli & Zero Gratifikasi**):

---

### 📢 **Saluran Pengaduan Eksternal & Internal:**
1. **Aplikasi SIWAS MA-RI:** [https://siwas.mahkamahagung.go.id](https://siwas.mahkamahagung.go.id) *(Whistleblowing System Badan Pengawasan MA-RI)*
2. **SP4N-LAPOR! Nasional:** [https://www.lapor.go.id](https://www.lapor.go.id) *(Kanal Pengaduan Pelayanan Publik Nasional)*
3. **Komisi Yudisial RI:** [https://www.komisiyudisial.go.id](https://www.komisiyudisial.go.id) *(Pengawasan Kode Etik dan Pedoman Perilaku Hakim)*
4. **Meja Pengaduan PTSP & Hotline WhatsApp:** **${courtWA}**

🔒 *Identitas pelapor dijamin kerahasiaannya dan dilindungi penuh sesuai Peraturan Mahkamah Agung RI Nomor 9 Tahun 2016.*`;
  }

  if (maxIntent === 'WILAYAH_HUKUM') {
    return `🗺️ **Wilayah Hukum (Yurisdiksi) Pengadilan Militer Tinggi V Makassar**

Pengadilan Militer Tinggi V Makassar merupakan pengadilan tingkat banding militer yang membawahi **4 Pengadilan Militer Tingkat Pertama** di kawasan Indonesia Timur:

1. 🏛️ **Pengadilan Militer III-16 Makassar** *(Sulawesi Selatan, Sulawesi Barat, dan Sulawesi Tenggara)*
2. 🏛️ **Pengadilan Militer III-17 Manado** *(Sulawesi Utara, Sulawesi Tengah, dan Gorontalo)*
3. 🏛️ **Pengadilan Militer III-18 Ambon** *(Maluku dan Maluku Utara)*
4. 🏛️ **Pengadilan Militer III-19 Jayapura** *(Papua, Papua Barat, Papua Tengah, Papua Pegunungan, Papua Selatan, dan Papua Barat Daya)*

🌐 **Referensi Eksternal:**
- [Peta Wilayah Yurisdiksi Ditjen Badilmiltun MA-RI](https://badilmiltun.mahkamahagung.go.id)
- [Undang-Undang Nomor 31 Tahun 1997 tentang Peradilan Militer](https://jdihn.go.id)`;
  }

  if (maxIntent === 'JAM_ALAMAT_KONTAK') {
    return `🕒 **Jam Operasional, Alamat Gedung & Kontak Resmi Dilmilti V Makassar**

---

### ⏰ **Jam Layanan PTSP & Kantor:**
- **Senin – Kamis:** 08.00 – 16.30 WITA *(Istirahat: 12.00 – 13.00 WITA)*
- **Jumat:** 08.00 – 17.00 WITA *(Istirahat: 11.30 – 13.30 WITA)*
- **Sabtu & Minggu:** Libur *(Layanan informasi digital portal web & SIPP tetap aktif 24 jam)*

---

### 📍 **Alamat Kantor:**
${courtAddr}

---

### 📞 **Saluran Kontak Resmi:**
- **Telepon Kantor:** **${courtPhone}**
- **WhatsApp PTSP & Notifikasi:** **${courtWA}**
- **Email Resmi:** \`${courtEmail}\`
- **Inovasi PTSP Online:** Tersedia pengambilan antrean digital & konsultasi video call melalui menu **PTSP Inovasi**.

🌐 **Tautan Eksternal Terkait:**
- [Direktori Satuan Kerja Ditjen Badilmiltun MA-RI](https://badilmiltun.mahkamahagung.go.id)`;
  }

  if (maxIntent === 'VISI_MISI') {
    return `🏛️ **Visi & Misi Pengadilan Militer Tinggi V Makassar**

**Visi:**
*"Terwujudnya Pengadilan Militer Tinggi V Makassar yang Agung"*

**Misi:**
1. Menjaga kemandirian dan integritas peradilan militer.
2. Memberikan pelayanan hukum yang berkeadilan, transparan, dan akuntabel.
3. Meningkatkan kualitas kepemimpinan dan profesionalisme aparatur peradilan militer.
4. Meningkatkan keterbukaan informasi dan akuntabilitas berbasis teknologi informasi terpadu.

🌐 **Referensi:**
- [Cetak Biru Pembaruan Peradilan 2010–2035 Mahkamah Agung RI](https://www.mahkamahagung.go.id)`;
  }

  if (maxIntent === 'SAPAAN') {
    return `🏛️ **Halo! Selamat Datang di PETA DILMILTI**
*(Perangkat Tanya-Jawab Pengadilan Militer Tinggi V Makassar)*

Saya terhubung dengan basis pengetahuan resmi dan **Google Search Grounding** untuk memberikan jawaban akurat beserta referensi hukum eksternal terpercaya (Mahkamah Agung RI, JDIH, e-BERPADU, SIWAS, dan direktori regulasi nasional):

1. 🌐 **Pencarian Regulasi & Portal Eksternal MA-RI**
2. 📋 **Unduh Template Dokumen Resmi & Laporan Kinerja**
3. ⚖️ **Cek Status Perkara SIPP & Jadwal Sidang Terkini**
4. 📜 **Syarat Permohonan Banding Pidana Militer & Gugatan STUM**
5. 💻 **Informasi Prosedur Pendaftaran di Loket PTSP & Biaya Perkara**
6. 🤝 **Bantuan Hukum Gratis (Posbakum & Prodeo)**

Silakan ketik pertanyaan Anda secara langsung di kolom chat di bawah ini!`;
  }

  // If search mode is active or user explicitly used search prefixes
  if (isSearchMode || lower.startsWith('cari ') || lower.startsWith('search ') || lower.startsWith('telusuri ') || lower.startsWith('pencarian ')) {
    const cleanSearchQuery = msg.replace(/^(cari|search|telusuri|pencarian)(\s*:|\s+)/i, '').trim() || msg;
    const srcList = Array.isArray(externalWebData?.sources) && externalWebData!.sources.length > 0
      ? externalWebData!.sources.map(s => `- 🌐 [${s.title}](${s.url})`).join('\n')
      : `- 🌐 [Hasil Penelusuran Google: "${cleanSearchQuery}"](https://www.google.com/search?q=${encodeURIComponent(cleanSearchQuery)})\n- 📜 [JDIHN - Basis Data Regulasi Nasional](https://jdihn.go.id)\n- 🏛️ [Direktori Putusan Mahkamah Agung RI](https://putusan3.mahkamahagung.go.id)\n- ⚖️ [JDIH Mahkamah Agung RI](https://jdih.mahkamahagung.go.id)`;

    const summaryContent = externalWebData?.summary
      ? `📌 **Rangkuman Penelusuran Cepat (Featured Snippet):**\n${externalWebData.summary}\n\n`
      : '';

    return attachRegulatory(`🔍 **HASIL PENELUSURAN CHAT AI PETA DILMILTI**
*(Pencarian Web, Google Search Grounding & Pangkalan Regulasi Peradilan Militer)*

🔎 **Kata Kunci Penelusuran:** \`${cleanSearchQuery}\`

${summaryContent}⚖️ **Hasil Temuan Regulasi & Pedoman Hukum:**
Sistem telah memindai pangkalan data peraturan perundang-undangan (termasuk **UU Nomor 31 Tahun 1997 tentang Peradilan Militer**, **KUHDPM**, **Buku II SK KMA 159/2026**, dan **PERMA/SEMA MA-RI**). Rujukan pasal dan substansi hukum terkait telah dipetakan di bawah ini.

💡 **Petunjuk Penelusuran Lanjutan:**
- Untuk mencari teks pasal per pasal UU 31/1997, gunakan kata kunci *"UU 31/1997"*, *"banding 7 hari"*, *"kasasi 14 hari"*, atau *"sengketa STUM 90 hari"*.
- Untuk melacak perkara atau jadwal sidang, masukkan nomor perkara lengkap (contoh: \`12-K/PMT.V/BDG\`).

---

🌐 **Tautan Sumber & Referensi Hasil Penelusuran:**
${srcList}`);
  }

  // If live external web search result was found for an open-ended/external question
  if (externalWebData?.summary) {
    const srcList = Array.isArray(externalWebData.sources) && externalWebData.sources.length > 0
      ? externalWebData.sources.map(s => `- 🌐 [${s.title}](${s.url})`).join('\n')
      : `- 🌐 [Penelusuran Google Resmi](https://www.google.com/search?q=${encodeURIComponent(msg)})\n- 🌐 [Portal Mahkamah Agung RI](https://www.mahkamahagung.go.id)`;

    return attachRegulatory(`🏛️ **PETA DILMILTI — Hasil Penelusuran Informasi & Sumber Eksternal**
*(Didukung Google Search & Basis Data Hukum Nasional)*

Berikut intisari jawaban mengenai pertanyaan Anda **"${msg}"**:

${externalWebData.summary}

---

🌐 **Referensi & Sumber Terkait:**
${srcList}`);
  }

  // Smart Open-Ended / General Question Fallback with Direct Web Search Links
  return attachRegulatory(`🏛️ **PETA DILMILTI — Asisten Virtual Pengadilan Militer Tinggi V Makassar**
*(Didukung Google Search & Basis Data Hukum Nasional)*

Mengenai pertanyaan Anda: **"${msg}"**

Berikut informasi panduan dan rujukan resmi yang dapat Anda akses:
1. 🔍 **Penelusuran Google & Regulasi Terkait:** Untuk topik atau regulasi di luar lingkup internal, Anda dapat menelusuri data mutakhir langsung melalui mesin pencari dan portal hukum resmi nasional.
2. 🏛️ **Layanan Pengadilan Militer:** Apabila pertanyaan Anda berkaitan dengan perkara banding, jadwal sidang, Posbakum gratis, atau template dokumen resmi Dilmilti V Makassar, Anda dapat mengetik kata kunci seperti *"Jadwal Sidang"*, *"Syarat Banding"*, *"Gugatan STUM"*, atau *"Template"*.
3. 📞 **Pusat Bantuan PTSP:** Petugas Meja PTSP siap membantu konsultasi secara langsung di kantor kami (${courtAddr}) maupun melalui Telepon: **${courtPhone}** / WhatsApp: **${courtWA}** (Jam Layanan: ${courtJam}).

🌐 **Penelusuran Web & Referensi Resmi Terkait:**
- 🌐 [Hasil Penelusuran Google: "${msg}"](https://www.google.com/search?q=${encodeURIComponent(msg)})
- 🌐 [Portal Resmi Mahkamah Agung RI](https://www.mahkamahagung.go.id)
- 🌐 [Ditjen Badilmiltun Mahkamah Agung RI](https://badilmiltun.mahkamahagung.go.id)
- 🌐 [JDIH Mahkamah Agung RI (Pencarian Regulasi & PERMA)](https://jdih.mahkamahagung.go.id)`);
}
