import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends (Component as any)<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public handleReset = () => {
    try {
      localStorage.removeItem('dilmilti5_db_session_v1');
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#071F13] text-white flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border-2 border-amber-400/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-9 h-9" />
            </div>
            
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 font-mono">
                Pengadilan Militer Tinggi V Makassar
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Terjadi Kendala Memuat Halaman
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Sistem mendeteksi kendala pada sesi browser atau cache sementara. Silakan segarkan halaman atau kembali ke Beranda utama.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left text-[11px] font-mono text-rose-300 overflow-x-auto max-h-32">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Segarkan Halaman (Reload)</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-slate-700 transition-colors"
              >
                <Home className="w-4 h-4 text-emerald-400" />
                <span>Kembali ke Beranda Utama</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (this.props as any).children;
  }
}
