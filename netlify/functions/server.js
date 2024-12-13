// netlify/functions/capture.js

const { Pool } = require('pg');

// Configuração da conexão com o banco PostgreSQL
const pool = new Pool({
    user: process.env.NILEDB_USER,
    host: process.env.NILEDB_HOST,
    database: process.env.NILEDB_DATABASE,
    password: process.env.NILEDB_PASSWORD,
    port: process.env.NILEDB_PORT,
});
    console.log("server", NILEDB_USER, NILEDB_HOST, NILEDB_DATABASE, NILEDB_PASSWORD, NILEDB_PORT,);
exports.handler = async (event, context) => {
    const data = JSON.parse(event.body);
    console.log("Received data:", data);

    if (!data.email || !data.phone) {
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
        console.log("Server", email, phone);
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
