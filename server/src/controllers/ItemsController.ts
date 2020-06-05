import { Request, Response } from 'express'
import knex from '../database/connection'
import config from '../config/hosting'

class ItemsController {
  async index (request:Request, response: Response) {
    const items = await knex('items').select('*')
    const serializedItems = items.map(item => ({
      id: item.id,
      title: item.title,
      image_url: `${config.server.url}:${config.server.port}/uploads/${item.image}`
    }))
    return response.json(serializedItems)
  }

  async delete (request: Request, response: Response) {
    const { id } = request.params
    const success = await knex('items').where('id', id).delete<boolean>()
    if (!success) {
      return response.status(400).json({ message: 'Item not found' })
    }
    return response.json({ message: 'Item successful deleted' })
  }
}

export default new ItemsController()
