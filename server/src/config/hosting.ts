import { config } from 'dotenv'

config()

export default {
  server: {
    url: process.env.BASE_URL || 'http://localhost',
    port: process.env.PORT || 3333
  }
}
