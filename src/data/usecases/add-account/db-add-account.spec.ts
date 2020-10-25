import { DbAddAccount } from './db-add-account'
import { Encrypter, AddAccountModel, AddAccountRepository, AccountModel } from './db-add-account-protocols'

const makeEncrypter = (): Encrypter => {
  class EncrypterStup implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return 'hashad_password'
    }
  }
  return new EncrypterStup()
}

const makeAddRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStup implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'hashed_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountRepositoryStup()
}

interface SutTypes {
  addAccountRepositoryStup: AddAccountRepository
  encrypterStup: Encrypter
  sut: DbAddAccount
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStup = makeAddRepository()
  const encrypterStup = makeEncrypter()
  const sut = new DbAddAccount(encrypterStup, addAccountRepositoryStup)
  return {
    addAccountRepositoryStup,
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

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStup } = makeSut()
    jest.spyOn(encrypterStup, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStup } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStup, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenLastCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashad_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStup } = makeSut()
    jest.spyOn(addAccountRepositoryStup, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
