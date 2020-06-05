import express from 'express'
import multer from 'multer'
import { celebrate, Joi } from 'celebrate'
import multerConfig from './config/multer'

import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const routes = express.Router()
const upload = multer(multerConfig)

routes.get('/items', ItemsController.index)
routes.delete('/items/:id', ItemsController.delete)

routes.get('/points', PointsController.index)
routes.get('/points/:id', PointsController.view)
routes.post('/points',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required().regex(/^\d+(,\d+)*$/)
    })
  }),
  PointsController.create
)
routes.put('/points/:id', PointsController.update)
routes.delete('/points/:id', PointsController.delete)

export default routes
