import { NextFunction, Request, Response } from "express";
import { getBearerToken } from "../auth/auth";
import { lookupTokenInDb } from "../db/queries/tokens";
import { UnauthorizedError } from "../middleware/errorHandler";
import { makeJWT } from "../auth/jwt";
import { config } from "../config";


export async function handlerRefresh(req: Request, res: Response, next: NextFunction){
    const getToken = getBearerToken(req);

    const dbToken = await lookupTokenInDb(getToken);

    if (dbToken.length > 0){
        const foundToken = dbToken[0];
        const currentTime = new Date(Date.now())

        if (foundToken.revokedAt === null && foundToken.expiresAt > currentTime){
            const response = {
                token: makeJWT(foundToken.userId, config.secret)
            }
            res.status(200).json(response);
        } else {
           throw new UnauthorizedError("Token invalid"); 
        }
    } else {
        throw new UnauthorizedError("Token error");
    }

}