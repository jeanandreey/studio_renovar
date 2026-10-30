// Modelo, cálculos e dados de exemplo do sistema Studio Renovar

export const MARGEM_MINIMA = 0.25; // 25%: abaixo disso o editor alerta (nunca aparece na proposta)

export const UNIDADES = ["m²", "cx", "pç", "un", "m"];
export const CLASSES = ["", "Classe A", "Comercial", "Classe B", "Classe C", "Standard"];
export const PERFIS = ["Consumidor final", "Arquiteto", "Designer de interiores", "Construtora", "Engenheiro", "Empreiteiro", "Lojista"];
export const PAGAMENTO_RAPIDO = ["PIX", "Dinheiro", "Cartão de crédito", "Cartão de débito", "Boleto", "Entrada + parcelas", "A combinar"];
export const AMBIENTES_SUGERIDOS = ["Sala", "Cozinha", "Banheiro social", "Suíte", "Área gourmet", "Fachada", "Área externa", "Lavabo", "Casa toda"];

export const STATUS = {
  elaboracao: { rotulo: "Em elaboração", tom: "neutro" },
  enviado: { rotulo: "Enviado", tom: "info" },
  aprovado: { rotulo: "Aprovado", tom: "ok" },
  recusado: { rotulo: "Recusado", tom: "ruim" },
  expirado: { rotulo: "Expirado", tom: "alerta" },
  pedido: { rotulo: "Virou pedido", tom: "escuro" },
};
export const STATUS_EDITAVEIS = ["elaboracao", "enviado", "aprovado", "recusado"];

export const CONDICOES_PADRAO = [
  "Na entrega não subimos escadas, e a distância máxima é de 20 m no térreo.",
  "Não realizamos entregas em dias de forte chuva ou em condições difíceis.",
  "As mercadorias entregues podem apresentar variações de tom em relação à amostra, o que não constitui defeito (a amostra é apenas referencial).",
  "Produtos em classe comercial (C, B ou Standard) não possuem garantia nem assistência, e podem apresentar variações conforme a classe comprada.",
];
export const DECLARACAO_PADRAO = "Declaro que concordo com o pedido acima e suas condições, me comprometendo a pagá-lo.";

