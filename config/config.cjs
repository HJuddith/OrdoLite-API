import fs from 'fs';
import dotenv from 'dotenv';

const envFile = `.env`;

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
  console.log(`Loaded ${envFile}`);
} else {
  dotenv.config();
  console.log(`Loaded default .env`);
}

console.log(process.env.DATABASE_URL)

export default function () {
  return {
    development: {
      url: process.env.DATABASE_URL,
      dialect: 'postgres',
      logging: false,
    },
    test: {
      url: process.env.DATABASE_URL,
      dialect: 'postgres',
      logging: false,
    },
    production: {
      url: process.env.DATABASE_URL,
      dialect: 'postgres',
      logging: false,
    }
  };
}
