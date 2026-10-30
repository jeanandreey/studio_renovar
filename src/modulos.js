// Mapa do sistema: áreas do menu, módulos e fases do MVP (do planejamento do Jean)

export const FASES = [
  { n: "01", nome: "Fundação comercial", texto: "Cadastro de clientes, catálogo de produtos, tabelas de preços e orçamentos em PDF.", estado: "Em construção", img: "banho" },
  { n: "02", nome: "Controle de vendas", texto: "Funil de oportunidades, follow-up, orçamento que vira pedido, histórico do cliente e indicadores.", estado: "Próxima", img: "cozinha" },
  { n: "03", nome: "Operação e rentabilidade", texto: "Estoque, compras, entregas, custos, margem de contribuição e financeiro.", estado: "Planejada", img: "argila" },
  { n: "04", nome: "Diferenciais competitivos", texto: "Portal de arquitetos, gestão de obras, integração com WhatsApp e relatórios inteligentes.", estado: "Planejada", img: "sala" },
];

export const MODULOS = {
  clientes: {
    nome: "Clientes e CRM", fase: "01", prioridade: "Prioridade alta",
    resumo: "Centralizar os dados de clientes, arquitetos, designers de interiores, construtoras, engenheiros e empreiteiros.",
    itens: ["Cadastro com contatos, CPF/CNPJ e endereço", "Histórico de atendimentos, compras e orçamentos", "Segmentação por perfil de cliente", "Registro de preferências e condições comerciais", "Lembretes de retorno e acompanhamento de oportunidades"],
  },
  orcamentos: {
    nome: "Orçamentos e propostas", fase: "01", prioridade: "Prioridade alta", pronto: true,
    resumo: "Propostas profissionais, rápidas e padronizadas para clientes e obras.",
    itens: ["Produtos, quantidades, m², caixas e peças", "Descontos por item ou no total", "Frete, instalação e outros serviços", "Condições de pagamento e validade", "PDF com a identidade da Renovar", "Status do envio à aprovação", "Orçamento aprovado vira pedido"],
  },
  pedidos: {
    nome: "Pedidos, entregas e logística", fase: "02",
    resumo: "Acompanhar o pedido do fechamento até a entrega.",
    itens: ["Pedido confirmado e pagamento", "Separação de materiais", "Compra pendente com fornecedor", "Agendamento e endereço de entrega", "Status de transporte e comprovante de recebimento", "Registro de avarias, faltas e devoluções"],
  },
  followup: {
    nome: "Comunicação e follow-up", fase: "02",
    resumo: "Registrar contatos comerciais, agendar retornos e acompanhar propostas que ainda não fecharam. Pode evoluir para WhatsApp e e-mail.",
    itens: ["Registro de mensagens e ligações", "Retornos agendados por vendedor", "Propostas paradas há mais de X dias", "Integração futura com WhatsApp e e-mail"],
  },
  arquitetos: {
    nome: "Portal de arquitetos", fase: "04",
    resumo: "Área exclusiva para parceiros consultarem catálogos, pedirem cotações, acompanharem propostas e acessarem condições autorizadas.",
    itens: ["Catálogo com condições do parceiro", "Pedido de cotação online", "Acompanhamento de propostas", "Histórico de obras especificadas"],
  },
  catalogo: {
    nome: "Catálogo de produtos", fase: "01",
    resumo: "Cadastrar e localizar rapidamente cada produto vendido.",
    itens: ["Nome, marca, fabricante, coleção e código", "Fotografias e ficha técnica", "Acabamento, cor, formato e espessura", "Preço por m², caixa, peça ou unidade", "Rendimento por caixa e peças por embalagem", "Ambientes indicados", "Produtos similares e alternativas"],
  },
  precos: {
    nome: "Tabelas de preços", fase: "01",
    resumo: "Um dos módulos mais importantes para evitar erros de venda.",
    itens: ["Tabelas por fornecedor, marca ou coleção", "Custo, preço de venda e margem", "Preços para arquitetos, lojistas e consumidor final", "Desconto máximo por perfil", "Histórico de reajustes", "Importação das tabelas dos fornecedores", "Alerta de margem abaixo do mínimo"],
  },
  fornecedores: {
    nome: "Compras e fornecedores", fase: "03",
    resumo: "Fornecedores, cotações de compra, reposição, prazos, frete e comparação de preços para o mesmo produto.",
    itens: ["Cadastro de fornecedores", "Cotações de compra", "Pedidos de reposição", "Prazos e custos de frete", "Comparação de preço por produto"],
  },
  calculadora: {
    nome: "Calculadora de revestimentos", fase: "01",
    resumo: "Quantidade de material pela metragem do ambiente, formato da peça e percentual de perda, arredondada para caixas inteiras.",
    itens: ["Área do ambiente em m²", "Perda conforme assentamento e ambiente", "Arredondamento para caixas inteiras", "Já embutida no editor de orçamentos"],
  },
  estoque: {
    nome: "Estoque e disponibilidade", fase: "03",
    resumo: "Saber o que está disponível antes de prometer um prazo ao cliente.",
    itens: ["Estoque por produto, lote e localização", "Disponível, reservado e encomendado", "Entradas e saídas", "Alertas de estoque baixo", "Previsão de reposição", "Reservas ligadas a orçamentos e pedidos", "Controle de lotes e tonalidades"],
  },
  obras: {
    nome: "Gestão de obras e projetos", fase: "04",
    resumo: "Para atender arquitetos e obras de alto padrão, ambiente por ambiente.",
    itens: ["Cadastro de obras e ambientes", "Cliente, arquiteto e responsáveis", "Produtos especificados por ambiente", "Área em m² com margem de perda", "Orçamentos por banheiro, cozinha, sala e fachada", "Cronograma de compra e entrega", "Histórico de materiais substituídos"],
  },
  devolucoes: {
    nome: "Pós-venda e assistência", fase: "03",
    resumo: "Problemas com peças, trocas, devoluções, divergências de tonalidade, reposição e garantia.",
    itens: ["Abertura de chamados", "Trocas e devoluções", "Divergência de tonalidade", "Reposição de peças", "Acompanhamento de garantia"],
  },
  financeiro: {
    nome: "Financeiro e rentabilidade", fase: "03",
    resumo: "Entender quanto a empresa vende e quanto realmente ganha.",
    itens: ["Contas a pagar e receber", "Entrada, parcelas e inadimplência", "Receita por período e vendedor", "Margem bruta por produto e pedido", "Comissões comerciais", "Fluxo de caixa previsto e realizado", "Custo × venda × descontos"],
  },
  relatorios: {
    nome: "Indicadores e inteligência comercial", fase: "02",
    resumo: "Conversão de orçamentos, ticket médio, margem por categoria, mais vendidos, clientes recorrentes e motivos de perda.",
    itens: ["Taxa de conversão", "Ticket médio", "Margem por categoria", "Produtos mais vendidos", "Clientes recorrentes", "Motivos de perda"],
  },
  configuracoes: {
    nome: "Usuários, permissões e auditoria", fase: "02",
    resumo: "O que vendedores, gestores e financeiro podem ver ou alterar, com registro de mudanças de preço, desconto e condições.",
    itens: ["Perfis de acesso", "Permissões por área", "Dados da empresa", "Integrações", "Histórico de alterações"],
  },
};

