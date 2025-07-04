
import { sql } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, users } from "../schema.js";


export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function removeAllUsers() {
    const result = await db.delete(users);
    return result;
}