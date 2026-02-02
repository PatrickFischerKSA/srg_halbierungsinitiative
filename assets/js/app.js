/* =========================================================
   SRG-HALBIERUNGSINITIATIVE – INTERAKTIVE LERNEINHEIT (V3)
   ARBEITSMODUS – VERBINDLICH (umgesetzt):
   - Keine Platzhalter
   - Keine ausgelassenen Teile
   - Vollständige Dateien
   - Jede Änderung explizit markiert

   ÄNDERUNGSPROTOKOLL V3
   - Datengetriebenes Aufgaben-System (MC Single/Multi + Offen)
   - Schwierigkeit hoch: Argumentationslogik, Transfer, Quellenkritik
   - Gamification: XP, Levels, Badge, Abschluss mit Exportpflicht
   - PDF-Export: vollständige Antworten + Score + Badge + Metadaten
   ========================================================= */

const STORAGE_KEY = "srg_v3_state";

const STATE_DEFAULT = {
  meta: {
    name: "",
    klasse: "",
    createdAt: new Date().toISOString()
  },
  currentLevel: 0,
  xp: 0,
  earnedBadge: false,
  exportedOnce: false,
  answers: {},        // id -> answer payload (string|array)
  results: {},        // id -> {complete:bool, correct:bool|null, xp:int, ts:iso}
};

const XP_RULES = {
  mc_single: { correct: 12, wrong: 2, complete: 2 },
  mc_multi:  { correct: 16, wrong: 3, complete: 3 },
  open:      { complete: 10 },
  open_short:{ complete: 6 },
};

