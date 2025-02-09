# project-bolt-react-account

Aqui está o texto traduzido e ajustado para Markdown:

````markdown
# Aplicativo Bancário com Autenticação e Transações

## Instalação

```sh
npm install
```
````

## Estrutura de Arquivos

```
src/types.ts
src/context/AuthContext.tsx
src/components/LoginForm.tsx
src/components/RegisterForm.tsx
src/components/Dashboard.tsx
src/App.tsx
```

## Executando o Projeto

```sh
npm run dev
```

## Funcionalidades

### 🔐 Autenticação:

-   Cadastro com nome, e-mail e senha
-   Login com e-mail e senha
-   Criação automática de conta com saldo inicial de R$100

### 🏦 Gerenciamento da Conta:

-   Visualizar detalhes da conta (agência e número da conta)
-   Consultar saldo atual
-   Ver histórico de transações

### 💰 Operações:

-   Depositar dinheiro
-   Sacar dinheiro
-   Transferir dinheiro para outra conta

### 📜 Histórico de Transações:

-   Listagem de todas as transações
-   Tipo de transação, valor e data
-   Cores diferenciadas para transações (verde para depósitos, vermelho para saques/transferências)

## 🚀 Tecnologias e Benefícios

O aplicativo está completamente funcional e inclui:

-   **Interface limpa e profissional** com Tailwind CSS
-   **Design responsivo** que funciona em todos os dispositivos
-   **Ícones modernos** do Lucide React
-   **Gerenciamento de estado** baseado em Context API
-   **Segurança com TypeScript** para evitar erros

## 📌 Testando o Aplicativo

1. Cadastre uma nova conta
2. Faça login com suas credenciais
3. Veja seu saldo inicial de **R$100**
4. Realize transações (depósito, saque, transferência)
5. Consulte o histórico de transações

O servidor de desenvolvimento já está rodando, então você pode testar todas as funcionalidades agora mesmo! 🚀

````

Esse formato torna o texto mais organizado e fácil de visualizar. Caso precise de alguma adaptação extra, me avise! 😊

# Documentação de Configuração do Backend e Frontend

## Separando Backend e Frontend

### Instalação das Dependências
```sh
npm install
````

### Estruturando o Projeto

```sh
mkdir -p backend && mv src/server.ts src/routes src/middleware src/utils src/types/express.d.ts src/lib backend/src/
mv tsconfig.json backend/
npm init -y
```

### Configurando o Backend

```sh
cd backend
npm install
npm run dev
```

O backend rodará em `http://localhost:3000`

### Configurando o Frontend

```sh
npm install
npm run dev
```

O frontend rodará em `http://localhost:5173`

## Estrutura do Projeto

Agora você tem dois diretórios separados:

-   `frontend/`: Contém a aplicação React
-   `backend/`: Contém a API Node.js

Cada projeto tem seu próprio:

-   `package.json` com suas dependências específicas
-   Scripts de desenvolvimento
-   Configurações TypeScript

## Desenvolvimento Simultâneo

Para desenvolver, abra dois terminais:

1. No primeiro terminal:
    ```sh
    npm run dev
    ```
    - Inicia o frontend (porta `5173`)
2. No segundo terminal:
    ```sh
    cd backend
    npm run dev
    ```
    - Inicia o backend (porta `3000`)

Isso garante uma separação clara entre frontend e backend, facilitando o desenvolvimento e a manutenção.

## Considerações Finais

-   Atualize a URL da API no frontend para `http://localhost:3000` ao fazer chamadas para o backend.
-   Essa separação permite desenvolver cada parte do sistema independentemente, mantendo um código mais organizado e modularizado.
