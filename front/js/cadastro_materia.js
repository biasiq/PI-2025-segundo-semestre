document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('botao-cadastrar');
  if (!btn) return;

  const radioExistente = document.getElementById('radio-existente');
  const radioNova = document.getElementById('radio-nova');
  const existingBlock = document.getElementById('existing-materia-block');
  const selectExisting = document.getElementById('select-existing-materia');

  async function loadMaterias() {
    if (!selectExisting) return;
    try {
      const res = await fetch('http://localhost:3000/materias/all');
      if (!res.ok) throw new Error('Falha ao carregar matérias');
      const materias = await res.json();
      selectExisting.innerHTML = '<option value="">-- Selecione --</option>';
      materias.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id_materia;
        opt.textContent = m.nome;
        selectExisting.appendChild(opt);
      });
    } catch (err) {
      console.error('Erro ao carregar matérias:', err);
      selectExisting.innerHTML = '<option value="">Erro ao carregar matérias</option>';
    }
  }

  function updateVisibility() {
    if (radioExistente && radioExistente.checked) {
      existingBlock.style.display = 'block';
    } else {
      existingBlock.style.display = 'none';
    }
  }

  if (radioExistente) radioExistente.addEventListener('change', () => { loadMaterias(); updateVisibility(); });
  if (radioNova) radioNova.addEventListener('change', () => updateVisibility());

  updateVisibility();

  btn.addEventListener('click', async () => {
    const nomeMateriaInput = document.getElementById('nome-materia');
    const nomeAssuntoInput = document.getElementById('nome-assunto');
    const nomeMateria = nomeMateriaInput ? nomeMateriaInput.value.trim() : '';
    const nomeAssunto = nomeAssuntoInput ? nomeAssuntoInput.value.trim() : '';

    if (radioExistente && radioExistente.checked) {
      const selectedId = selectExisting ? selectExisting.value : '';
      if (!selectedId) {
        alert('Selecione uma matéria existente');
        return;
      }
      if (!nomeAssunto) {
        alert('Escreva o nome do assunto a ser cadastrado');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/assuntos/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_materia: Number(selectedId), nome: nomeAssunto })
        });
        const data = await res.json();
        if (res.ok) {
          alert('Assunto criado com sucesso na matéria selecionada');
          nomeAssuntoInput.value = '';
          selectExisting.value = '';
        } else {
          alert(data.error || 'Erro ao criar assunto');
        }
      } catch (err) {
        console.error('Erro na requisição:', err);
        alert('Erro de rede ao criar assunto');
      }

      return;
    }

    if (!nomeMateria) {
      alert('Preencha o nome da nova matéria');
      return;
    }

    try {
      const resMat = await fetch('http://localhost:3000/materias/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nomeMateria })
      });
      const dataMat = await resMat.json();
      if (!resMat.ok) {
        alert(dataMat.error || 'Erro ao criar matéria');
        return;
      }

      const materiaId = dataMat.id_materia;

      if (nomeAssunto) {
        const resAss = await fetch('http://localhost:3000/assuntos/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_materia: materiaId, nome: nomeAssunto })
        });
        const dataAss = await resAss.json();
        if (!resAss.ok) {
          alert(dataAss.error || 'Matéria criada, mas falha ao criar assunto');
          return;
        }
        alert('Matéria e assunto criados com sucesso');
      } else {
        alert('Matéria criada com sucesso');
      }

      if (nomeMateriaInput) nomeMateriaInput.value = '';
      if (nomeAssuntoInput) nomeAssuntoInput.value = '';
    } catch (err) {
      console.error('Erro na requisição:', err);
      alert('Erro de rede ao criar matéria/assunto');
    }
  });
});