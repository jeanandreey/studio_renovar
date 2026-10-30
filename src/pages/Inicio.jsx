import React from "react";
import { Titulo, Icon, FOTOS } from "../ui.jsx";
import { MODULOS, CARDS, FASES } from "../modulos.js";
import { totais, statusEfetivo, fmtMoeda } from "../data.js";

function saudacao() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

export default function Inicio({ lista, novo }) {
  const abertos = lista.filter((o) => ["enviado", "elaboracao"].includes(statusEfetivo(o)));
  const valorAberto = abertos.reduce((s, o) => s + totais(o).total, 0);
  const hoje = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const orc = MODULOS.orcamentos;

  return (
    <div className="pagina">
      <section className="pg-head">
        <div>
          <p className="eyebrow">{saudacao()}, Markus · {hoje}</p>
          <Titulo t="Tudo da Renovar, [em um só lugar]" />
        </div>
        <div className="bloco-aside">
          <p>Escolha um módulo para começar. O sistema cresce por fases: o primeiro módulo já está ativo e os próximos entram conforme a loja for usando.</p>
          <a className="link-sub" href="#visao">Ver a visão geral <Icon n="upRight" size={12} /></a>
        </div>
      </section>

      <section className="modulos pg-corpo" aria-label="Módulos do sistema">
        <article className="mod-ativo">
          <img src={FOTOS.argila} alt="" />
          <div className="mod-ativo-in">
            <div className="mod-ativo-top">
              <span className="tag-ativo"><span className="pulso" />Ativo</span>
              <span className="mod-ativo-seta"><Icon n="upRight" size={18} /></span>
            </div>
            <div>
              <span className="mod-ativo-n">01 · Comercial</span>
              <h2><a href="#orcamentos" className="esticado">{orc.nome}</a></h2>
              <p>{orc.resumo} Por ambiente, com caixas calculadas pela metragem, descontos e PDF com a identidade da Renovar.</p>
              <div className="mod-ativo-stats">
                <div><b>{lista.length}</b><span>orçamentos</span></div>
                <div><b>{abertos.length}</b><span>em aberto</span></div>
                <div><b>{fmtMoeda(valorAberto).replace(/,\d+$/, "")}</b><span>em negociação</span></div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="mod-ativo-novo"
            onClick={novo}
          >
            <Icon n="plus" size={12} stroke={2} /> Novo orçamento
          </button>
        </article>

        {CARDS.map(([id, ic], n) => {
          const m = MODULOS[id];
          const f = FASES.find((x) => x.n === m.fase);
          return (
            <div key={id} className="mod-off" aria-disabled="true" title={`${m.nome}: em desenvolvimento`}>
              <div className="mod-off-top">
                <span className="mod-off-ic"><Icon n={ic} size={18} /></span>
                <span className="tag-dev">Em desenvolvimento</span>
              </div>
              <div>
                <h3>{m.nome}</h3>
                <p>{m.resumo}</p>
              </div>
              <span className="mod-off-fase">{String(n + 2).padStart(2, "0")} · Fase {f.n}</span>
            </div>
          );
        })}
      </section>
    </div>
  );
}
