import { db } from "../index.js";
import { RefreshToken, refreshTokens } from "../schema.js";

export async function addRefreshToken(token: RefreshToken){
    const [result] = await db.insert(refreshTokens).values(token).returning();

    return result;
}