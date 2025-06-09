# CashApp - API de Banco Digital

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<p align="center">Uma API moderna de banco digital construída com NestJS para gerenciamento seguro de contas e transações financeiras.</p>

## Visão Geral

CashApp é uma API bancária robusta que fornece um conjunto abrangente de recursos para operações bancárias digitais. Construída com NestJS e TypeORM, oferece gerenciamento seguro de contas, processamento de transações e rastreamento financeiro detalhado.

## Recursos

- **Gerenciamento de Usuários**: Crie e gerencie contas de usuários com controle de acesso baseado em funções
- **Gerenciamento de Contas**: Crie e gerencie contas bancárias com códigos de conta únicos
- **Processamento de Transações**:
  - Depósitos: Adicione fundos às contas
  - Saques: Retire fundos das contas (com validação de saldo)
  - Transferências: Mova fundos entre contas
  - Estorno de Transações: Reverta transações concluídas
- **Extratos de Conta**: Gere extratos detalhados de conta com opções de filtragem
- **Segurança**: Autenticação baseada em JWT e autorização baseada em funções
- **Documentação da API**: Documentação abrangente com Swagger

## Endpoints da API

### Autenticação
- `POST /auth/login` - Autenticar um usuário e obter token de acesso

### Contas
- `POST /accounts` - Criar uma nova conta (Somente Admin)
- `GET /accounts` - Obter todas as contas (Somente Admin)
- `GET /accounts/:code` - Obter conta por código (Somente Admin)
- `POST /accounts/deposit` - Depositar dinheiro na conta do usuário
- `POST /accounts/withdraw` - Sacar dinheiro da conta do usuário
- `POST /accounts/transfer/:toAccountId` - Transferir dinheiro para outra conta
- `GET /accounts/statement/consult` - Obter extrato da conta com filtros
- `POST /accounts/reverse/:transactionId` - Reverter uma transação

## Modelos de Dados

### Conta
- `id` - Identificador único (UUID)
- `code` - Código único da conta
- `user` - Usuário associado
- `balance` - Saldo atual da conta
- `active` - Status da conta [ideia abandonada]
- `transactions` - Transações associadas
- `createdAt` - Timestamp de criação
- `updatedAt` - Timestamp da última atualização

### Transação
- `id` - Identificador único (UUID)
- `type` - Tipo de transação (depósito, saque, transferência, estorno, estornada)
- `amount` - Valor da transação
- `before_balance` - Saldo da conta antes da transação
- `after_balance` - Saldo da conta após a transação
- `account` - Conta associada
- `to_account_id` - Conta destinatária para transferências (opcional)
- `from_account_id` - Conta remetente para transferências (opcional)
- `createdAt` - Timestamp da transação

## Configuração do Projeto

### Pré-requisitos
- Node.js (v14 ou superior)
- Gerenciador de pacotes Yarn
- Banco de dados PostgreSQL (ou outro suportado pelo TypeORM)

### Instalação

```bash
# Clonar o repositório
$ git clone <repository-url>

# Navegar para o diretório do projeto
$ cd cashapp

# Instalar dependências
$ yarn install

# Configurar variáveis de ambiente
# Criar um arquivo .env com as seguintes variáveis:
# PORT=3000
# JWT_SECRET=your_jwt_secret
```

## Executando a Aplicação

```bash
# Modo de desenvolvimento
$ yarn run start

# Modo de observação (recarrega automaticamente com alterações)
$ yarn run start:dev

# Modo de produção
$ yarn run start:prod
```
## ⚠ Importante
Para realizar as operacoes de admin é importante executar o comando abaixo para popular o banco
```bash
# Modo de desenvolvimento
$ yarn seed

```
## Suporte Docker

A aplicação inclui suporte Docker para fácil implantação:

```bash
# Construir e iniciar com Docker Compose
$ docker-compose up -d
```

## Documentação da API

Uma vez que a aplicação esteja em execução, você pode acessar a documentação da API Swagger em:

```
http://localhost:3000/api
```

## Testes

```bash
# Testes unitários
$ yarn run test

# Testes end-to-end
$ yarn run test:e2e

# Cobertura de testes
$ yarn run test:cov
```

## Licença

Este projeto está licenciado sob a [licença MIT](LICENSE).
