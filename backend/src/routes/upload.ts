import { Router } from 'express'
import { uploadFile } from '../controllers/upload'
import fileMiddleware from '../middlewares/file'
import { checkFilename } from '../middlewares/check-filename'

const uploadRouter = Router()
uploadRouter.post('/', fileMiddleware.single('file'), checkFilename, uploadFile)

export default uploadRouter
