import filmes from "../../data/filmes.js";
import buscarFilmePorId from "../../model/buscarFilmePorId.js";

export default function excluirFilme(req, res) {
  const filme = buscarFilmePorId(Number(req.params.id));

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado!" });
  }

  filmes.splice(filmes.indexOf(filme), 1);
  return res.json({ mensagem: "Filme excluído com sucesso!", filme });
}