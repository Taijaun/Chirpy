import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../middleware/errorHandler.js";
import { selectUserById, upgradeToChirpyRed } from "../db/queries/users.js";

export async function polkaWebhooksUpgrade(req: Request, res: Response, next: NextFunction){

    if (req.body.event !== "user.upgraded"){
        res.status(204).send();
        return;
    }

    if (!(req.body.data) || !(req.body.data.userId)){
        throw new BadRequestError("Bad request")
    }

    const user = await selectUserById(req.body.data.userId);

    if (!user){
        throw new NotFoundError("User not found");
    }

    const updatedUser = await upgradeToChirpyRed(user.id);
    res.status(204).send();
}