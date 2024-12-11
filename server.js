const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// Configuração da conexão com o banco PostgreSQL
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "12345678",
    port: 5432,
});

// Middleware
app.use(bodyParser.json());

// Rota de captura de dados
app.post("/api/capture", async (req, res) => {
    const { email, phone } = req.body;

    if (!email || !phone) {
        return res.status(400).json({ error: "Dados incompletos." });
    }

    try {
        const result = await pool.query(
            "INSERT INTO users (email, phone) VALUES ($1, $2)",
            [email, phone]
        );
        res.status(200).json({ message: "Dados salvos com sucesso!" });
    } catch (error) {
        console.error("Erro ao salvar dados:", error);
        res.status(500).json({ error: "Erro no servidor." });
    }
});

// Inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
