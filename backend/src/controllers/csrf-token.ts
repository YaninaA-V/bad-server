import { Request, Response } from "express";
import { generateCsrfToken } from "../middlewares/csrf";

export const getCsrfToken = (req: Request, res: Response) => {
    const csrfToken = generateCsrfToken(req, res)
    res.json({ csrfToken })
}