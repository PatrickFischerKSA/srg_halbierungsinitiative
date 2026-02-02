const answers = {};

function checkAnswer(id, correct) {
  const input = document.getElementById(id);
  const feedback = document.getElementById(id + "-fb");

  if (input.value.trim() == correct) {
    feedback.innerText = "✅ Richtig!";
    answers[id] = true;
  } else {
    feedback.innerText = "❌ Falsch – versuche es erneut.";
    answers[id] = false;
  }
  updateProgress();
}

function updateProgress() {
  const total = 5; // Anzahl der Aufgaben
  const correct = Object.values(answers).filter(v => v).length;
  const percent = Math.round((correct / total) * 100);
  document.getElementById("progress").innerText = percent + "%";
}