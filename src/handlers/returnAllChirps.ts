import { Response, Request, NextFunction } from "express";
import { getAllChirps } from "../db/queries/chirps.js";


export async function handlerReturnAllChirps(req: Request, res: Response, next: NextFunction){
    const allChirps = await getAllChirps();

    res.status(200).json(allChirps);
}