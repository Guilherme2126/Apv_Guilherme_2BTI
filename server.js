import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || "chave-secreta-desenvolvimento";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, "Uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });
app.use(express.json());
app.use("/arquivos", express.static(uploadDirectory));

// Armazenamento em memória (tema permitido: Jogos)
const jogos = [
  { id: 1, titulo: "Minecraft", genero: "Sandbox", ano: 2011 },
  { id: 2, titulo: "The Witcher 3", genero: "RPG", ano: 2015 },
  { id: 3, titulo: "GTA V", genero: "Ação", ano: 2013 }
];

const usuarios = [];
let proximoId = 4;

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const extensao = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extensao}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!tiposPermitidos.includes(file.mimetype)) {
      return callback(new Error("Apenas imagens JPG, PNG, GIF ou WEBP são permitidas"));
    }
    callback(null, true);
  }
});

function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization;
  const token = cabecalho?.startsWith("Bearer ") ? cabecalho.slice(7) : null;

  if (!token) {
    return res.status(401).json({ mensagem: "Token não informado" });
  }

  try {
    req.usuario = jwt.verify(token, jwtSecret);
    next();
  } catch {
    return res.status(401).json({ mensagem: "Token inválido ou expirado" });
  }
}

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API Catálogo de Jogos",
    version: "1.0.0",
    description: "API REST com CRUD, autenticação, upload e armazenamento em memória."
  },
  servers: [{ url: `http://localhost:${port}` }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    }
  },
  paths: {
    "/usuarios": { post: { summary: "Cadastra um usuário" } },
    "/login": { post: { summary: "Realiza login e retorna um JWT" } },
    "/jogos": {
      get: { summary: "Lista jogos", security: [{ bearerAuth: [] }] },
      post: { summary: "Cadastra um jogo", security: [{ bearerAuth: [] }] }
    },
    "/jogos/{id}": {
      get: { summary: "Consulta um jogo", security: [{ bearerAuth: [] }] },
      put: { summary: "Atualiza um jogo", security: [{ bearerAuth: [] }] },
      patch: { summary: "Atualiza parcialmente um jogo", security: [{ bearerAuth: [] }] },
      delete: { summary: "Exclui um jogo", security: [{ bearerAuth: [] }] }
    },
    "/upload": { post: { summary: "Envia uma imagem", security: [{ bearerAuth: [] }] } }
  }
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota de Boas-Vindas
app.get("/", (req, res) => {
  res.json({
    mensagem: "API de Catálogo de Jogos funcionando!",
    documentacao: "/api-docs"
  });
});

app.post("/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "Nome, e-mail e senha são obrigatórios" });
  }
  if (usuarios.some((usuario) => usuario.email === email.toLowerCase())) {
    return res.status(409).json({ mensagem: "E-mail já cadastrado" });
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);
  usuarios.push({ id: usuarios.length + 1, nome, email: email.toLowerCase(), senha: senhaCriptografada });
  res.status(201).json({ mensagem: "Usuário cadastrado com sucesso" });
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.find((item) => item.email === email?.toLowerCase());

  if (!usuario || !(await bcrypt.compare(senha || "", usuario.senha))) {
    return res.status(401).json({ mensagem: "E-mail ou senha inválidos" });
  }

  const token = jwt.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email }, jwtSecret, { expiresIn: "2h" });
  res.json({ mensagem: "Login realizado com sucesso", token });
});

app.post("/upload", autenticar, (req, res) => {
  upload.single("imagem")(req, res, (erro) => {
    if (erro instanceof multer.MulterError && erro.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ mensagem: "A imagem deve ter no máximo 5 MB" });
    }
    if (erro) {
      return res.status(400).json({ mensagem: erro.message });
    }
    if (!req.file) {
      return res.status(400).json({ mensagem: "Envie uma imagem no campo 'imagem'" });
    }
    res.status(201).json({ mensagem: "Imagem enviada com sucesso", arquivo: `/arquivos/${req.file.filename}` });
  });
});

// GET /jogos - Listar todos os jogos
app.get("/jogos", autenticar, (req, res) => {
  res.json(jogos);
});

// GET /jogos/:id - Buscar jogo por ID
app.get("/jogos/:id", autenticar, (req, res) => {
  const id = Number(req.params.id);
  const jogo = jogos.find((item) => item.id === id);

  if (!jogo) {
    return res.status(404).json({ mensagem: "Jogo não encontrado" });
  }

  res.json(jogo);
});

// POST /jogos - Cadastrar novo jogo
app.post("/jogos", autenticar, (req, res) => {
  const { titulo, genero, ano } = req.body;

  if (!titulo || !genero) {
    return res.status(400).json({ mensagem: "Título e gênero são obrigatórios" });
  }

  const novoJogo = {
    id: proximoId++,
    titulo,
    genero,
    ano: Number(ano) || null
  };

  jogos.push(novoJogo);

  res.status(201).json({
    mensagem: "Jogo cadastrado com sucesso",
    jogo: novoJogo
  });
});

// PUT /jogos/:id - Editar jogo existente (Obrigatório AV1)
app.put("/jogos/:id", autenticar, (req, res) => {
  const id = Number(req.params.id);
  const index = jogos.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Jogo não encontrado" });
  }

  const { titulo, genero, ano } = req.body;

  jogos[index] = {
    id,
    titulo: titulo || jogos[index].titulo,
    genero: genero || jogos[index].genero,
    ano: ano ? Number(ano) : jogos[index].ano
  };

  res.json({
    mensagem: "Jogo atualizado com sucesso",
    jogo: jogos[index]
  });
});

// PATCH /jogos/:id - Atualizar parcialmente um jogo
app.patch("/jogos/:id", autenticar, (req, res) => {
  const id = Number(req.params.id);
  const jogo = jogos.find((item) => item.id === id);

  if (!jogo) {
    return res.status(404).json({ mensagem: "Jogo não encontrado" });
  }

  const { titulo, genero, ano } = req.body;

  if (titulo !== undefined) jogo.titulo = titulo;
  if (genero !== undefined) jogo.genero = genero;
  if (ano !== undefined) jogo.ano = Number(ano);

  res.json({
    mensagem: "Jogo atualizado parcialmente com sucesso",
    jogo
  });
});

// DELETE /jogos/:id - Excluir jogo (Obrigatório AV1)
app.delete("/jogos/:id", autenticar, (req, res) => {
  const id = Number(req.params.id);
  const index = jogos.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Jogo não encontrado" });
  }

  const jogoRemovido = jogos.splice(index, 1);

  res.json({
    mensagem: "Jogo removido com sucesso",
    jogo: jogoRemovido[0]
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});