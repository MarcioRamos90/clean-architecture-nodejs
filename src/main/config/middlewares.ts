import { Express } from 'express'
import { bodyParser } from '../middleares/body-parser'

export default (app: Express): void => {
  app.use(bodyParser)
}
