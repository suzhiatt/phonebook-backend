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
    name: {
        type: String,
        minlength: 3,
        required: true,

    },
    number: {
        type: String,
        minlength: 8,
        required: true,
        validate: {
          validator: function(value) {
            return /^\d{2,3}-\d+$/.test(value)
          },
          message: "Please enter valid number with a dash after the 2 or 3 digits"
        },
    },
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
