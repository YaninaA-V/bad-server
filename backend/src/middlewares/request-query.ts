import BadRequestError from "../errors/bad-request-error";
import { NextFunction, Request, Response } from "express";

export const normalizeLimit = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.query.limit && Number(req.query.limit) > 10) {
        req.query.limit = '10'
    }
    next()
}

export const checkQueryOnObject = (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    const keys = Object.keys(req.query)
    for (let i = 0; i < keys.length; i += 1) {
        if (typeof req.query[keys[i]] === 'object') {
            return next(
                new BadRequestError('Входной параметр не может быть объектом!')
            )
        }
    }
    next()
}