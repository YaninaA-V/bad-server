import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

const storage = multer.memoryStorage();

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
    'text/plain',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

export default multer({ 
    storage, 
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1, 
        fieldSize: 10 * 1024 * 1024 
    }
});
