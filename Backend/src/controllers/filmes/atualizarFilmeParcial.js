import buscarFilmePorId from "../../model/buscarFilmePorId.js";

export default function atualizarFilmeParcial(req, res) {
  const filme = buscarFilmePorId(Number(req.params.id));

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado!" });
  }

  const { titulo, genero } = req.body;

  if (titulo === undefined && genero === undefined) {
    return res.status(400).json({ mensagem: "Informe titulo ou genero para atualizar." });
  }

  if (titulo !== undefined) filme.titulo = titulo;
  if (genero !== undefined) filme.genero = genero;

  return res.json({ mensagem: "Filme atualizado parcialmente!", filme });
}