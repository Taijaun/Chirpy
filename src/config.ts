import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile()

type APIConfig = {
    fileserverHits: number;
    db: DBConfig;
    platform: string;
};

type DBConfig = {
    dbString: string;
    migrationConfig: MigrationConfig;
}

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations"
}

function envOrThrow(key: string){
    let value = process.env[key];

    if (typeof value !== "string"){
        throw new Error("Database url missing");
    }

    return value;
}

const dbConfig: DBConfig = {
    dbString: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig
}

export let config: APIConfig = {
    fileserverHits: 0,
    db: dbConfig,
    platform: envOrThrow("PLATFORM")
}




