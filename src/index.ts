import { connect } from "mongoose";
import startServer from "./server.js";

const mongoLocalURL = process.env.MONGO_URL_LOCAL as string;
const mongoDockerURL = process.env.MONGO_URL_DOCKER as string;
const mongoURI = 'mongodb://mongo:27017/Users?directConnection=true';

(async () => {
  try {
    console.log("mongoURI", mongoURI);
    await connect(mongoURI);

    console.log("connected");
    startServer();
  } catch (e) {
    console.log(e);
  }
})();
