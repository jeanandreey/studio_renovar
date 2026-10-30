import React, { useState } from "react";
import { Titulo, Icon, StatusPill, FOTOS, Seta } from "../ui.jsx";
import { FASES, REGRAS } from "../modulos.js";
import { totais, statusEfetivo, fmtMoeda, fmtMoedaCurta, fmtNum, fmtPct, fmtData, dataValidade } from "../data.js";

function saudacao() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

export default function Visao({ lista, novo }) {
  const [regra, setRegra] = useState(0);
  const comT = lista.map((o) => ({ o, t: totais(o), s: statusEfetivo(o) }));
  const abertos = comT.filter((x) => x.s === "enviado" || x.s === "elaboracao");
  const fechados = comT.filter((x) => x.s === "aprovado" || x.s === "pedido");
  const decididos = comT.filter((x) => ["aprovado", "pedido", "recusado", "expirado"].includes(x.s));
  const conversao = decididos.length ? fechados.length / decididos.length : 0;
  const ticket = fechados.length ? fechados.reduce((s, x) => s + x.t.total, 0) / fechados.length : 0;
  const area = comT.reduce((s, x) => s + x.t.area, 0);
  const vencendo = abertos
    .filter((x) => x.s === "enviado")
    .sort((a, b) => dataValidade(a.o.data, a.o.validadeDias).localeCompare(dataValidade(b.o.data, b.o.validadeDias)))[0];
  const recentes = [...comT].sort((a, b) => b.o.data.localeCompare(a.o.data)).slice(0, 5);
  const temExemplo = lista.some((o) => o.exemplo);

  return (
    <div className="pagina">
      <section className="hero">
        <div className="hero-txt">
          <p className="eyebrow">{saudacao()}, Markus</p>
          <div className="hero-linha">
            <Titulo t="[Revestir] obras com precisão, [vender com] elegância" />
            <Seta n="down" href="#numeros" label="Ver os números do mês" />
          </div>
        </div>
        {vencendo ? (
          <a className="destaque" href={`#orcamento-${vencendo.o.id}`}>
            <span className="destaque-tag"><span className="dot" />Retorno de hoje</span>
            <p>
              A proposta Nº {vencendo.o.numero} para {vencendo.o.cliente.nome || "cliente"} vence em {fmtData(dataValidade(vencendo.o.data, vencendo.o.validadeDias))}.
              Vale um contato antes disso.
            </p>
            <span className="destaque-val">{fmtMoeda(vencendo.t.total)} <Icon n="upRight" size={14} /></span>
          </a>
        ) : (
          <div className="destaque">
            <span className="destaque-tag"><span className="dot" />Retornos</span>
            <p>Nenhuma proposta enviada aguardando resposta.</p>
          </div>
        )}
      </section>

      <section className="vitrine">
        <figure className="foto-g">
          <img src={FOTOS.banho} alt="Banheiro com porcelanato cinza, banheira e parede em relevo geométrico" />
          <figcaption className="foto-tag"><Icon n="home" size={13} />Showroom Renovar</figcaption>
        </figure>
        <article className="foto-card">
          <img src={FOTOS.argila} alt="Lavabo revestido em porcelanato terracota com espelhos redondos" />
          <h3>Coleção Argilas · Mater</h3>
          <p>Porcelanato terracota 60×120 em acabamento natural. Destaque da semana para banheiros e lavabos de alto padrão.</p>
          <a href="#orcamentos" className="link-sub">Orçar esta coleção <Icon n="upRight" size={12} /></a>
        </article>
      </section>

      <section className="bloco" id="numeros">
        <div className="bloco-head">
          <Titulo as="h2" t="Seu mês [em números]" />
          <div className="bloco-aside">
            <p>Calculado a partir dos orçamentos salvos neste navegador. {temExemplo ? "Os orçamentos marcados como exemplo entram na conta até você excluí-los." : ""}</p>
            <a className="btn-pill" href="#orcamentos">Ver orçamentos</a>
          </div>
        </div>
        <div className="stats">
          <div className="stat"><b>{fmtMoedaCurta(abertos.reduce((s, x) => s + x.t.total, 0))}</b><span>Em propostas abertas, em {abertos.length} {abertos.length === 1 ? "orçamento" : "orçamentos"}</span></div>
          <div className="stat"><b>{fmtPct(conversao)}</b><span>Taxa de conversão dos orçamentos já decididos</span></div>
          <div className="stat"><b>{fmtMoedaCurta(ticket)}</b><span>Ticket médio dos orçamentos aprovados</span></div>
          <div className="stat"><b>{fmtNum(area).replace(/,\d+$/, "")}<small> m²</small></b><span>Área total orçada em revestimentos</span></div>
        </div>
      </section>

      <section className="bloco">
        <div className="bloco-head">
          <Titulo as="h2" t="Orçamentos [recentes]" />
          <div className="bloco-aside">
            <p>As últimas propostas, com o status de cada uma. Toque para abrir o editor.</p>
            <button type="button" className="btn-pill" onClick={novo}>Novo orçamento</button>
          </div>
        </div>
        <ul className="linhas">
          {recentes.map(({ o, t, s }) => (
            <li key={o.id}>
              <a href={`#orcamento-${o.id}`} className="linha">
                <span className="linha-num">{o.numero}</span>
                <span className="linha-cli">
                  <b>{o.cliente.nome || "Sem cliente"}</b>
                  <small>{o.cliente.perfil} · {o.ambientes.map((a) => a.nome).filter(Boolean).join(", ") || "sem ambientes"}</small>
                </span>
                <span className="linha-area">{fmtNum(t.area)} m²</span>
                <StatusPill s={s} />
                <span className="linha-total">{fmtMoeda(t.total)}</span>
                <Icon n="upRight" size={15} className="linha-ic" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="bloco">
        <div className="bloco-head">
          <Titulo as="h2" t="O sistema, [fase por fase]" />
          <div className="bloco-aside">
            <p>Começamos pela fundação comercial e o sistema cresce conforme a loja precisar. Cada fase entrega um conjunto de módulos prontos para usar.</p>
          </div>
        </div>
        <div className="fases" tabIndex={0} aria-label="Fases do sistema">
          {FASES.map((f) => (
            <article key={f.n} className="fase">
              <img src={FOTOS[f.img]} alt="" />
              <div className="fase-t">
                <span className="fase-n">{f.n}</span>
                <div>
                  <h3>{f.nome}</h3>
                  <p>{f.texto}</p>
                  <span className={`fase-estado ${f.estado === "Em construção" ? "on" : ""}`}>{f.estado}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bloco faq">
        <div className="faq-l">
          <Titulo as="h2" t="Regras de uma loja [de revestimentos]" />
          <p>O que o sistema faz sozinho para evitar erro de venda, perda de material e mistura de lotes.</p>
        </div>
        <ul className="faq-lista">
          {REGRAS.map(([q, a], n) => (
            <li key={q} className={regra === n ? "open" : ""}>
              <button type="button" aria-expanded={regra === n} onClick={() => setRegra(regra === n ? -1 : n)}>
                <span>{q}</span>
                <span className="faq-ic"><Icon n={regra === n ? "x" : "plus"} size={12} stroke={2} /></span>
              </button>
              {regra === n && <p>{a}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
