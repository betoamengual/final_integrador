// src/routes/questions.ts
import { Router } from 'express';
import { getQuestion } from '../controllers/questionsController';

const router = Router();
router.get('/', getQuestion);   // GET /api/question
export default router;
