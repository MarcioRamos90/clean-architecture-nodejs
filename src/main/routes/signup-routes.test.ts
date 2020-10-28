import { MongoHelper } from '../../infra/criptography/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'

describe('SinUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
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
