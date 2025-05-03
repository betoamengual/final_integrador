"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/questions.ts
const express_1 = require("express");
const questionsController_1 = require("../controllers/questionsController");
const router = (0, express_1.Router)();
// GET /api/question       -> una sola pregunta
router.get('/', questionsController_1.getQuestion);
// GET /api/question/batch -> varias preguntas de golpe (batch)
router.get('/batch', questionsController_1.getQuestions);
exports.default = router;
