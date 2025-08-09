import dotenv from 'dotenv';
dotenv.config();

export const dbConfig = process.env.DATABASE_URL
  ? {
      url: process.env.DATABASE_URL,
      dialect: 'postgres',
      logging: false,
      define: {
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    }
  : {
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      database: process.env.DB_NAME ?? 'ordolite_dev',
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? '',
      dialect: 'postgres',
      logging: false,
      define: {
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    };
