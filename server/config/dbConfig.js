const mongoose = require('mongoose')
require('dotenv').config()
DB_URI = process.env.DB_URI

const dbConnect = async () => {
    try {
        const url = DB_URI
        const db = mongoose.connection
        mongoose.connect(url)
        db.once('open', (_) => {
            console.log('Database has been connected')
        })
        db.on('error', (err) => {
            console.error('connection error')
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = dbConnect
