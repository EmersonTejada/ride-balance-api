import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/prisma/index.js';
import bcrypt from 'bcrypt';

describe('Dashboard Integration Tests', () => {
  let token = '';

  beforeAll(async () => {
    // Limpiar base de datos
    await prisma.ride.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.user.deleteMany();

    // Crear usuario de prueba
    const testUser = {
      name: 'Dashboard Test User',
      email: 'dashboard-test@example.com',
      password: await bcrypt.hash('password123', 10)
    };
    const user = await prisma.user.create({ data: testUser });

    // Autenticarnos
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'dashboard-test@example.com', password: 'password123' });
    
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

  describe('GET /api/dashboard/weekly', () => {
    it('should return weekly dashboard kpis and charts', async () => {
      const response = await request(app)
        .get('/api/dashboard/weekly')
        .set('Authorization', `Bearer ${token}`)
        .set('x-timezone', 'America/Caracas'); // Pasar el header requerido

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Dashboard semanal');
      expect(response.body.data).toHaveProperty('period');
      expect(response.body.data).toHaveProperty('kpis');
      expect(response.body.data).toHaveProperty('charts');

      const kpis = response.body.data.kpis;
      expect(Number(kpis.totalIncome)).toBe(100);
      expect(Number(kpis.totalExpenses)).toBe(30);
      expect(Number(kpis.netIncome)).toBe(70);
    });

    it('should fail if unauthenticated', async () => {
      const response = await request(app).get('/api/dashboard/weekly');
      expect(response.status).toBe(401);
    });
  });
});
