import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Configuração do banco de dados PostgreSQL usando variáveis de ambiente
const pool = new Pool({
  host: process.env.PG_HOST || 'us-west-2.db.thenile.dev',
  user: process.env.PG_USER || '0193bd63-4ec9-7079-9890-a96c459daf53',
  password: process.env.PG_PASSWORD || 'eb803924-7c07-4e55-b13b-8e3d32ce5cbf',
  database: process.env.PG_DATABASE || 'Leeds',
  port: process.env.PG_PORT || 5432,
  ssl: { rejectUnauthorized: false },
});

// Inicializando o servidor Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear o corpo das requisições como JSON
app.use(express.json());

// Rota POST para salvar os dados no banco de dados
app.post('/netlify/functions/server.mjs', async (req, res) => {
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

// Iniciar o servidor na porta configurada
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export const handler = async (event, context) => {
  return await app(event, context);
};
