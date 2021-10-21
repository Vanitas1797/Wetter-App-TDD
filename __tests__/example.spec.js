const request = require('supertest');
const app = require('../src/app');

describe('Todos API', () => {
  it('GET /todos --> array todos', () => {
    return request(app)
      .get('/examples')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining([
            {
              id: expect.any(Number),
              name: expect.any(String),
              completed: expect.any(Boolean),
            },
          ])
        );
      });
  });

  it('GET /todos/id --> specific todo by ID', () => {});
  it('GET /todos/id --> 404 if not found', () => {});
  it('POST /todos --> created todo', () => {});
  it('GET /todos --> validates request body', () => {});
});
