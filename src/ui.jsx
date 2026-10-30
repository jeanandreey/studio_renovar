import React from "react";
import logoSvg from "./logo.svg";
import banho from "./img/banho.jpg";
import argila from "./img/argila.jpg";
import cozinha from "./img/cozinha.jpg";
import sala from "./img/sala.jpg";
import { STATUS } from "./data.js";

export const FOTOS = { banho, argila, cozinha, sala };

// O SVG original tem traços escuros (#1D1D1B) e um contorno branco no "Studio".
export function Logo({ cor = "#111", fundo = "#fff", className }) {
  const svg = logoSvg
    .replace(/#1D1D1B/g, cor)
    .replace(/<path([^>]*)fill="white"/g, `<path$1fill="${fundo}"`)
    .replace(/width="208" height="75"/, 'width="100%" height="100%" preserveAspectRatio="xMinYMid meet"');
  return <span className={className} aria-label="Studio Renovar Premium" role="img" dangerouslySetInnerHTML={{ __html: svg }} />;
}

const P = {
  plus: "M12 5v14M5 12h14",
  down: "M12 5v14M6 13l6 6 6-6",
  right: "M5 12h14M13 6l6 6-6 6",
  left: "M19 12H5M11 6l-6 6 6 6",
  upRight: "M7 17L17 7M8 7h9v9",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  chevron: "M6 9l6 6 6-6",
  x: "M6 6l12 12M18 6L6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  alert: "M12 8v5M12 16.5v.5M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3",
  copy: "M9 9h11v11H9zM5 15H4V4h11v1",
  file: "M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6",
  home: "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
  box: "M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10",
  ruler: "M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z",
  arrowsV: "M8 4v16M4 8l4-4 4 4M16 20V4M12 16l4 4 4-4",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  tag: "M3 12V4h8l10 10-8 8zM7.5 8.5h.01",
  truck: "M2 6h12v10H2zM14 10h4l4 4v2h-8M6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  chat: "M4 5h16v11H9l-5 4z",
  chart: "M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3",
  shield: "M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z",
  cart: "M3 4h2l2.4 11h11L21 7H6.2M9 20h.01M18 20h.01",
  wallet: "M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l12-4v4M17 14h.01",
  refresh: "M20 11a8 8 0 0 0-14.9-4M4 4v4h4M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4",
  building: "M4 21V5l8-3v19M12 8h8v13M8 8h.01M8 12h.01M8 16h.01M16 12h.01M16 16h.01M2 21h20",
  compass: "M12 3v3M12 6l-6 15M12 6l6 15M7.5 16h9",
};
export function Icon({ n, size = 16, stroke = 1.6, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[n]} />
    </svg>
  );
}

// Título em dois tons, como na referência: partes entre [colchetes] ficam em cinza.
export function Titulo({ t, as: Tag = "h1", className = "" }) {
  const partes = t.split(/(\[[^\]]+\])/g).filter(Boolean);
  return (
    <Tag className={`titulo ${className}`}>
      {partes.map((p, n) => (p.startsWith("[") ? <span key={n} className="tom">{p.slice(1, -1)}</span> : <React.Fragment key={n}>{p}</React.Fragment>))}
    </Tag>
  );
}

export function StatusPill({ s }) {
  const x = STATUS[s] || STATUS.elaboracao;
  return <span className={`status-pill t-${x.tom}`}>{x.rotulo}</span>;
}

export const Seta = ({ n = "down", href, onClick, label }) =>
  href ? (
    <a className="seta" href={href} aria-label={label}><Icon n={n} size={18} /></a>
  ) : (
    <button type="button" className="seta" onClick={onClick} aria-label={label}><Icon n={n} size={18} /></button>
  );
