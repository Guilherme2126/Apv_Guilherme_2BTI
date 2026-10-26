import buscarFilmePorId from "../../model/buscarFilmePorId.js";

export default function buscarFilme(req, res) {
  const filme = buscarFilmePorId(Number(req.params.id));

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado!" });
  }

  return res.json(filme);
}