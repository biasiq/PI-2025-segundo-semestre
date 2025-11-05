async function handleUserRegistration(event) {
    event.preventDefault();
    console.log('Form submission started');

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('emailusuario').value;
    const senha = document.getElementById('senhausuario').value;

    console.log('Form data:', { nome, email });

    try {
        const response = await fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome,
                email,
                senha
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
            window.location.href = 'tela_login.html';
        } else {
            alert(data.error || 'Erro ao cadastrar usuário');
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('Full error details:', error);
        alert('Erro ao cadastrar usuário');
    }
    console.log('Form submission completed');
}