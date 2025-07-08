import { NextFunction, Request, Response } from "express";
import { getBearerToken } from "src/auth/auth";
import { revokeToken } from "src/db/queries/tokens";

export async function handlerRevoke(req: Request, res: Response, next: NextFunction){

    const getToken = getBearerToken(req);

    await revokeToken(getToken);

    res.status(204).send();

}