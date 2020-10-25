import { Express } from 'express'
import { bodyParser } from '../middleares/body-parser'
import { cors } from '../middleares/cors'
import { contentType } from '../middleares/content-type'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
