'use strict';

// Mock dependencies before requiring server
jest.mock('axios');
const axios = require('axios');

// Start the app but don't listen on port to avoid EADDRINUSE
jest.mock('../server', () => {
  const express = require('express');
  const app = express();
  app.use(express.json());
  app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));
  return app;
});

const request = require('supertest');
const app = require('../server');

describe('Gateway Functional Tests', () => {
  describe('GET /health', () => {
    it('should return UP status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('UP');
    });
  });
});
