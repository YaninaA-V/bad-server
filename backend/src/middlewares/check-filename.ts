import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import path from "path";

export const checkFilename = (req: Request, res: Response, next: NextFunction) => {
    if (req.file && req.file.originalname) {
        const extension = path.extname(req.file.originalname);
        const newName = `${randomUUID()}${extension}`;
        
        req.file.filename = newName;
    }
    next();
};