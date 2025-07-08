import { NextFunction, Request, Response } from "express";
import { getBearerToken } from "../auth/auth.js";
import { revokeToken } from "../db/queries/tokens.js";

export async function handlerRevoke(req: Request, res: Response, next: NextFunction){

    const getToken = getBearerToken(req);

    await revokeToken(getToken);

    res.status(204).send();

}