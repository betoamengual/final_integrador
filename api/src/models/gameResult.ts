// src/models/gameResult.ts
export interface GameResult {
    userId: string;
    correct: number;
    incorrect: number;
    totalTimeMs: number;
    avgTimePerQuestionMs: number;
    timestamp: Date;
    score: number;
}
