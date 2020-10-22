import { SignUpController } from './signup'

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    // sut - system under test
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const sut = new SignUpController()
    const httResponse = sut.handle(httpRequest)
    expect(httResponse.statusCode).toBe(400)
    expect(httResponse.body).toEqual(new Error('Missing param: name'))
  })

  test('Should return 400 if no email is provided', () => {
    // sut - system under test
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const sut = new SignUpController()
    const httResponse = sut.handle(httpRequest)
    expect(httResponse.statusCode).toBe(400)
    expect(httResponse.body).toEqual(new Error('Missing param: email'))
  })
})
