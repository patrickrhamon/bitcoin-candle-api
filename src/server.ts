import { config } from 'dotenv'
import { app } from './app'
import { connectToMongoDb } from './config/db'
import { connection } from 'mongoose'
import CandleMessageChannel from './messages/CandleMessageChannel'

const createServer = async () => {
    config()
    await connectToMongoDb()
    const PORT = process.env.PORT || 3000
    const server = app.listen(PORT, () => console.log(`App running on port ${PORT}`))

    const candleMsgChannel = new CandleMessageChannel(server)
    candleMsgChannel.consumeMessages()

    process.on('SIGINT', async () => {
        await connection.close()
        server.close()
        console.log('App Server and MongoDB connection as closed')
    })
}

createServer()
