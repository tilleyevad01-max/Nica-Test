document.addEventListener("DOMContentLoaded", () => {

let questions = [];
let current = 0;
let correct = 0;
let wrong = 0;
let skipped = 0;

const startBtn = document.getElementById("startBtn");
const skipBtn = document.getElementById("skipBtn");

startBtn.onclick = () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("DOCX fayl tanlang");

  mammoth.extractRawText({ arrayBuffer: file })
    .then(res => parse(res.value));
};

function parse(text) {
  let q = null;
  questions = [];

  text.split("\n").forEach(line => {
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

  show();
}

function show() {
  if (current >= questions.length) return finish();

  const q = questions[current];
  document.getElementById("question").innerText = q.question;
  const box = document.getElementById("answers");
  box.innerHTML = "";

  q.answers.forEach(a => {
    const b = document.createElement("button");
    b.textContent = a;
    b.onclick = () => {
      if (a === q.correct) correct++;
      else wrong++;
      current++;
      show();
    };
    box.appendChild(b);
  });
}

skipBtn.onclick = () => {
  skipped++;
  current++;
  show();
};

function finish() {
  document.getElementById("test").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("stats").innerText =
    `To‘g‘ri: ${correct}, Noto‘g‘ri: ${wrong}, Tashlab ketilgan: ${skipped}`;
}

});
