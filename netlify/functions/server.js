const { Pool } = require("pg");

// Configuração do banco Nile usando variáveis de ambiente
const pool = new Pool({
    host: process.env.PG_HOST || "us-west-2.db.thenile.dev",
    user: process.env.PG_USER || "0193bd63-4ec9-7079-9890-a96c459daf53",
    password: process.env.PG_PASSWORD || "eb803924-7c07-4e55-b13b-8e3d32ce5cbf",
    database: process.env.PG_DATABASE || "Leeds",
    port: process.env.PG_PORT || 5432,
    ssl: { rejectUnauthorized: false },
});

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Método não permitido" }),
        };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (err) {
        console.error("Erro ao analisar o corpo da solicitação:", err);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Formato de JSON inválido." }),
        };
    }

    const { email, phone } = body;

    if (!email || !phone) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Dados incompletos. 'email' e 'phone' são obrigatórios." }),
        };
    }

    try {
        const result = await pool.query("INSERT INTO users (email, phone) VALUES ($1, $2) RETURNING *", [email, phone]);
        console.log("Dados salvos no banco:", result.rows[0]);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Dados salvos com sucesso!", data: result.rows[0] }),
        };
    } catch (error) {
        console.error("Erro ao salvar dados no banco de dados:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro no servidor ao gravar no banco de dados." }),
        };
    }
};
