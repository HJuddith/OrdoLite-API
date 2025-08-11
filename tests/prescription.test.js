import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/models/sequelize.js';

export const api = request(app);

let accessToken;

beforeAll(async () => {
    await sequelize.sync({ force: true });

   // Création utilisateur
  await api.post('/api/v1/auth/register').send({
    first_name: 'Alice',
    last_name: 'Doe',
    email: 'alice.test@example.com',
    password: 'pass123'
  });

  // Login
  const login = await api.post('/api/v1/auth/login').send({
    email: 'alice.test@example.com',
    password: 'pass123'
  });

  console.log('LOGIN RESPONSE:', login.body); 
  accessToken = login.body.accessToken;
});


describe('Prescriptions', () => {

  test('ORD-001 – Création ordonnance OK', async () => {
    const res = await api.post('/api/v1/prescriptions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Ordo Test',
        prescriber: 'Dr House',
        notes: 'Test notes'
      });
    expect(res.statusCode).toBe(201);
  });

  test('ORD-002 – Liste de mes ordonnances', async () => {
    const res = await api.get('/api/v1/prescriptions')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
