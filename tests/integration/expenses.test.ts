import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/prisma/index.js';
import bcrypt from 'bcrypt';

describe('Expenses Integration Tests', () => {
  let token = '';
  let expenseId = '';

  beforeAll(async () => {
    // Limpiar tabla de viajes, gastos y usuarios
    await prisma.ride.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.user.deleteMany();

    // Crear usuario de prueba
    const testUser = {
      name: 'Expenses Test User',
      email: 'expenses-test@example.com',
      password: await bcrypt.hash('password123', 10)
    };

    const user = await prisma.user.create({ data: testUser });

    // Autenticarnos
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'expenses-test@example.com', password: 'password123' });
    
    token = response.body.token;
  });

  afterAll(async () => {
    await prisma.expense.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  const testExpense = {
    amount: 30,
    category: 'fuel',
    subcategory: 'fuel_refill',
    description: 'Gas station'
  };

  describe('POST /api/expenses', () => {
    it('should create a new expense', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${token}`)
        .send(testExpense);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Gasto creado exitosamente');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.category).toBe(testExpense.category);
      
      expenseId = response.body.data.id; 
    });
  });

  describe('GET /api/expenses', () => {
    it('should retrieve all expenses for the user', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Gastos obtenidos exitosamente');
      expect(Array.isArray(response.body.data)).toBeTruthy();
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/expenses/:id', () => {
    it('should retrieve an expense by its ID', async () => {
      const response = await request(app)
        .get(`/api/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(expenseId);
    });
  });

  describe('PATCH /api/expenses/:id', () => {
    it('should update an expense', async () => {
      const response = await request(app)
        .patch(`/api/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ amount: 45 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Gasto actualizado exitosamente');
      expect(Number(response.body.data.amount)).toBe(45);
    });
  });

  describe('DELETE /api/expenses/:id', () => {
    it('should delete an expense', async () => {
      const response = await request(app)
        .delete(`/api/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Gasto eliminado exitosamente');
    });
  });
});
