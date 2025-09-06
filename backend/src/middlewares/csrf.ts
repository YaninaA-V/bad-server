import { NextFunction, Request, Response } from "express";

const allowedOrigins = [
    process.env.ORIGIN_ALLOW || 'http://localhost:3000',
    'http://localhost:3000' 
]

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
    if(['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const {origin} = req.headers

        if(!origin || !allowedOrigins.includes(origin)) {
            return res.status(403).json({ 
                error: 'CORS policy: Origin not allowed',
                message: 'Запрос с данного домена запрещен' 
            })
        }
        next()
    } else {
        next()
    }
}
