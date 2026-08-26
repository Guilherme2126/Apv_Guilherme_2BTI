import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

// Armazenamento em memória (Usando tema permitido: Jogos)
const jogos = [
  { id: 1, titulo: "Minecraft", genero: "Sandbox", ano: 2011 },
  { id: 2, titulo: "The Witcher 3", genero: "RPG", ano: 2015 },
  { id: 3, titulo: "GTA V", genero: "Ação", ano: 2013 }
];

let proximoId = 4; // Contador incremental para garantir IDs únicos

// Rota de Boas-Vindas
app.get("/", (req, res) => {
  res.json({
    mensagem: "API de Catálogo de Jogos funcionando!",
    disciplina: "Desenvolvimento de Websites",
    bimestre: "3º bimestre"
  });
});

// GET /jogos - Listar todos os jogos
app.get("/jogos", (req, res) => {
  res.json(jogos);
});

// GET /jogos/:id - Buscar jogo por ID
app.get("/jogos/:id", (req, res) => {
  const id = Number(req.params.id);
  const jogo = jogos.find((item) => item.id === id);

  if (!jogo) {
    return res.status(404).json({ mensagem: "Jogo não encontrado" });
  }

  res.json(jogo);
});

// POST /jogos - Cadastrar novo jogo
app.post("/jogos", (req, res) => {
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
app.put("/jogos/:id", (req, res) => {
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

// DELETE /jogos/:id - Excluir jogo (Obrigatório AV1)
app.delete("/jogos/:id", (req, res) => {
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