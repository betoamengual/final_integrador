"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestion = getQuestion;
exports.getQuestions = getQuestions;
const questionsService_1 = require("../services/questionsService");
const restCountriesClient_1 = require("../utils/restCountriesClient");
async function getQuestion(_req, res) {
    try {
        const { data: countries } = await restCountriesClient_1.restClient.get('/all?fields=name,capital,flags,borders');
        const q = await (0, questionsService_1.generateQuestion)(countries);
        res.json(q);
    }
    catch (err) {
        res.status(500).json({ error: 'Error al generar pregunta', err });
    }
}
// Nuevo handler mejorado para batch sin repeticiones
async function getQuestions(req, res) {
    try {
        // Leemos ?count=10
        const count = 10;
        const seen = new Set(); // para preguntas únicas
        const batch = [];
        // 2) Traer lista completa de países
        const { data: countries } = await restCountriesClient_1.restClient.get('/all?fields=name,capital,flags,borders');
        // Generar preguntas hasta completar 'count' únicas
        while (batch.length < count) {
            const q = await (0, questionsService_1.generateQuestion)(countries);
            if (!seen.has(q.question)) {
                seen.add(q.question);
                batch.push(q);
            }
        }
        res.json(batch); // devuelve Question[]
    }
    catch (err) {
        res.status(500).json({ error: 'Error al generar batch de preguntas', err });
    }
}
