
import { eq, sql } from "drizzle-orm";
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

export async function selectUserByEmail(email: string) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    
    return result;
}

export async function selectUserById(id: string){
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));

    return result;
}

export async function updateUserEmail(user: NewUser, email: string) {
    if (!(typeof(user.id) === "string")){
        throw new Error("Invalid user")
    }

    const [result] = await db
        .update(users)
        .set({email: email})
        .where(eq(users.id, user.id))
        .returning()

    return result;
}

export async function updateUserPassword(user: NewUser, password: string){
    if (!(typeof(user.id) === "string")){
        throw new Error("Invalid user")
    }

    const [result] = await db
        .update(users)
        .set({hashedPassword: password})
        .where(eq(users.id, user.id))
        .returning()

    return result;
}