// Menu por áreas de negócio. `rota` aponta para uma página pronta; o resto abre a página do módulo.
export const MENU = [
  { area: "Comercial", itens: [
    { id: "orcamentos", rota: "orcamentos", rotulo: "Orçamentos" },
    { id: "clientes", rotulo: "Clientes e CRM" },
    { id: "pedidos", rotulo: "Pedidos" },
    { id: "followup", rotulo: "Follow-up" },
    { id: "arquitetos", rotulo: "Arquitetos" },
  ]},
  { area: "Produtos e preços", itens: [
    { id: "catalogo", rota: "catalogo", rotulo: "Catálogo" },
    { id: "precos", rotulo: "Tabelas de preços" },
    { id: "fornecedores", rotulo: "Fornecedores" },
    { id: "calculadora", rotulo: "Calculadora de m²" },
  ]},
  { area: "Operações", itens: [
    { id: "estoque", rotulo: "Estoque" },
    { id: "fornecedores", rotulo: "Compras" },
    { id: "obras", rotulo: "Obras" },
    { id: "pedidos", rotulo: "Entregas" },
    { id: "devolucoes", rotulo: "Devoluções" },
  ]},
  { area: "Financeiro", itens: [
    { id: "financeiro", rotulo: "Contas a pagar e receber" },
    { id: "financeiro", rotulo: "Comissões" },
    { id: "financeiro", rotulo: "Margens" },
    { id: "financeiro", rotulo: "Fluxo de caixa" },
  ]},
  { area: "Relatórios", itens: [
    { id: "relatorios", rotulo: "Desempenho comercial" },
    { id: "relatorios", rotulo: "Rentabilidade" },
    { id: "relatorios", rotulo: "Produtos" },
    { id: "relatorios", rotulo: "Clientes" },
    { id: "relatorios", rotulo: "Vendedores" },
  ]},
];

export const REGRAS = [
  ["Conversão de unidades", "Converte caixas em m², respeitando o rendimento da embalagem."],
  ["Cálculo de perdas", "Acrescenta o percentual de sobra conforme o tipo de assentamento e o ambiente."],
  ["Controle de tonalidade", "Identifica lotes e tonalidades para não misturar na mesma obra."],
  ["Preço por perfil", "Aplica tabelas específicas para arquitetos, construtoras e clientes finais."],
  ["Margem mínima", "Alerta quando um desconto deixa o pedido abaixo da margem permitida."],
  ["Cotação por ambiente", "Separa os materiais de cada cômodo em uma única proposta de obra."],
  ["Alternativas de produto", "Sugere materiais similares quando o item está indisponível."],
  ["Histórico de preços", "Mostra o preço praticado em vendas anteriores e os reajustes."],
];

export const rotaModulo = (id) => (MODULOS[id]?.pronto ? id : `modulo-${id}`);

// Ordem e ícones dos cards da página inicial
export const CARDS = [
  ["clientes", "users"], ["catalogo", "grid"], ["precos", "tag"], ["calculadora", "ruler"],
  ["pedidos", "truck"], ["followup", "chat"], ["relatorios", "chart"], ["configuracoes", "shield"],
  ["estoque", "box"], ["fornecedores", "cart"], ["financeiro", "wallet"], ["devolucoes", "refresh"],
  ["obras", "building"], ["arquitetos", "compass"],
];
