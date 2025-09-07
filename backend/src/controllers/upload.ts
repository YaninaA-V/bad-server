import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        const fileName = `/${process.env.UPLOAD_PATH || 'uploads'}/${req.file.filename}`;
            
        return res.status(201).json({
            fileName, 
            originalName: req.file.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
