import { config } from 'dotenv';

config();

export default {
  api: { url: process.env.API_URL || 'http://localhost:3333' },
};
