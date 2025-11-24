document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('botao-cadastrar');

  const radioExistente = document.getElementById('radio-existente');
  const radioNova = document.getElementById('radio-nova');

  const existingBlock = document.getElementById('existing-materia-block');
  const newMateriaBlock = document.getElementById('new-materia-block');
  const assuntoBlock = document.getElementById('assunto-block');

  const selectExisting = document.getElementById('select-existing-materia');
  const nomeMateriaInput = document.getElementById('nome-materia');
  const nomeAssuntoInput = document.getElementById('nome-assunto');

  const sanitize = str => str.replace(/[<>]/g, "").trim();

  function updateVisibility() {
    const existente = radioExistente.checked;

    existingBlock.style.display = existente ? 'block' : 'none';
    newMateriaBlock.style.display = existente ? 'none' : 'block';

    assuntoBlock.style.display = 'block';
  }

  async function loadMaterias() {
    try {
      const res = await fetch('http://localhost:3000/materias/all');
      const materias = await res.json();

      selectExisting.innerHTML = `<option value="">-- Selecione --</option>`;
      materias.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id_materia;
        opt.textContent = m.nome;
        selectExisting.appendChild(opt);
      });

    } catch (error) {
      console.error("Erro ao carregar matérias:", error);
      selectExisting.innerHTML = `<option value="">Erro ao carregar</option>`;
    }
  }

  function validateExistingMateria() {
    const valid = selectExisting.value !== "";
    selectExisting.classList.toggle("is-invalid", !valid);
    return valid;
  }

  function validateNomeMateria() {
    if (radioExistente.checked) return true;
    const valid = nomeMateriaInput.value.trim().length >= 3;
    nomeMateriaInput.classList.toggle("is-invalid", !valid);
    return valid;
  }

  function validateNomeAssunto() {
    if (radioNova.checked && nomeAssuntoInput.value.trim() === "") return true;
    const valid = nomeAssuntoInput.value.trim().length >= 3;
    nomeAssuntoInput.classList.toggle("is-invalid", !valid);
    return valid;
  }

  updateVisibility();

  radioExistente.addEventListener('change', () => {
    loadMaterias();
    updateVisibility();
  });

  radioNova.addEventListener('change', updateVisibility);

  btn.addEventListener('click', async () => {
    const nomeMateria = sanitize(nomeMateriaInput.value);
    const nomeAssunto = sanitize(nomeAssuntoInput.value);

    if (radioExistente.checked) {

      if (!validateExistingMateria() || !validateNomeAssunto()) return;

      try {
        const res = await fetch('http://localhost:3000/assuntos/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_materia: Number(selectExisting.value),
            nome: nomeAssunto
          })
        });

        const data = await res.json();
        if (res.ok) {
          alert('Assunto cadastrado com sucesso!');
          nomeAssuntoInput.value = "";
          selectExisting.value = "";
        } else {
          alert(data.error || 'Erro ao cadastrar assunto');
        }

      } catch (err) {
        alert('Erro de rede ao inserir assunto.');
      }

      return;
    }

    if (!validateNomeMateria() || !validateNomeAssunto()) return;

    try {
      const resMat = await fetch('http://localhost:3000/materias/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nomeMateria })
      });

      const dataMat = await resMat.json();

      if (!resMat.ok) {
        alert(dataMat.error || "Erro ao criar matéria");
        return;
      }

      const idMateria = dataMat.id_materia;

      if (!nomeAssunto) {
        alert("Matéria criada com sucesso!");
        nomeMateriaInput.value = "";
        return;
      }

      const resAss = await fetch('http://localhost:3000/assuntos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_materia: idMateria,
          nome: nomeAssunto
        })
      });

      const dataAss = await resAss.json();

      if (resAss.ok) {
        alert("Matéria e assunto criados com sucesso!");
      } else {
        alert(dataAss.error || "A matéria foi criada, mas houve erro ao criar o assunto.");
      }

      nomeMateriaInput.value = "";
      nomeAssuntoInput.value = "";

    } catch (error) {
      alert("Erro de rede, tente novamente.");
    }
  });
});