// Catálogo de exemplo. Os três primeiros vêm do orçamento real; custos e demais produtos são ilustrativos.
export const CATALOGO = [
  { id: "p1", codigo: "PR-8888-A", nome: "Piso cerâmico Premium", marca: "Linha Premium", colecao: "Essencial", formato: "88×88 cm", acabamento: "Acetinado", classe: "Classe A", unid: "m²", preco: 49.9, custo: 34.5, rendimento: 2.32, pecasCx: 3, estoque: 412, cor: "#D9D4CB" },
  { id: "p2", codigo: "RV-3D-MNT", nome: "Revestimento 3D Mint", marca: "Linha 3D", colecao: "Relevos", formato: "30×60 cm", acabamento: "Fosco", classe: "Classe A", unid: "m²", preco: 69.9, custo: 46.0, rendimento: 0.57, pecasCx: 3, estoque: 38, cor: "#BFD6C9" },
  { id: "p3", codigo: "RV-3D-SAL", nome: "Revestimento 3D Salmão", marca: "Linha 3D", colecao: "Relevos", formato: "30×60 cm", acabamento: "Fosco", classe: "Comercial", unid: "m²", preco: 49.9, custo: 39.9, rendimento: 0.57, pecasCx: 3, estoque: 21, cor: "#E6B8A2" },
  { id: "p4", codigo: "PO-120-CAL", nome: "Porcelanato Calacatta", marca: "Lastras", colecao: "Mármores", formato: "120×120 cm", acabamento: "Polido", classe: "Classe A", unid: "m²", preco: 189.9, custo: 121.0, rendimento: 2.88, pecasCx: 2, estoque: 96, cor: "#EEEBE6" },
  { id: "p5", codigo: "PO-ARG-TER", nome: "Porcelanato Argilas Terracota", marca: "Mater", colecao: "Argilas", formato: "60×120 cm", acabamento: "Natural", classe: "Classe A", unid: "m²", preco: 129.9, custo: 84.0, rendimento: 1.44, pecasCx: 2, estoque: 64, cor: "#B9765A" },
  { id: "p6", codigo: "PO-VES-ARE", nome: "Porcelanato Vestígios Areia", marca: "Mater", colecao: "Vestígios", formato: "90×90 cm", acabamento: "Acetinado", classe: "Classe A", unid: "m²", preco: 149.9, custo: 98.0, rendimento: 1.62, pecasCx: 2, estoque: 0, cor: "#D8CDBB" },
  { id: "p7", codigo: "RV-AUT-ROS", nome: "Revestimento Autoria Rosé", marca: "Mutual", colecao: "Autoria", formato: "7,5×30 cm", acabamento: "Brilho", classe: "Classe A", unid: "m²", preco: 159.9, custo: 101.0, rendimento: 0.9, pecasCx: 40, estoque: 27, cor: "#9E4F48" },
  { id: "p8", codigo: "AC-ARG-CZ", nome: "Argamassa ACIII cinza 20 kg", marca: "Quartzolit", colecao: "Assentamento", formato: "Saco 20 kg", acabamento: "—", classe: "", unid: "un", preco: 42.9, custo: 29.0, rendimento: 0, pecasCx: 0, estoque: 180, cor: "#B5B3AE" },
  { id: "p9", codigo: "RJ-CZ-1KG", nome: "Rejunte flexível cinza 1 kg", marca: "Quartzolit", colecao: "Assentamento", formato: "1 kg", acabamento: "—", classe: "", unid: "un", preco: 18.9, custo: 11.5, rendimento: 0, pecasCx: 0, estoque: 240, cor: "#9C9A95" },
];
export const produtoPorId = (id) => CATALOGO.find((p) => p.id === id);

let seq = 0;
export const uid = () => `${Date.now().toString(36)}${(seq++).toString(36)}`;

export const novoItem = () => ({
  id: uid(), produtoId: "", descricao: "", classe: "", unid: "m²",
  area: "", perda: "10", rendimento: "", qtd: "", unitario: "", descontoPct: "", custo: "",
});
export const novoAmbiente = (nome = "") => ({ id: uid(), nome, itens: [novoItem()] });
export const novoServico = (nome = "", valor = "") => ({ id: uid(), nome, valor });

export function itemDoProduto(p, base = {}) {
  return {
    ...novoItem(), ...base,
    produtoId: p.id,
    descricao: `${p.nome} ${p.formato}`.trim(),
    classe: p.classe, unid: p.unid,
    rendimento: p.rendimento ? fmtNum(p.rendimento) : "",
    unitario: fmtNum(p.preco), custo: fmtNum(p.custo),
  };
}

const hoje = () => new Date().toISOString().slice(0, 10);

export function novoOrcamento(numero) {
  return {
    id: uid(), numero, status: "elaboracao", campanha: "", data: hoje(), validadeDias: "7",
    cliente: { nome: "", perfil: "Consumidor final", documento: "", telefone: "", endereco: "" },
    profissional: "",
    ambientes: [novoAmbiente("Sala")],
    servicos: [novoServico("Frete", "")],
    descontoTotal: "", pagamento: "", observacoes: "",
    consultor: { nome: "Markus", cargo: "Consultor técnico de vendas", whatsapp: "(51) 99388-7771", fixo: "(51) 3551-0017" },
    condicoes: [...CONDICOES_PADRAO], declaracao: DECLARACAO_PADRAO,
    exemplo: false, atualizadoEm: new Date().toISOString(),
  };
}

// ---------- números ----------
export function parseBR(v) {
  if (typeof v === "number") return v;
  const s = String(v ?? "").trim().replace(/[R$%\s]/g, "");
  if (!s) return 0;
  const n = Number(s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s);
  return Number.isFinite(n) ? n : 0;
}
const r2 = (n) => Math.round(n * 100) / 100;
const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dec = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const int = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
export const fmtMoeda = (n) => moeda.format(n || 0);
export const fmtNum = (n) => dec.format(n || 0);
export const fmtInt = (n) => int.format(n || 0);
export const fmtPct = (n) => `${int.format(Math.round((n || 0) * 100))}%`;
export const fmtMoedaCurta = (n) =>
  n >= 1000 ? `R$ ${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(n / 1000)} mil` : fmtMoeda(n);

