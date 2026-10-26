import buscarFilmePorId from "../../model/buscarFilmePorId.js";

export default function atualizarFilme(req, res) {
  const filme = buscarFilmePorId(Number(req.params.id));

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado!" });
  }

  const { titulo, genero } = req.body;

  if (!titulo || !genero) {
    return res.status(400).json({ mensagem: "Dados inválidos." });
  }

  filme.titulo = titulo;
  filme.genero = genero;
  return res.json({ mensagem: "Filme atualizado com sucesso!", filme });
}