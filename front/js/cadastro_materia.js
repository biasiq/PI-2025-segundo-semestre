document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('botao-cadastrar');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const nome = document.getElementById('nome-materia').value;
    if (!nome || nome.trim() === '') {
      alert('Preencha o nome da matéria');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/materias/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.trim() })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Matéria criada com sucesso');
        document.getElementById('nome-materia').value = '';
      } else {
        alert(data.error || 'Erro ao criar matéria');
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      alert('Erro de rede ao criar matéria');
    }
  });
});