import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseMath(text) {
  if (!text) return [""];

  const parts = [];
  const regex = /(\$\$[^$]+\$\$|\$[^$]+\$)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before) {
      parts.push(escapeHtml(before));
    }

    const raw = match[0];
    const isDisplay = raw.startsWith("$$");
    const content = raw.slice(isDisplay ? 2 : 1, isDisplay ? -2 : -1);
    let html;

    try {
      html = katex.renderToString(content, {
        displayMode: isDisplay,
        throwOnError: false,
      });
    } catch (error) {
      html = escapeHtml(raw);
    }

    parts.push(
      <span
        key={`${match.index}-${raw}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />,
    );

    lastIndex = match.index + raw.length;
  }

  const after = text.slice(lastIndex);
  if (after) {
    parts.push(escapeHtml(after));
  }

  return parts;
}

export default function MathPreview({ text }) {
  const rendered = useMemo(() => parseMath(text), [text]);

  return (
    <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, color: "#334155" }}>
      {rendered.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </div>
  );
}
