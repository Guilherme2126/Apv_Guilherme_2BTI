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

export default swaggerSpec;
