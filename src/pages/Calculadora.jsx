import React, { useState } from "react";
import { Titulo, Icon } from "../ui.jsx";
import { CATALOGO, produtoPorId, calcItem, fmtNum, fmtMoeda, parseBR } from "../data.js";

const PERDAS = [["Reto, peças pequenas", "8"], ["Reto, grandes formatos", "10"], ["Diagonal ou espinha", "15"], ["Muitos recortes", "20"]];

export default function Calculadora() {
  const [pid, setPid] = useState("p4");
  const [area, setArea] = useState("42");
  const [perda, setPerda] = useState("10");
  const p = produtoPorId(pid);
  const c = calcItem({ unid: "m²", area, perda, rendimento: String(p.rendimento), unitario: String(p.preco), descontoPct: "", custo: "" });
  return (
    <div className="pagina">
      <section className="pg-head">
        <div>
          <p className="eyebrow">Produtos e preços · Calculadora</p>
          <Titulo t="Quanto material [a obra precisa]" />
        </div>
        <div className="bloco-aside"><p>Metragem do ambiente mais a perda do assentamento, arredondada para caixas inteiras. A mesma conta roda dentro de cada item do orçamento.</p></div>
      </section>
      <section className="calc pg-corpo">
        <div className="calc-form">
          <label className="campo" htmlFor="c-prod"><span className="campo-label">Produto</span>
            <select id="c-prod" value={pid} onChange={(e) => setPid(e.target.value)}>
              {CATALOGO.filter((x) => x.rendimento).map((x) => <option key={x.id} value={x.id}>{x.nome} {x.formato}</option>)}
            </select>
          </label>
          <label className="campo" htmlFor="c-area"><span className="campo-label">Área do ambiente (m²)</span>
            <input id="c-area" inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} />
          </label>
          <div className="campo"><span className="campo-label">Perda pelo tipo de assentamento</span>
            <div className="chips">{PERDAS.map(([r, v]) => <button key={v} type="button" className={`chip ${perda === v ? "on" : ""}`} onClick={() => setPerda(v)}>{r} · {v}%</button>)}</div>
          </div>
          <label className="campo" htmlFor="c-perda"><span className="campo-label">Perda (%)</span>
            <input id="c-perda" inputMode="decimal" value={perda} onChange={(e) => setPerda(e.target.value)} />
          </label>
        </div>
        <div className="calc-res">
          <p className="calc-conta">{fmtNum(parseBR(area))} m² + {perda}% = {fmtNum(c.necessario)} m² necessários</p>
          <div className="calc-big"><b>{c.caixas}</b><span>caixas de {fmtNum(p.rendimento)} m²</span></div>
          <dl>
            <div><dt>Metragem faturada</dt><dd>{fmtNum(c.qtd)} m²</dd></div>
            <div><dt>Peças</dt><dd>{c.caixas * p.pecasCx}</dd></div>
            <div><dt>Valor estimado</dt><dd>{fmtMoeda(c.total)}</dd></div>
          </dl>
          <a href="#orcamentos" className="btn-pill claro">Usar em um orçamento <Icon n="right" size={13} /></a>
        </div>
      </section>
    </div>
  );
}
