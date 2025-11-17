console.log("✅ Script carregado com sucesso!");

document.getElementById("gerarBtn").addEventListener("click", async () => {
  
  const materia = document.getElementById("select-materia").selectedOptions[0]?.textContent;
  const assunto = document.getElementById("select-assunto").selectedOptions[0]?.textContent;
  const estilo = document.getElementById("select-estilo").value;
  const detalhes = document.getElementById("prompt").value.trim();

  const imagemContainer = document.getElementById("imagemContainer");
  imagemContainer.innerHTML = "<p>Gerando imagem...</p>";

  if (!detalhes) {
    imagemContainer.innerHTML = "<p>Por favor, escreva detalhes no prompt.</p>";
    return;
  }

  // 🧠 MONTA O PROMPT FINAL COM TODOS OS CAMPOS
  const promptFinal = `
    Gere uma imagem sobre a matéria "${materia}",
    especificamente do assunto "${assunto}".
    O estilo desejado é: ${estilo}.
    Detalhes adicionais: ${detalhes}.
  `;

  console.log("📌 Prompt enviado:", promptFinal);

  try {
    const resposta = await fetch("http://localhost:3000/gerar-imagem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptFinal }),
    });

    const dados = await resposta.json();

    if (dados.image || dados.url) {
      const imagem = dados.image || dados.url;

      imagemContainer.innerHTML = `
        <img src="${imagem}" alt="Imagem gerada"
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
