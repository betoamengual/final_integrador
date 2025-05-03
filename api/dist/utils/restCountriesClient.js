"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restClient = void 0;
// src/utils/restCountriesClient.ts
const axios_1 = __importDefault(require("axios"));
exports.restClient = axios_1.default.create({
    baseURL: 'https://restcountries.com/v3.1',
    timeout: 50000
});
// Podemos usar endpoints como /all o /name/{name}
