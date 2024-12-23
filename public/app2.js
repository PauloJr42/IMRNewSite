import { response } from "express";

document.getElementById("capture-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    try {
        const response = await fetch("/.netlify/functions/api/capture", {
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
            console.error("Erro:", errorData);
            alert(`Erro: ${errorData.error || "Falha no servidor."}`);
        }
    } catch (error) {
        console.log(response);
        console.error("Erro:", error);
        alert("Erro ao conectar ao servidor.");
    }
});
