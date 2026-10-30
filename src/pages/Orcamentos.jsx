import React, { useState } from "react";
import { Titulo, Icon, StatusPill } from "../ui.jsx";
import { STATUS, totais, statusEfetivo, fmtMoeda, fmtNum, fmtData, dataValidade } from "../data.js";

const ORDEM = ["elaboracao", "enviado", "aprovado", "pedido", "recusado", "expirado"];

export default function Orcamentos({ lista, novo }) {
  const [filtro, setFiltro] = useState("todos");
  const [busca, setBusca] = useState("");
  const comT = lista.map((o) => ({ o, t: totais(o), s: statusEfetivo(o) }));
  const q = busca.trim().toLowerCase();
  const visiveis = comT
    .filter((x) => filtro === "todos" || x.s === filtro)
    .filter((x) => !q || [x.o.numero, x.o.cliente.nome, x.o.profissional, ...x.o.ambientes.map((a) => a.nome)].join(" ").toLowerCase().includes(q))
    .sort((a, b) => b.o.numero.localeCompare(a.o.numero));

  return (
    <div className="pagina">
      <section className="pg-head">
        <div>
          <p className="eyebrow">Comercial · Orçamentos</p>
          <Titulo t="Propostas que [viram obra]" />
        </div>
        <div className="bloco-aside">
          <p>Cada orçamento separa os materiais por ambiente, calcula caixas pela metragem com perda e sai em PDF com a identidade da Renovar.</p>
          <button type="button" className="btn-pill" onClick={novo}><Icon n="plus" size={12} stroke={2} />Novo orçamento</button>
        </div>
      </section>

      <div className="pg-corpo">
      <section className="funil" aria-label="Filtrar por status">
        <button type="button" className={`funil-item ${filtro === "todos" ? "on" : ""}`} onClick={() => setFiltro("todos")}>
          <b>{comT.length}</b>
          <span>Todos</span>
          <small>{fmtMoeda(comT.reduce((s, x) => s + x.t.total, 0))}</small>
        </button>
        {ORDEM.map((s) => {
          const g = comT.filter((x) => x.s === s);
          return (
            <button type="button" key={s} className={`funil-item ${filtro === s ? "on" : ""}`} onClick={() => setFiltro(s)}>
              <b>{g.length}</b>
              <span>{STATUS[s].rotulo}</span>
              <small>{fmtMoeda(g.reduce((a, x) => a + x.t.total, 0))}</small>
            </button>
          );
        })}
      </section>

      <div className="busca">
        <Icon n="search" size={16} />
        <input id="busca-orc" type="search" placeholder="Buscar por cliente, número, arquiteto ou ambiente" value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      <div className="tabela-wrap">
        <table className="tabela">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Cliente</th>
              <th>Ambientes</th>
              <th className="num">Área</th>
              <th>Validade</th>
              <th>Status</th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {visiveis.map(({ o, t, s }) => (
              <tr key={o.id} onClick={() => (location.hash = `orcamento-${o.id}`)}>
                <td className="mono">
                  <a href={`#orcamento-${o.id}`}>{o.numero}</a>
                  {o.exemplo && <span className="tag-ex">exemplo</span>}
                </td>
                <td>
                  <b>{o.cliente.nome || "Sem cliente"}</b>
                  <small>{o.cliente.perfil}{o.profissional ? ` · ${o.profissional}` : ""}</small>
                </td>
                <td className="amb">{o.ambientes.map((a) => a.nome).filter(Boolean).join(", ") || "—"}</td>
                <td className="num">{fmtNum(t.area)} m²</td>
                <td>{fmtData(dataValidade(o.data, o.validadeDias))}</td>
                <td><StatusPill s={s} /></td>
                <td className="num strong">{fmtMoeda(t.total)}</td>
              </tr>
            ))}
            {visiveis.length === 0 && (
              <tr className="sem">
                <td colSpan={7}>Nenhum orçamento com esse filtro.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
