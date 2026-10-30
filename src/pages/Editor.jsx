import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Titulo, Icon, StatusPill } from "../ui.jsx";
import Proposta from "../Proposta.jsx";
import {
  UNIDADES, CLASSES, PERFIS, PAGAMENTO_RAPIDO, AMBIENTES_SUGERIDOS, CONDICOES_PADRAO, STATUS, STATUS_EDITAVEIS, MARGEM_MINIMA, CATALOGO,
  produtoPorId, itemDoProduto, novoItem, novoAmbiente, novoServico, calcItem, totais, margemItem, statusEfetivo,
  proximoNumero, uid, fmtMoeda, fmtNum, fmtPct, fmtData, parseBR,
} from "../data.js";

const emIframe = (() => {
  try { return window.self !== window.top; } catch { return true; }
})();

function Campo({ id, label, children, wide, hint, className = "" }) {
  return (
    <label className={`campo ${wide ? "wide" : ""} ${className}`} htmlFor={id}>
      <span className="campo-label">{label}</span>
      {children}
      {hint && <span className="campo-hint">{hint}</span>}
    </label>
  );
}

function Secao({ n, titulo, children, aside }) {
  return (
    <section className="secao">
      <header className="secao-head">
        <span className="secao-n">{n}</span>
        <h2>{titulo}</h2>
        {aside && <div className="secao-aside">{aside}</div>}
      </header>
      {children}
    </section>
  );
}

