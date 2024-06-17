import {Server} from "node:http";
import express from 'express';
import {main} from "./hotels";

const port = process.env.PORT;

const app = express();

export const startServer = async () => {
    await new Promise<Server>((resolve) => {
        const httpServer = app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
            resolve(httpServer);
        });
    });
    app.use(express.json({ limit: '50mb' }));
    // app.use(await router());
};

startServer().then(
    () => {
        main();
    }
).catch(console.error);