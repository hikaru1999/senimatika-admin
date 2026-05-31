import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const menu = [
        { path: "/editor", label: "Map Editor"},
        { path: "/content", label: "Content"},
        { path: "/users", label: "User Manager"}
    ];

    return (
        <>
            <style>
                {`
                    .nav-button {
                        transition: all 0.2s ease;
                        border-radius: 10px;
                        font-weight: 600;
                        font-size: 14px;
                    }
                    .nav-button:hover {
                        background: #475569 !important;
                        transform: translateY(-1px);
                    }
                    .nav-button-active:hover {
                        background: #2563eb !important;
                    }
                    .logout-button {
                        transition: all 0.2s ease;
                    }
                    .logout-button:hover {
                        background: #dc2626 !important;
                        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                    }
                `}
            </style>
            <nav
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 32px",
                    height: "72px",
                    background: "#0f172a",
                    color: "white",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    fontFamily: "'Inter', sans-serif",
                    position: "sticky",
                    top: 0,
                    zIndex: 1000
                }}
            >
                <img
                    src="/assets/text_admin.png"
                    alt="Senimatika Logo"
                    onClick={() => navigate("/editor")}
                    style={{
                        height: "48px",
                        width: "auto",
                        objectFit: "contain",
                        cursor: "pointer",
                        opacity: 0.9
                    }}
                />

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {menu.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`nav-button ${isActive ? 'nav-button-active' : ''}`}
                                style={{
                                    padding: "10px 18px",
                                    background: isActive ? "#2563eb" : "transparent",
                                    boxShadow: isActive ? "0 4px 12px rgba(37, 99, 235, 0.3)" : "none",
                                    color: isActive ? "white" : "#94a3b8",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                {item.label}
                            </button>
                        );
                    })}

                    <div style={{ width: "1px", height: "24px", background: "#334155", margin: "0 8px" }} />

                    <button
                        onClick={onLogout}
                        className="nav-button logout-button"
                        style={{
                            padding: "10px 20px",
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </nav>
        </>
    );
}

export default Navbar;