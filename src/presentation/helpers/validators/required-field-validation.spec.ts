import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredFieldValidation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    expect(sut.validate({ name: 'any_name' })).toEqual(new MissingParamError('field'))
  })

  it('Should not return validation succeeds', () => {
    const sut = new RequiredFieldValidation('field')
    expect(sut.validate({ name: 'any_name', field: 'any_value' })).toBeFalsy()
  })
})
