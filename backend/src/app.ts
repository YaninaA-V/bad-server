import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, NextFunction, Request, Response, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'
import { csrfProtection } from './middlewares/csrf'

const { PORT = 3000 } = process.env
const app = express()

const requestCounts = new Map<string, number>()
const TIME_WINDOW = 60 * 1000
const MAX_REQUESTS = 100
const REQUEST_TIMEOUT = 10000
const connections = new Map<string, number>()
const MAX_CONNECTIONS_PER_IP = 10

app.use((req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown'
    const now = Date.now()
    requestCounts.forEach((_count, key) => {
        const [timestamp, _storedIp] = key.split('|')
        if (now - parseInt(timestamp, 10) > TIME_WINDOW) {
            requestCounts.delete(key)
        }
    })
    const key = `${now}|${ip}`
    const currentCount = requestCounts.get(key) || 0
    
    if (currentCount >= MAX_REQUESTS) {
        return res.status(429).json({ error: 'Слишком много запросов' })
    }
    
    requestCounts.set(key, currentCount + 1)
    next()
})

app.use((req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown'
    const currentConnections = connections.get(ip) || 0
    
    if (currentConnections >= MAX_CONNECTIONS_PER_IP) {
        return res.status(429).json({ error: 'Слишком много подключений' })
    }
    
    connections.set(ip, currentConnections + 1)
    
    res.on('finish', () => {
        const current = connections.get(ip) || 0
        if (current > 0) {
            connections.set(ip, current - 1)
        }
    })
    
    next()
})

app.use((req: Request, res: Response, next: NextFunction) => {
    req.setTimeout(REQUEST_TIMEOUT, () => {
        res.status(408).json({ error: 'Request timeout' })
    })
    
    res.setTimeout(REQUEST_TIMEOUT, () => {
        res.status(408).json({ error: 'Response timeout' })
    })
    
    next()
})

app.use((req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10)
    if (contentLength > 1 * 1024 * 1024) {
        return res.status(413).json({ error: 'Payload too large' })
    }
    next()
})

app.use(cookieParser())

app.use(cors({ origin: process.env.ORIGIN_ALLOW, credentials: true }));

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true, limit: '1mb' }))
app.use(json({ limit: '1mb' }))

app.options('*', cors())
if (process.env.NODE_ENV !== 'test') {
    app.use(csrfProtection)
}
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