function Preview({ o }) {
  const box = useRef(null);
  const page = useRef(null);
  const [esc, setEsc] = useState(1);
  const [alt, setAlt] = useState(1123);
  useLayoutEffect(() => {
    const medir = () => {
      if (!box.current || !page.current) return;
      const s = Math.min(1, box.current.clientWidth / 794);
      setEsc(s);
      setAlt(page.current.offsetHeight * s);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(box.current);
    ro.observe(page.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="preview-box" ref={box}>
      <div className="preview-frame" style={{ height: alt }}>
        <div className="preview-scale" ref={page} style={{ transform: `scale(${esc})` }}>
          <Proposta o={o} />
        </div>
      </div>
    </div>
  );
}

const scripts = {};
function carregarScript(src) {
  scripts[src] ||= new Promise((ok, erro) => {
    const el = document.createElement("script");
    el.src = src;
    el.onload = ok;
    el.onerror = () => { delete scripts[src]; erro(new Error(src)); };
    document.head.appendChild(el);
  });
  return scripts[src];
}

// Copia a folha (que só aparece na impressão) para fora da tela, fotografa e monta páginas A4.
async function propostaEmPdf() {
  const origem = document.querySelector(".print-only .paper");
  const palco = document.createElement("div");
  palco.style.cssText = "position:fixed;left:-10000px;top:0;width:794px;background:#fff;";
  palco.className = "captura";
  palco.appendChild(origem.cloneNode(true));
  document.body.appendChild(palco);
  try {
    if (document.fonts?.ready) await document.fonts.ready;
    const canvas = await window.html2canvas(palco.firstChild, { scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false });
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pxPorPagina = Math.floor(canvas.width * (297 / 210));
    for (let y = 0, n = 0; y < canvas.height - 4; y += pxPorPagina, n++) {
      const fatia = document.createElement("canvas");
      fatia.width = canvas.width;
      fatia.height = Math.min(pxPorPagina, canvas.height - y);
      fatia.getContext("2d").drawImage(canvas, 0, y, canvas.width, fatia.height, 0, 0, canvas.width, fatia.height);
      if (n > 0) doc.addPage();
      doc.addImage(fatia.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, (fatia.height * 210) / canvas.width);
    }
    return doc.output("blob");
  } finally {
    palco.remove();
  }
}

function alternativas(p) {
  return CATALOGO.filter((x) => x.id !== p.id && x.unid === p.unid && x.estoque > 0 && Math.abs(x.preco - p.preco) / p.preco < 0.45).slice(0, 2);
}

function Item({ i, n, total, onChange, onMove, onRemove, ultimo }) {
  const c = calcItem(i);
  const m = margemItem(c);
  const p = i.produtoId ? produtoPorId(i.produtoId) : null;
  const semEstoque = p && p.estoque <= 0;
  const id = (k) => `i-${k}-${i.id}`;
  const escolher = (pid) => {
    if (!pid) return onChange({ produtoId: "" });
    const prod = produtoPorId(pid);
    onChange(itemDoProduto(prod, { id: i.id, area: i.area, perda: i.perda, qtd: i.qtd, descontoPct: i.descontoPct }));
  };

  return (
    <li className="item">
      <div className="item-head">
        <span className="item-n">{String(n + 1).padStart(2, "0")}</span>
        <select id={id("prod")} aria-label="Produto do catálogo" className="item-prod" value={i.produtoId} onChange={(e) => escolher(e.target.value)}>
          <option value="">Item livre (fora do catálogo)</option>
          {CATALOGO.map((x) => (
            <option key={x.id} value={x.id}>{x.nome} {x.formato} · {fmtMoeda(x.preco)}/{x.unid}</option>
          ))}
        </select>
        <div className="item-acoes">
          <button type="button" aria-label="Subir item" onClick={() => onMove(-1)} disabled={n === 0}><Icon n="right" size={12} className="rot-up" /></button>
          <button type="button" aria-label="Descer item" onClick={() => onMove(1)} disabled={ultimo}><Icon n="right" size={12} className="rot-down" /></button>
          <button type="button" aria-label="Remover item" className="del" onClick={onRemove}><Icon n="x" size={12} /></button>
        </div>
      </div>

      <div className="item-grid">
        <Campo id={id("desc")} label="Descrição na proposta" wide>
          <input id={id("desc")} placeholder="Produto · formato · cor" value={i.descricao} onChange={(e) => onChange({ descricao: e.target.value })} />
        </Campo>
        <Campo id={id("unid")} label="Vendido em">
          <select id={id("unid")} value={i.unid} onChange={(e) => onChange({ unid: e.target.value })}>
            {UNIDADES.map((u) => <option key={u}>{u}</option>)}
          </select>
        </Campo>
        {i.unid === "m²" ? (
          <>
            <Campo id={id("area")} label="Área (m²)">
              <input id={id("area")} inputMode="decimal" placeholder="0,00" value={i.area} onChange={(e) => onChange({ area: e.target.value })} />
            </Campo>
            <Campo id={id("perda")} label="Perda (%)">
              <input id={id("perda")} inputMode="decimal" placeholder="10" value={i.perda} onChange={(e) => onChange({ perda: e.target.value })} />
            </Campo>
            <Campo id={id("rend")} label="m² por caixa">
              <input id={id("rend")} inputMode="decimal" placeholder="opcional" value={i.rendimento} onChange={(e) => onChange({ rendimento: e.target.value })} />
            </Campo>
          </>
        ) : (
          <Campo id={id("qtd")} label="Quantidade">
            <input id={id("qtd")} inputMode="decimal" placeholder="0" value={i.qtd} onChange={(e) => onChange({ qtd: e.target.value })} />
          </Campo>
        )}
        <Campo id={id("unit")} label={`Preço (R$/${i.unid})`}>
          <input id={id("unit")} inputMode="decimal" placeholder="0,00" value={i.unitario} onChange={(e) => onChange({ unitario: e.target.value })} />
        </Campo>
        <Campo id={id("desc-pct")} label="Desconto (%)">
          <input id={id("desc-pct")} inputMode="decimal" placeholder="0" value={i.descontoPct} onChange={(e) => onChange({ descontoPct: e.target.value })} />
        </Campo>
        <Campo id={id("classe")} label="Classe">
          <select id={id("classe")} value={i.classe} onChange={(e) => onChange({ classe: e.target.value })}>
            {CLASSES.map((x) => <option key={x} value={x}>{x || "Sem classe"}</option>)}
          </select>
        </Campo>
        <Campo id={id("custo")} label="Custo (interno)" hint="Não aparece na proposta">
          <input id={id("custo")} inputMode="decimal" placeholder="0,00" value={i.custo} onChange={(e) => onChange({ custo: e.target.value })} />
        </Campo>
      </div>

      <div className="item-calc">
        {i.unid === "m²" && parseBR(i.area) > 0 ? (
          <span>
            {fmtNum(parseBR(i.area))} m² + {fmtNum(parseBR(i.perda)).replace(",00", "")}% = {fmtNum(c.necessario)} m²
            {c.caixas > 0 && <> <Icon n="right" size={11} /> <b>{c.caixas} cx</b> · {fmtNum(c.qtd)} m²</>}
          </span>
        ) : (
          <span>{c.qtd ? `${fmtNum(c.qtd)} ${i.unid}` : "Informe a quantidade"}</span>
        )}
        <span className="item-total">
          {c.desconto > 0 && <s>{fmtMoeda(c.bruto)}</s>}
          {fmtMoeda(total)}
        </span>
      </div>

      {(m !== null || semEstoque) && (
        <div className="item-alertas">
          {m !== null && (
            <span className={`chip-m ${m < MARGEM_MINIMA ? "ruim" : "ok"}`}>
              {m < MARGEM_MINIMA && <Icon n="alert" size={12} />}
              Margem {fmtPct(m)}{m < MARGEM_MINIMA ? ` · abaixo do mínimo de ${fmtPct(MARGEM_MINIMA)}` : ""}
            </span>
          )}
          {semEstoque && (
            <span className="chip-m alerta">
              <Icon n="box" size={12} /> Sem estoque.
              {alternativas(p).length > 0 && (
                <> Alternativas:{" "}
                  {alternativas(p).map((a) => (
                    <button key={a.id} type="button" className="link-mini" onClick={() => escolher(a.id)}>{a.nome}</button>
                  ))}
                </>
              )}
            </span>
          )}
        </div>
      )}
    </li>
  );
}

export default function Editor({ inicial, lista, gravar, remover, avisar, ir }) {
  const [o, setO] = useState(inicial);
  const [aba, setAba] = useState("editar");
  const [salvo, setSalvo] = useState(true);
  const [confirmar, setConfirmar] = useState(false);
  const primeira = useRef(true);
  const t = useMemo(() => totais(o), [o]);
  const sEf = statusEfetivo(o);

  // Salva sozinho, meio segundo depois da última alteração.
  useEffect(() => {
    if (primeira.current) { primeira.current = false; return; }
    setSalvo(false);
    const h = setTimeout(() => { gravar({ ...o, atualizadoEm: new Date().toISOString() }); setSalvo(true); }, 500);
    return () => clearTimeout(h);
  }, [o]);

  const set = (p) => setO((x) => ({ ...x, ...p }));
  const setCli = (p) => setO((x) => ({ ...x, cliente: { ...x.cliente, ...p } }));
  const setCon = (p) => setO((x) => ({ ...x, consultor: { ...x.consultor, ...p } }));
  const setAmb = (aid, f) => setO((x) => ({ ...x, ambientes: x.ambientes.map((a) => (a.id === aid ? f(a) : a)) }));
  const setItem = (aid, iid, p) => setAmb(aid, (a) => ({ ...a, itens: a.itens.map((i) => (i.id === iid ? { ...i, ...p } : i)) }));
  const moveItem = (aid, iid, d) => setAmb(aid, (a) => {
    const itens = [...a.itens];
    const k = itens.findIndex((i) => i.id === iid);
    if (k + d < 0 || k + d >= itens.length) return a;
    [itens[k], itens[k + d]] = [itens[k + d], itens[k]];
    return { ...a, itens };
  });
  const delItem = (aid, iid) => setAmb(aid, (a) => ({ ...a, itens: a.itens.filter((i) => i.id !== iid) }));
  const delAmb = (aid) => setO((x) => ({ ...x, ambientes: x.ambientes.filter((a) => a.id !== aid) }));
  const setServ = (sid, p) => setO((x) => ({ ...x, servicos: x.servicos.map((s) => (s.id === sid ? { ...s, ...p } : s)) }));

  const addPag = (p) => {
    const a = o.pagamento.trim();
    if (a.toLowerCase().includes(p.toLowerCase())) return;
    set({ pagamento: a ? `${a.replace(/[.]$/, "")} · ${p}` : p });
  };

  const duplicar = () => {
    const copia = {
      ...o, id: uid(), numero: proximoNumero(lista), status: "elaboracao", exemplo: false, data: new Date().toISOString().slice(0, 10),
      ambientes: o.ambientes.map((a) => ({ ...a, id: uid(), itens: a.itens.map((i) => ({ ...i, id: uid() })) })),
      servicos: o.servicos.map((s) => ({ ...s, id: uid() })),
    };
    gravar(copia);
    avisar(`Cópia criada como Nº ${copia.numero}.`);
    ir(`orcamento-${copia.id}`);
  };
  const converter = () => {
    set({ status: "pedido" });
    avisar("Orçamento convertido em pedido. O módulo de Pedidos entra na Fase 02.");
  };
  const [gerando, setGerando] = useState(false);
  const pdf = async () => {
    if (!emIframe) return window.print();
    // Dentro do claude.ai a impressão é bloqueada: gera o PDF na página e oferece o arquivo.
    setGerando(true);
    try {
      const downloads = window.claude ? await window.claude.use("downloads") : null;
      if (!downloads) throw { code: "unavailable" };
      await carregarScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
      await carregarScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      const blob = await propostaEmPdf();
      await downloads.save({ filename: `Proposta Renovar ${o.numero} - ${o.cliente.nome || "cliente"}.pdf`, data: blob });
      avisar("PDF salvo.");
    } catch (e) {
      if (e?.code === "declined") avisar("Download cancelado.");
      else if (e?.code === "rate_limited") avisar("Já existe um download aguardando confirmação.");
      else avisar("Não foi possível gerar o PDF aqui. Abra o sistema em um navegador para imprimir.");
    } finally {
      setGerando(false);
    }
  };
  const excluir = () => {
    remover(o.id);
    avisar(`Orçamento Nº ${o.numero} excluído.`);
    ir("orcamentos");
  };

  let contItens = 0;

  return (
    <div className="pagina editor-pg">
      <section className="ed-head">
        <a href="#orcamentos" className="voltar"><Icon n="left" size={14} />Orçamentos</a>
        <div className="ed-titulo">
          <div>
            <p className="eyebrow">Nº {o.numero} · {fmtData(o.data)} {o.exemplo && <span className="tag-ex">exemplo</span>}</p>
            <Titulo t={`[Proposta para] ${o.cliente.nome || "novo cliente"}`} />
          </div>
          <div className="ed-acoes">
            <span className={`salvo ${salvo ? "ok" : ""}`}>{salvo ? "Salvo neste navegador" : "Salvando…"}</span>
            <button type="button" className="btn-ghost" onClick={duplicar}><Icon n="copy" size={14} />Duplicar</button>
            <button type="button" className="btn-pill" onClick={pdf} disabled={gerando}><Icon n="file" size={14} />{gerando ? "Gerando PDF…" : "Gerar PDF"}</button>
          </div>
        </div>
        <div className="ed-status">
          <div className="segmentos" role="radiogroup" aria-label="Status do orçamento">
            {STATUS_EDITAVEIS.map((s) => (
              <button key={s} type="button" role="radio" aria-checked={o.status === s} className={o.status === s ? "on" : ""} onClick={() => set({ status: s })}>
                {STATUS[s].rotulo}
              </button>
            ))}
          </div>
          {sEf === "expirado" && <StatusPill s="expirado" />}
          {o.status === "pedido" && <StatusPill s="pedido" />}
          {o.status === "aprovado" && (
            <button type="button" className="btn-pill escuro" onClick={converter}>Converter em pedido <Icon n="right" size={13} /></button>
          )}
        </div>
      </section>

      <nav className="abas" aria-label="Alternar entre editor e proposta">
        <button type="button" className={aba === "editar" ? "on" : ""} onClick={() => setAba("editar")}>Editar</button>
        <button type="button" className={aba === "ver" ? "on" : ""} onClick={() => setAba("ver")}>Proposta · {fmtMoeda(t.total)}</button>
      </nav>

      <div className="workspace">
        <div className={`editor ${aba === "editar" ? "show" : ""}`}>
          <Secao n="01" titulo="Cliente e obra">
            <div className="grid">
              <Campo id="f-nome" label="Cliente" wide>
                <input id="f-nome" value={o.cliente.nome} onChange={(e) => setCli({ nome: e.target.value })} />
              </Campo>
              <Campo id="f-perfil" label="Perfil">
                <select id="f-perfil" value={o.cliente.perfil} onChange={(e) => setCli({ perfil: e.target.value })}>
                  {PERFIS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </Campo>
              <Campo id="f-doc" label="CPF ou CNPJ">
                <input id="f-doc" inputMode="numeric" value={o.cliente.documento} onChange={(e) => setCli({ documento: e.target.value })} />
              </Campo>
              <Campo id="f-fone" label="Telefone">
                <input id="f-fone" inputMode="tel" value={o.cliente.telefone} onChange={(e) => setCli({ telefone: e.target.value })} />
              </Campo>
              <Campo id="f-prof" label="Profissional (arquiteto, designer)">
                <input id="f-prof" value={o.profissional} onChange={(e) => set({ profissional: e.target.value })} />
              </Campo>
              <Campo id="f-end" label="Endereço da obra" wide>
                <input id="f-end" value={o.cliente.endereco} onChange={(e) => setCli({ endereco: e.target.value })} />
              </Campo>
            </div>
          </Secao>

          <Secao n="02" titulo="Proposta">
            <div className="grid g3">
              <Campo id="f-num" label="Número">
                <input id="f-num" value={o.numero} onChange={(e) => set({ numero: e.target.value })} />
              </Campo>
              <Campo id="f-data" label="Data">
                <input id="f-data" type="date" value={o.data} onChange={(e) => set({ data: e.target.value })} />
              </Campo>
              <Campo id="f-val" label="Validade (dias)">
                <input id="f-val" inputMode="numeric" value={o.validadeDias} onChange={(e) => set({ validadeDias: e.target.value.replace(/\D/g, "") })} />
              </Campo>
              <Campo id="f-camp" label="Campanha ou título (opcional)" wide>
                <input id="f-camp" placeholder="Ex.: Liquida Estoque" value={o.campanha} onChange={(e) => set({ campanha: e.target.value })} />
              </Campo>
            </div>
          </Secao>

          <Secao
            n="03"
            titulo="Ambientes e produtos"
            aside={<span className="secao-meta">{fmtNum(t.area)} m² · {fmtMoeda(t.produtos)}</span>}
          >
            {o.ambientes.map((a, k) => (
              <div key={a.id} className="ambiente">
                <div className="amb-head">
                  <input
                    id={`amb-${a.id}`}
                    className="amb-nome"
                    aria-label="Nome do ambiente"
                    list="amb-sugestoes"
                    placeholder="Nome do ambiente"
                    value={a.nome}
                    onChange={(e) => setAmb(a.id, (x) => ({ ...x, nome: e.target.value }))}
                  />
                  <span className="amb-sub">{fmtMoeda(t.ambientes[k].subtotal)}</span>
                  <button type="button" className="icon-btn" aria-label={`Remover ambiente ${a.nome}`} onClick={() => delAmb(a.id)}><Icon n="trash" size={14} /></button>
                </div>
                <ol className="itens">
                  {a.itens.map((i, n) => {
                    contItens++;
                    return (
                      <Item
                        key={i.id} i={i} n={n} total={t.ambientes[k].itens[n].total} ultimo={n === a.itens.length - 1}
                        onChange={(p) => setItem(a.id, i.id, p)}
                        onMove={(d) => moveItem(a.id, i.id, d)}
                        onRemove={() => delItem(a.id, i.id)}
                      />
                    );
                  })}
                </ol>
                <button type="button" className="btn-add" onClick={() => setAmb(a.id, (x) => ({ ...x, itens: [...x.itens, novoItem()] }))}>
                  <Icon n="plus" size={12} stroke={2} /> Produto em {a.nome || "este ambiente"}
                </button>
              </div>
            ))}
            <datalist id="amb-sugestoes">{AMBIENTES_SUGERIDOS.map((x) => <option key={x} value={x} />)}</datalist>
            <button type="button" className="btn-add forte" onClick={() => set({ ambientes: [...o.ambientes, novoAmbiente("")] })}>
              <Icon n="plus" size={12} stroke={2} /> Novo ambiente
            </button>
          </Secao>

          <Secao n="04" titulo="Serviços e descontos">
            <ul className="servicos">
              {o.servicos.map((s) => (
                <li key={s.id}>
                  <input id={`sv-n-${s.id}`} aria-label="Serviço" value={s.nome} placeholder="Serviço" onChange={(e) => setServ(s.id, { nome: e.target.value })} />
                  <input id={`sv-v-${s.id}`} aria-label={`Valor de ${s.nome}`} inputMode="decimal" placeholder="R$ 0,00" value={s.valor} onChange={(e) => setServ(s.id, { valor: e.target.value })} />
                  <button type="button" className="icon-btn" aria-label={`Remover ${s.nome}`} onClick={() => set({ servicos: o.servicos.filter((x) => x.id !== s.id) })}><Icon n="x" size={13} /></button>
                </li>
              ))}
            </ul>
            <div className="chips">
              {["Frete", "Instalação", "Corte e acabamento", "Outro serviço"].map((x) => (
                <button key={x} type="button" className="chip" onClick={() => set({ servicos: [...o.servicos, novoServico(x === "Outro serviço" ? "" : x)] })}>+ {x}</button>
              ))}
            </div>
            <div className="grid">
              <Campo id="f-desc" label="Desconto no total (R$)" hint="Além dos descontos por item">
                <input id="f-desc" inputMode="decimal" placeholder="0,00" value={o.descontoTotal} onChange={(e) => set({ descontoTotal: e.target.value })} />
              </Campo>
            </div>
            <dl className="resumo">
              <div><dt>Produtos</dt><dd>{fmtMoeda(t.produtos)}</dd></div>
              {t.descontoItens > 0 && <div className="sub"><dt>Descontos nos itens (já aplicados)</dt><dd>− {fmtMoeda(t.descontoItens)}</dd></div>}
              <div><dt>Serviços</dt><dd>{fmtMoeda(t.servicos)}</dd></div>
              {t.descontoTotal > 0 && <div><dt>Desconto no total</dt><dd>− {fmtMoeda(t.descontoTotal)}</dd></div>}
              <div className="tot"><dt>Total da proposta</dt><dd>{fmtMoeda(t.total)}</dd></div>
              {t.margem !== null && (
                <div className={`margem ${t.margem < MARGEM_MINIMA ? "ruim" : ""}`}>
                  <dt>Margem bruta estimada (interno)</dt>
                  <dd>{fmtPct(t.margem)}</dd>
                </div>
              )}
            </dl>
            {t.margem !== null && t.margem < MARGEM_MINIMA && (
              <p className="aviso-m"><Icon n="alert" size={14} />Com esses descontos o orçamento fica abaixo da margem mínima de {fmtPct(MARGEM_MINIMA)}.</p>
            )}
          </Secao>

          <Secao n="05" titulo="Pagamento e condições">
            <Campo id="f-pag" label="Forma de pagamento" wide>
              <textarea id="f-pag" rows={2} value={o.pagamento} onChange={(e) => set({ pagamento: e.target.value })} />
            </Campo>
            <div className="chips">
              {PAGAMENTO_RAPIDO.map((p) => <button key={p} type="button" className="chip" onClick={() => addPag(p)}>+ {p}</button>)}
            </div>
            <Campo id="f-obs" label="Observações" wide hint="A validade entra sozinha na proposta">
              <textarea id="f-obs" rows={2} value={o.observacoes} onChange={(e) => set({ observacoes: e.target.value })} />
            </Campo>
            <Campo id="f-cond" label="Condições de entrega (uma por linha)" wide>
              <textarea id="f-cond" rows={6} value={o.condicoes.join("\n")} onChange={(e) => set({ condicoes: e.target.value.split("\n") })} />
            </Campo>
            <button type="button" className="link-mini" onClick={() => set({ condicoes: [...CONDICOES_PADRAO] })}>Restaurar condições padrão</button>
          </Secao>

          <Secao n="06" titulo="Consultor e assinaturas">
            <div className="grid">
              <Campo id="f-cn" label="Consultor">
                <input id="f-cn" value={o.consultor.nome} onChange={(e) => setCon({ nome: e.target.value })} />
              </Campo>
              <Campo id="f-cc" label="Cargo">
                <input id="f-cc" value={o.consultor.cargo} onChange={(e) => setCon({ cargo: e.target.value })} />
              </Campo>
              <Campo id="f-cw" label="WhatsApp">
                <input id="f-cw" inputMode="tel" value={o.consultor.whatsapp} onChange={(e) => setCon({ whatsapp: e.target.value })} />
              </Campo>
              <Campo id="f-cf" label="Telefone fixo">
                <input id="f-cf" inputMode="tel" value={o.consultor.fixo} onChange={(e) => setCon({ fixo: e.target.value })} />
              </Campo>
              <Campo id="f-decl" label="Declaração do cliente" wide>
                <textarea id="f-decl" rows={2} value={o.declaracao} onChange={(e) => set({ declaracao: e.target.value })} />
              </Campo>
            </div>
          </Secao>

          <div className="zona-perigo">
            {confirmar ? (
              <>
                <span>Excluir o orçamento Nº {o.numero}? Isso não tem volta.</span>
                <button type="button" className="btn-ghost perigo" onClick={excluir}>Excluir</button>
                <button type="button" className="btn-ghost" onClick={() => setConfirmar(false)}>Cancelar</button>
              </>
            ) : (
              <button type="button" className="link-mini perigo" onClick={() => setConfirmar(true)}><Icon n="trash" size={13} /> Excluir orçamento</button>
            )}
          </div>
        </div>

        <div className={`visual ${aba === "ver" ? "show" : ""}`}>
          <div className="visual-head">
            <span>Como o cliente vai ver</span>
            <span>A4 · {contItens} {contItens === 1 ? "item" : "itens"}</span>
          </div>
          <Preview o={o} />
        </div>
      </div>

      <div className="print-only"><Proposta o={o} /></div>
    </div>
  );
}
