document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const skipBtn = document.getElementById("skipBtn");
  const home = document.getElementById("home");
  const test = document.getElementById("test");

  startBtn.onclick = () => {
    alert("JS ishlayapti! Fayl tanlang va test boshlanadi.");
    home.style.display = "none";
    test.style.display = "block";
  };
});
