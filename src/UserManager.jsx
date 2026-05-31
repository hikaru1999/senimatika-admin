import { useEffect, useState, useMemo } from "react";
import { db } from "./firebase"; 
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import Snackbar from "./components/Snackbar";
import Gatekeeper from "./components/userManager/Gatekeeper";
import UserTable from "./components/userManager/UserTable";
import UserDetailModal from "./components/userManager/UserDetailModal";
import { POWER_UP_OPTIONS } from "./components/userManager/Constants";

function UserManager() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
    const [searchTerm, setSearchTerm] = useState("");
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedUserDetail, setSelectedUserDetail] = useState(null);
    const [linkedData, setLinkedData] = useState({ quizzes: [], maps: [], contents: [] });
    const [isFetchingLinkedData, setIsFetchingLinkedData] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editableUserDetail, setEditableUserDetail] = useState(null);

    const filteredUsers = useMemo(() => {
        return users.filter(u => 
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.uid?.includes(searchTerm) ||
            u.role?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const stats = useMemo(() => {
        const total = users.length;
        const totalCoins = users.reduce((acc, u) => acc + (u.coins ?? u.coin ?? 0), 0);
        const activeUsers = users.filter(u => u.isOnline).length;
        return { 
            total: total.toLocaleString(), 
            totalCoins: totalCoins.toLocaleString(), 
            activeUsers: activeUsers.toLocaleString() 
        };
    }, [users]);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const usersCollectionRef = collection(db, "users");
            const firestoreSnapshot = await getDocs(usersCollectionRef);
            const data = firestoreSnapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            }));
            
            setUsers(data);
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: "Gagal memuat data pengguna.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLinkedData = async (user) => {
        setIsFetchingLinkedData(true);
        const newLinkedData = { quizzes: [], maps: [], contents: [] };

        try {
            if (user.completedQuizzes && user.completedQuizzes.length > 0) {
                const quizPromises = user.completedQuizzes.map(async (quizId) => {
                    const quizDoc = await getDoc(doc(db, "online_quizzes", quizId));
                    return quizDoc.exists() ? { id: quizDoc.id, ...quizDoc.data() } : null;
                });
                newLinkedData.quizzes = (await Promise.all(quizPromises)).filter(Boolean);
            }

            if (user.finishedMapIds && user.finishedMapIds.length > 0) {
                const mapPromises = user.finishedMapIds.map(async (mapId) => {
                    const mapDoc = await getDoc(doc(db, "game_maps", mapId));
                    return mapDoc.exists() ? { id: mapDoc.id, ...mapDoc.data() } : null;
                });
                newLinkedData.maps = (await Promise.all(mapPromises)).filter(Boolean);
            }

            if (user.scrolls && user.scrolls.length > 0) {
                const contentPromises = user.scrolls.map(async (contentId) => {
                    const contentDoc = await getDoc(doc(db, "learning_contents", contentId));
                    return contentDoc.exists() ? { id: contentDoc.id, ...contentDoc.data() } : null;
                });
                newLinkedData.contents = (await Promise.all(contentPromises)).filter(Boolean);
            }

            setLinkedData(newLinkedData);
        } catch (error) {
            console.error("Error fetching linked data:", error);
            setLinkedData({ quizzes: [], maps: [], contents: [] });
        } finally {
            setIsFetchingLinkedData(false);
        }
    };

    const handleViewDetails = (user) => {
        const enrichedPowerUps = user.powerUps?.map(pu => {
            const powerUpName = typeof pu === "string" ? pu : (pu.name || "");
            const powerUpQty = typeof pu === "string" ? 1 : (pu.quantity || 0);
            const option = POWER_UP_OPTIONS.find(opt => opt.name === powerUpName);
            return {
                name: powerUpName,
                uiName: option ? option.uiName : powerUpName,
                quantity: powerUpQty
            };
        }) || [];

        const userWithEnrichedPowerUps = {
            ...user,
            powerUps: enrichedPowerUps
        };
        setSelectedUserDetail(userWithEnrichedPowerUps);
        setEditableUserDetail({ ...userWithEnrichedPowerUps });
        setIsDetailModalOpen(true);
        fetchLinkedData(user);
    };

    const handleSaveUserChanges = async () => {
        if (!editableUserDetail || !editableUserDetail.uid) return;
        setIsLoading(true);
        try {
            const userRef = doc(db, "users", editableUserDetail.uid);
            await updateDoc(userRef, {
                coins: Number(editableUserDetail.coins || 0),
                totalBossDefeated: Number(editableUserDetail.totalBossDefeated || 0),
                totalChestsOpened: Number(editableUserDetail.totalChestsOpened || 0),
                tutorial_completed: Boolean(editableUserDetail.tutorial_completed),
                legendaryPityCounter: Number(editableUserDetail.legendaryPityCounter || 0),
                powerUps: editableUserDetail.powerUps || [],
            });
            setSnackbar({ open: true, message: "Perubahan berhasil disimpan!", type: "success" });
            setIsEditMode(false);
            await loadUsers();
        } catch (error) {
            console.error("Gagal menyimpan perubahan:", error);
            setSnackbar({ open: true, message: "Gagal menyimpan perubahan.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedUserDetail(null);
        setLinkedData({ quizzes: [], maps: [], contents: [] });
        setIsEditMode(false);
        setEditableUserDetail(null);
    };

    useEffect(() => {
        if (isAuthorized) loadUsers();
    }, [isAuthorized]);

    if (!isAuthorized) return <Gatekeeper onAuthorized={() => setIsAuthorized(true)} />;

    return (
        <div style={{ padding: "32px 24px", maxWidth: 1140, margin: "0 auto", fontFamily: "'Inter', sans-serif", color: "#1e293b" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, letterSpacing: "-0.025em" }}>👥 User Manager</h1>
                    <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "14px" }}>Kelola dan pantau seluruh aktivitas metrik pengguna Senimatika.</p>
                </div>
                <button 
                    onClick={loadUsers} 
                    disabled={isLoading} 
                    style={{ 
                        padding: "10px 20px", borderRadius: 12, border: "1px solid #e2e8f0", 
                        background: "white", cursor: "pointer", fontWeight: 700, fontSize: "14px",
                        display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}
                >
                    {isLoading ? "Memuat..." : "🔄 Segarkan Data"}
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 32 }}>
                <div style={statsCardStyle("#eff6ff", "#2563eb")}>
                    <div style={statsLabelStyle}>Total Pengguna</div>
                    <div style={statsValueStyle}>{stats.total}</div>
                </div>
                <div style={statsCardStyle("#fff7ed", "#ea580c")}>
                    <div style={statsLabelStyle}>Koin Beredar</div>
                    <div style={statsValueStyle}>🪙 {stats.totalCoins}</div>
                </div>
                <div style={statsCardStyle("#f0fdf4", "#16a34a")}>
                    <div style={statsLabelStyle}>User Sedang Online</div>
                    <div style={statsValueStyle}>{stats.activeUsers}</div>
                </div>
            </div>

            <div style={{ background: "white", padding: "20px", borderRadius: 20, border: "1px solid #e2e8f0", marginBottom: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: 16, color: "#94a3b8" }}>🔍</span>
                <input
                    type="text"
                        placeholder="Cari berdasarkan Email, Nama, atau UID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "100%", padding: "14px 14px 14px 44px", borderRadius: 14, border: "1px solid #e2e8f0", fontSize: "15px", outline: "none", transition: "border-color 0.2s" }}
                />
                </div>
            </div>

            <UserTable 
                users={filteredUsers} 
                onViewDetails={handleViewDetails} 
            />
            
            <UserDetailModal 
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                userDetail={selectedUserDetail}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
                editableUserDetail={editableUserDetail}
                setEditableUserDetail={setEditableUserDetail}
                linkedData={linkedData}
                isFetchingLinkedData={isFetchingLinkedData}
                onSave={handleSaveUserChanges}
                isLoading={isLoading}
            />

            <Snackbar 
                isOpen={snackbar.open} 
                message={snackbar.message} 
                type={snackbar.type}
                onClose={() => setSnackbar({ ...snackbar, open: false })} 
            />
        </div>
    );
}

const statsCardStyle = (bg, color) => ({ background: bg, padding: "24px", borderRadius: 20, border: `1px solid ${color}20` });
const statsLabelStyle = { color: "#64748b", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" };
const statsValueStyle = { fontSize: "28px", fontWeight: 800, color: "#1e293b" };

export default UserManager;