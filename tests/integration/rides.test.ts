import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/prisma/index.js';
import bcrypt from 'bcrypt';

describe('Rides Integration Tests', () => {
  let token = '';
  let rideId = '';

  beforeAll(async () => {
    // Limpiar tabla de viajes y usuarios
    await prisma.ride.deleteMany();
    await prisma.user.deleteMany();

    // Crear usuario de prueba
    const testUser = {
      name: 'Rides Test User',
      email: 'rides-test@example.com',
      password: await bcrypt.hash('password123', 10)
    };

    const user = await prisma.user.create({ data: testUser });

    // Autenticarnos para obtener un token real de prueba
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'rides-test@example.com', password: 'password123' });
    
    token = response.body.token;
  });

  afterAll(async () => {
    await prisma.ride.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  const testRide = {
    amount: 15.5,
    platform: 'yummy'
  };

  describe('POST /api/rides', () => {
    it('should create a new ride', async () => {
      const response = await request(app)
        .post('/api/rides')
        .set('Authorization', `Bearer ${token}`)
        .send(testRide);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Viaje creado exitosamente');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.platform).toBe(testRide.platform);
      
      rideId = response.body.data.id; // Guarda para futuras reqs
    });

    it('should block if not authenticated', async () => {
      const response = await request(app)
        .post('/api/rides')
        .send(testRide);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/rides', () => {
    it('should retrieve all rides for the user', async () => {
      const response = await request(app)
        .get('/api/rides')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Viajes obtenidos exitosamente');
      expect(Array.isArray(response.body.data)).toBeTruthy();
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      expect(response.body.data[0].id).toBe(rideId);
    });
  });

  describe('GET /api/rides/:id', () => {
    it('should retrieve a ride by its ID', async () => {
      const response = await request(app)
        .get(`/api/rides/${rideId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(rideId);
    });

    it('should fail for not found ID', async () => {
      const response = await request(app)
        .get('/api/rides/no-valid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/rides/:id', () => {
    it('should update a ride', async () => {
      const response = await request(app)
        .patch(`/api/rides/${rideId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ amount: 20 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Viaje actualizado exitosamente');
      expect(Number(response.body.data.amount)).toBe(20);
    });
  });

  describe('DELETE /api/rides/:id', () => {
    it('should delete a ride', async () => {
      const response = await request(app)
        .delete(`/api/rides/${rideId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Viaje eliminado exitosamente');
    });

    it('should fail accessing deleted ride', async () => {
      const response = await request(app)
        .get(`/api/rides/${rideId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
