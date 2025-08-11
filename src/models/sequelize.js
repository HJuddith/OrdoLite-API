import dbConfig from '../config/database.js';
import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';
const config = {
  ...dbConfig[env],
  define: {
    underscored: true,       
    timestamps: true,        
    createdAt: 'created_at', 
    updatedAt: 'updated_at', 
  },
};

export const sequelize = config.url
  ? new Sequelize(config.url, config)
  : new Sequelize(config.database, config.username, config.password, config);
