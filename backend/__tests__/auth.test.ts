import request from 'supertest';
import app from '../server';
import knex from '../src/config/db';

describe('Auth Routes', () => {
  beforeEach(async () => {
    // Limpa o banco de dados antes de cada teste
    await knex('users').del();
  });

  // Testes para a rota /register
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');
    });

    it('should return 400 if validation fails (missing username)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should return 400 if user already exists', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'existinguser',
          email: 'existing@example.com',
          password: 'Password123',
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'existinguser',
          email: 'existing@example.com',
          password: 'Password123',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Usuário já existe com este email');
    });
  });

  // Testes para a rota /login
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Garante que um usuário exista para o login
      await knex('users').insert({
        username: 'loginuser',
        email: 'login@example.com',
        password_hash: await require('bcryptjs').hash('Password123', 10),
      });
    });

    it('should log in an existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Password123',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 400 if validation fails (missing email)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'Password123',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Senha inválida');
    });
  });
});

afterAll(async () => {
  await knex.destroy();
});