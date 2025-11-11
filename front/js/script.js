document.getElementById('gerarBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    const imagemContainer = document.getElementById('imagemContainer');
    imagemContainer.innerHTML = '<p>Gerando imagem...</p>';
  
    try {
      const resposta = await fetch('http://localhost:3000/gerar-imagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
  
      const dados = await resposta.json();
      if (dados.url) {
        imagemContainer.innerHTML = `<img src="${dados.url}" alt="Imagem gerada" />`;
      } else {
        imagemContainer.innerHTML = `<p>Erro: ${dados.error}</p>`;
      }
    } catch (erro) {
      imagemContainer.innerHTML = `<p>Erro na requisição: ${erro.message}</p>`;
    }
  });
  