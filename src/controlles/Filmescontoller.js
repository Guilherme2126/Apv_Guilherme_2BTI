import filmes from '../models/Filmes.js';

export const listarFilmes = (req, res) => {
  res.json(filmes);
}

export function buscarFilme(req, res) {
  const filme = filmes.find((item) => item.id === Number(req.params.id));

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado!" });
  }

  res.json(filme);
}

app.get("/", (req, res) => {
  res.json({ mensagem: "API de filmes funcionando!", documentacao: "/api-docs" });
});

app.post("/filmes", verificarToken, (req, res) => {
  const { titulo, genero } = req.body;

  if (!titulo || !genero) {
    return res.status(400).json({ mensagem: "Dados inválidos." });
  }

  const novoFilme = { id: filmes.length + 1, titulo, genero };
  filmes.push(novoFilme);

  res.status(201).json({ mensagem: "Filme cadastrado com sucesso!", filme: novoFilme });
});

app.get("/filmes", (req, res) => {
  res.json(filmes);
});

app.get("/filmes/:id", (req, res) => {
  const filme = filmes.find((item) => item.id === Number(req.params.id));

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado!" });
  }

  res.json(filme);
});

app.put("/filmes/:id", verificarToken, (req, res) => {
  const filme = filmes.find((item) => item.id === Number(req.params.id));

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado!" });
  }

  const { titulo, genero } = req.body;

  if (!titulo || !genero) {
    return res.status(400).json({ mensagem: "Dados inválidos." });
  }

  filme.titulo = titulo;
  filme.genero = genero;
  res.json({ mensagem: "Filme atualizado com sucesso!", filme });
});

app.patch("/filmes/:id", verificarToken, (req, res) => {
  const filme = filmes.find((item) => item.id === Number(req.params.id));

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado!" });
  }

  const { titulo, genero } = req.body;

  if (titulo === undefined && genero === undefined) {
    return res.status(400).json({ mensagem: "Informe titulo ou genero para atualizar." });
  }

  if (titulo !== undefined) filme.titulo = titulo;
  if (genero !== undefined) filme.genero = genero;

  res.json({ mensagem: "Filme atualizado parcialmente!", filme });
});

app.delete("/filmes/:id", verificarToken, (req, res) => {
  const indice = filmes.findIndex((item) => item.id === Number(req.params.id));

  if (indice === -1) {
    return res.status(404).json({ mensagem: "Filme não encontrado!" });
  }

  const filme = filmes.splice(indice, 1)[0];
  res.json({ mensagem: "Filme excluído com sucesso!", filme });
}); 