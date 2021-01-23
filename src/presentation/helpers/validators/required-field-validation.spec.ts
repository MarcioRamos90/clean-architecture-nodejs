import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredFieldValidation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    expect(sut.validate({ name: 'any_name' })).toEqual(new MissingParamError('field'))
  })

  it('Should not return validation succeeds', () => {
    const sut = makeSut()
    expect(sut.validate({ name: 'any_name', field: 'any_value' })).toBeFalsy()
  })
})
