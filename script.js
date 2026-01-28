let questions = [];
let currentIndex = 0;
let userAnswers = [];
let wrongAnswers = [];

const fileInput = document.getElementById("docx-file");
const startBtn = document.getElementById("start-btn");
const quizSection = document.getElementById("quiz-section");
const questionContainer = document.getElementById("question-container");
const nextBtn = document.getElementById("next-btn");
const resultSection = document.getElementById("result-section");
const summary = document.getElementById("summary");
const wrongDiv = document.getElementById("wrong-answers");
const retryBtn = document.getElementById("retry-btn");
const exitBtn = document.getElementById("exit-btn");

// DOCX faylni o‘qish
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  mammoth.extractRawText({ arrayBuffer: file.arrayBuffer() }).then(result => {
    parseQuestions(result.value);
    if (questions.length > 0) startBtn.disabled = false;
  }).catch(err => {
    alert("Faylni o‘qib bo‘lmadi: " + err);
  });
});

// Savollarni tahlil qilish
function parseQuestions(text) {
  questions = [];
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
  let currentQ = null;

  lines.forEach(line => {
    if (line.startsWith("#")) {
      if (currentQ) questions.push(currentQ);
      currentQ = { question: line.substring(1).trim(), options: [], correct: "" };
    } else if (line.startsWith("+")) {
      const ans = line.substring(1).trim();
      currentQ.correct = ans;
      currentQ.options.push(ans);
    } else {
      currentQ.options.push(line.trim());
    }
  });
  if (currentQ) questions.push(currentQ);

  // Random variantlarni aralashtirish
  questions.forEach(q => {
    q.options = shuffleArray(q.options);
  });
}

// Start test
startBtn.addEventListener("click", () => {
  document.getElementById("file-section").classList.add("hidden");
  quizSection.classList.remove("hidden");
  currentIndex = 0;
  userAnswers = [];
  wrongAnswers = [];
  showQuestion();
});

function showQuestion() {
  const q = questions[currentIndex];
  questionContainer.innerHTML = `<h3>${q.question}</h3>`;
  q.options.forEach((opt, i) => {
    const optionHTML = `<label class="option">
      <input type="radio" name="option" value="${opt}"> ${opt}
    </label>`;
    questionContainer.innerHTML += optionHTML;
  });
}

// Keyingi tugma
nextBtn.addEventListener("click", () => {
  const selected = document.querySelector('input[name="option"]:checked');
  if (!selected) {
    alert("Iltimos javob tanlang!");
    return;
  }
  const answer = selected.value;
  userAnswers.push(answer);

  const correct = questions[currentIndex].correct;
  if (answer !== correct) {
    wrongAnswers.push({
      question: questions[currentIndex].question,
      yourAnswer: answer,
      correctAnswer: correct
    });
  }

  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

// Natijani ko‘rsatish
function showResult() {
  quizSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
  summary.textContent = `To‘g‘ri javoblar: ${questions.length - wrongAnswers.length}, Xato javoblar: ${wrongAnswers.length}`;

  wrongDiv.innerHTML = "";
  if (wrongAnswers.length > 0) {
    wrongAnswers.forEach(w => {
      wrongDiv.innerHTML += `<p><strong>Savol:</strong> ${w.question}<br>
                             <strong>Sizning javobingiz:</strong> ${w.yourAnswer}<br>
                             <strong>To‘g‘ri javob:</strong> ${w.correctAnswer}</p>`;
    });
  }
}

// Qayta ishlash va chiqish
retryBtn.addEventListener("click", () => {
  resultSection.classList.add("hidden");
  fileInput.value = "";
  startBtn.disabled = true;
  document.getElementById("file-section").classList.remove("hidden");
});

exitBtn.addEventListener("click", () => {
  location.reload();
});

// Helper: array aralashtirish
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
    }
