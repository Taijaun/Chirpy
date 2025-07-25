import { sql } from "drizzle-orm";
import { pgTable, timestamp, varchar, uuid, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: varchar("email", { length: 256 }).unique().notNull(),
    hashedPassword: varchar("hashed_password").default("unset").notNull(),
    isChirpyRed: boolean("is_chirpy_red").default(sql`false`).notNull(),
});

export type NewUser = typeof users.$inferInsert;

export const chirps = pgTable("chirps", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    body: varchar("body", { length: 140 }).notNull(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade"}),
});

export type NewChirp = typeof chirps.$inferInsert;

export const refreshTokens = pgTable("refresh_tokens", {
    token: varchar("token").primaryKey().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade"}),
    expiresAt: timestamp("expires_at").notNull(),
    revokedAt: timestamp("revoked_at")
})

export type RefreshToken = typeof refreshTokens.$inferInsert;