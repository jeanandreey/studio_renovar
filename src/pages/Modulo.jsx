import React from "react";
import { Titulo, Icon, FOTOS } from "../ui.jsx";
import { MODULOS, FASES } from "../modulos.js";

export default function Modulo({ id }) {
  const m = MODULOS[id];
  const f = FASES.find((x) => x.n === m.fase);
  const [a, ...b] = m.nome.split(" ");
  return (
    <div className="pagina">
      <section className="pg-head">
        <div>
          <p className="eyebrow">Módulo · Fase {m.fase} · {f.nome}</p>
          <Titulo t={`${a} [${b.join(" ") || ""}]`} />
        </div>
        <div className="bloco-aside">
          <p>{m.resumo}</p>
          <span className={`fase-estado ${f.estado === "Em construção" ? "on" : ""}`}>{m.prioridade ? `${m.prioridade} · ` : ""}{f.estado}</span>
        </div>
      </section>
      <div className="pg-corpo">
      <section className="mod">
        <figure className="mod-foto"><img src={FOTOS[f.img]} alt="" /><figcaption className="foto-tag">Fase {f.n} · {f.nome}</figcaption></figure>
        <ol className="mod-lista">
          {m.itens.map((x, n) => (
            <li key={x}><span>{String(n + 1).padStart(2, "0")}</span>{x}</li>
          ))}
        </ol>
      </section>
      <p className="mod-nota">Este módulo está em desenvolvimento. Ele entra na fase {f.n}, depois da validação dos orçamentos com a equipe. <a href="#orcamentos">Ir para Orçamentos <Icon n="upRight" size={12} /></a></p>
      </div>
    </div>
  );
}
