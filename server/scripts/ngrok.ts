import ngrok from 'ngrok'
import dotenv from 'dotenv-safe'

dotenv.config({ allowEmptyValues: true })

ngrok
  .connect({
    addr: Number(process.env.PORT) || 3001,
    authtoken: process.env.NGROK_AUTH_TOKEN,
  })
  .then((url) => {
    console.log(url)
  })
