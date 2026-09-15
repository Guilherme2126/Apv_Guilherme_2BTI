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

## Exemplo de uso no Insomnia

### 1) Cadastrar usuário
- Método: `POST`
- URL: `http://localhost:3000/usuarios`
- Body JSON:

```json
{
  "nome": "Guilherme",
  "email": "guilherme@email.com",
  "senha": "123456"
}
```

### 2) Fazer login
- Método: `POST`
- URL: `http://localhost:3000/login`
- Body JSON:

```json
{
  "email": "guilherme@email.com",
  "senha": "123456"
}
```

Copie o valor do campo `token` retornado.

### 3) Usar autenticação
Na aba `Auth` do Insomnia:

- Tipo: `Bearer Token`
- Token: `SEU_TOKEN`

### 4) Listar jogos
- Método: `GET`
- URL: `http://localhost:3000/jogos`

### 5) Buscar jogo por ID
- Método: `GET`
- URL: `http://localhost:3000/jogos/1`

### 6) Cadastrar jogo
- Método: `POST`
- URL: `http://localhost:3000/jogos`
- Body JSON:

```json
{
  "titulo": "God of War",
  "genero": "Ação",
  "ano": 2018
}
```

### 7) Atualizar jogo
- Método: `PUT`
- URL: `http://localhost:3000/jogos/1`
- Body JSON:

```json
{
  "titulo": "Minecraft Legends",
  "genero": "Sandbox",
  "ano": 2023
}
```

### 8) Excluir jogo
- Método: `DELETE`
- URL: `http://localhost:3000/jogos/1`

### 9) Upload de imagem
- Método: `POST`
- URL: `http://localhost:3000/upload`
- Auth: `Bearer Token`
- Body: `multipart/form-data`
- Campo: `imagem`

Aceita arquivos JPG, PNG, GIF e WEBP até 5 MB.

## Observações

- Os usuários e jogos são armazenados em memória enquanto o servidor estiver em execução.
- O token JWT expira em 2 horas.
- A documentação Swagger pode ser acessada em `/api-docs`.