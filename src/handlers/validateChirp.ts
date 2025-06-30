import { Request, Response } from "express";
import { BadRequestError } from "../middleware/errorHandler.js";

export async function handlerValidateChirp(req: Request, res: Response){
    type responseError = {
        error: string;
    }

    type responseData = {
        cleanedBody: string;
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

    

    const respData: responseData = {
        cleanedBody: bodyJoined.join(" ")
    };

            
 
    res.status(200).json(respData);
    return;
}