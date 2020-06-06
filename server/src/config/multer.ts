import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import crypto from 'crypto'
import { Request } from 'express'

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads/data'),
    filename (request, file, callback) {
      const hash = crypto.randomBytes(6).toString('hex')
      const filename = `${hash}-${file.originalname}`

      callback(null, filename)
    }
  }),
  fileFilter: (request: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      const error = new Error('Only "png" or "jpg" file types are allowed!')
      error.stack = ''
      return callback(error)
    }
    callback(null, true)
  }
}
