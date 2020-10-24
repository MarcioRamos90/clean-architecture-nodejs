import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encryter'

const makeEncrypter = (): Encrypter => {
  class EncrypterStup implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return 'hashad_password'
    }
  }
  return new EncrypterStup()
}

interface SutTypes {
  encrypterStup: Encrypter
  sut: DbAddAccount
}

const makeSut = (): SutTypes => {
  const encrypterStup = makeEncrypter()
  const sut = new DbAddAccount(encrypterStup)
  return {
    encrypterStup,
    sut
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStup } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStup, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenLastCalledWith('valid_password')
  })
})
