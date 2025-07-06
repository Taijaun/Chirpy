import { NextFunction, Request, Response } from "express";
import { checkPasswordHash } from "../auth/auth.js";
import { selectUserByEmail } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { UnauthorizedError } from "../middleware/errorHandler.js";


export async function handlerLogin(req: Request, res: Response, next: NextFunction){
    const password = req.body.password;
    const email = req.body.email;

    const user = await selectUserByEmail(email);

    if (!user){
        throw new UnauthorizedError("Incorrect email or password");
    }

    const passwordMatch = await checkPasswordHash(password, user.hashedPassword);

    if (!passwordMatch){
        throw new UnauthorizedError("Incorrect email or password");
    }

    type UserInfo = Omit<NewUser, "hashedPassword">

    const userInfo: UserInfo = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email
    }


    res.status(200).json(userInfo);
}