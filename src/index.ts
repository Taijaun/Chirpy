import express from "express";
import { handlerReadiness } from "./handlers/readiness.js";
import { middlewareLogResponses } from "./middleware/logResponses.js";
import { handlerHits } from "./handlers/hits.js";
import { handlerReset } from "./handlers/reset.js";
import { middlewareMetricsInc } from "./middleware/metricsInc.js";
import { handlerValidateChirp } from "./handlers/validateChirp.js";
import { errorHandler } from "./middleware/errorHandler.js";


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
    Promise.resolve(handlerHits(req, res)).catch(next);
});

app.post("/admin/reset", async (req, res, next) => {
    try {
        await handlerReset(req, res);
    } catch (err) {
        next(err);
    }
} );

app.post("/api/validate_chirp",(req, res, next) => {
    Promise.resolve(handlerValidateChirp(req, res)).catch(next);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.use(errorHandler)

