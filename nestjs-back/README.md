# Api TrackNWay

<div align="center">

  <img src="https://nestjs.com/img/logo-small.svg" height="300" />

</div>

## Sobre

API construída em NestJS para sistema de cadastro de rotas e rastreamento da rota do motoristas, integrado com a poderosa API do Google Maps. Fornecer rastreamento e visualização em tempo real das rotas dos motoristas, e otimização para os trajetos de viagem.

## Tecnologias

- ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)

- ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

- ![Google Maps](https://img.shields.io/badge/Google_Maps-%23204075?style=for-the-badge&logo=googlemaps&logoColor=white)

- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

- ![Swagger_Api_Doc](https://img.shields.io/badge/Swagger_api_doc-%233D6B14?style=for-the-badge&logo=swagger&logoColor=white)

## Documentação

<div align="center">

  <img src="https://github.com/juliu-cesar/VSCode-Landing-page/assets/121033909/ff0655e8-6661-4505-94b6-e73bc1f2839d" height="500" />

</div>

A documentação foi feita utilizando o **Swagger Api**, e pode ser acessada na rota `/api`.

### Rotas

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

## Instalação

```bash
$ npm install
```

## Iniciar a aplicação

### Iniciando de dentro do container com _Dev Container_

1. Entre dentro do container utilizando a opção `Open Folder in Container` da extensão _Dev Container_. Em seguida execute o comando:

```bash
$ npm run start:dev
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
$ docker compose down --volumes

$ docker compose up

$ npm run start:dev
```
