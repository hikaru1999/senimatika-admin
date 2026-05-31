import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import App from "./App";
import ContentManager from "./ContentManager";
import Navbar from "./components/Navbar";
import ClientHomePage from "./ClientHomePage";
import UserManager from "./UserManager";
import LoginPage from "./LoginPage";

function Root() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    setShowLogoutModal(false);
  };

  useEffect(() => {
    document.title = isLoggedIn ? "Senimatika | Dashboard Admin" : "Senimatika - Landing Page";
  }, [isLoggedIn]);

  return (
    <Routes>
      {/* CLIENT HOME PAGE */}
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/editor" replace /> : <ClientHomePage />}
      />

      {/*  LOGIN ADMIN */}
      <Route 
        path="/login" 
        element={isLoggedIn ? <Navigate to="/editor" replace /> : <LoginPage onLogin={handleLogin} />} 
      />

      {/* ADMIN AREA */}
      <Route
        path="/*"
        element={
          isLoggedIn ? (
            <>
              <Navbar onLogout={handleLogout} />
              {showLogoutModal && (
                <div style={{
                  position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  zIndex: 2000, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', backdropFilter: 'blur(4px)'
                }}>
                  <div style={{
                    background: 'white', padding: '32px', borderRadius: '24px',
                    width: '320px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>🚪</div>
                    <h3 style={{ margin: '0 0 8px', color: '#1e293b' }}>Konfirmasi Log Out</h3>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Apakah Anda yakin ingin keluar dari Panel Admin?</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => setShowLogoutModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', background: 'white', fontWeight: '600', cursor: 'pointer' }}>
                        Batal
                      </button>
                      <button onClick={confirmLogout} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
                        Keluar
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div style={{ padding: 20 }}>
                <Routes>
                  <Route path="editor" element={<App />} />
                  <Route path="content" element={<ContentManager />} />
                  <Route path="users" element={<UserManager />} />
                  <Route path="*" element={<Navigate to="/editor" replace />} />
                </Routes>
              </div>
            </>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default Root;