import React from "react";

export default function MateriPreview({ previewData, renderWithImages }) {
    const { materiType, materi, title, content } = previewData;

    return (
        <div style={previewContainerStyle}>
            <h2>In-app Preview</h2>
            {materiType === "scroll" ? (
                <div style={scrollPreviewStyle}>
                    <div style={scrollContentWrapperStyle}>
                        <h3 style={scrollTitleStyle}>{title.trim() ? title.toUpperCase() : "MATERI BARU"}</h3>
                        <div style={textContentStyle}>{renderWithImages(content || "Belum ada isi materi...", true, materiType)}</div>
                    </div>
                </div>
            ) : (
                <div style={artifactPreviewStyle}>
                    <div style={closeIconStyle}>✕</div>
                    <h2 style={artifactTitleStyle}>{title.trim() ? title : "Judul Artifact"}</h2>
                    <div style={artifactBadgeStyle}>{materi.trim() ? materi : "Materi"}</div>
                    <div style={dividerStyle} />
                    <div style={{ width: "100%", flex: 1, overflowY: "auto" }}>
                        <div style={{ color: "#3E2723", fontSize: "13px" }}>{renderWithImages(content || "Tulis isi materi...", true, materiType)}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

const previewContainerStyle = { background: "#f8fafc", borderRadius: 18, padding: 22 };
const scrollPreviewStyle = { background: "#F0E7D8", borderRadius: "24px", border: "3px solid #5D4037", width: "360px", height: "640px", margin: "0 auto", padding: "30px 20px", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: "url('https://www.transparenttextures.com/patterns/parchment.png')" };
const scrollContentWrapperStyle = { width: "65%", maxHeight: "75%", overflowY: "auto", textAlign: "center" };
const scrollTitleStyle = { margin: "0 0 12px 0", color: "rgba(161, 0, 0, 0.8)", fontWeight: "700", fontSize: "16px", textTransform: "uppercase" };
const textContentStyle = { lineHeight: "1.6", color: "#3E2723", fontSize: "12px", textAlign: "left" };
const artifactPreviewStyle = { background: "#FDF8E1", borderRadius: "24px", border: "4px solid #8D6E63", width: "360px", height: "640px", margin: "0 auto", padding: "24px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" };
const artifactTitleStyle = { fontSize: "22px", fontWeight: "800", textAlign: "center", color: "#3E2723", margin: "20px 0 8px 0" };
const artifactBadgeStyle = { background: "rgba(141, 110, 99, 0.1)", borderRadius: "8px", padding: "4px 12px", fontSize: "12px", color: "#5D4037", fontWeight: "700", marginBottom: "12px" };
const closeIconStyle = { position: "absolute", top: 12, right: 12, color: "#8D6E63", fontSize: 20, fontWeight: "bold" };
const dividerStyle = { width: "100%", height: "1px", background: "rgba(141, 110, 99, 0.2)", marginBottom: "12px" };