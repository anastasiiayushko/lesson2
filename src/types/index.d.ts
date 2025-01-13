import 'express';
//index.d.ts
declare module 'express' {
    export interface Request {
        userId?: string | null; // Добавляем поле userId в интерфейс Request
    }
}