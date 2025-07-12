import {JwtPayload} from 'jsonwebtoken'
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../middleware/errorHandler.js';


export function makeJWT(userId: string, secret: string, expiresIn: number = 3600 ): string {

    type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

    const iat = Math.floor(Date.now() / 1000)

    const payloadToSign: payload = {
        iss: "chirpy",
        sub: userId,
        iat: iat,
        exp: iat + expiresIn
    }
    
    const signed = jwt.sign( payloadToSign, secret);

    return signed;

}

export function validateJWT(tokenString: string, secret: string): string {

    try {
        const token = jwt.verify(tokenString, secret)
        return token.sub as string;
    } catch (err){
        throw new UnauthorizedError("Invalid token"); 
    }
}