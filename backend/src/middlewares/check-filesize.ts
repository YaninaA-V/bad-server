import { NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/bad-request-error"; 

export const checkFilesize = (req: Request, res: Response, next: NextFunction) => {
    console.log('checkFilesize middleware called'); 
    if (!req.file) {
        console.log('No file found'); 
        return next(new BadRequestError('File not uploaded'));
    }

    const minSizeBytes = 2 * 1024;
    if (req.file.size < minSizeBytes) {
        console.log('File too small:', req.file.size); 
        return next(new BadRequestError(`File is too small. Minimum size is ${minSizeBytes} bytes.`));
    }

    console.log('File passed validation'); 
    next();
};