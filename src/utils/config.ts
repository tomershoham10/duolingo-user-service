import dotenv from 'dotenv';
dotenv.config();

const config = {
  http: {
    port: process.env.PORT || 4001,
  },
  db: {},
};

export default config;