export function fmtData(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
export function dataValidade(iso, dias) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + (parseInt(dias, 10) || 0));
  return d.toISOString().slice(0, 10);
}

// ---------- cálculo de cada item ----------
// m²: área do ambiente + % de perda, arredondado para caixas inteiras pelo rendimento.
export function calcItem(i) {
  const unitario = parseBR(i.unitario);
  const descPct = Math.min(100, Math.max(0, parseBR(i.descontoPct))) / 100;
  const custo = parseBR(i.custo);
  let qtd, caixas = 0, necessario = 0;
  if (i.unid === "m²") {
    const area = parseBR(i.area);
    const perda = parseBR(i.perda) / 100;
    const rend = parseBR(i.rendimento);
    necessario = area * (1 + perda);
    if (rend > 0 && necessario > 0) {
      caixas = Math.ceil(r2(necessario / rend) - 1e-9);
      qtd = r2(caixas * rend);
    } else qtd = r2(necessario);
  } else {
    qtd = parseBR(i.qtd);
    if (i.unid === "cx") caixas = qtd;
  }
  const bruto = r2(qtd * unitario);
  const desconto = r2(bruto * descPct);
  const total = r2(bruto - desconto);
  const custoTotal = r2(qtd * custo);
  return { qtd, caixas, necessario, bruto, desconto, total, custoTotal, temCusto: custo > 0 };
}

export function totais(o) {
  const ambientes = o.ambientes.map((a) => {
    const itens = a.itens.map(calcItem);
    return { itens, subtotal: r2(itens.reduce((s, x) => s + x.total, 0)) };
  });
  const todos = ambientes.flatMap((a) => a.itens);
  const produtos = r2(todos.reduce((s, x) => s + x.total, 0));
  const descontoItens = r2(todos.reduce((s, x) => s + x.desconto, 0));
  const servicos = r2(o.servicos.reduce((s, x) => s + parseBR(x.valor), 0));
  const descontoTotal = parseBR(o.descontoTotal);
  const total = r2(produtos + servicos - descontoTotal);
  const area = r2(o.ambientes.flatMap((a) => a.itens).reduce((s, i, n) => s + (i.unid === "m²" ? calcItem(i).qtd : 0), 0));
  const caixas = todos.reduce((s, x) => s + x.caixas, 0);
  const custo = r2(todos.reduce((s, x) => s + x.custoTotal, 0));
  const receitaComCusto = r2(todos.filter((x) => x.temCusto).reduce((s, x) => s + x.total, 0)) - descontoTotal;
  const margem = receitaComCusto > 0 && custo > 0 ? (receitaComCusto - custo) / receitaComCusto : null;
  return { ambientes, produtos, descontoItens, servicos, descontoTotal, total, area, caixas, custo, margem };
}

export const margemItem = (c) => (c.temCusto && c.total > 0 ? (c.total - c.custoTotal) / c.total : null);

export function statusEfetivo(o) {
  if (o.status === "enviado" || o.status === "elaboracao") {
    const v = dataValidade(o.data, o.validadeDias);
    if (o.status === "enviado" && v && v < hoje()) return "expirado";
  }
  return o.status;
}

export function proximoNumero(lista) {
  const ano = new Date().getFullYear();
  const usados = lista.map((o) => String(o.numero || "")).filter((n) => n.startsWith(`${ano}-`)).map((n) => parseInt(n.split("-")[1], 10) || 0);
  return `${ano}-${String((usados.length ? Math.max(...usados) : 0) + 1).padStart(4, "0")}`;
}

