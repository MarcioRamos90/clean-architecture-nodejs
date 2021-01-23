import { MissingParamError } from '../../errors'
import { ValidationComposite } from './validation-composite'
import { Validation } from './validation'

describe('ValidationComposite', () => {
  it('Should return an error if any fails', () => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return new MissingParamError('any_value')
      }
    }
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('any_value'))
  })
})
