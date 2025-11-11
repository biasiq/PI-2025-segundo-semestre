document.addEventListener('DOMContentLoaded', () => {
  const materiaSelect = document.getElementById('select-materia');
  const assuntoSelect = document.getElementById('select-assunto');

  async function fetchMaterias() {
    try {
      const res = await fetch('http://localhost:3000/materias/all');
      if (!res.ok) throw new Error('Falha ao carregar matérias');
      const materias = await res.json();
      populateMaterias(materias);
    } catch (err) {
      console.error('Erro ao buscar matérias:', err);
      if (materiaSelect) {
        materiaSelect.innerHTML = '<option value="">Erro ao carregar matérias</option>';
      }
    }
  }

  function populateMaterias(materias) {
    if (!materiaSelect) return;
    materiaSelect.innerHTML = '<option value="">-- Escolha a matéria --</option>';
    materias.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id_materia;
      opt.textContent = m.nome;
      materiaSelect.appendChild(opt);
    });
  }

  async function fetchAssuntosForMateria(id_materia) {
    try {
      const res = await fetch(`http://localhost:3000/assuntos/materia/${id_materia}`);
      if (!res.ok) throw new Error('Falha ao carregar assuntos');
      const assuntos = await res.json();
      populateAssuntos(assuntos);
    } catch (err) {
      console.error('Erro ao buscar assuntos:', err);
      if (assuntoSelect) assuntoSelect.innerHTML = '<option value="">Erro ao carregar assuntos</option>';
    }
  }

  function populateAssuntos(assuntos) {
    if (!assuntoSelect) return;
    if (!assuntos || assuntos.length === 0) {
      assuntoSelect.innerHTML = '<option value="">Nenhum assunto encontrado</option>';
      return;
    }
    assuntoSelect.innerHTML = '<option value="">-- Escolha um assunto --</option>';
    assuntos.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id_assunto;
      opt.textContent = a.nome;
      assuntoSelect.appendChild(opt);
    });
  }

  if (materiaSelect) {
    materiaSelect.addEventListener('change', (e) => {
      const id = e.target.value;
      if (id) {
        fetchAssuntosForMateria(id);
      } else if (assuntoSelect) {
        assuntoSelect.innerHTML = '<option value="">Escolha uma matéria primeiro</option>';
      }
    });
  }

  fetchMaterias();
});