// ------------------------
// AUFGABENSET (V3)
// ------------------------
const LEVELS = [
  {
    title: "Level 1 – Orientierung & Begriffe",
    desc: "Du baust die Grundlagen auf: Vorlage, Begriffe, wofür die Abstimmung steht. Fokus: korrekt unterscheiden, nicht verwechseln.",
    tasks: [
      {
        id:"L1_T1",
        type:"mc_single",
        pointsTag:"12 XP",
        prompt:"Die Initiative «200 Franken sind genug!» verlangt …",
        options:[
          "die vollständige Abschaffung der SRG",
          "eine Senkung der Haushaltsabgabe auf maximal 200 Franken und die Befreiung der Unternehmen",
          "eine Erhöhung der Haushaltsabgabe, um Regionalmedien zu stärken",
          "nur eine Reform des Sportangebots der SRG"
        ],
        correct:[1],
        explainCorrect:"Kern der Initiative: Haushalt max. 200 CHF + Unternehmensabgabe entfällt.",
        explainWrong:"Achtung: Die Initiative will nicht die SRG abschaffen, sondern die Abgabe reduzieren und Unternehmen befreien."
      },
      {
        id:"L1_T2",
        type:"mc_multi",
        pointsTag:"16 XP",
        prompt:"Welche Aussagen passen zum Gegenprojekt des Bundesrats (Verordnungsweg)? (Mehrfachauswahl)",
        options:[
          "Haushaltabgabe sinkt bis 2029 auf 300 CHF.",
          "Unternehmen zahlen ab 2027 erst ab 1,2 Mio Umsatz; nur noch ca. 20% der MWST-pflichtigen Unternehmen zahlen.",
          "Unternehmensabgabe wird vollständig abgeschafft.",
          "SRG-Budget wird bis 2029 um rund 17% reduziert; ca. 900 Vollzeitstellen fallen weg."
        ],
        correct:[0,1,3],
        explainCorrect:"Gegenprojekt: moderate Senkung + Entlastung vieler Unternehmen + Sparauftrag an SRG.",
        explainWrong:"Nicht verwechseln: vollständige Abschaffung der Unternehmensabgabe wäre die Initiative, nicht das Gegenprojekt."
      },
      {
        id:"L1_T3",
        type:"open_short",
        pointsTag:"6 XP",
        prompt:"In 2–3 Sätzen: Was ist der Unterschied zwischen *Initiative* und *Gegenprojekt*? (Inhalt + Instrument)",
        minChars: 160,
        hint:"Instrument: Initiative = Verfassungsänderung durch Volksabstimmung; Gegenprojekt = Anpassung RTVV/Konzession durch Bundesrat."
      }
    ]
  },
  {
    title: "Level 2 – Zahlen clever nutzen (nicht nur auswendig)",
    desc: "Du arbeitest mit Zahlen, aber in Argumentationslogik: Rechnen, einordnen, Konsequenzen skizzieren.",
    tasks: [
      {
        id:"L2_T1",
        type:"mc_single",
        pointsTag:"12 XP",
        prompt:"Ein Haushalt spart bei Annahme der Initiative gegenüber heute (335 CHF) …",
        options:[
          "35 CHF",
          "100 CHF",
          "135 CHF",
          "200 CHF"
        ],
        correct:[2],
        explainCorrect:"335 – 200 = 135 CHF/Jahr.",
        explainWrong:"Rechne: 335 minus 200."
      },
      {
        id:"L2_T2",
        type:"mc_single",
        pointsTag:"12 XP",
        prompt:"Warum ist die Zahl «200 CHF» politisch *kommunikativ* stark? (Bestes Argument auswählen)",
        options:[
          "Weil runde Zahlen einfacher zu merken sind und sich als Slogan eignen.",
          "Weil 200 CHF exakt dem SRG-Budget von 2026 entspricht.",
          "Weil 200 CHF garantiert ohne Einschnitte möglich sind.",
          "Weil 200 CHF die Kosten für Sportrechte halbiert."
        ],
        correct:[0],
        explainCorrect:"Kommunikativ: einprägsam, slogan-tauglich, leicht vergleichbar.",
        explainWrong:"Die 200 CHF sind keine Budget-Garantie und entsprechen nicht «exakt» einem Budget."
      },
      {
        id:"L2_T3",
        type:"mc_multi",
        pointsTag:"16 XP",
        prompt:"Welche Faktoren erschweren internationale Gebührenvergleiche (CH vs. andere Länder)? (Mehrfachauswahl)",
        options:[
          "Mehrsprachigkeit/Sprachregionen",
          "Unterschiedliches Lohnniveau und Preisniveau",
          "Grösse des Werbemarkts",
          "Ob ein Land Berge hat"
        ],
        correct:[0,1,2],
        explainCorrect:"Vergleiche sind heikel: Struktur, Lohnniveau, Werbemarkt, Sprachen.",
        explainWrong:"Topografie (Berge) ist nicht der zentrale Medienfinanzierungsfaktor."
      },
      {
        id:"L2_T4",
        type:"open",
        pointsTag:"10 XP",
        prompt:"Transfer: Stelle ein **starkes Pro-Argument** und ein **starkes Contra-Argument** so dar, dass beide fair sind. Nutze mind. 2 Zahlen (z.B. 135 CHF, 630 Mio, 17%, 900 Stellen).",
        minChars: 420,
        hint:"Pro: Entlastung / Effizienz / Legitimität. Contra: Service Public / Regionen / Qualität / Jobs / Wertschöpfung."
      }
    ]
  },
  {
    title: "Level 3 – Video-Dossier (6 Clips) & Quellenkritik",
    desc: "Du arbeitest mit den Videoclips als Quellen: Wer spricht? Welche Absicht? Welche Argumentationsstrategie?",
    tasks: [
      {
        id:"L3_T0",
        type:"open_short",
        pointsTag:"6 XP",
        prompt:"Bevor du startest: Notiere deine *Arbeitshypothese* (1 Satz): Worauf wird diese Abstimmung deiner Meinung nach hinauslaufen?",
        minChars: 120,
        hint:"Hypothese = vorläufige Annahme, die du später mit Quellen prüfst."
      },
      {
        id:"L3_T1",
        type:"open",
        pointsTag:"10 XP",
        prompt:"Clip 1 (Einführung) – Schreibe 4 präzise Stichpunkte: Was sind die *Kernforderungen* der Initiative und was wären *direkte* Folgen für die Finanzierung?",
        minChars: 380,
        hint:"Stichworte: Haushalt 200, Unternehmen 0, SRG-Mittel, Service-Public-Definition."
      },
      {
        id:"L3_T2",
        type:"mc_single",
        pointsTag:"12 XP",
        prompt:"Was ist ein typischer Unterschied zwischen einer Bundesratsansprache und einem Kampagnenvideo?",
        options:[
          "Bundesratsansprachen dürfen keine Zahlen nennen.",
          "Kampagnenvideos sind meist stärker wertend/überzeugend; Bundesratsansprachen versuchen formell zu erklären und zu begründen.",
          "Kampagnenvideos müssen neutral sein, Bundesratsansprachen nicht.",
          "Beide sind identisch, nur Länge ist anders."
        ],
        correct:[1],
        explainCorrect:"Formate unterscheiden sich in Ziel/Adressaten/Neutralitätsanspruch.",
        explainWrong:"Neutralität und Überzeugungsabsicht sind nicht identisch verteilt."
      },
      {
        id:"L3_T3",
        type:"open",
        pointsTag:"10 XP",
        prompt:"Clip 2 («Warum Zeki irrt») – Fasse die Argumentationskette in 5–7 Sätzen zusammen: *Behauptung → Begründung → Beispiel/Zahl → Schluss.*",
        minChars: 520,
        hint:"Achte auf logische Sprünge: Ist die Schlussfolgerung zwingend oder nur plausibel?"
      },
      {
        id:"L3_T4",
        type:"open",
        pointsTag:"10 XP",
        prompt:"Clip 3 (SERAFE & Löhne) – Analysiere: Welche Rolle spielt hier das Thema «Löhne» im Abstimmungskampf? (Ablenkung? Legitimität? Vertrauensfrage?)",
        minChars: 520,
        hint:"Unterscheide: Empörung/Emotion vs. strukturelle Budgetlogik."
      },
      {
        id:"L3_T5",
        type:"open",
        pointsTag:"10 XP",
        prompt:"Clips 4–6 (Badran, Bundesrat, Rösti) – Vergleiche 2 Sprecher*innen: Welche Interessen/Hintergründe könnten ihre Perspektive prägen? Nenne 1 faire Gegenfrage pro Sprecher*in.",
        minChars: 620,
        hint:"Nicht polemisch: «faire Gegenfrage» = sachliche Nachfrage, die die Argumentation testet."
      }
    ]
  },
  {
    title: "Level 4 – Republik: Audio & Text (Medienkrise / Meinungsfreiheit)",
    desc: "Du arbeitest mit Republik-Ressourcen: 2 Audios + 2 PDFs. Fokus: Diskurs, Medienkrise, Meinungsfreiheit als Kampfbegriff.",
    tasks: [
      {
        id:"L4_T1",
        type:"mc_multi",
        pointsTag:"16 XP",
        prompt:"Welche Entwicklungen werden im Republik-Kontext als Teil einer Medienkrise beschrieben? (Mehrfachauswahl)",
        options:[
          "Sinkende Nutzer*innenzahlen und Zahlungsbereitschaft",
          "KI ersetzt Journalismus in Teilbereichen",
          "Zeitungen drucken nur noch montags",
          "Private Medien profitieren automatisch von SRG-Kürzungen"
        ],
        correct:[0,1],
        explainCorrect:"Krise: Nutzung, Bezahlung, KI-Disruption – private Medien profitieren nicht automatisch.",
        explainWrong:"Achtung: «automatisch profitieren» ist genau ein Streitpunkt und wird in Republik eher bezweifelt."
      },
      {
        id:"L4_T2",
        type:"open",
        pointsTag:"10 XP",
        prompt:"Höre Audio 1 (Republik) und notiere: (a) 2 zentrale Thesen, (b) 1 überraschenden Punkt, (c) 1 offene Frage, die du nach dem Hören hast.",
        minChars: 520,
        hint:"Thesen = Behauptungen, die begründet werden; offene Frage = was bleibt ungeklärt?"
      },
      {
        id:"L4_T3",
        type:"open",
        pointsTag:"10 XP",
        prompt:"Lies Binswanger (PDF) und erkläre: Wie wird der Begriff «Meinungsfreiheit» als politisches Kampfwort beschrieben? Und warum hängt das mit starken Medien zusammen?",
        minChars: 680,
        hint:"Achte auf das Argument: Meinungsfreiheit vs. Kontrolle der Öffentlichkeit / Zensur im Namen der Freiheit."
      },
      {
        id:"L4_T4",
        type:"mc_single",
        pointsTag:"12 XP",
        prompt:"Welche Form von Aussage ist am ehesten eine *These*?",
        options:[
          "Wie hoch ist die SRG-Gebühr?",
          "Ich finde Medien spannend.",
          "Die Halbierungsinitiative schwächt die demokratische Öffentlichkeit, weil sie die mediale Infrastruktur beschädigt.",
          "In der Schweiz gibt es vier Sprachen."
        ],
        correct:[2],
        explainCorrect:"These = Behauptung + begründbarer Zusammenhang.",
        explainWrong:"Frage/Fakt/Meinung ohne Begründungsstruktur ist keine These."
      },
      {
        id:"L4_T5",
        type:"open_short",
        pointsTag:"6 XP",
        prompt:"Höre das Podcast-Audio (Sondersession) 8–10 Minuten. Formuliere danach 1 Satz: *Worin liegt gemäss Podcast der «falsche Zeitpunkt» der Initiative?*",
        minChars: 200,
        hint:"Stichworte: Medienkrise, sinkende Zahlungsbereitschaft, KI, private Medien."
      }
    ]
  },
  {
    title: "Level 5 – Argumentationslabor (Pro/Contra auf hohem Niveau)",
    desc: "Jetzt wird es anspruchsvoll: Du baust eine saubere Argumentation, erkennst Fehlschlüsse, nutzt Zahlen, testest Gegenargumente.",
    tasks: [
      {
        id:"L5_T1",
        type:"mc_single",
        pointsTag:"12 XP",
        prompt:"Welche Formulierung ist ein *Fehlschluss* (Scheinsicherheit)?",
        options:[
          "Wenn das Budget sinkt, müssen Prioritäten gesetzt werden.",
          "200 Franken reichen sicher für genau das gleiche Angebot wie heute.",
          "Eine Senkung kann private Anbieter relativ stärken – je nach Markt.",
          "Weniger Geld kann Qualität beeinträchtigen, muss aber nicht zwingend alles zerstören."
        ],
        correct:[1],
        explainCorrect:"«Sicher gleiches Angebot» ist Scheinsicherheit ohne Beleg.",
        explainWrong:"Die anderen Aussagen sind vorsichtiger und logisch offener."
      },
      {
        id:"L5_T2",
        type:"mc_multi",
        pointsTag:"16 XP",
        prompt:"Wähle 3 Kriterien, nach denen man den Service Public der SRG *fair* beurteilen könnte.",
        options:[
          "Informationsqualität/Verlässlichkeit",
          "Abdeckung aller Sprachregionen/Regionen",
          "Maximale Rendite/Profitabilität",
          "Demokratische Relevanz (Wahlen/Abstimmungen)",
          "Nur Unterhaltung"
        ],
        correct:[0,1,3],
        explainCorrect:"Service Public = Information/Regionen/Demokratie (nicht primär Rendite).",
        explainWrong:"Profitabilität ist für öffentlich-rechtliche Medien nicht das Hauptkriterium."
      },
      {
        id:"L5_T3",
        type:"open",
        pointsTag:"10 XP",
        prompt:"Schreibe ein **Mini-Argumentarium** (ca. 10–12 Sätze): 3 Pro-Argumente + 3 Contra-Argumente, jeweils mit (a) Zahl/Beleg und (b) möglichem Einwand. Am Schluss 2 Sätze Abwägung.",
        minChars: 900,
        hint:"Struktur pro Punkt: Behauptung → Zahl → Begründung → möglicher Einwand."
      },
      {
        id:"L5_T4",
        type:"open",
        pointsTag:"10 XP",
        prompt:"Formuliere 5 Debattenfragen, die nicht «ja/nein» sind, sondern echte Denkarbeit erzeugen (z.B. Gerechtigkeit, Föderalismus, Medienmacht, Plattformen, KI).",
        minChars: 650,
        hint:"Beispiel: «Welche Folgen hat weniger SRG für die gemeinsame Öffentlichkeit in vier Sprachregionen?»"
      }
    ]
  },
  {
    title: "Level 6 – Abschluss: Position, Auszeichnung, Pflicht-Export",
    desc: "Du stellst deine Position dar und exportierst deine Antworten als PDF. Ohne Export gibt es keine Auszeichnung.",
    tasks: [
      {
        id:"L6_T1",
        type:"open",
        pointsTag:"10 XP",
        prompt:"Deine Abstimmungsempfehlung (1–1.5 Seiten): Entscheide Ja/Nein und begründe mit mindestens 6 Argumenten (mind. 3 Gegenargumente fair behandelt). Nutze mindestens 4 Zahlen/Belege.",
        minChars: 1400,
        hint:"Achte auf Fairness: Gegenargumente nicht verzerren, sondern ernst nehmen."
      },
      {
        id:"L6_T2",
        type:"open_short",
        pointsTag:"6 XP",
        prompt:"Meta-Reflexion: Was hat deine Meinung am stärksten verändert – Zahlen, Videos, Audio, Text? Warum?",
        minChars: 260,
        hint:"Nenne 1 konkretes Beispiel aus einer Quelle."
      }
    ]
  }
];

