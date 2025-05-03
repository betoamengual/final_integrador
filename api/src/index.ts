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

const publicPath = path.join(__dirname, '..', '..', 'public');
app.use(express.static(publicPath));

// ─────────────── RUTAS DE LA API ────────────────
app.use('/api/question', questionsRouter);
// app.use('/api/ranking', rankingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server corriendo en http://localhost:${PORT}`);
});
