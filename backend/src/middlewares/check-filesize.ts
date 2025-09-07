import { NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/bad-request-error"; 

export const checkFilesize = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return next(new BadRequestError('File not uploaded')); 
    }

    const minSizeBytes = 2 * 1024; // 2KB

    if (req.file.size < minSizeBytes) {
        return next(new BadRequestError(`File is too small. Minimum size is ${minSizeBytes} bytes.`)); 
    }

    next(); 
};