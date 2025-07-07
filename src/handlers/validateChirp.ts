import { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../middleware/errorHandler.js";
import { addChirp } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";
import { getBearerToken } from "../auth/auth.js";
import { validateJWT } from "../auth/jwt.js";
import { config } from "../config.js";


export async function handlerValidateChirp(req: Request, res: Response, next: NextFunction){

    let bearerToken: string;
    let validToken: string;

    try {
        bearerToken = getBearerToken(req);

        validToken = validateJWT(bearerToken, config.secret);
    } catch (error) {
        throw new UnauthorizedError("Invalid authentication");
    }

    if (!req.body.body){
        throw new BadRequestError("Invalid request parameters");
    }

    const profaneWords = ["kerfuffle", "sharbert", "fornax"];

    if (req.body.body.length > 140){
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    const bodySplit = req.body.body.split(" ");
    let bodyJoined: string[] = [];

    for (const word of bodySplit){
        if (profaneWords.includes(word.toLowerCase())){
            bodyJoined.push("****");
        } else {
            bodyJoined.push(word);
        }
    }

    const respData: NewChirp = {
        body: bodyJoined.join(" "),
        userId: validToken
    };

    const newChirp = await addChirp(respData);

    res.status(201).json(newChirp);
    return;
}