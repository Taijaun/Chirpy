import { NextFunction, Request, Response } from "express";
import { checkPasswordHash } from "../auth/auth.js";
import { selectUserByEmail } from "../db/queries/users.js";
import { NewUser, RefreshToken } from "../db/schema.js";
import { UnauthorizedError } from "../middleware/errorHandler.js";
import { makeJWT } from "../auth/jwt.js";
import { config } from "../config.js";
import { makeRefreshToken } from "../auth/auth.js";
import { addRefreshToken } from "../db/queries/tokens.js";


export async function handlerLogin(req: Request, res: Response, next: NextFunction){
    
    try {
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

        const token = makeJWT(user.id, config.secret);
        const refreshTokenString = makeRefreshToken();

        const expireIn60Days = 5_184_000_000;

        const refreshToken: RefreshToken = {
            userId: user.id,
            token: refreshTokenString,
            expiresAt: new Date(Date.now() + expireIn60Days)
        } 

        const addedToken = await addRefreshToken(refreshToken);


        const response = {
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            token: token,
            refreshToken: refreshTokenString,
            isChirpyRed: user.isChirpyRed
        }

        res.status(200).json(response);
    } catch (error) {
        console.log("Error in login handler:", error);
        throw error;
    }
}