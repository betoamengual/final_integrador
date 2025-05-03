import { Request, Response } from 'express';
import { generateQuestion } from '../services/questionsService';
import { Question } from '../models/question';
import { restClient } from '../utils/restCountriesClient';
import { RestCountry } from '../models/country';

export async function getQuestion(_req: Request, res: Response) {
    try {
        const { data: countries } = await restClient.get<RestCountry[]>('/all?fields=name,capital,flags,borders');
        const q = await generateQuestion(countries);
        res.json(q);
    } catch (err) {
        res.status(500).json({ error: 'Error al generar pregunta', err });
    }
}

// Nuevo handler mejorado para batch sin repeticiones
export async function getQuestions(req: Request, res: Response) {
    try {
        // Leemos ?count=10
        const count = 10;
        const seen = new Set<string>();    // para preguntas únicas
        const batch: Question[] = [];

        // 2) Traer lista completa de países
        const { data: countries } = await restClient.get<RestCountry[]>('/all?fields=name,capital,flags,borders');

        // Generar preguntas hasta completar 'count' únicas
        while (batch.length < count) {
            const q = await generateQuestion(countries);
            if (!seen.has(q.question)) {
                seen.add(q.question);
                batch.push(q);
            }
        }

        res.json(batch); // devuelve Question[]
    } catch (err) {
        res.status(500).json({ error: 'Error al generar batch de preguntas', err });
    }
}