// ------------------------
// STATE HELPERS
// ------------------------
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return structuredClone(STATE_DEFAULT);
    const s = JSON.parse(raw);
    // merge default keys (robust)
    return {
      ...structuredClone(STATE_DEFAULT),
      ...s,
      meta: { ...structuredClone(STATE_DEFAULT.meta), ...(s.meta||{}) },
      answers: s.answers || {},
      results: s.results || {}
    };
  }catch(e){
    return structuredClone(STATE_DEFAULT);
  }
}

function saveState(s){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function nowIso(){ return new Date().toISOString(); }

function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }

// ------------------------
// RENDER
// ------------------------
let state = loadState();

function renderMeta(){
  document.getElementById("studentName").value = state.meta.name || "";
  document.getElementById("studentClass").value = state.meta.klasse || "";
}

function renderKpis(){
  document.getElementById("kpiXp").innerText = String(state.xp);
  document.getElementById("kpiLevel").innerText = `${state.currentLevel+1}/${LEVELS.length}`;
  document.getElementById("kpiBadge").innerText = state.earnedBadge ? "Freigeschaltet" : "Gesperrt";
  document.getElementById("kpiExport").innerText = state.exportedOnce ? "Ja" : "Nein";
}

function isTaskComplete(task){
  const r = state.results[task.id];
  return !!(r && r.complete);
}

