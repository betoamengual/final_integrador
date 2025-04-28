// src/models/country.ts

/** Nombre completo y común del país */
export interface Name {
    common: string;
    official: string;
    /** Idiomas nativos, clave = código de idioma */
    nativeName?: Record<string, {
        official: string;
        common: string;
    }>;
}

/** URLs de las banderas */
export interface Flags {
    svg: string;
    png: string;
    /** Texto alternativo (puede faltar) */
    alt?: string;
}

/** Estructura mínima de un país según los campos que pedimos */
export interface RestCountry {
    name: Name;
    /** Puede faltar o ser un array vacío */
    capital?: string[];
    flags: Flags;
    /** Lista de códigos ISO de países limítrofes */
    borders?: string[];
}
