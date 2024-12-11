const { Pool } = require("pg");

// Configuração da conexão com o banco PostgreSQL
const pool = new Pool({
    user: "postgres",
    host: "localhost", // Altere para o IP/host do banco de dados em produção, se necessário
    database: "postgres",
    password: "12345678",
    port: 5432,
});

// Função Lambda
exports.handler = async (event, context) => {
    // Habilitar CORS para permitir requisições do frontend
    const headers = {
        "Access-Control-Allow-Origin": "https://imrservicos.netlify.app", // Substitua pelo domínio do seu frontend em produção
        "Access-Control-Allow-Headers": "Content-Type",
    };

    // Responder às preflight requests de navegadores (método OPTIONS)
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
        };
    }

    // Verificar método POST
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Método não permitido" }),
        };
    }

    // Capturar os dados do corpo da requisição
    const { email, phone } = JSON.parse(event.body);

    if (!email || !phone) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Dados incompletos." }),
        };
    }

    try {
        // Inserir dados no banco
        const result = await pool.query(
            "INSERT INTO users (email, phone) VALUES ($1, $2)",
            [email, phone]
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "Dados salvos com sucesso!" }),
        };
    } catch (error) {
        console.error("Erro ao salvar dados:", error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Erro no servidor." }),
        };
    }
};