function levelCompletion(levelIdx){
  const level = LEVELS[levelIdx];
  const total = level.tasks.length;
  const done = level.tasks.filter(t => isTaskComplete(t)).length;
  return {done, total};
}

function isLevelUnlocked(levelIdx){
  if(levelIdx === 0) return true;
  // unlocked if previous level completed
  const prev = levelCompletion(levelIdx-1);
  return prev.done === prev.total;
}

function renderLevelMap(){
  const map = document.getElementById("levelMap");
  map.innerHTML = "";
  LEVELS.forEach((lvl, idx) => {
    const {done,total} = levelCompletion(idx);
    const unlocked = isLevelUnlocked(idx);
    const status = done === total ? "ok" : (unlocked ? "warn" : "bad");
    const statusText = done===total ? "Abgeschlossen" : (unlocked ? "Offen" : "Gesperrt");
    const div = document.createElement("div");
    div.className = "leveltile";
    div.innerHTML = `
      <h3>${escapeHtml(lvl.title)}</h3>
      <div class="small">${escapeHtml(lvl.desc)}</div>
      <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
        <span class="pill ${status}">Status: ${statusText}</span>
        <span class="pill">Aufgaben: ${done}/${total}</span>
      </div>
      <div class="btnrow" style="margin-top:12px;">
        <button class="${unlocked ? "" : "locked"}" ${unlocked ? "" : "disabled"} onclick="goToLevel(${idx})">Level öffnen</button>
      </div>
    `;
    map.appendChild(div);
  });
}

