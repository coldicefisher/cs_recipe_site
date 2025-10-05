import dotenv from 'dotenv'
dotenv.config()
import { app } from './app.js'
import { initDatabase } from './db/init.js'

const PORT = Number(process.env.PORT) || 3000

await initDatabase()
app.listen(PORT)
console.info(`Server is running on http://localhost:${PORT}`)
