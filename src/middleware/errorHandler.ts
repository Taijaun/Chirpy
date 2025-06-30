import { NextFunction, Request, Response } from "express";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
){
    console.log("Error");
    if (err instanceof NotFoundError){
        res.status(404).json({ error: err.message });
    } else if (err instanceof BadRequestError){
        res.status(400).json({ error: err.message });
    } else if (err instanceof UnauthorizedError){
        res.status(401).json({ error: err.message });
    } else if (err instanceof ForbiddenError){
        res.status(403).json({ error: err.message });
    } else {
        res.status(500).json({
            error: "Something went wrong on our end"
        })
    };
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ForbiddenError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
    }
}