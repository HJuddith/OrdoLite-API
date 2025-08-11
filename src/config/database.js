import dotenv from 'dotenv';
import fs from 'fs';

// dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// export default {
//   development: {
//     url: process.env.DATABASE_URL,
//     dialect: 'postgres',
//     logging: false
//   },
//   test: {
//     url: process.env.DATABASE_URL,
//     dialect: 'postgres',
//     logging: false
//   },
//   production: {
//     url: process.env.DATABASE_URL,
//     dialect: 'postgres',
//     logging: false
//   }
// };


const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config();
}

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is missing');
}

export default {
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
  },
};