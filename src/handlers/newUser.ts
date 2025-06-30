import { NextFunction, Request, Response } from "express";
import { createUser } from "src/db/queries/users";
import { NewUser } from "src/db/schema";
import { BadRequestError } from "src/middleware/errorHandler";

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