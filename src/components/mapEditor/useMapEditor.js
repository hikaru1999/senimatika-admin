import { useState, useEffect, useRef, useCallback } from "react";
import { db } from "../../firebase";
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { GROUND_VARIANTS, OBJECT_VARIANTS } from "./Constants";

export default function useMapEditor() {
  const [view, setView] = useState("gallery");
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [newWidthInput, setNewWidthInput] = useState(40);
  const [newHeightInput, setNewHeightInput] = useState(30);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [levels, setLevels] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const [selectedLevelId, setSelectedLevelId] = useState("level_1");
  const [levelName, setLevelName] = useState("Level 1");
  const [levelDescription, setLevelDescription] = useState("");
  const [levelPassword, setLevelPassword] = useState("");
  const [levelType, setLevelType] = useState("NORMAL");
  const [isLevelActive, setIsLevelActive] = useState(true);
  const [visibilityMode, setVisibilityMode] = useState("NORMAL");
  const [activeTool, setActiveTool] = useState("NONE");
  const [brushMode, setBrushMode] = useState("GROUND");
  const [selectedGround, setSelectedGround] = useState("GROUND");
  const [selectedObject, setSelectedObject] = useState("NONE");
  const [selectedGroundVariant, setSelectedGroundVariant] = useState("tile_ground_1");
  const [selectedObjectVariant, setSelectedObjectVariant] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [playerPos, setPlayerPos] = useState({ x: 10, y: 10 });
  const [bossPos, setBossPos] = useState(null);
  const [hoverPos, setHoverPos] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [uniqueQuests, setUniqueQuests] = useState([]);
  const [artifactContents, setArtifactContents] = useState([]);
  const isMouseDown = useRef(false);

  const [map, setMap] = useState(() =>
    Array.from({ length: 30 }, () =>
      Array.from({ length: 40 }, () => ({
        ground: "GROUND", groundVariant: "", object: "NONE", objectVariant: "", quizId: "", contentId: "",
      }))
    )
  );

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "game_maps"));
      setLevels(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.levelType === b.levelType ? a.id.localeCompare(b.id) : a.levelType === "TUTORIAL" ? -1 : 1));

      const quizSnapshot = await getDocs(collection(db, "boss_quizzes"));
      setQuizzes(quizSnapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title || "Untitled Quiz", materi: doc.data().materi || "" })));

      const uqSnapshot = await getDocs(collection(db, "unique_quizzes"));
      setUniqueQuests(uqSnapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title || "Untitled Quest", materi: doc.data().materi || "" })));

      const contentSnapshot = await getDocs(collection(db, "artifact_contents"));
      setArtifactContents(contentSnapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title || "Untitled Content", materi: doc.data().materi || "" })));
    } catch (e) { console.error(e); }
  };

  const loadMap = async (id) => {
    const snap = await getDoc(doc(db, "game_maps", id));
    if (!snap.exists()) return;
    const data = snap.data();
    setSelectedLevelId(id);
    setLevelName(data.name || id);
    setLevelDescription(data.description || "");
    setLevelType(data.levelType || "NORMAL");
    setVisibilityMode(data.visibility?.fogNightCombined ? "FOG_NIGHT" : data.visibility?.nightMode ? "NIGHT" : data.visibility?.fogOfWar ? "FOG" : "NORMAL");
    
    const newMap = Array.from({ length: data.height }, (_, y) =>
      Array.from({ length: data.width }, (_, x) => {
        const tile = data.tiles[y * data.width + x];
        return { ...tile };
      })
    );
    setMap(newMap);
    setPlayerPos(data.playerStart || { x: 0, y: 0 });
    setBossPos(data.bossStart || null);
    setView("editor");
  };

  const handleSave = async () => {
    setIsSaving(true);
    const minX = Math.min(...map.flatMap((row, y) => row.map((tile, x) => (tile.object !== "NONE" || tile.groundVariant !== "") ? x : Infinity)));
    const minY = Math.min(...map.flatMap((row, y) => row.map((tile, x) => (tile.object !== "NONE" || tile.groundVariant !== "") ? y : Infinity)));
    const maxX = Math.max(...map.flatMap((row, y) => row.map((tile, x) => (tile.object !== "NONE" || tile.groundVariant !== "") ? x : -Infinity)));
    const maxY = Math.max(...map.flatMap((row, y) => row.map((tile, x) => (tile.object !== "NONE" || tile.groundVariant !== "") ? y : -Infinity)));

    if (minX === Infinity) return alert("Map kosong!");

    const croppedTiles = [];
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        croppedTiles.push(map[y][x]);
      }
    }

    const finalId = selectedLevelId.startsWith("level_") ? levelName.toLowerCase().replace(/\s+/g, "_") : selectedLevelId;
    await setDoc(doc(db, "game_maps", finalId), {
      name: levelName, description: levelDescription, levelType, isActive: isLevelActive,
      width: maxX - minX + 1, height: maxY - minY + 1, tiles: croppedTiles,
      playerStart: { x: playerPos.x - minX, y: playerPos.y - minY },
      bossStart: bossPos ? { x: bossPos.x - minX, y: bossPos.y - minY } : null,
      visibility: { normal: visibilityMode === "NORMAL", fogOfWar: visibilityMode === "FOG", nightMode: visibilityMode === "NIGHT", fogNightCombined: visibilityMode === "FOG_NIGHT" }
    }).then(async () => {
        await fetchData();
        setIsSaving(false);
        setIsSaveModalOpen(false);
        setSnackbar({ open: true, message: "Peta Berhasil Disimpan!", type: "success" });
    }).catch((err) => {
        console.error(err);
        setIsSaving(false);
        setSnackbar({ open: true, message: "Gagal menyimpan peta ke server.", type: "error" });
    });
  };

  const handleClick = useCallback((x, y) => {
    if (activeTool === "NONE") return;
    if (activeTool === "PLAYER") { setPlayerPos({ x, y }); return; }

    setMap(prev => {
      const newMap = [...prev];
      newMap[y] = [...newMap[y]];
      if (activeTool === "ERASER") {
        newMap[y][x] = { ground: "GROUND", groundVariant: "", object: "NONE", objectVariant: "", quizId: "", contentId: "" };
        if (bossPos?.x === x && bossPos?.y === y) setBossPos(null);
      } else {
        if (brushMode === "GROUND") {
          newMap[y][x] = { ...newMap[y][x], ground: selectedGround, groundVariant: selectedGroundVariant };
        } else {
          if (selectedObject === "BOSS") setBossPos({ x, y });
          newMap[y][x] = { 
            ...newMap[y][x], 
            object: selectedObject, 
            objectVariant: selectedObjectVariant,
            quizId: (selectedObject === "BOSS" || selectedObject === "STATION") ? selectedQuizId : "",
            contentId: (selectedObject === "ARTIFACT") ? selectedQuizId : "",
          };
        }
      }
      return newMap;
    });
  }, [activeTool, brushMode, selectedGround, selectedGroundVariant, selectedObject, selectedObjectVariant, selectedQuizId, bossPos]);

  const addDimension = (side, count = 1) => {
    setMap(prev => {
      const h = prev.length;
      const w = prev[0].length;
      const empty = () => ({ ground: "GROUND", groundVariant: "", object: "NONE", objectVariant: "", quizId: "", contentId: "" });
      if (side === "top") {
        setPlayerPos(p => ({ ...p, y: p.y + count }));
        return [...Array.from({ length: count }, () => Array.from({ length: w }, empty)), ...prev];
      }
      if (side === "left") {
        setPlayerPos(p => ({ ...p, x: p.x + count }));
        return prev.map(row => [...Array.from({ length: count }, empty), ...row]);
      }
      if (side === "bottom") return [...prev, ...Array.from({ length: count }, () => Array.from({ length: w }, empty))];
      if (side === "right") return prev.map(row => [...row, ...Array.from({ length: count }, empty)]);
      return prev;
    });
  };

  const handleConfirmNewLevel = () => {
    const w = parseInt(newWidthInput) || 40;
    const h = parseInt(newHeightInput) || 30;
    const newId = `level_${Date.now()}`;

    setSelectedLevelId(newId);
    setLevelName("Level Baru");
    setLevelDescription("");
    setLevelPassword("");
    setLevelType("NORMAL");
    setIsLevelActive(true);
    setVisibilityMode("NORMAL");
    setActiveTool("BRUSH");
    setIsSizeModalOpen(false);

    setMap(
      Array.from({ length: h }, () =>
        Array.from({ length: w }, () => ({
          ground: "GROUND", groundVariant: "", object: "NONE", objectVariant: "", quizId: "", contentId: "",
        }))
      )
    );
    setPlayerPos({ x: Math.floor(w / 2), y: Math.floor(h / 2) });
    setBossPos(null);
    setView("editor");
  };

  const handleClearMap = () => {
    const currentHeight = map.length;
    const currentWidth = map[0].length;
    setMap(Array.from({ length: currentHeight }, () =>
      Array.from({ length: currentWidth }, () => ({
        ground: "GROUND", groundVariant: "", object: "NONE", objectVariant: "", quizId: "", contentId: "",
      }))
    ));
    setPlayerPos({ x: 10, y: 10 });
    setBossPos(null);
    setVisibilityMode("NORMAL");
  };

  useEffect(() => { fetchData(); }, []);

  return {
    view, setView,
    levels, loadMap, handleSave, handleClick, addDimension,
    map, setMap,
    playerPos, setPlayerPos,
    bossPos, setBossPos,
    activeTool, setActiveTool,
    brushMode, setBrushMode,
    selectedGround, setSelectedGround,
    selectedGroundVariant, setSelectedGroundVariant,
    selectedObject, setSelectedObject,
    selectedObjectVariant, setSelectedObjectVariant,
    levelName, setLevelName,
    levelDescription, setLevelDescription,
    levelType, setLevelType,
    isLevelActive, setIsLevelActive,
    visibilityMode, setVisibilityMode,
    quizzes, uniqueQuests, artifactContents,
    selectedQuizId, setSelectedQuizId,
    isMouseDown, hoverPos, setHoverPos,
    isSizeModalOpen, setIsSizeModalOpen,
    isSaveModalOpen, setIsSaveModalOpen,
    isClearModalOpen, setIsClearModalOpen,
    isSaving,
    snackbar, setSnackbar,
    handleConfirmNewLevel,
    handleClearMap,
    newWidthInput, setNewWidthInput,
    newHeightInput, setNewHeightInput,
    handleDeleteLevel: async (id) => {
        if (window.confirm("Hapus?")) {
            try {
                await deleteDoc(doc(db, "game_maps", id));
                setSnackbar({ open: true, message: "Peta berhasil dihapus!", type: "success" });
                fetchData();
            } catch (err) {
                console.error(err);
                setSnackbar({ open: true, message: "Gagal menghapus peta.", type: "error" });
            }
        }
    }
  };
}