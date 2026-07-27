# Quiz previo — Econometría UTDT

Live warm-up quiz (11 questions, 35 s each) with QR join, synced phones, and reveal screens.

## Run locally

```bash
cd quiz-previo
npm install
npm start
```

Open:

- Presenter: http://localhost:3000/presenter.html  
- Student: http://localhost:3000/student.html (or scan the QR)

## Class flow

1. Open **presenter** on the projector PC → **Crear sala**  
2. Students scan QR (or enter the 4-letter code)  
3. Click **Iniciar quiz**  
4. Each question runs for **35 seconds** (auto-reveals)  
5. Review bars + figure + explanation  
6. Click **Siguiente pregunta** → all phones advance together  

## Deploy to your personal site

Any Node host works (Railway, Render, Fly.io, a VPS):

- Start command: `node server.js`  
- Root: `quiz-previo/`  
- Set `PORT` if the host requires it  

Point a subdomain or path (via reverse proxy) to this service so the QR uses your public HTTPS URL.

## Content

Questions live in `public/js/questions.js`. Figures in `public/assets/fig-01.svg` … `fig-11.svg`.
