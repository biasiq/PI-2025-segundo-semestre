// Function to handle user registration
async function handleUserRegistration(event) {
    event.preventDefault();
    console.log('Form submission started');

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('exampleInputEmail1').value;
    const senha = document.getElementById('exampleInputPassword1').value;

    console.log('Form data:', { nome, email });

    try {
        const response = await fetch('/users/register', {
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
            window.location.href = '/tela_login.html'; // Redirect to login page
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