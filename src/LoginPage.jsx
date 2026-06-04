import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const envUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    const adminEmail = import.meta.env.VITE_FIREBASE_ADMIN_EMAIL;

    // Cek apakah variabel .env terbaca saat runtime
    if (!envUsername || !envPassword || !adminEmail) {
      setError("Konfigurasi (.env) tidak terbaca. Pastikan sudah build ulang setelah mengisi .env.");
      setIsLoading(false);
      return;
    }

    if (username === envUsername && password === envPassword) {
      try {
        await signInWithEmailAndPassword(auth, adminEmail, password);
        onLogin();
      } catch (err) {
        setError(`Firebase Auth Error (${err.code}): Pastikan email '${adminEmail}' sudah terdaftar di Firebase Console.`);
      }
      setIsLoading(false);
    } else {
      setError("Username atau password salah!");
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f1f5f9",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <style>
        {`
          @keyframes spin-login {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .login-spinner {
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid #ffffff;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            animation: spin-login 0.8s linear infinite;
            display: inline-block;
          }
        `}
      </style>
      <form onSubmit={handleSubmit} style={{
        background: "white",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        width: "90%",
        maxWidth: "400px"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#1e293b" }}>Senimatika Admin</h2>
        
        {error && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#475569" }}>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "93%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
          />
        </div>
        
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#475569" }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "93%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
          />
        </div>
        
        <button type="submit" disabled={isLoading} style={{
          width: "100%",
          padding: "14px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontWeight: "700",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          opacity: isLoading ? 0.8 : 1
        }}>
          {isLoading ? <><div className="login-spinner"></div> Memproses...</> : "Login"}
        </button>

        <button 
          type="button" 
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            padding: "14px",
            background: "transparent",
            color: "#64748b",
            border: "1px solid #cbd5e1",
            borderRadius: "12px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "12px",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "#f8fafc"}
          onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
        >
          Kembali ke Beranda
        </button>
      </form>
    </div>
  );
}

export default LoginPage;