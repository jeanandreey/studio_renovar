import React from "react";
import { Logo, FOTOS } from "./ui.jsx";
import { totais, fmtMoeda, fmtNum, fmtData, dataValidade, parseBR } from "./data.js";

const vazio = (s) => !String(s ?? "").trim();

export default function Proposta({ o }) {
  const t = totais(o);
  const validade = dataValidade(o.data, o.validadeDias);
  const dias = parseInt(o.validadeDias, 10) || 0;
  const c = o.cliente;
  const k = o.consultor;
  const ambientes = o.ambientes
    .map((a, n) => ({ a, calc: t.ambientes[n], itens: a.itens.map((i, m) => ({ i, c: t.ambientes[n].itens[m] })).filter(({ i, c }) => !vazio(i.descricao) || c.qtd) }))
    .filter((x) => x.itens.length);
  const servicos = o.servicos.filter((s) => !vazio(s.nome) && parseBR(s.valor) > 0);
  const nomeCli = c.nome || "Cliente";

  return (
    <article className="paper">
      <header className="pp-top">
        <Logo className="pp-logo" cor="#111111" fundo="#FFFFFF" />
        <div className="pp-top-r">
          <span>Proposta de fornecimento</span>
          <b>Nº {o.numero}</b>
        </div>
      </header>

      <section className="pp-hero">
        <div className="pp-hero-t">
          {o.campanha && <span className="pp-camp">{o.campanha}</span>}
          <h1 className="pp-h1"><span>Proposta para</span> {nomeCli}</h1>
          <dl className="pp-datas">
            <div><dt>Emitida em</dt><dd>{fmtData(o.data)}</dd></div>
            <div><dt>Válida até</dt><dd>{fmtData(validade)}</dd></div>
            {!vazio(k.nome) && <div><dt>Consultor</dt><dd>{k.nome}</dd></div>}
          </dl>
        </div>
        <figure className="pp-foto"><img src={FOTOS.banho} alt="" /></figure>
      </section>

      <section className="pp-cli">
        {[
          ["Cliente", c.nome],
          ["CPF ou CNPJ", c.documento],
          ["Telefone", c.telefone],
          ["Profissional", o.profissional],
          ["Endereço da obra", c.endereco],
        ].map(([r, v]) => (
          <div key={r} className={r === "Endereço da obra" ? "wide" : ""}>
            <span className="pp-label">{r}</span>
            <span className={`pp-val ${vazio(v) ? "blank" : ""}`}>{vazio(v) ? " " : v}</span>
          </div>
        ))}
      </section>

      <section className="pp-stats">
        <div><b>{fmtNum(t.area)}<small> m²</small></b><span>Área total de revestimentos</span></div>
        <div><b>{t.caixas || "—"}</b><span>{t.caixas === 1 ? "Caixa" : "Caixas"} já com a margem de perda</span></div>
        <div><b>{ambientes.length}</b><span>{ambientes.length === 1 ? "Ambiente" : "Ambientes"} nesta proposta</span></div>
      </section>

      <section className="pp-itens">
        <table>
          <colgroup>
            <col />
            <col style={{ width: "17%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "17%" }} />
          </colgroup>
          <thead>
            <tr><th>Produto</th><th className="num">Quantidade</th><th className="num">Unitário</th><th className="num">Total</th></tr>
          </thead>
          {ambientes.map(({ a, calc, itens }, n) => (
            <tbody key={a.id}>
              <tr className="pp-amb">
                <td colSpan={3}><span className="pp-amb-n">{String(n + 1).padStart(2, "0")}</span>{a.nome || "Ambiente"}</td>
                <td className="num">{fmtMoeda(calc.subtotal)}</td>
              </tr>
              {itens.map(({ i, c: x }) => (
                <tr key={i.id} className="pp-item">
                  <td>
                    <span className="pp-desc">{i.descricao || "—"}</span>
                    <span className="pp-meta">
                      {i.classe && <span className={`pp-classe ${i.classe === "Classe A" ? "a" : ""}`}>{i.classe}</span>}
                      {i.unid === "m²" && parseBR(i.area) > 0 && (
                        <span>{fmtNum(parseBR(i.area))} m² + {fmtNum(parseBR(i.perda)).replace(",00", "")}% de perda{x.caixas ? ` · ${x.caixas} cx de ${fmtNum(parseBR(i.rendimento))} m²` : ""}</span>
                      )}
                      {x.desconto > 0 && <span>Desconto de {fmtNum(parseBR(i.descontoPct)).replace(",00", "")}%</span>}
                    </span>
                  </td>
                  <td className="num">{fmtNum(x.qtd)} <small>{i.unid}</small></td>
                  <td className="num">{fmtMoeda(parseBR(i.unitario))}</td>
                  <td className="num strong">
                    {x.desconto > 0 && <s>{fmtMoeda(x.bruto)}</s>}
                    {fmtMoeda(x.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </section>

      <section className="pp-fecho">
        <div className="pp-pag">
          {!vazio(o.pagamento) && (
            <>
              <span className="pp-label">Forma de pagamento</span>
              <p className="pp-pag-t">{o.pagamento}</p>
            </>
          )}
          {(dias > 0 || !vazio(o.observacoes)) && (
            <div className="pp-obs">
              <span className="pp-label">Observações</span>
              {dias > 0 && <p><b>Proposta válida por {dias === 1 ? "1 dia" : `${dias} dias`}, até {fmtData(validade)}.</b></p>}
              {!vazio(o.observacoes) && <p>{o.observacoes}</p>}
            </div>
          )}
        </div>
        <dl className="pp-tot">
          <div><dt>Produtos</dt><dd>{fmtMoeda(t.produtos)}</dd></div>
          {servicos.map((s) => <div key={s.id}><dt>{s.nome}</dt><dd>{fmtMoeda(parseBR(s.valor))}</dd></div>)}
          {servicos.length === 0 && <div><dt>Frete</dt><dd>A combinar</dd></div>}
          {t.descontoTotal > 0 && <div><dt>Desconto</dt><dd>− {fmtMoeda(t.descontoTotal)}</dd></div>}
          <div className="pp-total"><dt>Total da proposta</dt><dd>{fmtMoeda(t.total)}</dd></div>
        </dl>
      </section>

      <section className="pp-info">
        {o.condicoes.some((x) => !vazio(x)) && (
          <div>
            <span className="pp-label">Condições de entrega</span>
            <ol className="pp-cond">
              {o.condicoes.filter((x) => !vazio(x)).map((x, n) => <li key={n}>{x}</li>)}
            </ol>
          </div>
        )}
        <aside className="pp-cons">
          <span className="pp-label">{k.cargo || "Consultor de vendas"}</span>
          {!vazio(k.nome) && <b className="pp-cons-n">{k.nome}</b>}
          {!vazio(k.whatsapp) && <p><span>WhatsApp</span>{k.whatsapp}</p>}
          {!vazio(k.fixo) && <p><span>Fixo</span>{k.fixo}</p>}
        </aside>
      </section>

      <section className="pp-ass">
        <p>{o.declaracao}</p>
        <div className="pp-ass-l">
          <div><span /><small>Vendedor{!vazio(k.nome) ? ` · ${k.nome}` : ""}</small></div>
          <div><span /><small>Cliente · {nomeCli}</small></div>
        </div>
      </section>

      <footer className="pp-foot">
        <span className="pp-word">renovar</span>
        <span className="pp-foot-r">Pisos, porcelanatos e revestimentos<br />Studio Renovar Premium</span>
      </footer>
    </article>
  );
}
