import { asc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewChirp } from "../schema.js";


export async function addChirp(chirp: NewChirp){
    const [result] = await db.insert(chirps).values(chirp).returning();

    return result;
}

export async function getAllChirps(){
    const result = await db
        .select()
        .from(chirps)
        .orderBy(asc(chirps.createdAt));

    return result;
}

export async function getSingleChirp(id: string){
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, id));

    return result;
}

export async function deleteChirp(id: string){
    const [result] = await db
        .delete(chirps)
        .where(eq(chirps.id, id))
        .returning();

    return result;
}

export async function getUsersChirps(id: string){
    const result = await db
        .select()
        .from(chirps)
        .where(eq(chirps.userId, id));

    return result;
}