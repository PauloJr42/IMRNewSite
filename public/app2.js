document.getElementById("capture-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    try {
        const response = await fetch("/api/server", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, phone }),
        });

        // Verifica se a resposta foi bem-sucedida
        if (response.ok) {
            alert("Dados enviados com sucesso!");
        } else {
            // Se a resposta não for OK, tenta obter dados de erro do servidor
            const errorData = await response.json();
            console.error("Erro:", errorData);
            alert(`Erro: ${errorData.error || "Falha no servidor."}`);
        }
    } catch (error) {
        // Lida com erros de rede ou de conexão fora do escopo da resposta
        console.error("Erro:", error);
        alert("Erro ao conectar ao servidor.");
    }
});
