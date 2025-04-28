// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import questionsRouter from './routes/questions';
// import rankingRouter from './routes/ranking';

dotenv.config();
const app = express();

// Habilito CORS y JSON
app.use(cors());
app.use(express.json());

//  ─────────────── SERVIR FRONTEND ─────────────────
// Todo lo que esté en /public queda disponible en la raíz.
// Así al abrir http://localhost:3000/ te carga public/index.html
app.use(express.static(path.join(__dirname, '../public')));

// ─────────────── RUTAS DE LA API ────────────────
app.use('/api/question', questionsRouter);
// app.use('/api/ranking', rankingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});
