"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveScore = saveScore;
exports.getRanking = getRanking;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
// Ruta al JSON de datos
const DATA_PATH = path_1.default.join(__dirname, '../data/scores.json');
/**
 * Lee y parsea el archivo scores.json
 */
async function readScores() {
    const raw = await fs_1.promises.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
}
/**
 * Escribe el array de scores en scores.json
 */
async function writeScores(scores) {
    await fs_1.promises.writeFile(DATA_PATH, JSON.stringify(scores, null, 2));
}
/**
 * Guarda un nuevo resultado y devuelve cuántos usuarios hay
 */
async function saveScore(score) {
    const scores = await readScores();
    scores.push(score);
    await writeScores(scores);
    return scores.length;
}
/**
 * Devuelve el top-20 ordenado:
 * - Primero por más aciertos
 * - Si hay empate por menos tiempo
 */
async function getRanking() {
    const scores = await readScores();
    scores.sort((a, b) => {
        if (b.correctCount !== a.correctCount) {
            return b.correctCount - a.correctCount;
        }
        return a.totalTime - b.totalTime;
    });
    return scores.slice(0, 20);
}
