document.addEventListener('DOMContentLoaded', () => {
    const API = 'http://localhost:3000';

    const btn = document.getElementById('botao-cadastrar');

    const radioExist = document.getElementById('radio-existente');
    const radioNova = document.getElementById('radio-nova');

    const blocoSelect = document.getElementById('existing-materia-block');
    const selectMateria = document.getElementById('select-existing-materia');

    const inputMateria = document.getElementById('nome-materia');
    const inputAssunto = document.getElementById('nome-assunto');

    carregarMaterias();
    trocarModo();

    radioExist.addEventListener('change', trocarModo);
    radioNova.addEventListener('change', trocarModo);

    function trocarModo() {
        const existente = radioExist.checked;
        blocoSelect.style.display = existente ? 'block' : 'none';
        inputMateria.closest('.form-floating').style.display = existente ? 'none' : 'block';
    }

    async function carregarMaterias() {
        const res = await fetch(`${API}/materias/all`);
        const lista = await res.json();

        selectMateria.innerHTML = `<option value="">-- Selecione --</option>`;
        lista.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.id_materia;
            opt.textContent = m.nome;
            selectMateria.appendChild(opt);
        });
    }

    function invalid(el, flag) {
        el.classList.toggle('is-invalid', flag);
    }

    btn.addEventListener('click', async () => {
        const assunto = inputAssunto.value.trim();

        if (assunto.length < 3) {
            alert("Informe um assunto válido");
            invalid(inputAssunto, true);
            return;
        }

        if (radioExist.checked) {
            const id = selectMateria.value;
            if (!id) {
                alert("Selecione uma matéria");
                invalid(selectMateria, true);
                return;
            }
            await criarAssunto(id, assunto);
            return;
        }

        const materia = inputMateria.value.trim();
        if (materia.length < 3) {
            alert("Informe um nome válido para a matéria");
            invalid(inputMateria, true);
            return;
        }

        await criarMateriaEAssunto(materia, assunto);
    });

    async function criarAssunto(id_materia, nome) {
        const res = await fetch(`${API}/assuntos/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_materia, nome })
        });

        const data = await res.json();

        if (res.status === 409) {
            alert("Assunto já cadastrado nessa matéria.");
            invalid(inputAssunto, true);
            return;
        }
        if (!res.ok) {
            alert(data.error || "Erro ao cadastrar assunto");
            return;
        }

        alert("Assunto cadastrado.");
        inputAssunto.value = "";
    }

    async function criarMateriaEAssunto(nomeMateria, assunto) {
        const resMat = await fetch(`${API}/materias/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: nomeMateria })
        });

        const dataMat = await resMat.json();

        if (resMat.status === 409) {
            alert("Matéria já existe!");
            invalid(inputMateria, true);
            return;
        }

        if (!resMat.ok) {
            alert(dataMat.error || "Erro ao criar matéria.");
            return;
        }

        const resAss = await fetch(`${API}/assuntos/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_materia: dataMat.id_materia,
                nome: assunto
            })
        });

        const dataAss = await resAss.json();

        if (resAss.status === 409) {
            alert("Matéria criada, porém o assunto já existia.");
        } else if (!resAss.ok) {
            alert("Matéria criada, mas erro ao criar assunto.");
        } else {
            alert("Matéria e assunto cadastrados.");
        }

        inputMateria.value = "";
        inputAssunto.value = "";
        await carregarMaterias();

        radioExist.checked = true;
        trocarModo();
    }
});
