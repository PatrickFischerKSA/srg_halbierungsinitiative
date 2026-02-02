// ===============================
// ÄNDERUNGSPROTOKOLL V2
// - Speichert alle Antworten in localStorage
// - Fortschritt über alle Aufgaben hinweg
// - Übergibt Antworten an PDF-Seite
// ===============================

const ANSWER_KEYS = [
  "q1","q2","q3","q4","q5","q6","q7","q8","q9","q10","q11","q12","q13","q14","q15"
];

function saveAnswer(id, value){
  const data = JSON.parse(localStorage.getItem("srg_answers") || "{}");
  data[id] = value;
  localStorage.setItem("srg_answers", JSON.stringify(data));
  updateProgress();
}

function loadAnswer(id){
  const data = JSON.parse(localStorage.getItem("srg_answers") || "{}");
  return data[id] || "";
}

function checkAnswer(id, correct){
  const input = document.getElementById(id);
  const fb = document.getElementById(id + "-fb");
  if(input.value.trim() === correct){
    fb.innerText = "✅ Richtig.";
    saveAnswer(id, input.value.trim());
  } else {
    fb.innerText = "❌ Falsch. Richtige Antwort: " + correct;
    saveAnswer(id, input.value.trim() + " (falsch)");
  }
}

function updateProgress(){
  const data = JSON.parse(localStorage.getItem("srg_answers") || "{}");
  let filled = 0;
  ANSWER_KEYS.forEach(k => { if(data[k]) filled++; });
  const percent = Math.round((filled / ANSWER_KEYS.length) * 100);
  document.getElementById("progress").innerText = percent + "%";
}

window.addEventListener("load", () => {
  ANSWER_KEYS.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value = loadAnswer(id);
  });
  updateProgress();
});