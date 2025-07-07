import { NextFunction, Request, Response } from "express";
import { config } from "../config.js"
import { removeAllUsers } from "../db/queries/users.js";
import { ForbiddenError } from "../middleware/errorHandler.js";

export async function handlerReset(req: Request, res: Response, next: NextFunction){
    config.fileserverHits = 0;

    if (config.platform !== "dev"){
        throw new ForbiddenError("Only developers can access this")
    } else {
        await removeAllUsers();
        res.status(200).json({ message: "users deleted" });
    }
    
}