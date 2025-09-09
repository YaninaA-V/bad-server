import { NextFunction, Request, Response } from 'express'
import BadRequestError from '../errors/bad-request-error'
import { randomUUID } from 'crypto'
import { UPLOAD_TYPES } from '../config'
import { loadEsm } from 'load-esm'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        const { fileTypeFromBuffer } = await loadEsm<typeof import('file-type')>('file-type')
        const uint8Array = new Uint8Array(req.file.buffer);
        const fileType = await fileTypeFromBuffer(uint8Array);
        if (!fileType || !fileType.mime) {
            return next(new BadRequestError('Невозможно определить тип файла'))
        }
        if (!UPLOAD_TYPES.includes(fileType.mime)) {
            return next(new BadRequestError('Данный тип файла нельзя загружать'))
        }

        const ext = req.file.originalname.split('.').pop();
        const fileName = `/uploads/${randomUUID()}.${ext}`;
            
        return res.status(201).json({
            fileName,
            originalName: req.file.originalname,
            mimeType: fileType.mime
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
