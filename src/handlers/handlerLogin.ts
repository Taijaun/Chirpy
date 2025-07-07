import { NextFunction, Request, Response } from "express";
import { checkPasswordHash } from "../auth/auth.js";
import { selectUserByEmail } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { UnauthorizedError } from "../middleware/errorHandler.js";
import { makeJWT } from "../auth/jwt.js";
import { config } from "../config.js";


export async function handlerLogin(req: Request, res: Response, next: NextFunction){
    const password = req.body.password;
    const email = req.body.email;
    let expiry = 3600;

    const user = await selectUserByEmail(email);

    if (!user){
        throw new UnauthorizedError("Incorrect email or password");
    }

    const passwordMatch = await checkPasswordHash(password, user.hashedPassword);

    if (!passwordMatch){
        throw new UnauthorizedError("Incorrect email or password");
    }

    if (req.body.expiresInSeconds && typeof(req.body.expiresInSeconds) === "number" && req.body.expiresInSeconds < 3600){
        expiry = req.body.expiresInSeconds;
    }
    const token = makeJWT(user.id, expiry, config.secret);

    const response = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: token
    }


    res.status(200).json(response);
}