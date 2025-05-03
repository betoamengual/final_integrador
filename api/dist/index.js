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
const ranking_1 = __importDefault(require("./routes/ranking")); // ① importamos el router de ranking
dotenv_1.default.config();
const app = (0, express_1.default)();
// ──────── MIDDLEWARES ────────
// 1) Permitir peticiones desde el front (CORS)
// 2) Parsear bodies en JSON
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ──────── RUTAS API ────────
// 3) Preguntas: /api/question/...
app.use('/api/question', questions_1.default);
// 4) Ranking: 
//    - POST /api/scores    guarda un resultado  
//    - GET  /api/ranking   devuelve el top-20  
app.use('/api', ranking_1.default);
// ──────── SERVIR FRONT-END ────────
// 5) Servimos los archivos estáticos de public/ (index.html, JS, CSS…)
const publicPath = path_1.default.join(__dirname, '../../public');
app.use(express_1.default.static(publicPath));
// ──────── LEVANTAR SERVIDOR ────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server corriendo en http://localhost:${PORT}`);
});
