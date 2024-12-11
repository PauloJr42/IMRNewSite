// netlify/functions/capture.js

const { Pool } = require('pg');

// Configuração da conexão com o banco PostgreSQL
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "12345678",
    port: 5432,
});

exports.handler = async (event, context) => {
    const { email, phone } = JSON.parse(event.body);

    if (!email || !phone) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Dados incompletos." }),
        };
    }

    try {
        const result = await pool.query(
            "INSERT INTO users (email, phone) VALUES ($1, $2)",
            [email, phone]
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Dados salvos com sucesso!" }),
        };
    } catch (error) {
        console.error("Erro ao salvar dados:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro no servidor." }),
        };
    }
};