function renderLevel(){
  // hide all levels
  document.querySelectorAll(".level").forEach(el => el.classList.remove("active"));
  const active = document.getElementById("level_" + state.currentLevel);
  if(active) active.classList.add("active");
  document.getElementById("levelTitle").innerText = LEVELS[state.currentLevel].title;
  document.getElementById("levelDesc").innerText = LEVELS[state.currentLevel].desc;
  renderNavButtons();
  renderProgress();
  renderFinalPanel();
}

function renderNavButtons(){
  const prevBtn = document.getElementById("btnPrev");
  const nextBtn = document.getElementById("btnNext");
  prevBtn.classList.toggle("locked", state.currentLevel===0);
  prevBtn.disabled = state.currentLevel===0;

  const last = state.currentLevel === LEVELS.length-1;
  if(last){
    nextBtn.innerText = "Zum Abschluss";
  }else{
    nextBtn.innerText = "Nächstes Level";
  }

  // Next only unlocked if current level completed
  const {done,total} = levelCompletion(state.currentLevel);
  const canProceed = done === total;
  nextBtn.classList.toggle("locked", !canProceed);
  nextBtn.disabled = !canProceed;
}

function renderProgress(){
  const totalTasks = LEVELS.reduce((acc,l)=>acc + l.tasks.length, 0);
  const doneTasks = LEVELS.reduce((acc,l)=>acc + l.tasks.filter(t=>isTaskComplete(t)).length, 0);
  const pct = Math.round((doneTasks/totalTasks)*100);
  document.getElementById("globalProgress").innerText = `${pct}%`;
  document.getElementById("globalTasks").innerText = `${doneTasks}/${totalTasks}`;
}

function goToLevel(idx){
  if(!isLevelUnlocked(idx)) return;
  state.currentLevel = idx;
  saveState(state);
  renderAll();
  window.scrollTo({top:0, behavior:"smooth"});
}

function prevLevel(){
  if(state.currentLevel===0) return;
  state.currentLevel -= 1;
  saveState(state);
  renderAll();
  window.scrollTo({top:0, behavior:"smooth"});
}

function nextLevel(){
  const {done,total} = levelCompletion(state.currentLevel);
  if(done !== total) return;
  if(state.currentLevel < LEVELS.length-1){
    state.currentLevel += 1;
    saveState(state);
    renderAll();
    window.scrollTo({top:0, behavior:"smooth"});
  }else{
    // already last, scroll to final
    document.getElementById("finalCard").scrollIntoView({behavior:"smooth"});
  }
}

function resetAll(){
  if(!confirm("Wirklich ALLES zurücksetzen? (Antworten, XP, Fortschritt)")) return;
  state = structuredClone(STATE_DEFAULT);
  saveState(state);
  renderAll();
}

function updateMeta(){
  state.meta.name = document.getElementById("studentName").value.trim();
  state.meta.klasse = document.getElementById("studentClass").value.trim();
  saveState(state);
  renderKpis();
}

// ------------------------
// TASK EVALUATION
// ------------------------
function awardXp(task, correctOrComplete){
  const r = state.results[task.id] || {complete:false, correct:null, xp:0, ts:null};

  // prevent double-award: only award when task transitions from incomplete -> complete
  if(r.complete) return 0;

  let gained = 0;

  if(task.type === "mc_single"){
    const isCorrect = !!correctOrComplete;
    gained = isCorrect ? XP_RULES.mc_single.correct : XP_RULES.mc_single.wrong;
    r.correct = isCorrect;
    r.complete = true;
  } else if(task.type === "mc_multi"){
    const isCorrect = !!correctOrComplete;
    gained = isCorrect ? XP_RULES.mc_multi.correct : XP_RULES.mc_multi.wrong;
    r.correct = isCorrect;
    r.complete = true;
  } else if(task.type === "open"){
    gained = XP_RULES.open.complete;
    r.correct = null;
    r.complete = true;
  } else if(task.type === "open_short"){
    gained = XP_RULES.open_short.complete;
    r.correct = null;
    r.complete = true;
  }

  r.xp = gained;
  r.ts = nowIso();

  state.results[task.id] = r;
  state.xp += gained;

  // badge logic: require ALL tasks complete + export once
  saveState(state);
  return gained;
}

function getTaskById(taskId){
  for(const lvl of LEVELS){
    for(const t of lvl.tasks){
      if(t.id === taskId) return t;
    }
  }
  return null;
}

function submitMc(taskId){
  const task = getTaskById(taskId);
  if(!task) return;
  const fb = document.getElementById(taskId + "_fb");

  if(task.type === "mc_single"){
    const chosen = document.querySelector(`input[name="${taskId}"]:checked`);
    if(!chosen){
      fb.className = "feedback bad";
      fb.innerText = "❗ Bitte eine Option auswählen.";
      return;
    }
    const idx = parseInt(chosen.value,10);
    state.answers[taskId] = idx;
    const ok = arraysEqual([idx], task.correct);
    const xp = awardXp(task, ok);
    saveState(state);

    fb.className = "feedback " + (ok ? "good" : "bad");
    fb.innerText = ok ? `✅ Richtig. (+${xp} XP)\n${task.explainCorrect}` : `❌ Nicht korrekt. (+${xp} XP)\n${task.explainWrong}`;
  }

  if(task.type === "mc_multi"){
    const chosen = [...document.querySelectorAll(`input[name="${taskId}"]:checked`)].map(x=>parseInt(x.value,10)).sort((a,b)=>a-b);
    if(chosen.length === 0){
      fb.className = "feedback bad";
      fb.innerText = "❗ Bitte mindestens eine Option auswählen.";
      return;
    }
    state.answers[taskId] = chosen;
    const ok = arraysEqual(chosen, task.correct.slice().sort((a,b)=>a-b));
    const xp = awardXp(task, ok);
    saveState(state);

    fb.className = "feedback " + (ok ? "good" : "bad");
    fb.innerText = ok ? `✅ Richtig. (+${xp} XP)\n${task.explainCorrect}` : `❌ Nicht korrekt. (+${xp} XP)\n${task.explainWrong}`;
  }

  renderAll(); // update map/progress/locks
}

