import { promises as fs } from 'fs';
import path from 'path';

// Definimos la forma de un Score
export interface Score {
    username: string;
    correctCount: number;
    totalTime: number;  // en segundos
}

// Ruta al JSON de datos
const DATA_PATH = path.join(__dirname, '../data/scores.json');

/**
 * Lee y parsea el archivo scores.json
 */
async function readScores(): Promise<Score[]> {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw) as Score[];
}

/**
 * Escribe el array de scores en scores.json
 */
async function writeScores(scores: Score[]): Promise<void> {
    await fs.writeFile(DATA_PATH, JSON.stringify(scores, null, 2));
}

/**
 * Guarda un nuevo resultado y devuelve cuántos usuarios hay
 */
export async function saveScore(score: Score): Promise<number> {
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
export async function getRanking(): Promise<Score[]> {
    const scores = await readScores();
    scores.sort((a, b) => {
        if (b.correctCount !== a.correctCount) {
            return b.correctCount - a.correctCount;
        }
        return a.totalTime - b.totalTime;
    });
    return scores.slice(0, 20);
}
