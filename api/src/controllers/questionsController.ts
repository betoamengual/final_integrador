// src/controllers/questionsController.ts
import { Request, Response } from 'express';
import { generateQuestion } from '../services/questionsService';

export async function getQuestion(req: Request, res: Response) {
    try {
        const q = await generateQuestion();
        res.json(q);
    } catch (err) {
        res.status(500).json({ error: 'Error al generar pregunta', err });
    }
}
