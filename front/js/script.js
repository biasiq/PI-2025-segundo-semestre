console.log("✅ Script carregado com sucesso!");

document.getElementById("gerarBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value.trim();
  const imagemContainer = document.getElementById("imagemContainer");
  imagemContainer.innerHTML = "<p>Gerando imagem...</p>";

  if (!prompt) {
    imagemContainer.innerHTML = "<p>Por favor, digite um prompt.</p>";
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3000/gerar-imagem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const dados = await resposta.json();

    if (dados.image) {
      imagemContainer.innerHTML = `
        <img src="${dados.image}" alt="Imagem gerada"
        style="max-width:100%; border-radius:8px; margin-top:10px;">
      `;
    } else {
      imagemContainer.innerHTML = `<p>Erro: ${dados.error || "Erro desconhecido."}</p>`;
    }
  } catch (erro) {
    imagemContainer.innerHTML = `<p>Erro na requisição: ${erro.message}</p>`;
    console.error("❌ Erro:", erro);
  }
});
