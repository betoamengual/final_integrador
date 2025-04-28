// src/services/questionsService.ts
import { restClient } from '../utils/restCountriesClient';
import { Question, Option, QuestionType, QuestionPoints } from '../models/question';
import { RestCountry } from '../models/country';

function shuffle<T>(arr: T[]): T[] {
    return arr.sort(() => Math.random() - 0.5);
}

function mapOption(type: QuestionType, option: RestCountry) {
    if (type === 'borderCount')
        return {
            label: (option.borders || []).length,
            value: (option.borders || []).length
        }

    if (type === 'capital')
        return {
            label: option.capital?.[0] || '',
            value: option.capital?.[0] || ''
        }
    return {
        label: option.name.common,
        value: option.name.common
    }
}

export async function generateQuestion(): Promise<Question> {
    // 1) Elegir tipo aleatorio
    const types: QuestionType[] = ['capital', 'flag', 'borderCount'];
    const type = types[Math.floor(Math.random() * types.length)];

    // 2) Traer lista completa de países
    const { data: countries } = await restClient.get<RestCountry[]>('/all?fields=name,capital,flags,borders');

    // 3) Elegir país base
    const correctCountry = countries[Math.floor(Math.random() * countries.length)];

    let questionText: string;
    let correctAnswer: string | number;
    let points: QuestionPoints;

    if (type === 'capital') {
        questionText = `¿Cuál es el país de la capital **${correctCountry.name.common}**?`;
        correctAnswer = mapOption(type, correctCountry).label;
        points = 3;
    } else if (type === 'flag') {
        questionText = `¿Qué país corresponde a esta bandera?`;
        // Para el front mostrar correctCountry.flags.svg
        correctAnswer = mapOption(type, correctCountry).label;
        points = 5;
    } else { // borderCount
        questionText = `¿Cuántos países limítrofes tiene **${correctCountry.name.common}**?`;
        correctAnswer = mapOption(type, correctCountry).label
        points = 3;
    }

    // 4) Generar 3 distractores
    const others = shuffle(countries.filter(c => (c.name.common !== correctCountry.name.common)
    )).slice(0, 3);

    const options: Option[] = others.map(o => (mapOption(type, o)));
    options.push(mapOption(type, correctCountry));

    return {
        type,
        question: questionText,
        options: shuffle(options),
        correctAnswer,
        points,
        flag: correctCountry.flags
    };
}
