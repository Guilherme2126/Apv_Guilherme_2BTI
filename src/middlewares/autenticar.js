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