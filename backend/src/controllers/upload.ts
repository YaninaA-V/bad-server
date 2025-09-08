import { NextFunction, Request, Response } from 'express'
import BadRequestError from '../errors/bad-request-error'
import { randomUUID } from 'crypto'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        const ext = req.file.originalname.split('.').pop();
        const fileName = `/uploads/${randomUUID()}.${ext}`;
            
        return res.status(201).json({
            fileName
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
