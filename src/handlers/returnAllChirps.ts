import { Response, Request, NextFunction } from "express";
import { getAllChirps, getSingleChirp } from "../db/queries/chirps.js";


export async function handlerReturnAllChirps(req: Request, res: Response, next: NextFunction){
    const allChirps = await getAllChirps();

    res.status(200).json(allChirps);
}

export async function handlerReturnSingleChirp(req: Request, res: Response, next: NextFunction){
    const chirp = await getSingleChirp(req.params.chirpID);

    if (chirp){
        res.status(200).json(chirp);
    } else {
        res.status(404).send();
    }

    
}