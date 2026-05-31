import React from "react";
import useMapEditor from "./components/mapEditor/useMapEditor";
import MapGallery from "./components/mapEditor/MapGallery";
import MapCanvas from "./components/mapEditor/MapCanvas";
import EditorSidebar from "./components/mapEditor/EditorSidebar";
import NewMapModal from "./components/mapEditor/NewMapModal";
import SaveMapModal from "./components/mapEditor/SaveMapModal";
import ClearMapModal from "./components/mapEditor/ClearMapModal";
import Snackbar from "./components/Snackbar";

function App() {
  const editor = useMapEditor();

  if (editor.view === "gallery") {
    return (
      <>
        <MapGallery 
          levels={editor.levels} 
          loadingMapId={editor.loadingMapId}
          isLoading={editor.isLoading}
          onAddNew={() => editor.setIsSizeModalOpen(true)}
          onLoad={editor.loadMap}
          onDelete={editor.handleDeleteLevel}
        />
        <NewMapModal 
          isOpen={editor.isSizeModalOpen}
          onClose={() => editor.setIsSizeModalOpen(false)}
          onConfirm={editor.handleConfirmNewLevel}
          width={editor.newWidthInput}
          height={editor.newHeightInput}
          setWidth={editor.setNewWidthInput}
          setHeight={editor.setNewHeightInput}
        />
        <Snackbar 
          isOpen={editor.snackbar.open} 
          message={editor.snackbar.message} 
          type={editor.snackbar.type}
          onClose={() => editor.setSnackbar({ ...editor.snackbar, open: false })} 
        />
      </>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, sans-serif", background: "#f1f5f9" }}>
      <EditorSidebar {...editor} />
      <MapCanvas 
        map={editor.map} 
        playerPos={editor.playerPos}
        isMouseDown={editor.isMouseDown}
        onTileClick={editor.handleClick}
        onHover={editor.setHoverPos}
        onAddDimension={editor.addDimension}
        activeTool={editor.activeTool}
        setActiveTool={editor.setActiveTool}
      />
      <NewMapModal 
        isOpen={editor.isSizeModalOpen}
        onClose={() => editor.setIsSizeModalOpen(false)}
        onConfirm={editor.handleConfirmNewLevel}
        width={editor.newWidthInput}
        height={editor.newHeightInput}
        setWidth={editor.setNewWidthInput}
        setHeight={editor.setNewHeightInput}
      />
      <SaveMapModal 
        isOpen={editor.isSaveModalOpen}
        onClose={() => editor.setIsSaveModalOpen(false)}
        onConfirm={editor.handleSave}
        isSaving={editor.isSaving}
      />
      <ClearMapModal 
        isOpen={editor.isClearModalOpen}
        onClose={() => editor.setIsClearModalOpen(false)}
        onConfirm={editor.handleClearMap}
      />

      <Snackbar 
        isOpen={editor.snackbar.open} 
        message={editor.snackbar.message} 
        type={editor.snackbar.type}
        onClose={() => editor.setSnackbar({ ...editor.snackbar, open: false })} 
      />
    </div>
  );
}

export default App;