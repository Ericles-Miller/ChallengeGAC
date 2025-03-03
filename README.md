<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Setup do projeto- Instale as dependências

Obs: Certifque-se de ter o node instalado em sua máquina e nestjs. Para instalar o nestjs, execute o seguinte comando: npm i -g @nestjs/cli

Acesse a branch main no projeto e execute o comando abaixo para instalar as dependências do projeto:


```bash
$ yarn install
```

## Intruções

1- para configurar o projeto cria um arquivo .env na raiz do projeto e coloque as seguintes variáveis de ambiente presentes no arquivo .env.example:

obs: há um arquivo init.sql na raiz do projeto com o nome do banco de dados já configurado. Caso querira definir outro nome para o banco de dados, altere o nome do banco de dados no arquivo init.sql também.

além disso, crie um arquivo chamado my-app.log no dir logstash/


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

para executar o logstash execute o comando abaixo:
logstash -f logstash.conf

Acesse o Kibana através do seu navegador (normalmente http://localhost:5601).


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


## executando com docker 
execute o comando abaixo para subir o container
```bash 
docker-compose up -d 
```
