import express from 'express'
import cors from 'cors'
import path from 'path'
import { errors } from 'celebrate'
import routes from './routes'
import config from './config/hosting'

const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use(errors())

app.listen(config.server.port, () => console.log(`Server listening on ${config.server.port}`))
