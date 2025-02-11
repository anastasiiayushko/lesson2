import 'express';
//index.d.ts
declare module 'express' {
    export interface Request {
        userId?: string | null; // Добавляем поле userId в интерфейс Request
        deviceSessionId?: string | null; // _id deviceSession
        deviceId?: string | null; // _id deviceSession
    }
}