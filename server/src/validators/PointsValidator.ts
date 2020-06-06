import { celebrate, Segments, Joi } from 'celebrate'

export default {
  create: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required().not(0),
      longitude: Joi.number().required().not(0),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required().regex(/^\d+(,\d+)*$/)
    })
  })
}
