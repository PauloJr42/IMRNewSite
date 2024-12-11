document.getElementById("capture-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    try {
        const response = await fetch("/.netlify/functions/server", { // Endpoint correto para Netlify Functions
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, phone }),
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message || "Dados enviados com sucesso!");
        } else {
            const errorData = await response.json();
            alert(errorData.error || "Erro ao enviar os dados.");
        }
    } catch (error) {
        console.error("Erro na comunicação com o servidor:", error);
        alert("Erro ao conectar ao servidor.");
    }
});
