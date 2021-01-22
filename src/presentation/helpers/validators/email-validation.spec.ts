import { EmailValidation } from './email-validation'
import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStup implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStup()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSignUpSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSignUpSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(sut.validate).toThrow()
  })

  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSignUpSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate('any_email@mail.com')
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct Email', () => {
    const { sut, emailValidatorStub } = makeSignUpSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'any_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
