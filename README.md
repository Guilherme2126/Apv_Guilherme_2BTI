# API REST - Catálogo de Jogos

API desenvolvida para as avaliações AV1 e AV2 de Desenvolvimento de Websites.

## Executar

```bash
npm install
npm start
```

Servidor: `http://localhost:3000`

## Rotas

Públicas:

* `POST /usuarios` - `{ "nome": "Guilherme", "email": "email@exemplo.com", "senha": "123456" }`
* `POST /login` - retorna o token JWT
* `GET /api-docs` - documentação Swagger

Protegidas: envie `Authorization: Bearer SEU_TOKEN`.

* `GET /jogos`
* `GET /jogos/:id`
* `POST /jogos`
* `PUT /jogos/:id`
* `DELETE /jogos/:id`
* `POST /upload` - envie uma imagem no campo `imagem` (JPG, PNG, GIF ou WEBP, até 5 MB)

Os jogos e usuários são mantidos em memória enquanto o servidor estiver ligado. Os uploads são salvos na pasta `Uploads`.