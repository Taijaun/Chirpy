import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../middleware/errorHandler.js";
import { addChirp } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";


export async function handlerValidateChirp(req: Request, res: Response, next: NextFunction){
    type responseError = {
        error: string;
    }


    if (!req.body.body || !req.body.userId){
        throw new BadRequestError("Incorrect request format");
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
        userId: req.body.userId
    };

    const newChirp = await addChirp(respData);

    res.status(201).json(newChirp);
    return;
}