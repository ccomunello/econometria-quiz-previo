(function () {
  const socket = io();
  const Q = window.QUIZ.questions;
  const TIMER = window.QUIZ.timerSeconds;

  const params = new URLSearchParams(location.search);
  const presetRoom = (params.get("room") || "").toUpperCase();

  const els = {
    join: document.getElementById("join"),
    wait: document.getElementById("wait"),
    play: document.getElementById("play"),
    reveal: document.getElementById("reveal"),
    done: document.getElementById("done"),
    code: document.getElementById("code"),
    name: document.getElementById("name"),
    joinError: document.getElementById("join-error"),
    waitCode: document.getElementById("wait-code"),
    progress: document.getElementById("progress"),
    timer: document.getElementById("timer"),
    topic: document.getElementById("topic"),
    prompt: document.getElementById("prompt"),
    options: document.getElementById("options"),
    status: document.getElementById("status"),
    revealProgress: document.getElementById("reveal-progress"),
    revealTopic: document.getElementById("reveal-topic"),
    revealPrompt: document.getElementById("reveal-prompt"),
    explanation: document.getElementById("explanation"),
    figure: document.getElementById("figure"),
    bars: document.getElementById("bars")
  };

  if (presetRoom) els.code.value = presetRoom;

  let myChoice = null;
  let lastQuestionIndex = -1;
  let tick = null;
  let state = null;

  function renderMath(root) {
    if (window.renderMathInElement) {
      renderMathInElement(root, {
        delimiters: [
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false
      });
    }
  }

  function show(id) {
    ["join", "wait", "play", "reveal", "done"].forEach((k) => {
      els[k].hidden = k !== id;
    });
  }

  document.getElementById("btn-join").onclick = () => {
    const code = els.code.value.trim().toUpperCase();
    const name = els.name.value.trim();
    if (!code) {
      els.joinError.textContent = "Ingresá el código de la sala.";
      return;
    }
    socket.emit("student:join", { code, name });
  };

  socket.on("student:joined", ({ code }) => {
    els.waitCode.textContent = code;
    show("wait");
  });

  socket.on("error_msg", (msg) => {
    els.joinError.textContent = msg;
  });

  socket.on("student:accepted", ({ choice }) => {
    myChoice = choice;
    els.status.textContent = `Respuesta enviada: ${choice}. Esperá los resultados…`;
    lockOptions();
  });

  socket.on("state", (s) => {
    state = s;
    if (s.phase === "lobby") {
      show("wait");
      return;
    }
    if (s.phase === "done") {
      show("done");
      return;
    }
    if (s.phase === "question") {
      if (s.questionIndex !== lastQuestionIndex) {
        myChoice = null;
        lastQuestionIndex = s.questionIndex;
      }
      show("play");
      renderQuestion(s);
      return;
    }
    if (s.phase === "reveal") {
      show("reveal");
      renderReveal(s);
    }
  });

  function renderQuestion(s) {
    const q = Q[s.questionIndex];
    if (!q) return;
    els.progress.textContent = `${s.questionIndex + 1} / ${Q.length}`;
    els.topic.textContent = q.topic;
    els.prompt.innerHTML = q.prompt;
    els.options.innerHTML = "";
    els.status.textContent = myChoice
      ? `Respuesta enviada: ${myChoice}.`
      : "Elegí una opción.";

    ["A", "B", "C", "D"].forEach((letter) => {
      const btn = document.createElement("button");
      btn.className = "option" + (myChoice === letter ? " selected" : "");
      btn.type = "button";
      btn.innerHTML = `<span class="letter">${letter}</span><span>${q.options[letter]}</span>`;
      btn.disabled = !!myChoice;
      btn.onclick = () => {
        if (myChoice) return;
        socket.emit("student:answer", { choice: letter });
      };
      els.options.appendChild(btn);
    });
    renderMath(els.play);
    startTimer(s);
  }

  function lockOptions() {
    [...els.options.querySelectorAll(".option")].forEach((btn) => {
      btn.disabled = true;
      if (btn.textContent.trim().startsWith(myChoice)) btn.classList.add("selected");
    });
  }

  function renderReveal(s) {
    stopTimer();
    const q = Q[s.questionIndex];
    if (!q) return;
    els.revealProgress.textContent = `Pregunta ${s.questionIndex + 1} / ${Q.length}`;
    els.revealTopic.textContent = q.topic;
    els.revealPrompt.innerHTML = q.prompt;
    els.explanation.innerHTML =
      q.explanation +
      (myChoice
        ? myChoice === q.correct
          ? ` <strong style="color:var(--ok)">Tu respuesta (${myChoice}) fue correcta.</strong>`
          : ` <strong style="color:var(--bad)">Tu respuesta fue ${myChoice}; la correcta es ${q.correct}.</strong>`
        : ` <strong>La correcta es ${q.correct}.</strong>`);
    els.figure.alt = `Figura: ${q.topic}`;
    els.figure.src = `/assets/${q.figure}?v=3`;
    els.figure.onerror = () => {
      els.figure.alt = "No se pudo cargar la figura";
    };
    renderBars(s.votes || { A: 0, B: 0, C: 0, D: 0 }, q.correct);
    renderMath(els.reveal);
  }

  function renderBars(votes, correct) {
    const total = Math.max(1, Object.values(votes).reduce((a, b) => a + b, 0));
    els.bars.innerHTML = "";
    ["A", "B", "C", "D"].forEach((letter) => {
      const n = votes[letter] || 0;
      const pct = Math.round((100 * n) / total);
      const row = document.createElement("div");
      row.className = "bar-row";
      row.innerHTML = `
        <strong>${letter}</strong>
        <div class="bar-track"><div class="bar-fill ${letter === correct ? "correct" : ""}" style="width:${pct}%"></div></div>
        <span>${n} (${pct}%)</span>`;
      els.bars.appendChild(row);
    });
  }

  function startTimer(s) {
    stopTimer();
    const update = () => {
      const elapsed = (Date.now() - (s.questionStartedAt || Date.now())) / 1000;
      const left = Math.max(0, Math.ceil(TIMER - elapsed));
      els.timer.textContent = String(left);
      els.timer.className = "timer" + (left <= 5 ? " danger" : left <= 10 ? " warn" : "");
      if (left === 0 && !myChoice) {
        els.status.textContent = "Se acabó el tiempo.";
        lockOptions();
      }
    };
    update();
    tick = setInterval(update, 200);
  }

  function stopTimer() {
    if (tick) clearInterval(tick);
    tick = null;
  }

  // Auto-join if room in URL
  if (presetRoom) {
    // leave name empty; user can still type before clicking if they want
  }
})();
