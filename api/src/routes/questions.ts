// src/routes/questions.ts
import { Router } from 'express';
import { getQuestion, getQuestions } from '../controllers/questionsController';

const router = Router();

// GET /api/question       -> una sola pregunta
router.get('/', getQuestion);

// GET /api/question/batch -> varias preguntas de golpe (batch)
router.get('/batch', getQuestions);

export default router;
