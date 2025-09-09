import { NextFunction, Request, Response } from 'express'
import BadRequestError from '../errors/bad-request-error'
import { randomUUID } from 'crypto'
import { UPLOAD_TYPES } from '../config'
import { loadEsm } from 'load-esm'
import { constants } from 'http2'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        const { fileTypeFromFile } = await loadEsm<typeof import('file-type')>('file-type')
        const fileType = await fileTypeFromFile(req.file.path)
        if (!fileType || !fileType.mime) {
            return next(new BadRequestError('Невозможно определить тип файла'))
        }
        if (!UPLOAD_TYPES.includes(fileType.mime)) {
            return next(new BadRequestError('Данный тип файла нельзя загружать'))
        }

        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
