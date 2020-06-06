import express from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'
import PointsValidator from './validators/PointsValidator'

const routes = express.Router()
const upload = multer(multerConfig)

routes.get('/items', ItemsController.index)
routes.delete('/items/:id', ItemsController.delete)

routes.get('/points', PointsController.index)
routes.get('/points/:id', PointsController.view)
routes.post('/points', upload.single('image'), PointsValidator.create, PointsController.create)
routes.put('/points/:id', PointsController.update)
routes.delete('/points/:id', PointsController.delete)

export default routes
