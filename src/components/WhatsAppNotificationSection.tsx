import React, { useState } from 'react';
import { 
  MessageSquareCode, 
  Send, 
  CheckCheck, 
  Check, 
  Bell, 
  Phone, 
  Shield, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Smartphone,
  Info
} from 'lucide-react';
import { WANotificationSubscriber, WAMessageLog } from '../types';
import { INITIAL_PERKARA_SIPP } from '../data/sippData';
import { CourtDB } from '../data/courtDatabase';
import { sendWhatsAppMessage } from '../utils/whatsappHelper';

interface WhatsAppNotificationProps {
  prefilledNomorPerkara?: string;
  onNavigate?: (section: any, subTab?: string) => void;
}

export default function WhatsAppNotificationSection({ prefilledNomorPerkara, onNavigate }: WhatsAppNotificationProps) {
  // Registration Form State
  const [nomorPerkara, setNomorPerkara] = useState(prefilledNomorPerkara || '24-K/PMT.V/BDG/AD/VIII/2026');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nomorWA, setNomorWA] = useState('');
  const [peran, setPeran] = useState<'Penasihat Hukum' | 'Oditur Militer' | 'Ankum / Perwira Kesatuan' | 'Keluarga Terdakwa' | 'Saksi / Masyarakat'>('Penasihat Hukum');
  const [subscribers, setSubscribers] = useState<WANotificationSubscriber[]>([
    {
      id: 'sub-01',
      nomorPerkara: '24-K/PMT.V/BDG/AD/VIII/2026',
      namaLengkap: 'Mayor Chk R. Sinaga, S.H. (Kumdam XIV)',
      nomorWA: '0812-4112-98xx',
      peran: 'Penasihat Hukum',
      tanggalDaftar: '14 September 2026',
      terakhirTerkirim: 'Hari ini, 08:30 WITA',
      statusAktif: true
    },
    {
      id: 'sub-02',
      nomorPerkara: '18-K/PMT.V/AD/VII/2026',
      namaLengkap: 'Perwira Urusan Personel Bekangdam XIV',
      nomorWA: '0821-9988-12xx',
      peran: 'Ankum / Perwira Kesatuan',
      tanggalDaftar: '13 September 2026',
      terakhirTerkirim: 'Kemarin, 14:15 WITA',
      statusAktif: true
    }
  ]);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Live Chat Simulator State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'system' | 'user';
    text: string;
    time: string;
    status?: 'sent' | 'delivered' | 'read';
  }>>([
    {
      id: 'msg-0',
      sender: 'system',
      text: '🏛️ *PENGADILAN MILITER TINGGI V MAKASSAR*\n_Layanan Resmi Informasi & Notifikasi WhatsApp Perkara Real-Time_\n\nSelamat datang! Layanan ini otomatis mengirimkan pengingat jadwal persidangan (H-1), panggilan ruang sidang, serta pengumuman amar putusan.\n\nKetik kata kunci untuk bantuan instan:\n• *INFO* <No Perkara> (misal: INFO 24-K)\n• *JADWAL* (Jadwal sidang hari ini)\n• *PTSP* (Jam buka & layanan)\n• *BIAYA* (Informasi panjar perkara)\n• *LOKASI* (Alamat & denah gedung)',
      time: '08:00'
    },
    {
      id: 'msg-1',
      sender: 'system',
      text: '📢 *NOTIFIKASI PERSIDANGAN RESMI DILMILTI V MAKASSAR*\n\nKepada Yth. Pihak Berperkara / Kuasa Hukum,\nPerkara: *24-K/PMT.V/BDG/AD/VIII/2026*\nTerdakwa: Kapten Inf Hendra Wardana\n\n🗓️ *Jadwal Sidang Berikutnya:*\nTanggal: Jumat, 18 September 2026\nWaktu: 09:30 WITA\nRuang: Ruang Sidang Utama Kartika Dilmilti V\nAgenda: Pemeriksaan Saksi Ahli Militer\n\nDimohon hadir 30 menit sebelum sidang dimulai mengenakan seragam PDH/toga advokat sesuai tata tertib.',
      time: '08:30'
    }
  ]);

  const [logs, setLogs] = useState<WAMessageLog[]>([
    {
      id: 'log-1',
      nomorWA: '+62 812-4112-98xx',
      nomorPerkara: '24-K/PMT.V/BDG/AD/VIII/2026',
      waktu: '14 Sep 2026, 08:30:12 WITA',
      pesan: 'Notifikasi Jadwal Sidang Jumat 18 Sep 2026 (Ruang Sidang Utama Kartika)',
      status: 'Terkirim',
      kategori: 'Reminder H-1'
    },
    {
      id: 'log-2',
      nomorWA: '+62 821-9988-12xx',
      nomorPerkara: '18-K/PMT.V/AD/VII/2026',
      waktu: '13 Sep 2026, 14:15:00 WITA',
      pesan: 'Update Tahapan: Pemeriksaan Saksi Selesai, Sidang Tuntutan Ditetapkan',
      status: 'Terkirim',
      kategori: 'Update Status Persidangan'
    },
    {
      id: 'log-3',
      nomorWA: '+62 852-1144-77xx',
      nomorPerkara: '12-TUN/PMT.V/2026',
      waktu: '28 Agu 2026, 11:30:00 WITA',
      pesan: 'Pemberitahuan Putusan Sengketa TUN Militer Telah Diucapkan Terbuka',
      status: 'Terkirim',
      kategori: 'Pemberitahuan Putusan'
    }
  ]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap || !nomorWA) return;

    const newSub: WANotificationSubscriber = {
      id: `sub-${Date.now()}`,
      nomorPerkara,
      namaLengkap,
      nomorWA,
      peran,
      tanggalDaftar: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      terakhirTerkirim: 'Baru saja diaktifkan',
      statusAktif: true
    };

    setSubscribers([newSub, ...subscribers]);
    setRegisterSuccess(true);

    // Send automated welcome message in simulator
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const welcomeMsg = `✅ *PENDAFTARAN NOTIFIKASI WHATSAPP BERHASIL*\n\nHalo *${namaLengkap}* (${peran}), nomor WhatsApp Anda (${nomorWA}) telah berhasil didaftarkan untuk menerima pemantauan status persidangan perkara:\n\n📜 *Nomor Perkara:* ${nomorPerkara}\n🏛️ *Pengadilan:* Pengadilan Militer Tinggi V Makassar\n\nSistem akan mengirimkan update agenda sidang, ruang sidang, dan putusan secara otomatis tanpa dipungut biaya.`;

    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'system',
        text: welcomeMsg,
        time: nowTime
      }
    ]);

    // Add log
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        nomorWA,
        nomorPerkara,
        waktu: `${new Date().toLocaleDateString('id-ID')} ${nowTime} WITA`,
        pesan: `Pendaftaran berhasil untuk ${namaLengkap}`,
        status: 'Terkirim',
        kategori: 'Update Status Persidangan'
      },
      ...prev
    ]);

    // Try background API dispatch if configured
    const waConfig = CourtDB.getWhatsAppConfig();
    const isMockToken = !waConfig.foonteApiToken || waConfig.foonteApiToken === 'f3k8_Foonte_Token_DILMILTI5_2026_xYz987';
    if (waConfig.isActive && !isMockToken) {
      await sendWhatsAppMessage(nomorWA, welcomeMsg);
    }
  };

  // Bot responses
  const handleSendChat = (customText?: string) => {
    const textToSend = (customText || chatInput).trim();
    if (!textToSend) return;

    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user' as const,
      text: textToSend,
      time: nowTime,
      status: 'read' as const
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    // Generate automated response
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let replyText = '';

      if (lower.includes('24-k') || lower.includes('hendra')) {
        replyText = '📋 *INFO PERKARA: 24-K/PMT.V/BDG/AD/VIII/2026*\n\n• *Terdakwa:* Kapten Inf Hendra Wardana\n• *Kesatuan:* Brigif 11/Badik Sakti Kodam XIV\n• *Status:* Dalam Pemeriksaan Sidang Banding\n• *Majelis Hakim:* Brigjen TNI Dr. H. Faisal Ahmad, S.H., M.H.\n• *Sidang Berikut:* Jumat, 18 Sep 2026 (09:30 WITA)\n• *Ruang Sidang:* Kartika (Utama)\n• *Agenda:* Pemeriksaan Saksi Ahli Militer';
      } else if (lower.includes('18-k') || lower.includes('rahmat')) {
        replyText = '📋 *INFO PERKARA: 18-K/PMT.V/AD/VII/2026*\n\n• *Terdakwa:* Mayor Cba Rahmat Hidayat\n• *Kesatuan:* Bekangdam XIV/Hasanuddin\n• *Status:* Tuntutan Oditur Militer\n• *Sidang Berikut:* Rabu, 16 Sep 2026 (10:00 WITA)\n• *Ruang Sidang:* Garuda\n• *Agenda:* Pembacaan Surat Tuntutan Oditur Tinggi';
      } else if (lower.includes('jadwal')) {
        replyText = '⚖️ *JADWAL PERSIDANGAN HARI INI DI DILMILTI V:*\n\n1. *Perkara No. 18-K/PMT.V/AD/VII/2026*\n   Terdakwa: Mayor Cba Rahmat Hidayat\n   Pukul: 10.00 WITA | Ruang Garuda\n   Agenda: Pembacaan Tuntutan Oditur\n\n2. *Perkara No. 31-K/PMT.V/AD/IX/2026*\n   Terdakwa: Letkol Inf Agus Supriyadi\n   Pukul: 09.00 WITA (Kamis) | Ruang Kartika';
      } else if (lower.includes('ptsp') || lower.includes('jam')) {
        replyText = '🏢 *JAM PELAYANAN PTSP DILMILTI V MAKASSAR:*\n\n• *Senin - Kamis:* 08.00 - 16.30 WITA\n• *Jumat:* 08.00 - 17.00 WITA\n• *Pendaftaran Perkara:* Ditutup pukul 15.00 WITA\n• *Istirahat:* 12.00 - 13.00 WITA\n\nPetugas PTSP siap melayani pendaftaran perkara langsung di loket, pelimpahan berkas, legalisasi, dan informasi permohonan PPID.';
      } else if (lower.includes('biaya') || lower.includes('panjar')) {
        replyText = '💰 *BIAYA PERKARA & PRODEO:*\n\n• Perkara Pidana Militer: Bebas biaya bagi terdakwa sesuai UU No. 31 Tahun 1997.\n• Sengketa TUN Militer: Dikenakan panjar biaya perkara sesuai SK KMA yang dibayarkan melalui rekening resmi / loket PTSP Dilmilti V Makassar.\n• Bantuan Hukum Prodeo & Posbakum tersedia cuma-cuma bagi prajurit berpenghasilan rendah.';
      } else if (lower.includes('lokasi') || lower.includes('alamat')) {
        replyText = '📍 *LOKASI GEDUNG PENGADILAN MILITER TINGGI V MAKASSAR:*\n\nJl. Perintis Kemerdekaan KM. 13, Kel. Daya, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan 90243\nEmail: dilmiti5makassar@gmail.com';
      } else {
        replyText = `🤖 Terima kasih atas pesan Anda. Perintah "${textToSend}" diterima oleh sistem bot Dilmilti V Makassar.\n\nKetik kata kunci:\n• *INFO 24-K* (Cek detail perkara)\n• *JADWAL* (Jadwal sidang terkini)\n• *PTSP* (Jam pelayanan)\n• *BIAYA* (Informasi biaya)\n• *LOKASI* (Alamat pengadilan)\n\nAtau hubungi petugas PTSP pada jam kerja di 0811-4567-890.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-bot-${Date.now()}`,
          sender: 'system',
          text: replyText,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 700);
  };

  const [actionToast, setActionToast] = useState<string | null>(null);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [sendToRealWhatsApp, setSendToRealWhatsApp] = useState<boolean>(true);

  const showActionToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
  };

  const triggerSimulation = async (type: 'h-1' | 'ruang-sidang' | 'putusan') => {
    setIsDispatching(true);
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    let simulatedMsg = '';
    let kategori: WAMessageLog['kategori'] = 'Update Status Persidangan';
    let titleBadge = '';

    const targetPhone = nomorWA.trim() || '081241129800';
    const activePerkara = nomorPerkara.trim() || '24-K/PMT.V/BDG/AD/VIII/2026';

    if (type === 'h-1') {
      titleBadge = '⏰ PENGINGAT H-1 SIDANG';
      simulatedMsg = `⏰ *PENGINGAT SIDANG (H-1) DILMILTI V MAKASSAR*\n\nKepada Yth. Pihak Berperkara / Penasihat Hukum / Oditur Militer,\n\n📜 *Nomor Perkara:* ${activePerkara}\n🏛️ *Pengadilan:* Pengadilan Militer Tinggi V Makassar\n🗓️ *Jadwal Sidang:* BESOK, Pukul 09.30 WITA\n📍 *Ruang Sidang:* Ruang Sidang Utama Kartika\n📋 *Agenda:* Pemeriksaan Saksi & Pembuktian Berkas\n\n*PENTING:*\n1. Dimohon hadir 30 menit sebelum sidang dimulai.\n2. Menggunakan seragam dinas (PDU IV/PDH muts bagi prajurit TNI) atau toga advokat sesuai Pedoman Buku II MA-RI.\n3. Informasi lebih lanjut hubungi PTSP Dilmilti V Makassar.`;
      kategori = 'Reminder H-1';
    } else if (type === 'ruang-sidang') {
      titleBadge = '🔔 PANGGILAN RUANG SIDANG';
      simulatedMsg = `🔔 *PANGGILAN MASUK RUANG SIDANG (REAL-TIME)*\n\nKepada Yth. Seluruh Pihak dalam Perkara:\n📜 *Nomor Perkara:* ${activePerkara}\n\nMajelis Hakim Pengadilan Militer Tinggi V Makassar telah memasuki Ruang Sidang Utama Kartika.\n\nTerdakwa, Oditur Militer Tinggi, dan Penasihat Hukum dipersilakan segera memasuki ruang sidang dan menempati kursi persidangan yang telah ditentukan.\n\n_Pemberitahuan Otomatis Panitera Pengganti Dilmilti V Makassar_`;
      kategori = 'Update Status Persidangan';
    } else {
      titleBadge = '⚖️ PEMBERITAHUAN AMAR PUTUSAN';
      simulatedMsg = `⚖️ *PEMBERITAHUAN AMAR PUTUSAN DIUCAPKAN*\n\nKepada Yth. Pihak Berperkara / Pemohon Banding,\n\n📜 *Nomor Perkara:* ${activePerkara}\n🏛️ *Pengadilan:* Pengadilan Militer Tinggi V Makassar\n\nMajelis Hakim telah membacakan Putusan dalam sidang terbuka untuk umum pada hari ini:\n\n*AMAR PUTUSAN:*\n"MENGADILI: Menyatakan permohonan banding diterima secara formal; Menguatkan Putusan Pengadilan Militer pengaju dengan perbaikan kualifikasi pidana."\n\n📄 Petikan dan Salinan Resmi Putusan ber-TTE BSrE BSSN dapat diakses melalui SIPP atau diambil langsung di Meja PTSP Kepaniteraan Dilmilti V Makassar.`;
      kategori = 'Pemberitahuan Putusan';
    }

    // 1. Update live phone screen
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-sim-${Date.now()}`,
        sender: 'system',
        text: simulatedMsg,
        time: nowTime,
        status: 'delivered'
      }
    ]);

    // 2. Add log entry
    setLogs((prev) => [
      {
        id: `log-sim-${Date.now()}`,
        nomorWA: targetPhone,
        nomorPerkara: activePerkara,
        waktu: `${new Date().toLocaleDateString('id-ID')} ${nowTime} WITA`,
        pesan: `${titleBadge}: ${simulatedMsg.slice(0, 75)}...`,
        status: 'Terkirim',
        kategori
      },
      ...prev
    ]);

    // 3. Dispatch directly in background via WhatsApp Gateway API (Zero Popup)
    if (sendToRealWhatsApp && targetPhone) {
      try {
        const result = await sendWhatsAppMessage(targetPhone, simulatedMsg, false);
        if (result.success) {
          showToastNotification(`✅ ${titleBadge} dikirim LANGSUNG oleh aplikasi ke +${targetPhone} via ${result.provider} (Tanpa Buka WhatsApp Web)!`);
        } else {
          showToastNotification(`⚠️ Direct Gateway: ${result.message}`);
        }
      } catch (err: any) {
        showToastNotification(`Notifikasi WhatsApp "${titleBadge}" diproses langsung oleh aplikasi.`);
      }
    } else {
      showToastNotification(`Notifikasi "${titleBadge}" diproses & ditampilkan di simulator!`);
    }

    setIsDispatching(false);
  };

  const showToastNotification = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
  };

  return (
    <section id="whatsapp-system-section" className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#03190E] via-[#0A3D24] to-[#041F12] text-white rounded-2xl p-5 sm:p-7 shadow-xl border-2 border-amber-400/60 relative overflow-hidden tactical-corners">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-military-camo-pattern"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                INOVASI MILITER UNGGULAN
              </span>
              <span className="text-xs text-amber-200 font-bold font-mono">
                Terintegrasi SIPP Dilmilti V Makassar
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 font-serif text-white">
              <MessageSquareCode className="w-6 h-6 text-amber-300" />
              <span>Sistem Notifikasi Persidangan Otomatis via WhatsApp Real-Time</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-3xl leading-relaxed">
              Pantau panggilan sidang masuk ruangan, pengingat H-1 persidangan pidana militer, dan pengumuman amar putusan langsung di smartphone tanpa biaya antre.
            </p>
          </div>

          <div className="bg-black/40 border border-amber-400/40 p-3 rounded-xl text-xs shrink-0 text-right">
            <div className="text-[10px] text-amber-300 uppercase font-bold font-mono">Gateway Direct Status</div>
            <div className="text-emerald-400 font-bold flex items-center justify-end gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Direct WA Engine Aktif</span>
            </div>
            <div className="text-[10px] text-emerald-200/80 mt-1 font-mono">Fonnte API • Push Real-Time</div>
          </div>
        </div>

        {/* DAFTAR APLIKASI INOVASI DILMILTI V MAKASSAR SHOWCASE BAR */}
        <div className="relative z-10 mt-5 pt-4 border-t border-emerald-700/60">
          <div className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>DAFTAR SEMUA APLIKASI INOVASI DILMILTI V MAKASSAR:</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              className="px-3 py-2 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 border border-amber-300 shadow-md cursor-pointer text-xs"
              title="Aplikasi Notifikasi WA Real-Time & Simulator Panggilan Sidang"
            >
              <MessageSquareCode className="w-4 h-4 text-slate-950" />
              <span>1. Simulator & Notifikasi WA (WA REWAKO)</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('ptsp-inovasi')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/20 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
              title="Buka Aplikasi PTSP Online 6 Meja"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>2. PTSP Online (6 Meja & Video Call)</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('tentang', 'profil-pegawai')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/20 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
              title="Buka Aplikasi Cuti Online (e-Cuti SIKEP)"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>3. Cuti Online (e-Cuti SIKEP)</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('publik', 'jenis-layanan')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/20 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
              title="Buka Aplikasi e-BERPADU & Meja Layanan PTSP"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>4. e-BERPADU & Meja PTSP</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('layanan-publik', 'siwas')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/20 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
              title="Buka Aplikasi SIWAS MA-RI"
            >
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>5. SIWAS MA-RI (Pengaduan)</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('layanan-publik', 'survei')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/20 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
              title="Buka Portal E-Survei Badilmiltun"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>6. E-Survei (IKM & IPAK)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Form & Live Phone Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Registration Form (7 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <span>Pendaftaran Notifikasi WhatsApp Perkara</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftarkan nomor Anda untuk menerima broadcast perkembangan perkara
                </p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                GRATIS
              </span>
            </div>

            {registerSuccess && (
              <div className="p-4 mb-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 text-xs space-y-2.5 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong>Pendaftaran Berhasil Terdaftar!</strong>
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  Nomor Anda telah terdaftar di database notifikasi perkara. 
                  Untuk mencoba langsung menerima pesan konfirmasi di ponsel asli Anda saat ini, silakan klik tombol di bawah ini:
                </p>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      const welcomeMsg = `✅ *PENDAFTARAN NOTIFIKASI WHATSAPP BERHASIL*\n\nHalo *${namaLengkap}* (${peran}), nomor WhatsApp Anda (${nomorWA}) telah berhasil didaftarkan untuk menerima pemantauan status persidangan perkara:\n\n📜 *Nomor Perkara:* ${nomorPerkara}\n🏛️ *Pengadilan:* Pengadilan Militer Tinggi V Makassar\n\nSistem akan mengirimkan update agenda sidang, ruang sidang, dan putusan secara otomatis tanpa dipungut biaya.`;
                      sendWhatsAppMessage(nomorWA, welcomeMsg, true);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs text-[10px] cursor-pointer"
                  >
                    <Send className="w-3 h-3 text-white" />
                    <span>Terima di No. WhatsApp Asli ({nomorWA})</span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              
              {/* Nomor Perkara Selector */}
              <div>
                <label htmlFor="select-nomor-perkara-wa" className="block font-bold text-slate-700 mb-1">
                  Pilih Nomor Perkara (Database SIPP):
                </label>
                <select
                  id="select-nomor-perkara-wa"
                  value={nomorPerkara}
                  onChange={(e) => setNomorPerkara(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {INITIAL_PERKARA_SIPP.map((item) => (
                    <option key={item.id} value={item.nomorPerkara}>
                      {item.nomorPerkara} - {item.terdakwa.nama} ({item.tingkatPerkara})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-600 mt-1">
                  Pilih dari perkara yang terdaftar atau ketik manual jika perkara belum muncul di daftar cepat.
                </p>
              </div>

              {/* Nama Pemohon */}
              <div>
                <label htmlFor="input-nama-pendaftar" className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap Penerima:
                </label>
                <input
                  id="input-nama-pendaftar"
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Contoh: Mayor Chk Suwardi, S.H. / Kopda Andi / Ibu Nurhaliza"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Nomor WhatsApp */}
              <div>
                <label htmlFor="input-nomor-wa" className="block font-bold text-slate-700 mb-1">
                  Nomor WhatsApp Aktif:
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 font-bold text-xs">+62</span>
                  <input
                    id="input-nomor-wa"
                    type="tel"
                    required
                    value={nomorWA}
                    onChange={(e) => setNomorWA(e.target.value)}
                    placeholder="812-xxxx-xxxx"
                    className="w-full pl-12 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-1">
                  Format angka tanpa awalan nol atau tanda strip (misal: 81245678901)
                </p>
              </div>

              {/* Peran / Status Hubungan */}
              <div>
                <label htmlFor="select-peran-pemohon" className="block font-bold text-slate-700 mb-1">
                  Status / Hubungan dengan Perkara:
                </label>
                <select
                  id="select-peran-pemohon"
                  value={peran}
                  onChange={(e) => setPeran(e.target.value as any)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Penasihat Hukum">Penasihat Hukum Militer / Advokat</option>
                  <option value="Oditur Militer">Oditur Militer / Staf Oditurat</option>
                  <option value="Ankum / Perwira Kesatuan">Ankum / Perwira Urusan Dinas Kesatuan TNI</option>
                  <option value="Keluarga Terdakwa">Keluarga Kandung / Kerabat Terdakwa</option>
                  <option value="Saksi / Masyarakat">Saksi Perkara / Pencari Keadilan</option>
                </select>
              </div>

              {/* Checklist Notifikasi Otomatis */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <span className="block text-[11px] font-bold text-slate-800">
                  Jenis Notifikasi Otomatis yang Dikirim:
                </span>
                <label className="flex items-center gap-2 text-slate-700 text-[11px]">
                  <input type="checkbox" defaultChecked disabled className="rounded text-emerald-600" />
                  <span>Pengingat Jadwal Sidang H-1 (Pukul 08.00 WITA)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 text-[11px]">
                  <input type="checkbox" defaultChecked disabled className="rounded text-emerald-600" />
                  <span>Notifikasi Panggilan Ruang Sidang Siap (Real-Time)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 text-[11px]">
                  <input type="checkbox" defaultChecked disabled className="rounded text-emerald-600" />
                  <span>Pemberitahuan Amar Putusan & Petikan Resmi</span>
                </label>
              </div>

              <button
                type="submit"
                id="btn-submit-register-wa"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquareCode className="w-4 h-4" />
                <span>Aktifkan Notifikasi WhatsApp Perkara</span>
              </button>
            </form>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Simulasi &amp; Uji Kirim Notifikasi Push Real-Time</span>
              </h4>
              <label className="flex items-center gap-1.5 text-[11px] text-emerald-900 font-extrabold cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs">
                <input
                  type="checkbox"
                  checked={sendToRealWhatsApp}
                  onChange={(e) => setSendToRealWhatsApp(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Kirim Langsung oleh Aplikasi (Background Direct - Tanpa WA Web)</span>
              </label>
            </div>

            {actionToast && (
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{actionToast}</span>
              </div>
            )}

            <p className="text-[11px] text-slate-500">
              Klik salah satu tombol resmi di bawah untuk mengeksekusi template pesan persidangan ke nomor target dan memperbarui simulator:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                id="btn-sim-h1"
                disabled={isDispatching}
                onClick={() => triggerSimulation('h-1')}
                className="p-3 bg-white hover:bg-emerald-50 border-2 border-emerald-800/30 hover:border-emerald-600 rounded-xl text-left transition-all cursor-pointer shadow-xs group"
              >
                <div className="font-black text-slate-900 text-xs group-hover:text-emerald-800 flex items-center gap-1">
                  <span>⏰ Kirim H-1 Sidang</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Pengingat agenda besok</div>
                <div className="text-[9px] font-mono font-bold text-emerald-700 mt-1">Eksekusi Push WA →</div>
              </button>

              <button
                type="button"
                id="btn-sim-ruang"
                disabled={isDispatching}
                onClick={() => triggerSimulation('ruang-sidang')}
                className="p-3 bg-white hover:bg-emerald-50 border-2 border-emerald-800/30 hover:border-emerald-600 rounded-xl text-left transition-all cursor-pointer shadow-xs group"
              >
                <div className="font-black text-slate-900 text-xs group-hover:text-emerald-800 flex items-center gap-1">
                  <span>🔔 Masuk Ruang Sidang</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Panggilan sidang siap</div>
                <div className="text-[9px] font-mono font-bold text-emerald-700 mt-1">Eksekusi Push WA →</div>
              </button>

              <button
                type="button"
                id="btn-sim-putusan"
                disabled={isDispatching}
                onClick={() => triggerSimulation('putusan')}
                className="p-3 bg-white hover:bg-emerald-50 border-2 border-emerald-800/30 hover:border-emerald-600 rounded-xl text-left transition-all cursor-pointer shadow-xs group"
              >
                <div className="font-black text-slate-900 text-xs group-hover:text-emerald-800 flex items-center gap-1">
                  <span>⚖️ Kirim Putusan</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Amar putusan diucapkan</div>
                <div className="text-[9px] font-mono font-bold text-emerald-700 mt-1">Eksekusi Push WA →</div>
              </button>
            </div>
          </div>

        </div>

        {/* Right: Authentic Smartphone WhatsApp Screen (6 Cols) */}
        <div className="lg:col-span-6">
          <div className="max-w-md mx-auto bg-slate-800 rounded-[32px] p-3 shadow-2xl border-4 border-slate-700">
            
            {/* Phone Notch & Speaker */}
            <div className="w-32 h-4 bg-slate-900 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
            </div>

            {/* WhatsApp App Container */}
            <div className="bg-[#0b141a] rounded-[24px] overflow-hidden flex flex-col h-[520px] text-slate-100 font-sans shadow-inner">
              
              {/* WhatsApp Chat Header */}
              <div className="bg-[#202c33] px-3.5 py-2.5 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs ring-1 ring-white/20">
                    🏛️
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-slate-100 truncate max-w-[180px]">
                        Dilmilti V Makassar
                      </span>
                      {/* WhatsApp Verified Green Badge */}
                      <span 
                        title="Akun Resmi Terverifikasi Mahkamah Agung RI"
                        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[9px] font-black"
                      >
                        ✓
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Official Court Bot • Online
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-300 text-xs">
                  <Phone className="w-4 h-4" />
                </div>
              </div>

              {/* Chat Message List (Background with WhatsApp-like subtle pattern) */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#0b141a] text-xs">
                
                {/* Notice timestamp badge */}
                <div className="text-center my-1">
                  <span className="bg-[#182229] text-slate-400 text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                    HARI INI
                  </span>
                </div>

                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-2.5 shadow-sm text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#005c4b] text-slate-100 rounded-tr-none'
                          : 'bg-[#202c33] text-slate-200 rounded-tl-none border-l-2 border-emerald-500'
                      }`}
                    >
                      <div className="whitespace-pre-line text-[11px]">
                        {msg.text}
                      </div>

                      {nomorWA && msg.sender === 'system' && (
                        <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex justify-end">
                          <button
                            type="button"
                            onClick={() => sendWhatsAppMessage(nomorWA, msg.text)}
                            className="bg-[#005c4b] hover:bg-[#007a64] text-white font-extrabold text-[9px] px-2 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer"
                            title="Kirim pesan simulasi ini ke nomor WhatsApp asli Anda"
                          >
                            <Send className="w-2.5 h-2.5 text-white" />
                            <span>Terima di WhatsApp Asli ({nomorWA})</span>
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                        <span>{msg.time}</span>
                        {msg.sender === 'user' && (
                          <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Bot Chips */}
              <div className="bg-[#111b21] p-1.5 px-2 flex items-center gap-1.5 overflow-x-auto border-t border-slate-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleSendChat('INFO 24-K')}
                  className="px-2 py-1 rounded bg-[#202c33] hover:bg-[#2a3942] text-emerald-300 font-mono whitespace-nowrap transition-colors"
                >
                  INFO 24-K
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChat('JADWAL')}
                  className="px-2 py-1 rounded bg-[#202c33] hover:bg-[#2a3942] text-amber-300 font-mono whitespace-nowrap transition-colors"
                >
                  JADWAL
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChat('PTSP')}
                  className="px-2 py-1 rounded bg-[#202c33] hover:bg-[#2a3942] text-sky-300 font-mono whitespace-nowrap transition-colors"
                >
                  PTSP
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChat('BIAYA')}
                  className="px-2 py-1 rounded bg-[#202c33] hover:bg-[#2a3942] text-indigo-300 font-mono whitespace-nowrap transition-colors"
                >
                  BIAYA
                </button>
              </div>

              {/* Chat Input Bar */}
              <div className="bg-[#202c33] p-2 flex items-center gap-2 border-t border-slate-700/50">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendChat();
                    }
                  }}
                  placeholder="Ketik INFO 24-K, JADWAL, PTSP..."
                  className="flex-1 bg-[#2a3942] text-slate-100 text-xs px-3 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500"
                />
                <button
                  type="button"
                  id="btn-send-sim-chat"
                  onClick={() => handleSendChat()}
                  className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white transition-colors cursor-pointer"
                  aria-label="Kirim Pesan WhatsApp"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Log Feed Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#0E29CD]" />
            <span>Riwayat Pengiriman Notifikasi Otomatis (Live Dispatch Log)</span>
          </h3>
          <span className="text-[10px] text-slate-500">Auto-Refreshed Real-Time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="p-2.5">Waktu Pengiriman</th>
                <th className="p-2.5">Nomor Tujuan</th>
                <th className="p-2.5">Perkara Terkait</th>
                <th className="p-2.5">Kategori Pesan</th>
                <th className="p-2.5">Ringkasan Notifikasi</th>
                <th className="p-2.5 text-center">Status Gateway</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="p-2.5 font-mono text-[11px] text-slate-500">{log.waktu}</td>
                  <td className="p-2.5 font-mono text-slate-800 font-medium">{log.nomorWA}</td>
                  <td className="p-2.5 font-semibold text-[#0E29CD]">{log.nomorPerkara}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {log.kategori}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-600 text-[11px] max-w-xs truncate">{log.pesan}</td>
                  <td className="p-2.5 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                      <CheckCheck className="w-3 h-3 text-emerald-600" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}
