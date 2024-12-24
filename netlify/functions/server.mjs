import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import serverless from 'serverless-http'; // Adicionei o adaptador serverless-http

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Configuração do banco de dados PostgreSQL usando variáveis de ambiente
const pool = new Pool({
  host: process.env.NILEDB_HOST,
  user: process.env.NILEDB_USER,
  password: process.env.NILEDB_PASSWORD,
  database: process.env.NILEDB_NAME,
  port: process.env.PG_PORT || 5432,
  ssl: { rejectUnauthorized: false },
});

// Inicializando o servidor Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear o corpo das requisições como JSON
app.use(express.json());

// Rota POST para salvar os dados no banco de dados
app.post('/api/server', async (req, res) => {
  const { email, phone } = req.body;

  // Verificar se os dados estão completos
  if (!email || !phone) {
    return res.status(400).json({ error: "Dados incompletos. 'email' e 'phone' são obrigatórios." });
  }

  try {
    // Inserir os dados no banco de dados
    const result = await pool.query(
      'INSERT INTO users (email, phone) VALUES ($1, $2) RETURNING *',
      [email, phone]
    );
    console.log("Dados salvos no banco:", result.rows[0]);

    // Retornar resposta de sucesso
    return res.status(200).json({
      message: "Dados salvos com sucesso!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao salvar dados no banco de dados:", error);
    return res.status(500).json({
      error: "Erro no servidor ao gravar no banco de dados.",
    });
  }
});

// Configurar o adaptador serverless
export const handler = serverless(app);
