# Sistema Studio Renovar

Sistema de gestão comercial da Studio Renovar (pisos, porcelanatos e revestimentos), construído por módulos. Fase 01 em construção.

- Página inicial com os cards dos módulos. Só Orçamentos está ativo; os demais aparecem como "Em desenvolvimento".
- Orçamentos: lista por status, editor por ambiente (m² + perda → caixas inteiras), desconto por item e no total, serviços, margem mínima interna, alternativa sem estoque, conversão em pedido e proposta em PDF (A4).

## Rodar

```
npm install
npm run build
```

Gera `dist/index.html` (o site, arquivo único), `dist/orcamentos.html` (mesmo conteúdo) e `dist/artifact.html` (fragmento para a prévia no claude.ai).
Na Vercel: build `npm run build`, saída `dist` (já configurado em `vercel.json`).

Os dados ficam no localStorage do navegador até existir um backend.
