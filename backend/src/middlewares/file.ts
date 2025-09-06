import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path, { join } from 'path'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        const originalName = _file.originalname
        if (originalName.includes('../') || originalName.includes('..\\')) {
            return cb(new Error('Недопустимое имя файла'), '')
        }
        cb(
            null,
            join(
                __dirname,
                process.env.UPLOAD_PATH_TEMP
                    ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                    : '../public'
            )
        )
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        const randomName = Date.now() + '-' + Math.random().toString(36).substring(7)
        const extension = path.extname(file.originalname)
        cb(null, randomName + extension)
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }

    return cb(null, true)
}

export default multer({ 
    storage, 
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, 
        files: 1, 
        fieldSize: 10 * 1024 * 1024 
    }
 })
