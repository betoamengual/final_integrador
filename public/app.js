// public/app.js

document.addEventListener('DOMContentLoaded', async () => {
  // ────────────── Referencias al DOM ──────────────
  const questionContainer = document.getElementById('question-container');
  const optionsContainer  = document.getElementById('options-container');
  const feedbackContainer = document.getElementById('feedback-container');
  const nextButton        = document.getElementById('next-button');
  const progressSpan      = document.getElementById('current-question');

  // Referencias para nombre, ranking y reinicio
  const nameInput     = document.getElementById('player-name');
  const rankingButton = document.getElementById('btn-ranking');
  const rankingTable  = document.getElementById('table-ranking');
  const restartButton = document.getElementById('btn-restart');

  // ─────────────── Estado del juego ────────────────
  let currentQuestionIndex = 0;
  let correctCount         = 0;
  const questionTimes      = [];

  // ─── 1 sola llamada para traer N=10 preguntas ───
  const res = await fetch('/api/question/batch?count=10');
  const questions = await res.json();

  // Temporizador de cada pregunta
  let questionStartTime;

  // ────────── Función que carga y muestra la pregunta i ──────────
  function loadQuestion(i) {
    resetState();
    progressSpan.textContent = i + 1;
    const q = questions[i];

    // Mostrar texto o imagen de bandera
    if (q.type === 'flag') {
      questionContainer.innerHTML = `<img src="${q.flag.svg}" alt="Bandera" />`;
    } else {
      const html = q.question.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      questionContainer.innerHTML = `<p>${html}</p>`;
    }

    // Mostrar opciones
    optionsContainer.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className     = 'option';
      btn.dataset.value = opt.value;
      btn.textContent   = opt.label;
      btn.addEventListener('click', () => selectOption(btn, q));
      optionsContainer.appendChild(btn);
    });

    // Iniciar el cronómetro
    questionStartTime = Date.now();
  }

  // ────────── Gestión de selección de respuesta ──────────
  function selectOption(btn, q) {
    if (!nextButton.disabled) return; // ya contestó

    const selected = btn.dataset.value;
    const correct  = String(q.correctAnswer);
    const elapsed  = Date.now() - questionStartTime;
    questionTimes.push(elapsed);

    if (selected === correct) {
      correctCount++;
      btn.classList.add('correct');
      feedbackContainer.textContent = '¡Correcto!';
    } else {
      btn.classList.add('incorrect');
      // resaltar la correcta
      document.querySelectorAll('.option').forEach(b => {
        if (b.dataset.value === correct) b.classList.add('correct');
      });
      feedbackContainer.textContent = `Incorrecto. La respuesta era: ${q.correctAnswer}`;
    }

    feedbackContainer.classList.remove('hidden');
    nextButton.disabled = false;
  }

  // ────────── Limpia feedback y estado ──────────
  function resetState() {
    feedbackContainer.classList.add('hidden');
    feedbackContainer.textContent = '';
    nextButton.disabled = true;
    document.querySelectorAll('.option').forEach(b =>
      b.classList.remove('correct', 'incorrect')
    );
  }

  // ────────── Evento “Siguiente” ──────────
  nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion(currentQuestionIndex);
    } else {
      showSummary();
    }
  });

  // ────────── Mostrar resumen y enviar score ──────────
  async function showSummary() {
    // Cálculos de tiempo y aciertos
    const totalTimeMs = questionTimes.reduce((a, b) => a + b, 0);
    const avgTimeMs   = Math.round(totalTimeMs / questionTimes.length);
    const incorrect   = questions.length - correctCount;

    // Ocultar setup de nombre y elementos de juego
    document.getElementById('setup-container').style.display = 'none';
    nextButton.style.display = 'none';
    progressSpan.parentElement.style.display = 'none';

    // Mostrar el resumen
    questionContainer.innerHTML = `
      <h2>Resumen de la partida</h2>
      <p>Correctas: ${correctCount}</p>
      <p>Incorrectas: ${incorrect}</p>
      <p>Tiempo total: ${Math.round(totalTimeMs/1000)} seg.</p>
      <p>Tiempo promedio: ${Math.round(avgTimeMs/1000)} seg.</p>
    `;
    optionsContainer.innerHTML = '';
    feedbackContainer.classList.add('hidden');

    // Enviar resultado
    const username  = nameInput.value.trim();
    const totalTime = Math.round(totalTimeMs / 1000);
    if (!username) {
      alert('Por favor ingresá tu nombre antes de jugar.');
      return;
    }

    try {
      const resp = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, correctCount, totalTime })
      });
      const { totalUsers } = await resp.json();

      // Mostrar botón de ranking
      if (totalUsers >= 20) {
        rankingButton.style.display = 'inline-block';
      }
      // Mostrar botón de reinicio
      restartButton.style.display = 'inline-block';

    } catch (err) {
      console.error('Error enviando score:', err);
    }
  }

  // ────────── Ver ranking ──────────
  rankingButton.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/ranking');
      const lista = await res.json();
      let html = `
        <tr><th>Pos.</th><th>Usuario</th><th>Aciertos</th><th>Tiempo (s)</th></tr>`;
      lista.forEach((item, i) => {
        html += `
          <tr>
            <td>${i + 1}</td>
            <td>${item.username}</td>
            <td>${item.correctCount}</td>
            <td>${item.totalTime}</td>
          </tr>`;
      });
      rankingTable.innerHTML = html;
    } catch (err) {
      console.error('Error obteniendo ranking:', err);
    }
  });

  // ────────── Reiniciar juego ──────────
  restartButton.addEventListener('click', () => {
    window.location.reload();
  });

  // ────────── Iniciar ──────────
  loadQuestion(0);
});
