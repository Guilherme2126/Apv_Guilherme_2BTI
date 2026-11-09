import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = process.env.PORT || 3000;
const tokenSecreto = "1234";

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de cadastro e gerenciamento de filmes",
      version: "1.0.0",
      description: "API escolar para cadastrar e gerenciar filmes."
    },
    servers: [{ url: `http://localhost:${port}`, description: "Servidor local da API" }],
    components: {
      schemas: {
        Filme: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            titulo: { type: "string", example: "Interestelar" },
            genero: { type: "string", example: "Ficção Científica" }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description: "Informe o token no formato: Bearer SEU_TOKEN"
        }
      }
    }
  },
  apis: ["./server.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const partes = authHeader?.split(" ") || [];

  if (!authHeader || partes[0] !== "Bearer" || partes.length !== 2) {
    return res.status(401).json({ mensagem: "Acesso negado! Token não fornecido." });
  }

  if (partes[1] !== tokenSecreto) {
    return res.status(403).json({ mensagem: "Acesso negado! Token inválido." });
  }

  next();
}

const filmes = [
  { id: 1, titulo: "Interestelar", genero: "Ficção Científica" },
  { id: 2, titulo: "Titanic", genero: "Romance" },
  { id: 3, titulo: "O Rei Leão", genero: "Animação" },
  { id: 4, titulo: "Corra!", genero: "Terror" },
  { id: 5, titulo: "Vingadores: Ultimato", genero: "Ação" }
];

app.get("/", (req, res) => {
  res.json({ mensagem: "API de filmes funcionando!", documentacao: "/api-docs" });
});

/**
 * @swagger
 * /filmes:
 *   get:
 *     summary: Lista todos os filmes
 *     responses:
 *       200:
 *         description: Lista de filmes
 *   post:
 *     summary: Cadastra um filme
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, genero]
 *             properties:
 *               titulo: { type: string, example: Interestelar }
 *               genero: { type: string, example: Ficção Científica }
 *     responses:
 *       201:
 *         description: Filme cadastrado com sucesso
 * /filmes/{id}:
 *   get:
 *     summary: Busca um filme por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Filme encontrado
 *   put:
 *     summary: Atualiza um filme
 *     security:
 *       - bearerAuth: []
 *   patch:
 *     summary: Atualiza parcialmente um filme
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Exclui um filme
 *     security:
 *       - bearerAuth: []
 */
