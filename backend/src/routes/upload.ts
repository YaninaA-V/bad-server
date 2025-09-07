import { Router } from 'express'
import { uploadFile } from '../controllers/upload'
import fileMiddleware from '../middlewares/file'
import { checkFilesize } from '../middlewares/check-filesize'

const uploadRouter = Router()
uploadRouter.post('/', fileMiddleware.single('file'),checkFilesize, uploadFile)

export default uploadRouter
