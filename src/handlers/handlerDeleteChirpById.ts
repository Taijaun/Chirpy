import { NextFunction, Request, Response } from "express";
import { getBearerToken } from "../auth/auth.js";
import { validateJWT } from "../auth/jwt.js";
import { config } from "../config.js";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../middleware/errorHandler.js";
import { selectUserById } from "../db/queries/users.js";
import { deleteChirp, getSingleChirp } from "../db/queries/chirps.js";

export async function deleteChirpById(req: Request, res: Response, next: NextFunction){ 
    const userToken = getBearerToken(req);
    const userId = validateJWT(userToken, config.secret);

    if (!userId){
        throw new UnauthorizedError("Unknown user")
    }

    const user = await selectUserById(userId);

    if (!user){
        throw new UnauthorizedError("User does not exist");
    }
    const chirpId = req.params.chirpID;
    const chirp = await getSingleChirp(chirpId);

    if (!chirp){
        throw new NotFoundError("Chirp not found");
    }

    if (chirp.userId !== user.id){
        throw new ForbiddenError("Incorrect user");
    } else {
        await deleteChirp(chirpId);
        res.status(204).send();
    }

}