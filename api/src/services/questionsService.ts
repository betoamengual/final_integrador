import { restClient } from '../utils/restCountriesClient';
import { Question, Option, QuestionType, QuestionPoints } from '../models/question';
import { RestCountry } from '../models/country';

function shuffle<T>(arr: T[]): T[] {
    return arr.sort(() => Math.random() - 0.5);
}

export async function generateQuestion(countries: RestCountry[]): Promise<Question> {
    // Elegir tipo aleatorio
    const types: QuestionType[] = ['capital', 'flag', 'borderCount'];
    const type = types[Math.floor(Math.random() * types.length)];



    // Elegir país base
    const correctCountry = countries[Math.floor(Math.random() * countries.length)];

    // Variables comunes
    let questionText: string;
    let correctAnswer: string | number;
    let points: QuestionPoints;
    let options: Option[] = [];

    if (type === 'capital') {
        // Pregunta de capital
        const capital = correctCountry.capital?.[0] || '';
        questionText = `¿Cuál es el país de la capital **${correctCountry.name.common}**?`;
        correctAnswer = capital;
        points = 3;
        // Distractores: otras capitales
        const others = shuffle(
            countries.filter(c => c.capital && c.capital[0] && c.capital[0] !== capital)
        ).slice(0, 3);
        options = others.map(o => ({ label: o.capital![0], value: o.capital![0] }));
        options.push({ label: capital, value: capital });

    } else if (type === 'flag') {
        // Pregunta de bandera
        questionText = `¿Qué país corresponde a esta bandera?`;
        correctAnswer = correctCountry.name.common;
        points = 5;
        // Distractores: nombres de otros países
        const others = shuffle(
            countries.filter(c => c.name.common !== correctCountry.name.common)
        ).slice(0, 3);
        options = others.map(o => ({ label: o.name.common, value: o.name.common }));
        options.push({ label: correctAnswer as string, value: correctAnswer as string });

    } else {
        // Pregunta de límite de fronteras
        questionText = `¿Cuántos países limítrofes tiene **${correctCountry.name.common}**?`;
        const correctCount = (correctCountry.borders || []).length;
        correctAnswer = correctCount;
        points = 3;
        // Generar distractores numéricos únicos
        const distractors = new Set<number>();
        const offsets = [1, 2, 3];
        while (distractors.size < 3) {
            const delta = offsets[Math.floor(Math.random() * offsets.length)];
            const val = Math.random() < 0.5
                ? correctCount + delta
                : correctCount - delta;
            if (val >= 0 && val !== correctCount) {
                distractors.add(val);
            }
        }
        options = Array.from(distractors).map(n => ({ label: n, value: n }));
        options.push({ label: correctCount, value: correctCount });
    }

    // 4) Mezclar y devolver
    return {
        type,
        question: questionText,
        options: shuffle(options),
        correctAnswer,
        points,
        flag: correctCountry.flags
    };
}
