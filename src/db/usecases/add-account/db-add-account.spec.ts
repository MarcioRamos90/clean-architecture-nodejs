import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterStup {
      async encrypt (value: string): Promise<string> {
        return 'hashad_password'
      }
    }
    const encrypterStup = new EncrypterStup()
    const sut = new DbAddAccount(encrypterStup)
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
