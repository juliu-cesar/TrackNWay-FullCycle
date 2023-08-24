# Api TrackNWay

<div align="center">

  <img src="https://nestjs.com/img/logo-small.svg" height="300" />

</div>

## :bulb: Sobre

API construída em NestJS para sistema de cadastro de rotas e rastreamento da rota do motoristas, integrado com a poderosa API do Google Maps. Fornecer rastreamento e visualização em tempo real das rotas dos motoristas, e otimização para os trajetos de viagem.

## :floppy_disk: Tecnologias

- ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)

- ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

- ![Google Maps](https://img.shields.io/badge/Google_Maps-%23204075?style=for-the-badge&logo=googlemaps&logoColor=white)

- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

- ![Swagger_Api_Doc](https://img.shields.io/badge/Swagger_api_doc-%233D6B14?style=for-the-badge&logo=swagger&logoColor=white)

## :books: Documentação

<div align="center">

  <img src="https://github.com/juliu-cesar/VSCode-Landing-page/assets/121033909/ff0655e8-6661-4505-94b6-e73bc1f2839d" height="500" />

</div>

A documentação foi feita utilizando o **Swagger Api**, e pode ser acessada na rota `/api`.

## :gear: Criado com

Para criar um projeto **Nest.js** com **Docker** primeiro precisamos verificar se ja temos o Node, o Docker e *cli* do nest. Para instalar o *cli* do Nest utilizamos o comando:

```bash
npm install -g @nestjs/cli
```

1. Para criar o projeto Nest utilizamos o comando:

```bash
nest new nome_do_projeto
```

Com isso podemos até rodar o `npm run start:dev` para executar a aplicação. Agora vamos para o Docker.

2. Sera necessario criar 2 arquivos na raiz do projeto, o `Dockerfile` e o `docker-compose.yaml`. Dentre do primeiro vamos adicionar os seguintes códigos:

```yaml
FROM node:20-slim

WORKDIR /home/node/app

USER node

CMD [ "tail", "-f", "/dev/null"]
```

Já para o arquivo `yaml` vamos configurar a aplicação e o banco de dados MongoDb:

```yaml
version: '3'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/home/node/app

  db:
    image: bitnami/mongodb:5.0.17
    volumes:
      - mongodb_data:/bitnami/mongodb
    environment:
      MONGODB_ROOT_PASSWORD: root
      MONGODB_REPLICA_SET_MODE: primary
      MONGODB_REPLICA_SET_KEY: 123456
      MONGODB_DATABASE: nest-full

volumes:
  mongodb_data:
    driver: local
```

Com isso podemos tanto rodar um `docker compose up --build` para rodar o container e, em outro shell executar o `docker compose exec app bash` para abrir o bash da aplicação, onde podemos iniciar a aplicação com o mesmo `npm run start:dev`. Porem utilizando a extensão **Dev Container** podemos executar o Vs Code de dentro do container, o que simplifica muito, pois ao entrar no container com a extensão o container ja estará rodando, então temos o terminal do Vs Code para executar todos os comandos.

3. Vamos instalar agora o **Prisma** e iniciar o projeto prisma:

```bash
npm install @prisma/client

npx prisma init
```

Sera criado tanto a pasta do Prisma como o arquivo `.env` com a variável de conexão com o banco de dados.

4. Dentro do arquivo `.env` vamos configurar a variável para o mongoDb:

```env
DATABASE_URL="mongodb://root:root@db:27017/nest-full?authSource=admin"
```

> As informações na url de conexão varia de acordo com a configuração do MongoDb no Docker.

5. Editando o *schema* do prisma

Para facilitar a edição do arquivo prisma, baixe a extensão [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma). Após instalar a extensão, vamos adicionar o seguinte trecho de código no arquivo `schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

Pronto, com isso temos o básico para iniciar uma aplicação Nestjs com MongoDb. O proximo passo é disponibilizar o serviço do Prisma.

### :file_folder: Criando e disponibilizando o serviço do Prisma

O proximo passo é criar o modulo e o serviço do prisma, para podermos acessar o db através dele. Para isso vamos utilizar os 2 comandos abaixo:

```bash
npx nest generate module prisma

npx nest generate service prisma/prisma
```

Com isso o Nest vai criar os arquivos necessarios, e dentro do `prisma.service` vamos adicionar o seguinte código:

```javascript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect;
  }
}
```

Isso ira iniciar o serviço do prisma assim que a aplicação iniciar. Por fim precisamos expor esse serviço, e fazemos isso indo no arquivo `prisma.module` e adicionando no `exports` o prisma service:

```javascript
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
```

> O `@Global()` serve para criar uma instancia de conexão para toda a aplicação. Dessa forma não é preciso importar o prisma service em todo arquivo que for utiliza-lo.

### :hash: Criando uma "tabela" no MongoDb

Apesar de estarmos utilizando um banco de dados NoSql, criamos a collection no Mongo igual uma tabela. Vamos criar o modelo `Route` para o nosso projeto:

```prisma
model Route {
  id          String        @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  source      Place
  destination Place
  distance    Float
  duration    Float
  direction   Json
  created_at  DateTime      @default(now())
  updated_at  DateTime      @updatedAt
}
```

- @id: define o *id* da coleção.

- @default(auto()) : define que o valor do campo sera gerado automaticamente pelo Mongo

- @db.ObjectId : define que sera o tipo padrão de *id* utilizado pelo MongoDb.

- @map("_id") : mapeia esse campo para o nome `_id` no db. Com isso na aplicação utilizamos `id` mas no mongo sera armazenado como `_id`, uma vez que esse é o nome padrão para o Mongo.

- @default(now()) : define o valor do campo para a data no momento da escrita.

- @updatedAt : define o vapor para a data atual sempre que houver uma atualização.

Após criar o modelo vamos gerar a tipagem do modelo para podermos utilizar ele no projeto com o comando prisma:

```bash
npx prisma generate
```

Após todas essas configurações basta criar as rotas da api, mas não iremos abordar isso neste documento.

## :bookmark_tabs: Criando uma nova rota no mapa

Para criar uma nova rota vamos precisar de 2 `place_id`, o do ponto inicial e o do ponto final da viagem. Vamos seguir os seguintes passos:

1. Na rota da api `GET /places?text=nome_local` atribua ao parâmetro `text` o nome da cidade ou local desejado, em seguida faça a requisição.

2. No objeto de retorno temos o campo `place_id`, copie o valor dele e também o da segunda cidade/local.

3. Agora com os 2 _place_id_, vamos na rota `POST /routes` onde iremos enviar um objeto json com as informações necessárias para criar a rota.

```json
{
  "name": "cidade 1 -> cidade 2",
  "source_id": "<place_id_cidade_1>",
  "destination_id": "<place_id_cidade_2>"
}
```

Pronto, ao efetuar a requisição enviando o objeto json a rota sera cadastrada. Podes listar todos os trajetos criados com a rota da api `GET /routes`.

### :electric_plug: Rotas da API

Para criar uma rota no mapa, utilize a rota da api ``

#### POST `/routes`

- request

```json
{
  "name": "string",
  "source_id": "string",
  "destination_id": "string"
}
```

#### GET `/routes`

- response

```json
[
  {
    "id": "string",
    "name": "string",
    "source": {
      "name": "string",
      "location": {
        "lat": 0,
        "lng": 0
      }
    },
    "destination": {
      "name": "string",
      "location": {
        "lat": 0,
        "lng": 0
      }
    },
    "distance": 0,
    "duration": 0,
    "directions": {},
    "created_at": "2023-08-23T12:12:12.102Z",
    "updated_at": "2023-08-23T12:12:12.102Z"
  }
]
```

#### GET `/routes/{id}`

- response

```json
{
  "id": "string",
  "name": "string",
  "source": {
    "name": "string",
    "location": {
      "lat": 0,
      "lng": 0
    }
  },
  "destination": {
    "name": "string",
    "location": {
      "lat": 0,
      "lng": 0
    }
  },
  "distance": 0,
  "duration": 0,
  "directions": {},
  "created_at": "2023-08-23T12:12:12.102Z",
  "updated_at": "2023-08-23T12:12:12.102Z"
}
```

#### PATCH `/routes/{id}`

- request

```json
{
  "name": "string",
  "source_id": "string",
  "destination_id": "string"
}
```

#### DELETE `/routes/{id}`

- request

```json
{}
```

#### GET `/places`

- request

```url
/places?text=<place_name>
```

- response

```json
{
  "candidates": [
    {
      "formatted_address": "string",
      "geometry": {
        "location": {
          "lat": 0,
          "lng": 0
        },
        "viewport": {
          "northeast": {
            "lat": 0,
            "lng": 0
          },
          "southwest": {
            "lat": 0,
            "lng": 0
          }
        }
      },
      "name": "string",
      "place_id": "string"
    }
  ],
  "status": "string"
}
```

## :computer: Instalação

Clone o repositório e em seguida execute os seguintes comandos:

```bash
npm install

npx prisma generate
```

Apos isso **renomeie** o arquivo `.env.sample` para apenas `.env`. Dentro do arquivo, insira sua **chave de api do google maps** na variável `GOOGLE_MAPS_API_KEY`.

## :keyboard: Iniciar a aplicação

### Iniciando de dentro do container com _Dev Container_

1. Entre dentro do container utilizando a opção `Open Folder in Container` da extensão _Dev Container_. Em seguida execute o comando:

```bash
npm run start:dev
```

### Iniciando de fora do container Docker

1. **Comente** o seguinte trecho de código no arquivo `docker-compose.yaml`:

```yaml
# app:
#   build: .
#   ports:
#     - "3000:3000"
#   volumes:
#     - .:/home/node/app
```

2. Execute os 3 seguintes comandos:

```bash
docker compose down --volumes

docker compose up

npm run start:dev
```
