import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredFieldValidation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field')
    expect(sut.validate({ name: 'any_name' })).toEqual(new MissingParamError('any_field'))
  })
})
