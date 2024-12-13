// app.js

document.getElementById("capture-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    try {
        const response = await fetch(".netlify/functions/server", {  // Altere o caminho para as funções serverless
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, phone }),
        });
            console.log(email,phone);
        if (response.ok) {
            alert("Dados enviados com sucesso!");
        } else {
            alert("Erro ao enviar os dados.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar ao servidor.");
    }
});
