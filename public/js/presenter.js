(function () {
  const socket = io();
  const Q = window.QUIZ.questions;
  const TIMER = window.QUIZ.timerSeconds;

  const els = {
    lobby: document.getElementById("lobby"),
    lobbyActive: document.getElementById("lobby-active"),
    play: document.getElementById("play"),
    done: document.getElementById("done"),
    roomCode: document.getElementById("room-code"),
    joinUrl: document.getElementById("join-url"),
    studentCount: document.getElementById("student-count"),
    progress: document.getElementById("progress"),
    answered: document.getElementById("answered"),
    students: document.getElementById("students"),
    timer: document.getElementById("timer"),
    topic: document.getElementById("topic"),
    prompt: document.getElementById("prompt"),
    options: document.getElementById("options"),
    revealPanel: document.getElementById("reveal-panel"),
    revealActions: document.getElementById("reveal-actions"),
    explanation: document.getElementById("explanation"),
    figure: document.getElementById("figure"),
    bars: document.getElementById("bars")
  };

  let state = null;
  let tick = null;

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

  function joinUrl(code) {
    return `${location.origin}/student.html?room=${code}`;
  }

  document.getElementById("btn-create").onclick = () => {
    socket.emit("presenter:create");
  };

  document.getElementById("btn-start").onclick = () => {
    socket.emit("presenter:set_total", { total: Q.length });
    socket.emit("presenter:start");
  };

  document.getElementById("btn-reveal").onclick = () => {
    socket.emit("presenter:reveal");
  };

  document.getElementById("btn-next").onclick = () => {
    socket.emit("presenter:set_total", { total: Q.length });
    socket.emit("presenter:next");
  };

  socket.on("presenter:created", ({ code }) => {
    els.lobbyActive.hidden = false;
    els.roomCode.textContent = code;
    const url = joinUrl(code);
    els.joinUrl.textContent = url;
    QRCode.toCanvas(document.getElementById("qr"), url, {
      width: 220,
      margin: 1,
      color: { dark: "#1f4e79", light: "#ffffff" }
    });
  });

  socket.on("state", (s) => {
    state = s;
    els.studentCount.textContent = s.studentCount;
    if (s.phase === "lobby") {
      els.lobby.hidden = false;
      els.play.hidden = true;
      els.done.hidden = true;
      return;
    }
    if (s.phase === "done") {
      els.lobby.hidden = true;
      els.play.hidden = true;
      els.done.hidden = false;
      return;
    }
    els.lobby.hidden = true;
    els.done.hidden = true;
    els.play.hidden = false;
    renderPlay(s);
  });

  function renderPlay(s) {
    const q = Q[s.questionIndex];
    if (!q) return;
    els.progress.textContent = `Pregunta ${s.questionIndex + 1} / ${Q.length}`;
    els.answered.textContent = s.answeredCount;
    els.students.textContent = s.studentCount;
    els.topic.textContent = q.topic;
    els.prompt.innerHTML = q.prompt;
    els.options.innerHTML = "";
    ["A", "B", "C", "D"].forEach((letter) => {
      const div = document.createElement("div");
      div.className = "option";
      if (s.phase === "reveal" && letter === q.correct) div.classList.add("correct");
      div.innerHTML = `<span class="letter">${letter}</span><span>${q.options[letter]}</span>`;
      els.options.appendChild(div);
    });
    renderMath(els.play);

    if (s.phase === "question") {
      els.revealPanel.hidden = true;
      els.revealActions.hidden = false;
      startTimer(s);
    } else if (s.phase === "reveal") {
      stopTimer();
      els.timer.textContent = "0";
      els.timer.className = "timer";
      els.revealPanel.hidden = false;
      els.revealActions.hidden = true;
      els.explanation.innerHTML = q.explanation;
      els.figure.src = `/assets/${q.figure}`;
      renderBars(s.votes || { A: 0, B: 0, C: 0, D: 0 }, q.correct);
      const nextBtn = document.getElementById("btn-next");
      nextBtn.textContent =
        s.questionIndex >= Q.length - 1 ? "Finalizar quiz →" : "Siguiente pregunta →";
      renderMath(els.revealPanel);
    }
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
    };
    update();
    tick = setInterval(update, 200);
  }

  function stopTimer() {
    if (tick) clearInterval(tick);
    tick = null;
  }

  socket.on("error_msg", (msg) => alert(msg));
})();
