import { jest } from '@jest/globals';

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: jest.fn().mockResolvedValue(true)
  })
}));

import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/models/sequelize.js';

export const api = request(app);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});