function submitOpen(taskId){
  const task = getTaskById(taskId);
  if(!task) return;
  const fb = document.getElementById(taskId + "_fb");
  const input = document.getElementById(taskId + "_txt");
  const text = (input.value || "").trim();

  const min = task.minChars || 0;
  if(text.length < min){
    fb.className = "feedback bad";
    fb.innerText = `❗ Zu kurz: mindestens ${min} Zeichen. Aktuell: ${text.length}.\nTipp: ${task.hint || "Arbeite mit konkreten Belegen, fairen Gegenargumenten und klaren Schlussfolgerungen."}`;
    return;
  }

  state.answers[taskId] = text;
  const xp = awardXp(task, true);
  saveState(state);

  fb.className = "feedback good";
  fb.innerText = `✅ Gespeichert und als erledigt markiert. (+${xp} XP)\nTipp: ${task.hint || "Arbeite mit klarer Struktur."}`;

  renderAll();
}

// ------------------------
// FINAL: badge + answer list + pdf export
// ------------------------
function allTasksComplete(){
  for(const lvl of LEVELS){
    for(const t of lvl.tasks){
      if(!isTaskComplete(t)) return false;
    }
  }
  return true;
}

function computeBadge(){
  // must have all tasks complete AND exported once AND meta filled
  const metaOk = (state.meta.name || "").length >= 2 && (state.meta.klasse || "").length >= 1;
  return allTasksComplete() && state.exportedOnce && metaOk;
}

function renderFinalPanel(){
  const final = document.getElementById("finalCard");
  const metaOk = (state.meta.name || "").length >= 2 && (state.meta.klasse || "").length >= 1;

  const btnExport = document.getElementById("btnExportPdf");
  const btnShowAnswers = document.getElementById("btnShowAnswers");

  // Export only enabled if all tasks complete and meta ok
  const exportUnlocked = allTasksComplete() && metaOk;
  btnExport.classList.toggle("locked", !exportUnlocked);
  btnExport.disabled = !exportUnlocked;

  // Show answers enabled if at least one answer exists
  const hasAny = Object.keys(state.answers).length > 0;
  btnShowAnswers.classList.toggle("locked", !hasAny);
  btnShowAnswers.disabled = !hasAny;

  // Badge status
  state.earnedBadge = computeBadge();
  saveState(state);
  renderKpis();

  const badgeBox = document.getElementById("badgeBox");
  if(state.earnedBadge){
    badgeBox.innerHTML = `
      <div class="badge">
        <div style="font-size:1.5rem;">🏅</div>
        <div>
          <div class="title">Auszeichnung freigeschaltet: «Medienkompetenz-Profi»</div>
          <div class="small">Du hast alle Levels abgeschlossen und das PDF exportiert. Abgabe: Lade die PDF-Datei in Teams hoch.</div>
        </div>
      </div>
    `;
  }else{
    const missing = [];
    if(!metaOk) missing.push("Name & Klasse eintragen");
    if(!allTasksComplete()) missing.push("alle Aufgaben erledigen");
    if(!state.exportedOnce) missing.push("PDF exportieren");
    badgeBox.innerHTML = `
      <div class="badge" style="border-color: rgba(255,212,59,0.30); background: rgba(255,212,59,0.10);">
        <div style="font-size:1.5rem;">🔒</div>
        <div>
          <div class="title">Auszeichnung noch gesperrt</div>
          <div class="small">Fehlt noch: ${missing.join(" · ")}</div>
        </div>
      </div>
    `;
  }
}

function showAllAnswers(){
  const box = document.getElementById("answerDump");
  const lines = [];
  lines.push(`Name: ${state.meta.name}`);
  lines.push(`Klasse: ${state.meta.klasse}`);
  lines.push(`Datum: ${new Date().toLocaleString()}`);
  lines.push(`XP: ${state.xp}`);
  lines.push("");
  for(const lvl of LEVELS){
    lines.push(lvl.title);
    lines.push("-".repeat(lvl.title.length));
    for(const t of lvl.tasks){
      const a = state.answers[t.id];
      const r = state.results[t.id];
      const status = r ? (r.correct===true ? "✅" : (r.correct===false ? "❌" : "📝")) : "—";
      lines.push(`${status} ${t.id}: ${summarizeAnswer(t, a)}`);
    }
    lines.push("");
  }
  box.textContent = lines.join("\n");
  box.parentElement.style.display = "block";
  box.parentElement.scrollIntoView({behavior:"smooth"});
}

