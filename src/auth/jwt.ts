import {JwtPayload} from 'jsonwebtoken'

export function makeJWT(userId: string, expiresIn: number, secret: string): string {
    var jwt = require('jsonwebtoken')

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
    var jwt = require('jsonwebtoken')

    try {
        const token = jwt.verify(tokenString, secret)
        return token.sub;
    } catch (err){
        throw new Error("Invalid token"); 
    }
}