"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const questions_1 = __importDefault(require("./routes/questions"));
// import rankingRouter from './routes/ranking';
dotenv_1.default.config();
const app = (0, express_1.default)();
// Habilito CORS y JSON
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ─────────────── SERVIR FRONTEND ─────────────────
// Todo lo que esté en la carpeta /public (en la raíz del proyecto) queda disponible en la raíz.
// __dirname es .../api/dist o .../api/src, por eso subimos dos niveles.
const publicPath = path_1.default.join(__dirname, '..', '..', 'public');
app.use(express_1.default.static(publicPath));
// ─────────────── RUTAS DE LA API ────────────────
app.use('/api/question', questions_1.default);
// app.use('/api/ranking', rankingRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server corriendo en http://localhost:${PORT}`);
});
