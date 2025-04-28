// app.js

document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');
    const feedbackContainer = document.getElementById('feedback-container');
    const nextButton = document.getElementById('next-button');
    const progressSpan = document.getElementById('current-question');

    // Estado del juego
    let currentQuestionIndex = 0;
    const totalQuestions = 10;
    let correctCount = 0;
    const questionTimes = [];

    // Para medir el tiempo de respuesta
    let questionStartTime;

    // Carga y muestra la siguiente pregunta
    async function loadQuestion() {
        resetState();
        // Si se acabaron las preguntas, muestro resumen
        if (currentQuestionIndex >= totalQuestions) {
            return showSummary();
        }

        progressSpan.textContent = currentQuestionIndex + 1;

        try {
            // GET /api/question → { type, question, options, correctAnswer, flag } :contentReference[oaicite:0]{index=0}&#8203;:contentReference[oaicite:1]{index=1} :contentReference[oaicite:2]{index=2}&#8203;:contentReference[oaicite:3]{index=3}
            const res = await fetch('/api/question');
            const q = await res.json();

            renderQuestion(q);
            questionStartTime = Date.now();
        } catch (err) {
            questionContainer.textContent = 'Error al cargar la pregunta.';
            console.error(err);
        }
    }

    // Pinta la pregunta y las 4 opciones
    function renderQuestion(q) {
        // Pregunta: texto o imagen
        if (q.type === 'flag') {
            // Imagen de la bandera :contentReference[oaicite:4]{index=4}&#8203;:contentReference[oaicite:5]{index=5}
            questionContainer.innerHTML = `<img src="${q.flag.svg}" alt="Bandera" />`;
        } else {
            // Reemplazo **algo** por <strong>algo</strong> si viene con markdown :contentReference[oaicite:6]{index=6}&#8203;:contentReference[oaicite:7]{index=7}
            const html = q.question.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            questionContainer.innerHTML = `<p>${html}</p>`;
        }

        // Opciones
        optionsContainer.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option';
            btn.dataset.value = opt.value;
            btn.textContent = opt.label;
            btn.addEventListener('click', () => selectOption(btn, q));
            optionsContainer.appendChild(btn);
        });
    }

    // Al hacer click en una opción
    function selectOption(btn, q) {
        // Evito doble click
        if (!nextButton.disabled) return;

        const selected = btn.dataset.value;
        const correct = String(q.correctAnswer);
        const timeTaken = Date.now() - questionStartTime;
        questionTimes.push(timeTaken);

        // Marco aciertos/errores y muestro feedback
        if (selected === correct) {
            correctCount++;
            btn.classList.add('correct');
            feedbackContainer.textContent = '¡Correcto!';
        } else {
            btn.classList.add('incorrect');
            // señalo también la respuesta correcta
            document.querySelectorAll('.option').forEach(b => {
                if (b.dataset.value === correct) {
                    b.classList.add('correct');
                }
            });
            feedbackContainer.textContent = `Incorrecto. La respuesta era: ${q.correctAnswer}`;
        }

        feedbackContainer.classList.remove('hidden');
        nextButton.disabled = false;
    }

    // Limpia estados de botón y feedback
    function resetState() {
        feedbackContainer.classList.add('hidden');
        feedbackContainer.textContent = '';
        nextButton.disabled = true;
        // Limpio clases de opciones anteriores
        document.querySelectorAll('.option').forEach(b => {
            b.classList.remove('correct', 'incorrect');
        });
    }

    // Al hacer click en “Siguiente”
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        loadQuestion();
    });

    // Muestra el resumen final en el contenedor
    function showSummary() {
        const totalTime = questionTimes.reduce((a, b) => a + b, 0);
        const avgTime = Math.round(totalTime / questionTimes.length);
        const incorrect = totalQuestions - correctCount;

        questionContainer.innerHTML = `
        <h2>Resumen de la partida</h2>
        <p>Correctas: ${correctCount}</p>
        <p>Incorrectas: ${incorrect}</p>
        <p>Tiempo total: ${Math.round(totalTime / 1000)} seg.</p>
        <p>Tiempo promedio por pregunta: ${Math.round(avgTime / 1000)} seg.</p>
      `;
        optionsContainer.innerHTML = '';
        feedbackContainer.classList.add('hidden');
        nextButton.style.display = 'none';
        progressSpan.parentElement.style.display = 'none';
    }

    // Inicio del juego
    loadQuestion();
});
