import { MAX_REQUEST } from "../config";
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: MAX_REQUEST,
    message: 'Слишком много запросов. Пожалуйста, повторите позже.',
    standardHeaders: true,
    legacyHeaders: false,
})