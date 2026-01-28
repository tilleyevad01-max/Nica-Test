document.addEventListener("DOMContentLoaded", () => {

let questions = [];
let current = 0;
let correct = 0;
let wrong = 0;
let skipped = 0;
let wrongDetails = [];

const startBtn = document.getElementById("startBtn");
const skipBtn = document.getElementById("skipBtn");
const restartBtn = document.getElementById("restartBtn");
const exitBtn = document.getElementById("exitBtn");

startBtn.onclick = () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Fayl tanlang (txt yoki docx formatida)");

  const reader = new FileReader();
  reader.onload = e => parseText(e.target.result);
  reader.readAsText(file);
};

function parseText(text) {
  const lines = text.split("\n");
  let q = null;
  questions = [];

  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith("#")) {
      if (q) questions.push(q);
      q = { question: line.slice(1), answers: [], correct: "" };
    } else if (line.startsWith("+")) {
      q.correct = line.slice(1);
      q.answers.push(line.slice(1));
    } else if (line && q) {
      q.answers.push(line);
    }
  });
  if (q) questions.push(q);

  questions.forEach(q => q.answers.sort(() => Math.random() - 0.5));
  questions.sort(() => Math.random() - 0.5);

  document.getElementById("home").style.display = "none";
  document.getElementById("test").style.display = "block";

  showQuestion();
}

function showQuestion() {
  if (current >= questions.length) return finishTest();

  const q = questions[current];
  document.getElementById("question").innerText = q.question;
  const box = document.getElementById("answers");
  box.innerHTML = "";

  q.answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = () => {
      if (ans === q.correct) correct++;
      else {
        wrong++;
        wrongDetails.push({question: q.question, correct: q.correct, yourAnswer: ans});
      }
      current++;
      showQuestion();
    };
    box.appendChild(btn);
  });
}

skipBtn.onclick = () => {
  skipped++;
  wrongDetails.push({
    question: questions[current].question,
    correct: questions[current].correct,
    yourAnswer: "Tashlab ketilgan"
  });
  current++;
  showQuestion();
};

function finishTest() {
  document.getElementById("test").style.display = "none";
  document.getElementById("result").style.display = "block";

  document.getElementById("stats").innerText =
    `To‘g‘ri: ${correct}, Noto‘g‘ri: ${wrong}, Tashlab ketilgan: ${skipped}`;

  const wrongBox = document.getElementById("wrongList");
  wrongBox.innerHTML = "<h4>Xato qilgan savollar va javoblar:</h4>";
  wrongDetails.forEach(item => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>Savol:</strong> ${item.question}<br>
                   <strong>To'g'ri javob:</strong> ${item.correct}<br>
                   <strong>Sizning javobingiz:</strong> ${item.yourAnswer}`;
    wrongBox.appendChild(p);
  });
}

restartBtn.onclick = () => location.reload();
exitBtn.onclick = () => {
  document.getElementById("result").style.display = "none";
  document.getElementById("home").style.display = "block";
  current = 0; correct = 0; wrong = 0; skipped = 0; wrongDetails = [];
};

});
