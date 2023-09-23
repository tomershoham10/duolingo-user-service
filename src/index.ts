import mongoose from "mongoose";
import startServer from "./server.js";

const mongoLocalURL = process.env.MONGO_URL_LOCAL as string;
const mongoDockerURL = process.env.MONGO_URL_DOCKER as string;

(async () => {
  try {
    await mongoose.connect("mongodb://mongo:27017/Users");
    console.log("connected");
    startServer();
  } catch (e) {
    console.log(e);
  }
})();
