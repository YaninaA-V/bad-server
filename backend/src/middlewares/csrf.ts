import { Request, Response, NextFunction } from 'express'
import { verify, sign } from 'jsonwebtoken' 
import { ACCESS_TOKEN } from '../config'

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {    
    if (process.env.NODE_ENV !== 'production') {
        return next()
    }    

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const csrfToken = req.headers['x-csrf-token'] as string || req.body._csrf
        
        if (!csrfToken) {
            return res.status(403).json({ 
                error: 'CSRF token required',
                message: 'Отсутствует CSRF токен' 
            })
        }

        try {
            verify(csrfToken, ACCESS_TOKEN.secret)
            next()
        } catch (error) {
            return res.status(403).json({ 
                error: 'Invalid CSRF token',
                message: 'Недействительный CSRF токен' 
            })
        }
    } else {
        next()
    }
}

export const generateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'production') {
        const csrfToken = sign( 
            { type: 'csrf' },
            ACCESS_TOKEN.secret,
            { expiresIn: '1h' }
        )
        res.locals.csrfToken = csrfToken
    } else {
        res.locals.csrfToken = 'dev-csrf-token'
    }
    next()
}