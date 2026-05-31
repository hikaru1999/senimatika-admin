import React from 'react';
import { Link } from 'react-router-dom';

function ClientHomePage() {
  const [isInstallModalOpen, setIsInstallModalOpen] = React.useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  const senimatikaLogo = '/assets/img_logo_wo_name.png';
  const _m1 = "aHR0cHM6Ly9naXRodWIuY29tL2hpa2FydTE5OTkvc2VuaW1hdGlrYS1hcHAvcmVsZWFzZXMvZG93bmxvYWQvdjQuMy4x";
  const _m2 = "aHR0cHM6Ly91bnlhY2lkLW15LnNoYXJlcG9pbnQuY29tLzpiOi9nL3BlcnNvbmFsL2FyZGhpa2FmYWphcl8yMDIyX3N0dWRlbnRfdW55X2FjX2lkL0lRQ0llMWs1R1g2WlNMRlBnZGctZlJEc0FTdWlfR0VwUWttY2hHR3lmV2FOMzVZP2U9SDlmaEpa";

  const handleNavigate = (type) => {
    const url = type === 'apk' ? atob(_m1) + '/senimatika_4.3.1.apk' : atob(_m2);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '300px', height: '300px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '50%' }} />

      <button
        onClick={() => setIsUpdateModalOpen(true)}
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          width: '50px',
          height: '50px',
          backgroundColor: 'white',
          color: '#2563eb',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5em',
          boxShadow: '0 4px 15px rgba(37, 99, 235, 0.1)',
          border: '1px solid rgba(37, 99, 235, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        📢
      </button>

      {/* Tombol Admin Login */}
      <Link
        to="/login"
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          padding: '10px 20px',
          backgroundColor: 'white',
          color: '#2563eb',
          borderRadius: '12px',
          textDecoration: 'none',
          fontSize: '0.85em',
          fontWeight: '800',
          boxShadow: '0 4px 15px rgba(37, 99, 235, 0.1)',
          border: '1px solid rgba(37, 99, 235, 0.1)',
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.backgroundColor = '#2563eb';
          e.currentTarget.style.color = 'white';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.backgroundColor = 'white';
          e.currentTarget.style.color = '#2563eb';
        }}
      >
        🔐 Panel Admin
      </Link>

      <div style={{ textAlign: 'center', zIndex: 1, maxWidth: '800px' }}>
        <img 
          src={senimatikaLogo} 
          alt="Senimatika Logo" 
          style={{ 
            maxWidth: '280px', 
            marginBottom: '24px',
            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.05))'
          }} 
        />
        
        <h1 style={{ 
          fontSize: '3.5em', 
          fontWeight: '900',
          color: '#1e3a8a', 
          marginBottom: '16px', 
          letterSpacing: '-0.02em',
          lineHeight: '1.1'
        }}>
          Senimatika
        </h1>
        
        <p style={{ 
          fontSize: '1.25em', 
          color: '#475569', 
          marginBottom: '48px', 
          lineHeight: '1.6',
          maxWidth: '540px',
          marginInline: 'auto'
        }}>
          Platform belajar matematika interaktif yang mengubah angka menjadi petualangan seru!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '360px', marginInline: 'auto' }}>
          <button 
            onClick={() => handleNavigate('apk')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '18px 28px',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '16px',
              textDecoration: 'none',
              fontSize: '1.1em',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            📥 Unduh Aplikasi (APK)
          </button>

          <button 
              onClick={() => handleNavigate('guide')}
              style={{
                padding: '14px',
                backgroundColor: 'white',
                color: '#2563eb',
                textAlign: 'center',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '0.9em',
                fontWeight: '700',
                cursor: 'pointer',
                border: '2px solid #dbeafe',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.backgroundColor = '#f0f9ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#dbeafe';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              📖 Panduan Penggunaan
            </button>

          <button 
            onClick={() => setIsInstallModalOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#475569',
              textDecoration: 'underline',
              fontSize: '0.85em',
              cursor: 'pointer',
              fontWeight: '600',
              marginTop: '-8px'
            }}
          >
            Cara Instalasi
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            

            {/* <a 
              href={guidePdf2} 
              download="Panduan_2.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '14px',
                backgroundColor: 'white',
                color: '#2563eb',
                textAlign: 'center',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '0.9em',
                fontWeight: '700',
                border: '2px solid #dbeafe',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.backgroundColor = '#f0f9ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#dbeafe';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              📖 Panduan 2
            </a> */}
          </div>
        </div>

        <p style={{ marginTop: '48px', fontSize: '0.85em', color: '#94a3b8', fontWeight: '500' }}>
          Latest Version 4.3.1 • © 2026 Senimatika Team
        </p>
      </div>

      {isInstallModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          backdropFilter: 'blur(4px)',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '24px',
            maxWidth: '450px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <h3 style={{ color: '#1e3a8a', marginTop: 0, marginBottom: '16px', fontSize: '1.5em' }}>Cara Instalasi</h3>
            <div style={{ color: '#475569', lineHeight: '1.7', fontSize: '0.95em' }}>
              <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
                <li>Klik tombol <b>Unduh Aplikasi (APK)</b> di halaman ini.</li>
                <li>Abaikan peringatan <b>"File mungkin berbahaya"</b>. Google Play Protect akan memindai APK ini. Tenang, kami menjamin aplikasi aman digunakan untuk berbagai kalangan. Your privacy matters!</li>
                <li>Setelah selesai, buka file APK tersebut melalui File Manager.</li>
                <li>Jika muncul blokir keamanan, buka <b>Pengaturan</b> lalu aktifkan izin <b>"Instal aplikasi dari sumber tidak dikenal (allow from this source)"</b>.</li>
                <li>Klik <b>Instal</b> dan tunggu prosesnya hingga selesai.</li>
                <li>Aplikasi <b>Senimatika</b> siap digunakan!</li>
              </ol>
            </div>
            <button 
              onClick={() => setIsInstallModalOpen(false)}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          backdropFilter: 'blur(4px)',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '24px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <h3 style={{ color: '#1e3a8a', marginTop: 0, marginBottom: '16px', fontSize: '1.5em' }}>📢 Pembaruan Terbaru (v4.3.1)</h3>
            <p>Beta Release: 20 Mei 2026</p>
            <div style={{ color: '#475569', lineHeight: '1.7', fontSize: '0.95em' }}>
              <p>Apa yang baru di versi ini?</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
                <li><b>Fitur Zoom-in/out:</b> Pengguna kini dapat memperbesar/memperkecil gambar yang tercantum untuk semua tipe kuis (Online Quiz, Boss Quiz, dan Station Quiz).</li>
                <li><b>Perbaikan LaTeX Rendering:</b> Sekarang, formula matematika kompleks, notasi saintifik, dan karakter spesial tampil secara rapi dan proporsional tanpa distorsi.</li>
                <li><b>Optimasi Peta Eksplorasi:</b> Resolusi gambar yang digunakan pada peta direduksi untuk meningkatkan performa dan efisiensi.</li>
                <li><b>Submit Answer Fairness:</b> Pada kuis kompetitif (Online Quiz), timer akan berhenti seketika pengguna menekan tombol submit.</li>
              </ul>
            </div>
            <button 
              onClick={() => setIsUpdateModalOpen(false)}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientHomePage;