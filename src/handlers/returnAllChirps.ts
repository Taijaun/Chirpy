import { Response, Request, NextFunction } from "express";
import { getAllChirps, getSingleChirp, getUsersChirps } from "../db/queries/chirps.js";


export async function handlerReturnAllChirps(req: Request, res: Response, next: NextFunction){
    let ascending = true;

    if (req.query.sort){
        if (req.query.sort === "asc"){
            ascending = true;
        } else if (req.query.sort === "desc"){
            ascending = false;
        }
    }

    if (req.query.authorId && typeof(req.query.authorId) === "string"){
        const chirps = await getUsersChirps(req.query.authorId, ascending);
        res.status(200).json(chirps)
        return;
    } else {
        const allChirps = await getAllChirps(ascending);
        res.status(200).json(allChirps);
        return;
    }
    
}

export async function handlerReturnSingleChirp(req: Request, res: Response, next: NextFunction){
    const chirp = await getSingleChirp(req.params.chirpID);

    if (chirp){
        res.status(200).json(chirp);
    } else {
        res.status(404).send();
    }

    
}