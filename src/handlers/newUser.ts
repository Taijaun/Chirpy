import { NextFunction, Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { BadRequestError } from "../middleware/errorHandler.js";

export async function handlerNewUser(req: Request, res: Response, next: NextFunction) {
    type emailReq = {
        email: string
    }

    if("email" in req.body){
        if (typeof req.body.email === "string"){
            const user: NewUser = {
                email: req.body.email
            };

            const createdUser = await createUser(user);
            res.status(201).json(createdUser);
        } else {
            throw new BadRequestError("Incorrect email format");
        }
    } else {
        throw new BadRequestError("Bad request");
    }
}