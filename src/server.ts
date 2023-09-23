import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./router.js";
import config from "./utils/config.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { Express } from "express-serve-static-core";

const startServer = () => {
  const port = config.http.port;
  const app = express();
  configureMiddlewares(app);
  app.use(router);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

const configureMiddlewares = (app: Express) => {
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
      exposedHeaders: ["Authorization"],
    })
  );
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(errorHandler);
};

export default startServer;
