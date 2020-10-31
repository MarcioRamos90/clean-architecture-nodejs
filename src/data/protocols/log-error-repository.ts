export interface LogErrorRepository {
  logError: (error: string) => Promise<void>
}
