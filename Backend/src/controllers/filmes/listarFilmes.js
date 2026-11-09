import filmes from "../../data/filmes.js";

export default function listarFilmes(req, res) {
  res.json(filmes);
}