# Sistema de Carteira Digital

## Índice
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
  - [Configuração do Ambiente](#configuração-do-ambiente)
  - [Usando Docker](#usando-docker)
  - [Instalação Manual](#instalação-manual)
- [Configuração](#configuração)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
  - [Banco de Dados](#banco-de-dados)
- [Monitoramento (ELK Stack)](#monitoramento)
  - [Acessando Kibana](#acessando-kibana)
  - [Visualização de Logs](#visualização-de-logs)
  - [APM](#apm)
- [Testes](#testes)
- [API Documentation](#api-documentation)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Troubleshooting](#troubleshooting)

## Visão Geral
ecnologias desejadas 
• NodeJs 
• NestJs 
• TypeScript. 
  
Objetivo 
O objetivo consiste na criação de uma carteira financeira em que os usuários possam realizar 
transferência de saldo. 
Teremos apenas um tipo de usuário que pode enviar ou receber dinheiro de qualquer outro. 
 

## Tecnologias
- NestJS
- PostgreSQL
- Docker
- ELK Stack (Elasticsearch, Logstash, Kibana)
- APM Server
- JWT para autenticação

## Arquitetura
Arquitetura padrão do NEST.js (MVC)

## Pré-requisitos
- Node.js (v16+)
- Docker e Docker Compose
- NestJS CLI (`npm i -g @nestjs/cli`)

## Instalação

### Configuração do Ambiente
1. Clone o repositório
2. Copie o `.env.example` para `.env`
3. Configure as variáveis de ambiente

### Usando Docker
```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f
```

## Monitoramento
### Acessando Kibana
1. Acesse `http://localhost:5601`
2. Navegue até "Observability" > "APM"

### Visualização de Logs
Os logs são divididos em três categorias:
- my-app.log: Logs gerais da aplicação
- transaction-audit.log: Logs de transações
- transaction-reversal-audit.log: Logs de reversões
1. Acesse `http://localhost:5601`
2. Navegue até "Stack Management" > Index Management > Name_Index > Discover Index

## Troubleshooting
### Problemas Comuns
1. Erro de conexão com o banco:
   - Verifique as variáveis de ambiente
   - Confirme se o container do PostgreSQL está rodando

2. Logs não aparecem no Kibana:
   - Verifique se os arquivos de log foram criados
   - Confirme se o Filebeat está rodando

## Objetivo

O objetivo consiste na criação de uma carteira financeira em que os usuários possam realizar 
transferência de saldo. 
Teremos apenas um tipo de usuário que pode enviar ou receber dinheiro de qualquer outro. 
 
### Requisitos 
• Criar cadastro 
• Criar autenticação 
• Usuários podem enviar ou receber dinheiro 
• Validar se o usuário tem saldo antes da transferência. 
• A operação de transferência deve ser uma transação passível de reversão em qualquer caso de 
inconsistência ou por solicitação do usuário. 
 
### Avaliação 
• Atente-se para cumprir: 
• Segurança 
• Saber argumentar suas escolhas 
• Conhecimento de padrões (design patterns, SOLID) 
• Modelagem de dados 

### O que será um diferencial: 
• Uso de Docker 
• Testes de integração 
• Testes unitários 
• Documentação 
• Monitoramento e logging 


## Setup do projeto- Instale as dependências

Obs: Certifque-se de ter o node instalado em sua máquina e nestjs. Para instalar o nestjs, execute o seguinte comando: npm i -g @nestjs/cli

Acesse a branch main no projeto e execute o comando abaixo para instalar as dependências do projeto:


```bash
$ yarn 
```

## Intruções

1- para configurar o projeto cria um arquivo .env na raiz do projeto e coloque as seguintes variáveis de ambiente presentes no arquivo .env.example:

obs: há um arquivo init.sql na raiz do projeto com o nome do banco de dados já configurado. Caso querira definir outro nome para o banco de dados, altere o nome do banco de dados no arquivo init.sql também.

2- Para a configuração do monitoramento do sistema crie os seguintes 3 arquivos na pasta logstash presente na raíz do projeto. my-app.log, transaction-audit.log, transaction-reversal-audit.log

3- Caso você esteja usando a via docker as variáveis de ambiente deverão estar setadas de acordo com as instruções do arquivo .env.example

## Run tests

OBS: para executar os testes de loggers set a variável de ambiente LOG_RUlES de acordo com o arquivo .env.example. Além disso, set a variável de ambiente NODE_ENV para test.

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Compile e execute o projeto

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod

```

## Acessando os endpoints pelo swagger

Acesse o endereco: http://localhost:{port}/api para visualizar a documentação do swagger

OBS: para acessar o swagger é necessario que a variável de ambiente NODE_ENV esteja em modo de development.


## Executando com docker 
execute o comando abaixo para subir o container
```bash 
docker-compose up -d 
```
