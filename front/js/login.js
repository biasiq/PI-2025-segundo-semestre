document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('botao-gerar');
  btn.addEventListener('click', async () => {
    const email = document.getElementById('email-usuario').value;
    const senha = document.getElementById('senha-usuario').value;

    if (!email || !senha) {
      alert('Preencha email e senha');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = 'index.html';
      } else {
        alert(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error('Login error', err);
      alert('Erro de rede ao tentar fazer login');
    }
  });
});