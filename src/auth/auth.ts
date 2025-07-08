import bcrypt from 'bcrypt';
import { Request } from 'express';
import { randomBytes } from 'node:crypto';
import { UnauthorizedError } from '../middleware/errorHandler';

export async function hashPassword(password: string): Promise<string>{
    const saltRounds = 10;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.log('Error hashing password:', err);
        throw err;
    }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    const match = await bcrypt.compare(password, hash);

    if (match){
        return true;
    } else {
        return false;
    }
}

export function getBearerToken(req: Request): string {
    const authInfo = req.get('Authorization');

    if (authInfo){
        const tokenStringSplit = authInfo.split(' ');

        if (tokenStringSplit.length === 2 && tokenStringSplit[0] === "Bearer"){
            const tokenString = tokenStringSplit[1];
            return tokenString;
        } else {
            throw new UnauthorizedError("Invalid token")
        }
    } else {
        throw new UnauthorizedError("Authorization header does not exist");
    }
    

}

export function makeRefreshToken(): string {

    const token = randomBytes(32).toString('hex');

    return token;
}