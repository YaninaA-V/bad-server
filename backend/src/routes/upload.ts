import { Router } from 'express'
import { uploadFile } from '../controllers/upload'
import fileMiddleware from '../middlewares/file'
import { checkFilename } from '../middlewares/check-filename'

const uploadRouter = Router()
uploadRouter.post('/', checkFilename, fileMiddleware.single('file'), uploadFile)

export default uploadRouter
