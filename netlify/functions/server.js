const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");

// Configurações do app Express
const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração do banco Nile usando variáveis de ambiente criadas no Netlify
const pool = new Pool({
    host: process.env.NILEDB_HOST,
    user: process.env.NILEDB_USER,
    password: process.env.NILEDB_PASSWORD,
    database: process.env.NILEDB_NAME,
    port: 5432, // Confirme se o Nile usa essa porta padrão do PostgreSQL
    ssl: { rejectUnauthorized: false },
});

// Rota de captura de dados
router.post("/api/capture", async (req, res) => {
    const { email, phone } = req.body;
    console.log("Received data:", req.body);
    if (!email || !phone) {
        return res.status(400).json({ error: "Dados incompletos." });
    }

    try {
        console.log("Tentando conectar ao banco...");
        const result = await pool.query("INSERT INTO users (email, phone) VALUES ($1, $2)", [email, phone]);
        console.log("Dados salvos no banco:", result);
        res.status(200).json({ message: "Dados salvos com sucesso!" });
    } catch (error) {
        console.error("Erro ao salvar dados:", error);
        res.status(500).json({ error: "Erro no servidor ao gravar no banco de dados." });
    }
});

// Integrando o router ao Express
app.use("/", router);

// Exportando a função serverless
module.exports.handler = serverless(app);
