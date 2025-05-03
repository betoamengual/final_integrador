// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import questionsRouter from './routes/questions';
import rankingRouter from './routes/ranking';   // ① importamos el router de ranking

dotenv.config();
const app = express();

// ──────── MIDDLEWARES ────────
// 1) Permitir peticiones desde el front (CORS)
// 2) Parsear bodies en JSON
app.use(cors());
app.use(express.json());

// ──────── RUTAS API ────────
// 3) Preguntas: /api/question/...
app.use('/api/question', questionsRouter);

// 4) Ranking: 
//    - POST /api/scores    guarda un resultado  
//    - GET  /api/ranking   devuelve el top-20  
app.use('/api', rankingRouter);

// ──────── SERVIR FRONT-END ────────
// 5) Servimos los archivos estáticos de public/ (index.html, JS, CSS…)
const publicPath = path.join(__dirname, '../../public');
app.use(express.static(publicPath));

// ──────── LEVANTAR SERVIDOR ────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server corriendo en http://localhost:${PORT}`);
});
