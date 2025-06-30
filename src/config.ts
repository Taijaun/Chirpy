process.loadEnvFile()

type APIConfig = {
    fileserverHits: number;
    dbURL: string;
};

function envOrThrow(key: string){
    let value = process.env[key];

    if (typeof value !== "string"){
        throw new Error("Database url missing");
    }

    return value;
}

export let config: APIConfig = {
    fileserverHits: 0,
    dbURL: envOrThrow("DB_URL")
}
