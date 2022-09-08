import ngrok from 'ngrok'
import dotenv from 'dotenv-safe'

dotenv.config()

ngrok.connect(Number(process.env.PORT) || 3001).then((url) => {
  console.log(url)
})
