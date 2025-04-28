// src/utils/restCountriesClient.ts
import axios from 'axios';

export const restClient = axios.create({
    baseURL: 'https://restcountries.com/v3.1',
    timeout: 50000
});

// Podemos usar endpoints como /all o /name/{name}
