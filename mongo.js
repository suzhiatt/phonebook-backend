const mongoose = require('mongoose')

//url = directions to your database, go there and stay connected while the server runs

const phonebookSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
})

const Pbook = mongoose.model('Pbook', phonebookSchema)

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

//access command line parameter, will add new doc to db
const password = process.argv[2]
const url = `mongodb+srv://suzhiatt:${password}@cluster0.xnxqotd.mongodb.net/PbookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

const name = process.argv[3]
const number = process.argv[4]



//connection to database is est with this command
mongoose.connect(url, { family: 4 })
  .then(() => {
    if (process.argv.length === 3) {
        console.log('phonebook: ')
      Pbook.find({}).then(result => {
        result.forEach(pbook => {
          console.log(pbook.name, pbook.number)
        })
        mongoose.connection.close()
      })
    } else if (process.argv.length === 5) {
      const newEntry = new Pbook({ name, number, id: '' })
      newEntry.save().then(() => {
        console.log(`added ${name} number ${number}`)
        mongoose.connection.close()
      })
    } else {
      console.log('give password, optional name and number')
      mongoose.connection.close()
    }
  })

