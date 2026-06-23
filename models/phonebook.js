const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
require('dotenv').config()

const url = process.env.MONGODB_URI
console.log('MONGODB_URI is:', process.env.MONGODB_URI ? 'set' : 'UNDEFINED')

mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB: ', error.message)
  })

  const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  //every time one of these docs is converted to JSON, run this to change what gets sent
phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
  })

  module.exports = mongoose.model('Pbook', phonebookSchema)
