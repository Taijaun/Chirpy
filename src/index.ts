import express from "express";
import postgres from "postgres";
import { handlerReadiness } from "./handlers/readiness.js";
import { middlewareLogResponses } from "./middleware/logResponses.js";
import { handlerHits } from "./handlers/hits.js";
import { handlerReset } from "./handlers/reset.js";
import { middlewareMetricsInc } from "./middleware/metricsInc.js";
import { handlerValidateChirp } from "./handlers/validateChirp.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerNewUser } from "./handlers/newUser.js";
import { handlerReturnAllChirps, handlerReturnSingleChirp } from "./handlers/returnAllChirps.js";
import { handlerLogin } from "./handlers/handlerLogin.js";
import { handlerRefresh } from "./handlers/handlerRefresh.js";
import { handlerRevoke } from "./handlers/handlerRevoke.js";
import { updateUserDetails } from "./handlers/handlerUpdateUserDetails.js";
import { deleteChirpById } from "./handlers/handlerDeleteChirpById.js";
import { upgradeToChirpyRed } from "./db/queries/users.js";
import { polkaWebhooksUpgrade } from "./handlers/handlerPolkaWebhooksUpgrade.js";

const migrationClient = postgres(config.db.dbString, { max: 1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", async (req, res, next)=> {
    try {
        await handlerReadiness(req, res);
    } catch (err) {
        next(err);
    }
})

app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerHits(req, res, next)).catch(next);
});

app.post("/admin/reset", async (req, res, next) => {
    try {
        await handlerReset(req, res, next);
    } catch (err) {
        next(err);
    }
} );


app.post("/api/users", async (req, res, next) => {
    try {
        await handlerNewUser(req, res, next);
    } catch (err) {
        next(err);
    }
});

app.post("/api/chirps", async (req, res, next) => {
    try {
        await handlerValidateChirp(req, res, next);
    } catch (err) {
        next(err);
    }
})

app.get("/api/chirps", async (req, res, next) => {
    try {
        await handlerReturnAllChirps(req, res, next);
    } catch (err) {
        next(err);
    }
})

app.post("/api/login", async (req, res, next) => {
    try {
        await handlerLogin(req, res, next)
    } catch (err) {
        next(err);
    }
})

app.get(`/api/chirps/:chirpID`, async (req, res, next) => {
    try {
        
        await handlerReturnSingleChirp(req, res, next);
    } catch (err) {
        next(err);
    }
})

app.delete(`/api/chirps/:chirpID`, async (req, res, next) => {
    try {
        await deleteChirpById(req, res, next);
    } catch (err) {
        next(err);
    }
})

app.post("/api/refresh", async (req, res, next) => {
    try {
        await handlerRefresh(req, res, next);
    } catch (err) {
        next(err);
    }
})

app.post("/api/revoke", async (req, res, next) => {
    try {
        await handlerRevoke(req, res, next);
    } catch (err) {
        next(err);
    }
})

app.put("/api/users", async (req, res, next) => {
    try {
        await updateUserDetails(req, res, next);
    } catch (err) {
        next(err);
    }
})

app.post("/api/polka/webhooks", async (req, res, next) => {
    try {
        await polkaWebhooksUpgrade(req, res, next);
    } catch (err) {
        next(err)
    }
})


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
app.use(errorHandler)

