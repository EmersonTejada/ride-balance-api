import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/prisma/index.js';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    // Limpiar tabla de usuarios antes de las pruebas
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // Desconectar Prisma después de las pruebas
    await prisma.$disconnect();
  });

  let token = '';
  const testUser = {
    name: 'Integration Test User',
    email: 'integration@test.com',
    password: 'password123'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Usuario creado exitosamente');
      expect(response.body.data).toHaveProperty('email', testUser.email);
      expect(response.body.data).toHaveProperty('name', testUser.name);
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should fail if email is duplicated', async () => {
      // Intentamos registrar al mismo usuario
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      // Dado que AppError captura esto o Prisma falla, asumimos que devuelve algo que no es 200
      expect(response.status).not.toBe(200);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login and return a token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login exitoso');
      expect(response.body).toHaveProperty('token');
      token = response.body.token; // Guardar el token para la siguiente prueba
    });

    it('should fail with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Contraseña incorrecta');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return the user profile when authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Usuario Verificado');
      expect(response.body.data.user).toHaveProperty('email', testUser.email);
      expect(response.body.data.user).toHaveProperty('name', testUser.name);
    });

    it('should fail when no token is provided', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token no proporcionado');
    });
  });
});
