const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;
const TIMER_SECONDS = 35;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

/** @type {Map<string, Room>} */
const rooms = new Map();

/**
 * @typedef {object} Room
 * @property {string} code
 * @property {string|null} presenterId
 * @property {'lobby'|'question'|'reveal'|'done'} phase
 * @property {number} questionIndex
 * @property {number|null} questionStartedAt
 * @property {Record<string, string>} votes studentId -> 'A'|'B'|'C'|'D'
 * @property {Set<string>} students
 */

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  if (rooms.has(code)) return makeCode();
  return code;
}

function tally(votes) {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const v of Object.values(votes)) {
    if (counts[v] !== undefined) counts[v] += 1;
  }
  return counts;
}

function publicState(room) {
  return {
    code: room.code,
    phase: room.phase,
    questionIndex: room.questionIndex,
    questionStartedAt: room.questionStartedAt,
    timerSeconds: TIMER_SECONDS,
    studentCount: room.students.size,
    votes: room.phase === "reveal" || room.phase === "done" ? tally(room.votes) : null,
    answeredCount: Object.keys(room.votes).length
  };
}

function emitState(room) {
  io.to(room.code).emit("state", publicState(room));
}

io.on("connection", (socket) => {
  socket.on("presenter:create", () => {
    const code = makeCode();
    /** @type {Room} */
    const room = {
      code,
      presenterId: socket.id,
      phase: "lobby",
      questionIndex: 0,
      questionStartedAt: null,
      votes: {},
      students: new Set(),
      totalQuestions: 11
    };
    rooms.set(code, room);
    socket.join(code);
    socket.data.role = "presenter";
    socket.data.room = code;
    socket.emit("presenter:created", { code, joinPath: `/student.html?room=${code}` });
    emitState(room);
  });

  socket.on("presenter:join", ({ code }) => {
    const room = rooms.get(String(code || "").toUpperCase());
    if (!room) return socket.emit("error_msg", "Sala no encontrada.");
    room.presenterId = socket.id;
    socket.join(room.code);
    socket.data.role = "presenter";
    socket.data.room = room.code;
    socket.emit("presenter:resumed", { code: room.code });
    emitState(room);
  });

  socket.on("student:join", ({ code, name }) => {
    const room = rooms.get(String(code || "").toUpperCase());
    if (!room) return socket.emit("error_msg", "Sala no encontrada.");
    room.students.add(socket.id);
    socket.join(room.code);
    socket.data.role = "student";
    socket.data.room = room.code;
    socket.data.name = (name || "Estudiante").slice(0, 24);
    socket.emit("student:joined", { code: room.code, name: socket.data.name });
    emitState(room);
  });

  socket.on("presenter:start", () => {
    const room = rooms.get(socket.data.room);
    if (!room || room.presenterId !== socket.id) return;
    room.phase = "question";
    room.questionIndex = 0;
    room.questionStartedAt = Date.now();
    room.votes = {};
    emitState(room);
  });

  socket.on("presenter:reveal", () => {
    const room = rooms.get(socket.data.room);
    if (!room || room.presenterId !== socket.id) return;
    if (room.phase !== "question") return;
    room.phase = "reveal";
    emitState(room);
  });

  socket.on("presenter:next", () => {
    const room = rooms.get(socket.data.room);
    if (!room || room.presenterId !== socket.id) return;
    if (room.phase !== "reveal") return;

    const n = Number(room.totalQuestions || 11);
    if (room.questionIndex >= n - 1) {
      room.phase = "done";
      emitState(room);
      return;
    }

    room.questionIndex += 1;
    room.phase = "question";
    room.questionStartedAt = Date.now();
    room.votes = {};
    emitState(room);
  });

  socket.on("presenter:set_total", ({ total }) => {
    const room = rooms.get(socket.data.room);
    if (!room || room.presenterId !== socket.id) return;
    room.totalQuestions = Number(total) || 11;
  });

  socket.on("student:answer", ({ choice }) => {
    const room = rooms.get(socket.data.room);
    if (!room || socket.data.role !== "student") return;
    if (room.phase !== "question") return;
    if (!["A", "B", "C", "D"].includes(choice)) return;

    const elapsed = (Date.now() - (room.questionStartedAt || 0)) / 1000;
    if (elapsed > TIMER_SECONDS + 1.5) return; // small grace for latency

    // one vote per student per question
    room.votes[socket.id] = choice;
    socket.emit("student:accepted", { choice });
    emitState(room);
  });

  socket.on("disconnect", () => {
    const code = socket.data.room;
    if (!code) return;
    const room = rooms.get(code);
    if (!room) return;

    if (socket.data.role === "student") {
      room.students.delete(socket.id);
      delete room.votes[socket.id];
      emitState(room);
    }

    if (socket.data.role === "presenter" && room.presenterId === socket.id) {
      room.presenterId = null;
      // keep room alive for a bit so students don't drop mid-quiz
    }

    if (!room.presenterId && room.students.size === 0) {
      rooms.delete(code);
    }
  });
});

// Auto-reveal when timer expires (checked often)
setInterval(() => {
  const now = Date.now();
  for (const room of rooms.values()) {
    if (room.phase !== "question" || !room.questionStartedAt) continue;
    const elapsed = (now - room.questionStartedAt) / 1000;
    if (elapsed >= TIMER_SECONDS) {
      room.phase = "reveal";
      emitState(room);
    }
  }
}, 250);

server.listen(PORT, () => {
  console.log(`Quiz previo listening on http://localhost:${PORT}`);
  console.log(`Presenter: http://localhost:${PORT}/presenter.html`);
});
