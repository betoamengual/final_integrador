import { Flags } from "./country";

// src/models/question.ts
export type QuestionType = 'capital' | 'flag' | 'borderCount';
export type QuestionPoints = 3 | 5;

export interface Option {
    label: string | number;
    value: string | number;
}

export interface Question {
    type: QuestionType;
    question: string;
    options: Option[];
    correctAnswer: string | number;
    points: QuestionPoints;
    flag: Flags
}