function summarizeAnswer(task, ans){
  if(ans === undefined || ans === null) return "(keine Antwort)";
  if(task.type === "mc_single"){
    return `${task.options[ans] || "(unbekannt)"}`;
  }
  if(task.type === "mc_multi"){
    if(!Array.isArray(ans)) return "(unbekannt)";
    return ans.map(i => task.options[i]).join(" | ");
  }
  return String(ans).replace(/\s+/g," ").trim();
}

// ------------------------
// PDF EXPORT via jsPDF (loaded in HTML)
// ------------------------
async function exportPdf(){
  if(!allTasksComplete()){
    alert("Export gesperrt: Bitte zuerst alle Aufgaben erledigen.");
    return;
  }
  if((state.meta.name||"").length < 2 || (state.meta.klasse||"").length < 1){
    alert("Bitte Name und Klasse eintragen (oben rechts) – sonst kein Export.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:"mm", format:"a4" });

  const margin = 12;
  let y = 14;

  const title = "SRG-Halbierungsinitiative – Abgabe (Interaktive Lerneinheit)";
  doc.setFont("helvetica","bold");
  doc.setFontSize(14);
  doc.text(title, margin, y); y += 8;

  doc.setFont("helvetica","normal");
  doc.setFontSize(11);
  doc.text(`Name: ${state.meta.name}   |   Klasse: ${state.meta.klasse}`, margin, y); y += 6;
  doc.text(`Datum/Zeit: ${new Date().toLocaleString()}   |   XP: ${state.xp}`, margin, y); y += 8;

  // badge line
  const badgeText = computeBadge() ? "Auszeichnung: Medienkompetenz-Profi (freigeschaltet)" : "Auszeichnung: (noch gesperrt – Export zählt als Schritt)";
  doc.setFont("helvetica","italic");
  doc.text(badgeText, margin, y); y += 8;
  doc.setFont("helvetica","normal");

  const wrap = (text, maxWidth) => doc.splitTextToSize(text, maxWidth);

  const maxWidth = 210 - 2*margin;

  for(const lvl of LEVELS){
    // level header
    doc.setFont("helvetica","bold");
    doc.text(lvl.title, margin, y); y += 6;
    doc.setFont("helvetica","normal");

    for(const t of lvl.tasks){
      const ans = state.answers[t.id];
      const r = state.results[t.id];
      const status = r ? (r.correct===true ? "✅" : (r.correct===false ? "❌" : "📝")) : "—";

      const qLine = `${status} ${t.id} – ${t.prompt}`;
      const qWrapped = wrap(qLine, maxWidth);
      doc.setFont("helvetica","bold");
      doc.text(qWrapped, margin, y); y += (qWrapped.length*5);

      doc.setFont("helvetica","normal");
      const aText = "Antwort: " + summarizeAnswer(t, ans);
      const aWrapped = wrap(aText, maxWidth);
      doc.text(aWrapped, margin, y); y += (aWrapped.length*5 + 2);

      // page break
      if(y > 270){
        doc.addPage();
        y = 14;
      }
    }
    y += 2;
    if(y > 270){
      doc.addPage();
      y = 14;
    }
  }

  // mark exported
  state.exportedOnce = true;
  saveState(state);
  // after export, badge may unlock (if all tasks complete + meta ok)
  state.earnedBadge = computeBadge();
  saveState(state);
  renderAll();

  const safeName = (state.meta.name || "schueler_in").replace(/[^\p{L}\p{N}_-]+/gu,"_").slice(0,40);
  const safeClass = (state.meta.klasse || "klasse").replace(/[^\p{L}\p{N}_-]+/gu,"_").slice(0,20);
  const filename = `SRG_Lerneinheit_${safeClass}_${safeName}.pdf`;

  doc.save(filename);
}

// ------------------------
// UTIL
// ------------------------
function arraysEqual(a,b){
  if(a.length !== b.length) return false;
  for(let i=0;i<a.length;i++){ if(a[i]!==b[i]) return false; }
  return true;
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// ------------------------
// INITIAL RENDER
// ------------------------
function renderAll(){
  renderMeta();
  renderKpis();
  renderLevelMap();
  renderLevel();
}

window.addEventListener("load", () => {
  // wire meta fields
  document.getElementById("studentName").addEventListener("input", updateMeta);
  document.getElementById("studentClass").addEventListener("input", updateMeta);

  // render tasks into DOM (once)
  buildLevelsDom();
  renderAll();
});

function buildLevelsDom(){
  const host = document.getElementById("levelsHost");
  host.innerHTML = "";

  LEVELS.forEach((lvl, levelIdx) => {
    const levelDiv = document.createElement("div");
    levelDiv.className = "level";
    levelDiv.id = "level_" + levelIdx;

    // build tasks
    const tasksHtml = lvl.tasks.map(t => renderTaskHtml(t)).join("\n");

    levelDiv.innerHTML = `
      ${tasksHtml}
      <div class="footer">Hinweis: Aufgaben werden erst als erledigt markiert, wenn du sie absendest (Button). Bei offenen Antworten gilt eine Mindestlänge, damit du wirklich argumentierst.</div>
    `;

    host.appendChild(levelDiv);

    // restore previously chosen inputs
    lvl.tasks.forEach(t => restoreTaskInputs(t));
  });
}

function renderTaskHtml(task){
  const baseMeta = `
    <div class="meta">
      <span class="tag score">${task.pointsTag}</span>
      <span class="tag">${task.type === "mc_single" ? "MC (1 Antwort)" :
                          task.type === "mc_multi"  ? "MC (mehrere)" :
                          task.type === "open_short"? "Kurztext" : "Textantwort"}</span>
    </div>
  `;

  if(task.type === "mc_single"){
    const opts = task.options.map((o,i)=>`
      <div class="opt">
        <input type="radio" name="${task.id}" id="${task.id}_o${i}" value="${i}">
        <label for="${task.id}_o${i}">${escapeHtml(o)}</label>
      </div>
    `).join("");
    return `
      <div class="task" id="${task.id}">
        ${baseMeta}
        <h4>${escapeHtml(task.prompt)}</h4>
        <div class="options">${opts}</div>
        <div class="btnrow">
          <button onclick="submitMc('${task.id}')">Antwort prüfen & abschliessen</button>
          <button class="secondary" onclick="showHint('${task.id}')">Tipp anzeigen</button>
        </div>
        <div id="${task.id}_fb" class="feedback"></div>
        <div id="${task.id}_hint" class="feedback neutral" style="display:none;"></div>
      </div>
    `;
  }

  if(task.type === "mc_multi"){
    const opts = task.options.map((o,i)=>`
      <div class="opt">
        <input type="checkbox" name="${task.id}" id="${task.id}_o${i}" value="${i}">
        <label for="${task.id}_o${i}">${escapeHtml(o)}</label>
      </div>
    `).join("");
    return `
      <div class="task" id="${task.id}">
        ${baseMeta}
        <h4>${escapeHtml(task.prompt)}</h4>
        <div class="options">${opts}</div>
        <div class="btnrow">
          <button onclick="submitMc('${task.id}')">Antwort prüfen & abschliessen</button>
          <button class="secondary" onclick="showHint('${task.id}')">Tipp anzeigen</button>
        </div>
        <div id="${task.id}_fb" class="feedback"></div>
        <div id="${task.id}_hint" class="feedback neutral" style="display:none;"></div>
      </div>
    `;
  }

  // open text
  const minInfo = task.minChars ? `<div class="small">Mindestlänge: <strong>${task.minChars}</strong> Zeichen. (Damit du wirklich argumentierst.)</div>` : "";
  return `
    <div class="task" id="${task.id}">
      ${baseMeta}
      <h4>${escapeHtml(task.prompt)}</h4>
      ${minInfo}
      <textarea id="${task.id}_txt" placeholder="Schreibe deine Antwort hier …"></textarea>
      <div class="btnrow">
        <button onclick="submitOpen('${task.id}')">Speichern & abschliessen</button>
        <button class="secondary" onclick="showHint('${task.id}')">Tipp anzeigen</button>
      </div>
      <div id="${task.id}_fb" class="feedback"></div>
      <div id="${task.id}_hint" class="feedback neutral" style="display:none;"></div>
    </div>
  `;
}

function showHint(taskId){
  const task = getTaskById(taskId);
  const el = document.getElementById(taskId + "_hint");
  if(!task || !el) return;
  el.style.display = "block";
  const hint = task.hint || "Tipp: Arbeite mit klarer Struktur (Behauptung → Begründung → Beleg/Zahl → Schluss).";
  el.innerText = "💡 " + hint;
}

function restoreTaskInputs(task){
  const ans = state.answers[task.id];
  if(ans === undefined) return;

  if(task.type === "mc_single"){
    const radio = document.querySelector(`input[name="${task.id}"][value="${ans}"]`);
    if(radio) radio.checked = true;
  } else if(task.type === "mc_multi"){
    if(Array.isArray(ans)){
      ans.forEach(i => {
        const cb = document.querySelector(`input[name="${task.id}"][value="${i}"]`);
        if(cb) cb.checked = true;
      });
    }
  } else {
    const ta = document.getElementById(task.id + "_txt");
    if(ta) ta.value = ans;
  }

  // If already completed, show stored feedback (minimal)
  const r = state.results[task.id];
  const fb = document.getElementById(task.id + "_fb");
  if(r && r.complete && fb){
    if(task.type.startsWith("mc")){
      fb.className = "feedback " + (r.correct ? "good" : "bad");
      fb.innerText = r.correct ? `✅ Bereits abgeschlossen. (+${r.xp} XP)` : `❌ Bereits abgeschlossen. (+${r.xp} XP)`;
    }else{
      fb.className = "feedback good";
      fb.innerText = `✅ Bereits abgeschlossen. (+${r.xp} XP)`;
    }
  }
}

// Expose for inline handlers
window.goToLevel = goToLevel;
window.prevLevel = prevLevel;
window.nextLevel = nextLevel;
window.resetAll = resetAll;
window.submitMc = submitMc;
window.submitOpen = submitOpen;
window.showHint = showHint;
window.showAllAnswers = showAllAnswers;
window.exportPdf = exportPdf;
