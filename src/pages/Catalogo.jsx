import React, { useState } from "react";
import { Titulo, Icon } from "../ui.jsx";
import { CATALOGO, fmtMoeda, fmtNum, fmtPct } from "../data.js";

export default function Catalogo() {
  const [q, setQ] = useState("");
  const [col, setCol] = useState("Todas");
  const colecoes = ["Todas", ...new Set(CATALOGO.map((p) => p.colecao))];
  const vis = CATALOGO.filter((p) => (col === "Todas" || p.colecao === col) && [p.nome, p.marca, p.codigo, p.colecao, p.formato].join(" ").toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="pagina">
      <section className="pg-head">
        <div>
          <p className="eyebrow">Produtos e preços · Catálogo</p>
          <Titulo t="Cada peça, [com rendimento e margem]" />
        </div>
        <div className="bloco-aside">
          <p>Produtos de exemplo para testar o editor. Os três primeiros vêm do orçamento real; custos e os demais itens são ilustrativos até importarmos a tabela da loja.</p>
        </div>
      </section>
      <div className="pg-corpo">
      <div className="filtros">
        <div className="busca">
          <Icon n="search" size={16} />
          <input id="busca-cat" type="search" placeholder="Buscar por nome, marca, código ou formato" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="chips">
          {colecoes.map((c) => <button key={c} type="button" className={`chip ${col === c ? "on" : ""}`} onClick={() => setCol(c)}>{c}</button>)}
        </div>
      </div>
      <div className="produtos">
        {vis.map((p) => {
          const m = (p.preco - p.custo) / p.preco;
          return (
            <article key={p.id} className="produto">
              <div className="swatch" style={{ "--sw": p.cor }}><span>{p.formato}</span></div>
              <div className="produto-t">
                <span className="mono">{p.codigo}</span>
                <h3>{p.nome}</h3>
                <p>{p.marca} · {p.colecao} · {p.acabamento}{p.classe ? ` · ${p.classe}` : ""}</p>
              </div>
              <dl className="produto-d">
                <div><dt>Preço</dt><dd>{fmtMoeda(p.preco)}/{p.unid}</dd></div>
                <div><dt>Rendimento</dt><dd>{p.rendimento ? `${fmtNum(p.rendimento)} m²/cx` : "—"}</dd></div>
                <div><dt>Margem</dt><dd>{fmtPct(m)}</dd></div>
                <div><dt>Estoque</dt><dd className={p.estoque ? "" : "falta"}>{p.estoque ? `${p.estoque} ${p.unid === "m²" ? "m²" : "un"}` : "Sem estoque"}</dd></div>
              </dl>
            </article>
          );
        })}
      </div>
      </div>
    </div>
  );
}
