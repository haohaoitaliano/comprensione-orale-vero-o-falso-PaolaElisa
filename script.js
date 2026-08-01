const correctAnswers = {
  1: false,
  2: true,
  3: false,
  4: true,
  5: false,
  6: true,
  7: false,
  8: true,
};

const questions = [
  {
    id: 1,
    text: "Paola dice subito a Elisa di sapere del litigio con Michele.",
    explanationIt:
      "Paola non dice subito di sapere del litigio. Fa finta di averlo capito per intuizione.",
    explanationZh: "Paola一开始没有直接说自己知道两人吵架了，而是假装是自己猜到的。",
  },
  {
    id: 2,
    text: "Paola propone a Elisa di mangiare insieme alla Locanda Imperfetta.",
    explanationIt: "Paola propone a Elisa di mangiare insieme alla Locanda Imperfetta.",
    explanationZh: "Paola提议和Elisa一起去Locanda Imperfetta吃饭。",
  },
  {
    id: 3,
    text: "Quando arriva al ristorante, Elisa incontra Paola.",
    explanationIt: "Al ristorante Elisa incontra Michele, non Paola.",
    explanationZh: "Elisa在餐厅遇到的是Michele，不是Paola。",
  },
  {
    id: 4,
    text: "Michele ha spento il telefono per passare una serata con Elisa.",
    explanationIt: "Michele spegne il telefono e promette di dedicare la serata a Elisa.",
    explanationZh: "Michele关掉了手机，并答应把这个晚上留给Elisa。",
  },
  {
    id: 5,
    text: "Lucia dice che nel ristorante ci sono ancora alcuni tavoli liberi.",
    explanationIt: "Lucia dice che il ristorante è al completo e che non ci sono tavoli liberi.",
    explanationZh: "Lucia说餐厅已经客满，没有空桌。",
  },
  {
    id: 6,
    text: "All’inizio Lucia non trova la prenotazione di Michele.",
    explanationIt: "All’inizio Lucia non vede il nome di Michele tra le prenotazioni.",
    explanationZh: "一开始Lucia没有在预订名单中看到Michele的名字。",
  },
  {
    id: 7,
    text: "Michele ha prenotato in un altro ristorante con lo stesso nome.",
    explanationIt:
      "Michele non ha prenotato in un altro ristorante. Alla fine Lucia trova la sua prenotazione.",
    explanationZh: "Michele并没有订错餐厅，最后Lucia找到了他的预订。",
  },
  {
    id: 8,
    text: "Alla fine Lucia trova la prenotazione e li fa accomodare.",
    explanationIt:
      "Alla fine Lucia trova la prenotazione e invita Michele ed Elisa ad accomodarsi.",
    explanationZh: "最后Lucia找到了预订，并请Michele和Elisa入座。",
  },
];

const answers = {};
const questionsContainer = document.querySelector("#questions");
const progress = document.querySelector("#progress");
const checkButton = document.querySelector("#check-button");
const results = document.querySelector("#results");
const feedback = document.querySelector("#feedback");
const retryButton = document.querySelector("#retry-button");
const audio = document.querySelector("#dialogue-audio");

function answerLabel(value) {
  return value ? "Vero" : "Falso";
}

function renderQuestions() {
  questionsContainer.innerHTML = questions
    .map(
      (question) => `
        <article class="question-card" aria-labelledby="question-${question.id}">
          <span class="question-number" aria-hidden="true">${question.id}</span>
          <p class="question-text" id="question-${question.id}">${question.text}</p>
          <div class="answer-buttons" role="group" aria-label="Risposta alla domanda ${question.id}">
            <button class="answer-button" type="button" data-question="${question.id}" data-answer="true" aria-pressed="false">Vero</button>
            <button class="answer-button" type="button" data-question="${question.id}" data-answer="false" aria-pressed="false">Falso</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function updateProgress() {
  const answered = Object.keys(answers).length;
  progress.textContent = `${answered} di ${questions.length} ${answered === 1 ? "risposta" : "risposte"}`;
}

function selectAnswer(button) {
  const questionId = Number(button.dataset.question);
  const answer = button.dataset.answer === "true";
  answers[questionId] = answer;

  const group = button.closest(".answer-buttons");
  group.querySelectorAll(".answer-button").forEach((option) => {
    option.setAttribute("aria-pressed", String(option === button));
  });

  updateProgress();
}

function buildFeedback(question, selectedAnswer) {
  const isUnanswered = typeof selectedAnswer === "undefined";
  const isCorrect = !isUnanswered && selectedAnswer === correctAnswers[question.id];
  const stateClass = isUnanswered ? "unanswered" : isCorrect ? "correct" : "wrong";
  const status = isUnanswered
    ? "✗ Non hai risposto"
    : isCorrect
      ? "✓ Corretto"
      : "✗ Risposta errata";

  const selectedLine = isUnanswered
    ? ""
    : `<p class="feedback-answer">La tua risposta: <strong>${answerLabel(selectedAnswer)}</strong></p>`;
  const correctLine = isCorrect
    ? ""
    : `<p class="feedback-answer">Risposta corretta: <strong>${answerLabel(correctAnswers[question.id])}</strong></p>`;

  return `
    <article class="feedback-card ${stateClass}">
      <p class="feedback-status">${status}</p>
      <p class="feedback-question">${question.id}. ${question.text}</p>
      ${selectedLine}
      ${correctLine}
      <div class="explanation">
        <p><strong>Spiegazione:</strong> ${question.explanationIt}</p>
        <p lang="zh-CN"><strong>解释：</strong>${question.explanationZh}</p>
      </div>
    </article>
  `;
}

function checkAnswers() {
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  questions.forEach((question) => {
    const selectedAnswer = answers[question.id];
    if (typeof selectedAnswer === "undefined") {
      unanswered += 1;
    } else if (selectedAnswer === correctAnswers[question.id]) {
      correct += 1;
    } else {
      wrong += 1;
    }
  });

  document.querySelector("#score").textContent = `${correct} / ${questions.length}`;
  document.querySelector("#correct-count").textContent = correct;
  document.querySelector("#wrong-count").textContent = wrong;
  document.querySelector("#unanswered-count").textContent = unanswered;
  feedback.innerHTML = questions.map((question) => buildFeedback(question, answers[question.id])).join("");
  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetQuiz() {
  Object.keys(answers).forEach((key) => delete answers[key]);
  questionsContainer.querySelectorAll(".answer-button").forEach((button) => {
    button.setAttribute("aria-pressed", "false");
  });
  progress.textContent = `0 di ${questions.length} risposte`;
  feedback.innerHTML = "";
  results.hidden = true;
  audio.pause();
  audio.currentTime = 0;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

renderQuestions();
updateProgress();

questionsContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".answer-button");
  if (button) selectAnswer(button);
});

checkButton.addEventListener("click", checkAnswers);
retryButton.addEventListener("click", resetQuiz);

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") event.preventDefault();
});
