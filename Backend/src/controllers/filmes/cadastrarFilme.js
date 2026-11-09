import filmes from "../../data/filmes.js";

export default function cadastrarFilme(req, res) {
  const { titulo, genero } = req.body;

  if (!titulo || !genero) {
    return res.status(400).json({ mensagem: "Dados inválidos." });
  }

  const proximoId = filmes.reduce((maiorId, filme) => Math.max(maiorId, filme.id), 0) + 1;
  const novoFilme = { id: proximoId, titulo, genero };
  filmes.push(novoFilme);

  return res.status(201).json({ mensagem: "Filme cadastrado com sucesso!", filme: novoFilme });
}