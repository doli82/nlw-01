import { Request, Response } from 'express'
import knex from '../database/connection'
import config from '../config/hosting'

interface PointInterface {
    image: string
    image_url?: string
    name: string,
    email: string,
    whatsapp: string,
    latitude: number,
    longitude: number,
    city: string,
    uf: string
}

class PointsController {
  async index (request: Request, response: Response) {
    const { city = '', uf = '', items } = request.query

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .modify(queryBuilder => {
        if (items) {
          const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()))
          queryBuilder.whereIn('point_items.item_id', parsedItems)
        }

        queryBuilder.where('city', 'like', `%${String(city)}%`)
        queryBuilder.where('uf', 'like', `%${String(uf)}%`)
        queryBuilder.distinct()
        queryBuilder.select('points.*')
      })
    const serializedPoints = points.map((point: PointInterface) => ({
      ...point,
      image_url: `${config.server.url}:${config.server.port}/uploads/data/${point.image}`
    }))
    return response.json(serializedPoints)
  }

  async view (request: Request, response: Response) {
    const { id } = request.params
    const point = await knex('points')
      .where('id', id)
      .first<PointInterface>()
    if (!point) {
      return response.status(400).json({ message: 'Point not found' })
    }
    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')

    const serializedPoint = {
      ...point,
      image_url: `${config.server.url}:${config.server.port}/uploads/data/${point.image}`
    }
    return response.json({ point: serializedPoint, items })
  }

  async create (request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = request.body
    const trx = await knex.transaction()

    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    } as PointInterface
    const insertedIds = await trx('points').insert(point)
    const point_id = insertedIds[0]
    const pointItems = String(items)
      .split(',')
      .map((item:string) => Number(item.trim()))
      .map((item_id: number) => ({
        item_id,
        point_id
      }))
    await trx('point_items').insert(pointItems)
    await trx.commit()
    return response.json({ id: point_id, ...point })
  }

  async update (request: Request, response: Response) {
    const { id } = request.params
    const {
      name,
      email,
      image,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    } = request.body
    const pointData = {
      image,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    } as PointInterface
    const success = await knex('points')
      .where('id', id)
      .update(pointData)

    if (!success) {
      return response.status(400).json({ message: 'Point not updated' })
    }
    return response.json({ id, ...pointData })
  }

  async delete (request: Request, response: Response) {
    const { id } = request.params
    const success = await knex('points').where('id', id).delete<boolean>()
    if (!success) {
      return response.status(400).json({ message: 'Point not found' })
    }
    return response.json({ message: 'Point successful deleted' })
  }
}

export default new PointsController()
