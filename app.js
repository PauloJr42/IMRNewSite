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

        if (response.ok) {
            alert("Dados enviados com sucesso!");
        } else {
            const errorData = await response.json();
            alert(`Erro: ${errorData.error || "Não foi possível enviar os dados."}`);
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar ao servidor.");
    }
});
