import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { COOKIES_SECRET, DB_ADDRESS, MAX_SIZE_FILE } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'
import { limiter } from './middlewares/rate-limit'
import { checkQueryOnObject, normalizeLimit } from './middlewares/request-query'
import ExpressMongoSanitize from 'express-mongo-sanitize'

const { PORT = 3000 } = process.env
const app = express()

app.use(cookieParser(COOKIES_SECRET))
app.use(limiter)

app.use(cors({ origin: process.env.ORIGIN_ALLOW, credentials: true }));
app.use(serveStatic(path.join(__dirname, 'public')))
app.use(urlencoded({ extended: true }))
app.use(json({ limit: MAX_SIZE_FILE }))
app.use(checkQueryOnObject)
app.use(normalizeLimit)
app.use(ExpressMongoSanitize())
app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()