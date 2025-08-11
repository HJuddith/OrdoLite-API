import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/models/sequelize.js';

export const api = request(app);

let accessToken;
let refreshToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Auth – Tests d’authentification', () => {

  test('REG-001 – Inscription OK', async () => {
    const res = await api.post('/api/v1/auth/register').send({
      first_name: 'Alice',
      last_name: 'Doe',
      email: 'test@example.com',
      password: 'pass123'
    });
    console.log('Register response:', res.statusCode, res.body);
    expect(res.statusCode).toBe(201);
  });

  test('REG-003 – Inscription KO (email déjà pris)', async () => {
    const res = await api.post('/api/v1/auth/register').send({
      first_name: 'Alice',
      last_name: 'Dup',
      email: 'test@example.com',
      password: 'pass123'
    });
    expect(res.statusCode).toBe(409);
  });

  test('SEC-001 – Prévention XSS sur champs texte', async () => {
  const res = await api.post('/api/v1/auth/register').send({
    first_name: '<script>alert("xss")</script>',
    last_name: 'Doe',
    email: 'xss@example.com',
    password: 'pass123'
  });

  expect(res.statusCode).toBe(201);
  expect(res.body.email).not.toMatch(/<script>/i);
});

  test('LOG-001 – Connexion OK', async () => {
    const res = await api.post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'pass123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  test('ME-001 – Récupérer profil utilisateur connecté', async () => {
    const res = await api.get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'test@example.com');
  });

  test('REFRESH-001 – Refresh token valide', async () => {
    const res = await api.post('/api/v1/auth/refresh').send({
      refresh_token: refreshToken
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('access_token');
  });

  test('REFRESH-002 – Refresh token invalide', async () => {
    const res = await api.post('/api/v1/auth/refresh').send({
      refresh_token: 'invalid.token.here'
    });
    expect(res.statusCode).toBe(401);
  });

  test('LOGOUT-001 – Déconnexion (révocation refresh token)', async () => {
    const res = await api.post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refresh_token: refreshToken });
    expect(res.statusCode).toBe(204);
  });
});
