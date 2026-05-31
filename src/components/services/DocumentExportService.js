import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, AlignmentType, Footer, Header, PageNumber, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import { saveAs } from "file-saver";

export const DocumentExportService = {
    questionTypeLabels: {
        multiple_choice: "PILIHAN GANDA",
        check_boxes: "PILIHAN GANDA KOMPLEKS",
        short_answer: "ISIAN SINGKAT"
    },

    parseContent: (text) => {
        if (!text) return [{ text: "", isMath: false }];
        const regex = /(\$\$[^$]+\$\$|\$[^$]+\$)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const before = text.slice(lastIndex, match.index);
            if (before) {
                parts.push({ text: before.replace(/[#*`]/g, ''), isMath: false });
            }
            parts.push({ text: match[0], isMath: true });
            lastIndex = match.index + match[0].length;
        }
        const after = text.slice(lastIndex);
        if (after) {
            parts.push({ text: after.replace(/[#*`]/g, ''), isMath: false });
        }
        return parts;
    },

    getOptionLabel: (index) => String.fromCharCode(65 + index),

    getAlignment: (text) => {
        if (text.includes("[center]")) return "center";
        if (text.includes("[right]")) return "right";
        if (text.includes("[justify]")) return "justify";
        return "left";
    },

    cleanText: (text) => {
        return text.replace(/\[\/?(left|center|right|justify)\]/gi, "");
    },

    exportToPDF: async (questions, includeKey) => {
        const doc = new jsPDF();
        const margin = 25.4;
        const pageWidth = doc.internal.pageSize.width;
        const contentWidth = pageWidth - (margin * 2);
        let yPos = margin;

        const addHeader = () => {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("ARSIP SOAL SENIMATIKA", pageWidth / 2, 15, { align: "center" });
            doc.setLineWidth(0.5);
            doc.line(margin, 18, pageWidth - margin, 18);
        };

        const addFooter = () => {
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFont("helvetica", "italic");
                doc.setFontSize(9);
                doc.text(`Hal. ${i} dari ${pageCount}`, pageWidth - margin, doc.internal.pageSize.height - 10, { align: "right" });
            }
        };

        addHeader();
        yPos += 5;

        questions.forEach((q, i) => {
            if (yPos > 260) { doc.addPage(); addHeader(); yPos = margin; }

            const alignment = DocumentExportService.getAlignment(q.question);
            const text = DocumentExportService.cleanText(q.question);
            const xPos = alignment === "center" ? pageWidth / 2 : (alignment === "right" ? pageWidth - margin : margin);
            const lines = doc.splitTextToSize(text, contentWidth);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(`${i + 1}.`, margin - 10, yPos);
            
            doc.setFont("helvetica", "normal");
            doc.text(text, xPos, yPos, { align: alignment, maxWidth: contentWidth });
            yPos += (lines.length * 7) + 10;

            if (q.questionType === "short_answer") {
                doc.text(".".repeat(95), margin, yPos);
                yPos += 15;
            } else if (q.questionType === "check_boxes") {
                q.options.forEach((opt, idx) => {
                    const optText = DocumentExportService.cleanText(opt);
                    const optLines = doc.splitTextToSize(optText, contentWidth - 10);
                    
                    if (yPos + (optLines.length * 7) > 270) { doc.addPage(); addHeader(); yPos = margin; }
                    
                    doc.rect(margin, yPos - 4, 4, 4); 
                    doc.text(optText, margin + 8, yPos, { maxWidth: contentWidth - 10 });
                    yPos += (optLines.length * 7) + 2;
                });
                yPos += 5;
            } else if (q.options) {
                q.options.forEach((opt, idx) => {
                    const label = DocumentExportService.getOptionLabel(idx); 
                    const optText = DocumentExportService.cleanText(opt);
                    const optLines = doc.splitTextToSize(optText, contentWidth - 12);

                    if (yPos + (optLines.length * 7) > 270) { doc.addPage(); addHeader(); yPos = margin; }

                    doc.text(`${label}.`, margin + 5, yPos);
                    doc.text(optText, margin + 12, yPos, { maxWidth: contentWidth - 12 });
                    yPos += (optLines.length * 7) + 2;
                });
                yPos += 5;
            }
        });

        if (includeKey) {
            doc.addPage(); addHeader();
            yPos = margin;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("KUNCI JAWABAN", margin, yPos);
            yPos += 10;
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");

            questions.forEach((q, i) => {
                const answerText = q.questionType === "short_answer" 
                    ? q.answerKey.join(", ") 
                    : q.answerKey.map(idx => DocumentExportService.getOptionLabel(idx)).join(", ");
                
                const keyLines = doc.splitTextToSize(`${i + 1}. ${answerText}`, contentWidth);
                if (yPos + (keyLines.length * 7) > 270) { doc.addPage(); addHeader(); yPos = margin; }
                doc.text(`${i + 1}. ${answerText}`, margin, yPos, { maxWidth: contentWidth });
                yPos += (keyLines.length * 7) + 2;
            });
        }

        addFooter();
        doc.save(`Soal_Senimatika_${Date.now()}.pdf`);
    },

    exportToWord: async (questions, includeKey) => {
        const children = [
            new Paragraph({
                children: [new TextRun({ text: "ARSIP SOAL SENIMATIKA", bold: true, size: 28 })],
                alignment: "center",
                spacing: { after: 400 }
            })
        ];

        questions.forEach((q, i) => {
            const alignment = DocumentExportService.getAlignment(q.question);
            const rawText = DocumentExportService.cleanText(q.question);
            const questionParts = DocumentExportService.parseContent(rawText);
            
            const wordAlign = alignment === "center" ? AlignmentType.CENTER : (alignment === "right" ? AlignmentType.RIGHT : (alignment === "justify" ? AlignmentType.JUSTIFIED : AlignmentType.LEFT));

            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: `${i + 1}.   `,
                        bold: true,
                        size: 24,
                        color: "1e293b",
                    }),
                    new TextRun({
                        text: `  ${(q.jenjang || "UMUM").toUpperCase()}  |  ${(q.materi || "GENERAL").toUpperCase()}  |  ${DocumentExportService.questionTypeLabels[q.questionType] || (q.questionType || "N/A").toUpperCase()}  `,
                        bold: true,
                        size: 16,
                        color: "0369a1",
                    })
                ],
                shading: {
                    fill: "f0f9ff",
                },
                spacing: { before: 300, after: 120 }
            }));

            children.push(new Paragraph({
                children: [
                    ...questionParts.map(p => new TextRun({
                        text: p.text,
                        italics: p.isMath,
                        color: p.isMath ? "2563eb" : "000000"
                    }))
                ],
                alignment: wordAlign,
                spacing: { after: 100 },
                indent: { left: 450 }
            }));

            if (q.questionType === "short_answer") {
                children.push(new Paragraph({
                    children: [new TextRun({ text: "_".repeat(70), bold: true })],
                    spacing: { after: 200 }
                }));
            } else if (q.questionType === "check_boxes") {
                const rows = q.options.map((opt, idx) => {
                    const optParts = DocumentExportService.parseContent(DocumentExportService.cleanText(opt));
                    return new TableRow({
                        children: [
                            new TableCell({ 
                                width: { size: 5, type: WidthType.PERCENTAGE },
                                children: [new Paragraph({ children: [new TextRun("☐")] })] 
                            }),
                            new TableCell({ 
                                width: { size: 95, type: WidthType.PERCENTAGE },
                                children: [new Paragraph({
                                    children: optParts.map(p => new TextRun({
                                        text: p.text,
                                        italics: p.isMath,
                                        color: p.isMath ? "2563eb" : "000000"
                                    }))
                                })] 
                            })
                        ]
                    });
                });
                children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
            } else if (q.options) {
                q.options.forEach((opt, idx) => {
                    const optParts = DocumentExportService.parseContent(DocumentExportService.cleanText(opt));
                    children.push(new Paragraph({
                        children: [
                            new TextRun({ text: `   ${DocumentExportService.getOptionLabel(idx)}. `, bold: true }),
                            ...optParts.map(p => new TextRun({
                                text: p.text,
                                italics: p.isMath,
                                color: p.isMath ? "2563eb" : "000000"
                            }))
                        ],
                        spacing: { after: 50 }
                    }));
                });
            }
        });

        const doc = new Document({
            sections: [{
                properties: {
                    page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
                },
                headers: {
                    default: new Header({
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Dokumen Ujian Senimatika", color: "64748b", size: 18 })],
                            alignment: AlignmentType.RIGHT
                        })]
                    })
                },
                footers: {
                    default: new Footer({
                        children: [new Paragraph({
                            children: [
                                new TextRun("Halaman "),
                                new TextRun({ children: [PageNumber.CURRENT] }),
                                new TextRun(" dari "),
                                new TextRun({ children: [PageNumber.TOTAL_PAGES] }),
                            ],
                            alignment: AlignmentType.CENTER
                        })]
                    })
                },
                children: children,
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Soal_Senimatika_${Date.now()}.docx`);
    }
};