// public/app.js



document.addEventListener('DOMContentLoaded', async () => {
    // Referencias al DOM
    const questionContainer = document.getElementById('question-container');
    const optionsContainer  = document.getElementById('options-container');
    const feedbackContainer = document.getElementById('feedback-container');
    const nextButton        = document.getElementById('next-button');
    const progressSpan      = document.getElementById('current-question');
  
    // Estado
    let currentQuestionIndex = 0;
    let correctCount         = 0;
    const questionTimes      = [];
  
    // 1 sola llamada para traer N preguntas
    const res = await fetch('/api/question/batch?count=10');
    const questions = await res.json(); // array de 10 preguntas
  
    // Iniciar timer
    let questionStartTime;
  
    // Carga y muestra la pregunta i
    function loadQuestion(i) {
      resetState();
      progressSpan.textContent = i + 1;
      const q = questions[i];
  
      // Render de la pregunta
      if (q.type === 'flag') {
        questionContainer.innerHTML = `<img src="${q.flag.svg}" alt="Bandera" />`;
      } else {
        const html = q.question.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        questionContainer.innerHTML = `<p>${html}</p>`;
      }
  
      // Render de opciones
      optionsContainer.innerHTML = '';
      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className       = 'option';
        btn.dataset.value   = opt.value;
        btn.textContent     = opt.label;
        btn.addEventListener('click', () => selectOption(btn, q));
        optionsContainer.appendChild(btn);
      });
  
      questionStartTime = Date.now();
    }
  
    // Selección de respuesta
    function selectOption(btn, q) {
      if (!nextButton.disabled) return; // ya respondido
  
      const selected   = btn.dataset.value;
      const correct    = String(q.correctAnswer);
      const elapsed    = Date.now() - questionStartTime;
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
        feedbackContainer.textContent =
          `Incorrecto. La respuesta era: ${q.correctAnswer}`;
      }
  
      feedbackContainer.classList.remove('hidden');
      nextButton.disabled = false;
    }
  
    // Limpia feedback y clases
    function resetState() {
      feedbackContainer.classList.add('hidden');
      feedbackContainer.textContent = '';
      nextButton.disabled = true;
      document.querySelectorAll('.option').forEach(b =>
        b.classList.remove('correct', 'incorrect')
      );
    }
  
    // Al hacer click en “Siguiente pregunta”
    nextButton.addEventListener('click', () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
      } else {
        showSummary();
      }
    });
  
    // Mostrar resumen final
    function showSummary() {
        questionTimes.forEach((item)=> {
            console.log(item);
        })
      const totalTime = questionTimes.reduce((a, b) => a + b, 0);
      const avgTime   = Math.round(totalTime / questionTimes.length);
      const incorrect = questions.length - correctCount;
  
      questionContainer.innerHTML = `
        <h2>Resumen de la partida</h2>
        <p>Correctas: ${correctCount}</p>
        <p>Incorrectas: ${incorrect}</p>
        <p>Tiempo total: ${Math.round(totalTime/1000)} seg.</p>
        <p>Tiempo promedio: ${Math.round(avgTime/1000)} seg.</p>
      `;
      optionsContainer.innerHTML = '';
      feedbackContainer.classList.add('hidden');
      nextButton.style.display = 'none';
      progressSpan.parentElement.style.display = 'none';
    }
  
    // Arranco con la primera
    loadQuestion(0);
  });
  