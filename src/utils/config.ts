import dotenv from "dotenv";
dotenv.config();

const config = {
  http: {
    port: process.env.PORT || 4000,
  },
  db: {},
};

export default config;
