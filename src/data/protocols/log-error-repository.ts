export interface LogErrorRepository {
  log: (error: string) => Promise<void>
}
