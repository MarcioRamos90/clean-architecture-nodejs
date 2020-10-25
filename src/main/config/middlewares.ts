import { Express } from 'express'
import { bodyParser } from '../middleares/body-parser'
import { cors } from '../middleares/cors'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
}
