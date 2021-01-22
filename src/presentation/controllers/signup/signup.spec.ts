import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel, Validation } from './signup-protocols'
import { HttpRequest } from '../../protocols'
import { ok, serverError, badRequest } from '../../helpers/http-helper'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStup implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStup()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStup implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new AddAccountStup()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSignUpSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const emailValidatorStub = makeEmailValidator()
  const validationStub = makeValidation()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub
  }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'

  }
})

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    // sut - system under test
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const { sut } = makeSignUpSut()
    const httResponse = await sut.handle(httpRequest)
    expect(httResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Should return 400 if no email is provided', async () => {
    // sut - system under test
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const { sut } = makeSignUpSut()
    const httResponse = await sut.handle(httpRequest)
    expect(httResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    // sut - system under test
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const { sut } = makeSignUpSut()
    const httResponse = await sut.handle(httpRequest)
    expect(httResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if no confirmation is provided', async () => {
    // sut - system under test
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const { sut } = makeSignUpSut()
    const httResponse = await sut.handle(httpRequest)
    expect(httResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('Should return 400 if password fails', async () => {
    // sut - system under test
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const { sut } = makeSignUpSut()
    const httResponse = await sut.handle(httpRequest)
    expect(httResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    // sut - system under test
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'

      }
    }
    const { sut, emailValidatorStub } = makeSignUpSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httResponse = await sut.handle(httpRequest)
    expect(httResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct Email', async () => {
    const { sut, emailValidatorStub } = makeSignUpSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeHttpRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSignUpSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httResponse = await sut.handle(makeFakeHttpRequest())
    expect(httResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSignUpSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => { throw new Error() })
    const httResponse = await sut.handle(makeFakeHttpRequest())
    expect(httResponse).toEqual(serverError(new ServerError()))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSignUpSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeHttpRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSignUpSut()
    const httResponse = await sut.handle(makeFakeHttpRequest())
    expect(httResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSignUpSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSignUpSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httResponse = await sut.handle(makeFakeHttpRequest())
    expect(httResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
