import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { RefreshToken, refreshTokens } from "../schema.js";

export async function addRefreshToken(token: RefreshToken){
    const [result] = await db.insert(refreshTokens).values(token).returning();

    return result;
}

export async function lookupTokenInDb(token: string){
    const result = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));

    return result;
}

export async function revokeToken(token: string){
    const result = await db.update(refreshTokens)
        .set({revokedAt: new Date(Date.now())})
        .where(eq(refreshTokens.token, token));

    return result;
}