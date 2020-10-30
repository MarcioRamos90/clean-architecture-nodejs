import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LoggerControllerDecorator } from './log'

interface SutTypes {
  sut: LoggerControllerDecorator
  controllerStub: Controller
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Marcio',
          email: 'marrcio@mainModule.com',
          password: '12344',
          passwordConfirmation: '12344'
        }
      }
      return httpResponse
    }
  }
  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()

  const sut = new LoggerControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
  }
}

describe('Log Controller Decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation'

      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of controller', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation'

      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Marcio',
        email: 'marrcio@mainModule.com',
        password: '12344',
        passwordConfirmation: '12344'
      }
    })
  })
})
