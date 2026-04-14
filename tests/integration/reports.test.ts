import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/prisma/index.js';
import bcrypt from 'bcrypt';

describe('Reports Integration Tests', () => {
  let token = '';

  beforeAll(async () => {
    // Limpiar base de datos
    await prisma.ride.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.user.deleteMany();

    // Crear usuario de prueba
    const testUser = {
      name: 'Reports Test User',
      email: 'reports-test@example.com',
      password: await bcrypt.hash('password123', 10)
    };
    const user = await prisma.user.create({ data: testUser });

    // Autenticarnos
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'reports-test@example.com', password: 'password123' });
    
    token = response.body.token;

    // Crear datos agregados (Rides y Expenses)
    await prisma.ride.create({
      data: { amount: 100, platform: 'yummy', userId: user.id }
    });
    await prisma.expense.create({
      data: { amount: 30, category: 'fuel', userId: user.id }
    });
  });

  afterAll(async () => {
    await prisma.ride.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // Backend enforces a maximum of 7 days on the difference
  const queryParams = '?from=2024-01-01&to=2024-01-07';

  describe('GET /api/reports/summary', () => {
    it('should return summary report', async () => {
      const response = await request(app)
        .get(`/api/reports/summary${queryParams}`)
        .set('Authorization', `Bearer ${token}`)
        .set('x-timezone', 'America/Caracas');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Reporte obtenido exitosamente');
      expect(response.body.data).toHaveProperty('period');
      expect(response.body.data).toHaveProperty('kpis');
    });
  });

  describe('GET /api/reports/rides', () => {
    it('should return rides report', async () => {
      const response = await request(app)
        .get(`/api/reports/rides${queryParams}`)
        .set('Authorization', `Bearer ${token}`)
        .set('x-timezone', 'America/Caracas');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Reporte obtenido exitosamente');
      expect(response.body.data).toHaveProperty('period');
    });
  });

  describe('GET /api/reports/expenses', () => {
    it('should return expenses report', async () => {
      const response = await request(app)
        .get(`/api/reports/expenses${queryParams}`)
        .set('Authorization', `Bearer ${token}`)
        .set('x-timezone', 'America/Caracas');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Reporte obtenido exitosamente');
      expect(response.body.data).toHaveProperty('period');
    });
  });
});
