import { Router } from 'express';
import * as rankingController from '../controllers/rankingController';

const router = Router();

// POST /api/scores   → guarda un resultado
router.post('/scores', rankingController.saveScore);

// GET /api/ranking   → devuelve el top-20
router.get('/ranking', rankingController.getRanking);

export default router;
