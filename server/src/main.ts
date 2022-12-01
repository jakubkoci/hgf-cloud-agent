import dotenv from 'dotenv-safe'
import { startApp } from './workshop'

dotenv.config({
  allowEmptyValues: true,
  example: '.env.cloud-agent.example',
})
startApp()
