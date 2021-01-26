import { DbAddAccount } from './db-add-account'
import { Hasher, AddAccountModel, AddAccountRepository, AccountModel } from './db-add-account-protocols'

const makeHasher = (): Hasher => {
  class HasherStup implements Hasher {
    async hash (value: string): Promise<string> {
      return 'hashad_password'
    }
  }
  return new HasherStup()
}

const makeAddRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStup implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new AddAccountRepositoryStup()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

interface SutTypes {
  addAccountRepositoryStup: AddAccountRepository
  hasherStup: Hasher
  sut: DbAddAccount
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStup = makeAddRepository()
  const hasherStup = makeHasher()
  const sut = new DbAddAccount(hasherStup, addAccountRepositoryStup)
  return {
    addAccountRepositoryStup,
    hasherStup,
    sut
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStup } = makeSut()
    const hashSpy = jest.spyOn(hasherStup, 'hash')
    await sut.add(makeFakeAccountData())
    expect(hashSpy).toHaveBeenLastCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStup } = makeSut()
    jest.spyOn(hasherStup, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStup } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStup, 'add')
    await sut.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenLastCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashad_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStup } = makeSut()
    jest.spyOn(addAccountRepositoryStup, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account if success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
