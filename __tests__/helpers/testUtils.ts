import {Express} from "express";
import request from "supertest";
import {StatusCode} from "../../src/types/status-code-types";
import {SETTINGS} from "../../src/settings";
import {SortDirectionsType} from "../../src/db/types/db-types";


export const resetTestData = async (app: Express) => {
    await request(app).delete(`${SETTINGS.PATH.TESTING}/all-data`).expect(StatusCode.NO_CONTENT_204);
};

export const getAuthHeaderBasicTest = (auth: string) => {
    const encoded = Buffer.from(auth, 'utf8').toString('base64');
    return `Basic ${encoded}`;
};

export const generateRandomStringForTest = (lengthSymbols: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Набор символов
    let result = '';
    for (let i = 0; i < lengthSymbols; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}


export const sortedBySortKeyAndDirectionTest =
    <T>(data: T[], sortBy: keyof T, direction: SortDirectionsType) => {
    return data.sort((a, b) => {
        const valueA = String(a[sortBy]).toLowerCase(); // Приводим к строке и в нижний регистр
        const valueB = String(b[sortBy]).toLowerCase();

        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}