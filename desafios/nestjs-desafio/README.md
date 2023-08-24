<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Installation

Dentro da pasta do projeto execute os 2 comandos:

```bash
npm install

npx prisma generate
```

## Running the app

Primeiramente suba os containers Docker com o comando:

```bash
docker compose up --build
```

Abra um outro terminal e rode os 2 comando para iniciar a aplicação

```bash
docker compose exec app bash

npm run start:dev
```
