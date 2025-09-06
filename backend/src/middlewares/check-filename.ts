import BadRequestError from "errors/bad-request-error"
import { NextFunction, Request, Response } from "express"

export const checkFilename = (req: Request, res: Response, next: NextFunction) => {
    if (req.file && req.file.originalname) {
        const originalName = req.file.originalname
        if (originalName.includes('../') || originalName.includes('..\\')) {
            return next(new BadRequestError('Недопустимое имя файла'))
        }
    }
    next()
}