import React, { useEffect, useRef, useState } from "react";
import { Logo, Icon } from "./ui.jsx";
import { MENU, MODULOS, rotaModulo } from "./modulos.js";
import { carregarLista, salvarLista, novoOrcamento, proximoNumero } from "./data.js";
import Visao from "./pages/Visao.jsx";
import Inicio from "./pages/Inicio.jsx";
import Orcamentos from "./pages/Orcamentos.jsx";
import Editor from "./pages/Editor.jsx";
import Modulo from "./pages/Modulo.jsx";

const lerRota = () => (location.hash || "#inicio").slice(1) || "inicio";

function Menu({ rota, ir, novo }) {
  const [aberto, setAberto] = useState(null);
  const [mobile, setMobile] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const fora = (e) => ref.current && !ref.current.contains(e.target) && setAberto(null);
    document.addEventListener("pointerdown", fora);
    return () => document.removeEventListener("pointerdown", fora);
  }, []);
  useEffect(() => { setAberto(null); setMobile(false); }, [rota]);

  const areaAtiva = (g) => g.itens.some((i) => rotaModulo(i.id) === rota || (i.id === "orcamentos" && rota.startsWith("orcamento-")));

  return (
    <header className="nav" ref={ref}>
      <div className="nav-in">
        <a href="#inicio" className="nav-logo" aria-label="Início">
          <Logo cor="var(--ink)" fundo="var(--bg)" />
        </a>
        <nav className={`nav-areas ${mobile ? "open" : ""}`} aria-label="Áreas do sistema">
          <a href="#inicio" className={`nav-link ${rota === "inicio" ? "on" : ""}`}>Início</a>
          <a href="#visao" className={`nav-link ${rota === "visao" ? "on" : ""}`}>Visão geral</a>
          {MENU.map((g) => (
            <div key={g.area} className={`nav-grupo ${aberto === g.area ? "open" : ""}`}>
              <button
                type="button"
                className={`nav-link ${areaAtiva(g) ? "on" : ""}`}
                aria-expanded={aberto === g.area}
                onClick={() => setAberto(aberto === g.area ? null : g.area)}
              >
                {g.area}
                <span className="nav-plus"><Icon n="plus" size={9} stroke={2} /></span>
              </button>
              <div className="nav-drop" role="menu">
                {g.itens.map((i) => {
                  const r = rotaModulo(i.id);
                  const pronto = MODULOS[i.id]?.pronto;
                  return (
                    <a key={i.rotulo} href={`#${r}`} role="menuitem" className="nav-drop-item">
                      <span>{i.rotulo}</span>
                      <span className={`nav-tag ${pronto ? "ok" : ""}`}>{pronto ? "Ativo" : "Em desenvolvimento"}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="nav-acoes">
          <a className="nav-icon" href="#orcamentos" aria-label="Buscar orçamentos"><Icon n="search" size={16} /></a>
          <button type="button" className="nav-novo" onClick={novo}>
            <span className="nav-novo-ic"><Icon n="plus" size={12} stroke={2} /></span>
            Novo orçamento
          </button>
          <a href="#modulo-configuracoes" className="nav-avatar" aria-label="Markus · configurações">MK</a>
          <button type="button" className="nav-burger" aria-label="Abrir menu" aria-expanded={mobile} onClick={() => setMobile(!mobile)}>
            <Icon n={mobile ? "x" : "menu"} size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

function Rodape() {
  return (
    <footer className="foot">
      <div className="foot-in">
        <div className="foot-top">
          <div className="foot-intro">
            <p className="foot-t">Sistema de gestão Studio Renovar</p>
            <p className="foot-s">Pisos, porcelanatos, pedras e revestimentos para obras de alto padrão.</p>
            <a className="foot-btn" href="#orcamentos">Ver orçamentos <Icon n="right" size={13} /></a>
          </div>
          <div className="foot-cols">
            {MENU.slice(0, 4).map((g) => (
              <div key={g.area}>
                <p>{g.area}</p>
                {g.itens.slice(0, 4).map((i) => <a key={i.rotulo} href={`#${rotaModulo(i.id)}`}>{i.rotulo}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="foot-word" aria-hidden="true">renovar</div>
      </div>
    </footer>
  );
}

export default function App() {
  const [rota, setRota] = useState(lerRota);
  const [lista, setLista] = useState(carregarLista);
  const [aviso, setAviso] = useState("");
  const tAviso = useRef(null);

  useEffect(() => {
    const f = () => { setRota(lerRota()); window.scrollTo({ top: 0 }); };
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);

  const avisar = (m) => {
    setAviso(m);
    clearTimeout(tAviso.current);
    tAviso.current = setTimeout(() => setAviso(""), 2800);
  };
  const ir = (r) => { location.hash = r; };

  const gravar = (o) => {
    const nova = [o, ...lista.filter((x) => x.id !== o.id)];
    setLista(nova);
    return salvarLista(nova);
  };
  const remover = (id) => {
    const nova = lista.filter((x) => x.id !== id);
    setLista(nova);
    salvarLista(nova);
  };
  const novo = () => {
    const o = novoOrcamento(proximoNumero(lista));
    gravar(o);
    ir(`orcamento-${o.id}`);
  };

  let pagina;
  if (rota === "inicio") pagina = <Inicio lista={lista} novo={novo} />;
  else if (rota === "visao") pagina = <Visao lista={lista} novo={novo} />;
  else if (rota === "orcamentos") pagina = <Orcamentos lista={lista} novo={novo} />;
  else if (rota.startsWith("orcamento-")) {
    const o = lista.find((x) => `orcamento-${x.id}` === rota);
    pagina = o ? (
      <Editor key={o.id} inicial={o} lista={lista} gravar={gravar} remover={remover} avisar={avisar} ir={ir} />
    ) : (
      <section className="pagina vazio-pg">
        <p>Esse orçamento não está salvo neste navegador.</p>
        <a className="btn-pill" href="#orcamentos">Ver orçamentos</a>
      </section>
    );
  }
  else if (rota.startsWith("modulo-") && MODULOS[rota.slice(7)]) pagina = <Modulo id={rota.slice(7)} />;
  else pagina = <Inicio lista={lista} novo={novo} />;

  return (
    <div className="app">
      <Menu rota={rota} ir={ir} novo={novo} />
      <main className="main">{pagina}</main>
      <Rodape />
      <div className={`toast ${aviso ? "on" : ""}`} role="status" aria-live="polite">{aviso}</div>
    </div>
  );
}
