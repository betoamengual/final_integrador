import { Request, Response } from 'express';
import * as rankingService from '../services/rankingService';

export async function saveScore(req: Request, res: Response) {
    const { username, correctCount, totalTime } = req.body;
    if (!username || correctCount == null || totalTime == null) {
        return res.status(400).json({ error: 'Faltan datos en el body' });
    }

    try {
        const totalUsers = await rankingService.saveScore({ username, correctCount, totalTime });
        return res.json({ totalUsers });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error guardando el score' });
    }
}

export async function getRanking(req: Request, res: Response) {
    try {
        const top20 = await rankingService.getRanking();
        return res.json(top20);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error leyendo el ranking' });
    }
}
