import request from 'supertest'
import app from '../config/app'

describe('SinUp Routes', () => {
  test('Should reuturns an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Marcio',
        email: 'marcio.ramos@mail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