// ---------- exemplos ----------
const it = (pid, extra) => itemDoProduto(produtoPorId(pid), extra);
const diasAtras = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export function exemplos() {
  const base = (numero, extra) => ({ ...novoOrcamento(numero), exemplo: true, ...extra });
  return [
    // Reconstrução do orçamento real enviado pela loja (01/09/2026)
    base("2026-0001", {
      status: "enviado", campanha: "Liquida Estoque", data: diasAtras(0), validadeDias: "1",
      cliente: { nome: "Jean e Debora", perfil: "Consumidor final", documento: "", telefone: "", endereco: "" },
      ambientes: [
        { id: uid(), nome: "Casa toda", itens: [it("p1", { area: "101,20", perda: "10" })] },
        { id: uid(), nome: "Parede social", itens: [it("p2", { area: "4,10", perda: "10" }), it("p3", { area: "4,60", perda: "10" })] },
      ],
      servicos: [novoServico("Frete", "120,00")],
      pagamento: "Pagamento à vista no PIX ou dinheiro. A combinar.",
    }),
    base("2026-0002", {
      status: "aprovado", data: diasAtras(3), validadeDias: "10",
      cliente: { nome: "Residência Almeida", perfil: "Arquiteto", documento: "", telefone: "(51) 99812-0034", endereco: "Rua das Palmeiras, 220 · Capão da Canoa" },
      profissional: "Arq. Fernanda Lopes",
      ambientes: [
        { id: uid(), nome: "Sala e jantar", itens: [it("p4", { area: "58", perda: "8", descontoPct: "5" })] },
        { id: uid(), nome: "Banheiro suíte", itens: [it("p5", { area: "14,5", perda: "12" }), it("p8", { unid: "un", qtd: "12" })] },
      ],
      servicos: [novoServico("Frete", "250,00"), novoServico("Instalação", "1.800,00")],
      pagamento: "Entrada de 40% no PIX e saldo em 3x no cartão.",
    }),
    base("2026-0003", {
      status: "enviado", data: diasAtras(5), validadeDias: "7",
      cliente: { nome: "Construtora Litoral", perfil: "Construtora", documento: "", telefone: "", endereco: "Edifício Mirante · Torres" },
      ambientes: [{ id: uid(), nome: "Áreas comuns", itens: [it("p1", { area: "320", perda: "10", descontoPct: "12" })] }],
      servicos: [novoServico("Frete", "0")],
      pagamento: "Boleto 30/60/90.",
    }),
    base("2026-0004", {
      status: "elaboracao", data: diasAtras(1), validadeDias: "7",
      cliente: { nome: "Carla Menezes", perfil: "Designer de interiores", documento: "", telefone: "", endereco: "" },
      ambientes: [{ id: uid(), nome: "Cozinha", itens: [it("p7", { area: "9", perda: "15" }), it("p9", { unid: "un", qtd: "6" })] }],
      servicos: [novoServico("Frete", "")],
    }),
    base("2026-0005", {
      status: "recusado", data: diasAtras(12), validadeDias: "7",
      cliente: { nome: "Paulo Henrique", perfil: "Consumidor final", documento: "", telefone: "", endereco: "" },
      ambientes: [{ id: uid(), nome: "Área gourmet", itens: [it("p6", { area: "36", perda: "10" })] }],
      servicos: [novoServico("Frete", "180,00")],
      observacoes: "Cliente achou o prazo de reposição longo.",
    }),
    base("2026-0006", {
      status: "pedido", data: diasAtras(9), validadeDias: "7",
      cliente: { nome: "Studio Arq Norte", perfil: "Arquiteto", documento: "", telefone: "", endereco: "" },
      ambientes: [{ id: uid(), nome: "Lavabo", itens: [it("p5", { area: "6", perda: "10" })] }],
      servicos: [novoServico("Frete", "90,00")],
    }),
  ];
}

// ---------- armazenamento local ----------
const KEY = "renovar.sistema.orcamentos.v2";
export function carregarLista() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const ex = exemplos();
  salvarLista(ex);
  return ex;
}
export function salvarLista(lista) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lista));
    return true;
  } catch {
    return false;
  }
}
