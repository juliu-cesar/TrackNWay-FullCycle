## Iniciar o projeto

1. Suba o container do mysql com o comando:

```bash
docker compose up -d
```

2. Inicie o go com o comando:

```bash
go run ./cmd/route/main.go
```

___

### Rota POST /routes

- Content-Type: "application/json"

```json
{
    "name": "Route Name",
    "source": {
        "lat": -20,
        "lng": -20
    },
    "destination": {
        "lat": -20,
        "lng": -20
    }
}
```

### Rota GET /routes

- Content-Type: "application/json"

```json
[
    {
    "name": "Route Name",
    "source": {
        "lat": -20,
        "lng": -20
    },
    "destination": {
        "lat": -20,
        "lng": -20
    }
}
]
```
