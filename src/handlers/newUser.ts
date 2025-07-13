import { NextFunction, Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { BadRequestError } from "../middleware/errorHandler.js";
import { hashPassword } from "../auth/auth.js";

export async function handlerNewUser(req: Request, res: Response, next: NextFunction) {
    type emailReq = {
        email: string
    }

    if(req.body.email && req.body.password){
        if (typeof req.body.email === "string" && typeof req.body.password == "string"){
            const user: NewUser = {
                email: req.body.email,
                hashedPassword: await hashPassword(req.body.password)
            };

            const createdUser = await createUser(user);

            type UserInfo = Omit<NewUser, "hashedPassword">
            const userInfo: UserInfo = {
                id: createdUser.id,
                createdAt: createdUser.createdAt,
                updatedAt: createdUser.updatedAt,
                email: createdUser.email,
                isChirpyRed: createdUser.isChirpyRed
            }

            res.status(201).json(userInfo);
        } else {
            throw new BadRequestError("Incorrect email format");
        }
    } else {
        throw new BadRequestError("Bad request");
    }
}