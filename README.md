# 💸 Fluxo

Controle de gastos com **conversão de moedas em tempo real**. Registre despesas em qualquer moeda, veja tudo convertido para reais e acompanhe o total na moeda que preferir.

## ✨ Funcionalidades

- Cadastro, edição e exclusão de despesas (descrição, valor, moeda, pagamento e categoria).
- Cotação **travada no momento do lançamento**: o valor em reais não muda depois.
- Total geral convertido para a moeda de sua escolha, com resumo por categoria.
- Autenticação com e-mail e senha, rotas protegidas e despesas separadas por usuário.
- Tema **dark** (padrão) com alternância para claro.
- Layout responsivo: tabela no desktop, cartões no celular.

## 🧰 Tecnologias

React 18 · TypeScript · Vite · Redux Toolkit · React Router · Supabase Auth (opcional) · Vitest + Testing Library · cotações da [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas).

## 🚀 Como rodar

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | checagem de tipos + build de produção |
| `npm test` | testes (Vitest) |
| `npm run lint` | ESLint |

## 🔐 Autenticação

Um app só de front-end **não consegue** proteger senhas sozinho: qualquer verificação feita no navegador pode ser contornada. O caminho simples e seguro é delegar o login a um provedor. O Fluxo usa o [Supabase Auth](https://supabase.com/auth) (plano gratuito), que cuida de hash de senha, sessão, renovação de token e confirmação de e-mail.

**Modo seguro (Supabase)**

1. Crie um projeto em supabase.com.
2. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (Project Settings → API). A chave `anon` é pública por design.
3. Reinicie o `npm run dev`. Em *Authentication → Providers*, deixe *Email* ativo.

**Modo demo (sem configuração)**

Sem as variáveis acima, o app cria contas locais no navegador (senha com PBKDF2 + salt, sessão por aba). Serve para testar a interface, **não** para uso real.

> As despesas ficam no `localStorage` do navegador, separadas por usuário. Para sincronizar entre dispositivos, o próximo passo natural é salvá-las no Supabase com Row Level Security.

## 🗂️ Estrutura

```
src/
├── auth/         # provedores de login (supabase e demo) atrás da mesma interface
├── components/   # Header, Summary, ExpenseForm, ExpenseList, ...
├── pages/        # Login e Wallet
├── redux/        # store, slices (user, wallet) e persistência
├── api.ts        # busca de cotações
└── tests/        # helpers de teste
```