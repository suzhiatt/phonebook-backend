require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Pbook = require('./models/phonebook')

//POST data arrives as raw JSON, so express parses it and puts it in req.body
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

//this is a function
//body is the name of the placeholder. (req) is called when building a log line. You return what appears where :body should go
morgan.token('body', (req) => {
  //is this a post? Return the data as a string, or else return nothing extra
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

//morgan(tiny) only knows Morgan's built in tokens. To use my token, the string must include body
//used a wrapper because the assignment wants body data only on post
app.use((req, res, next) => {
  if (req.method === 'POST') {
    return morgan(
      ':method :url :status :res[content-length] - :response-time ms :body'
    )(req, res, next)
  } else {
    return morgan('tiny')(req, res, next)
  }
})

let phonebook = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/info', (request, response) => {
  response.send(
    `Phonebook has info for ${phonebook.length} people\n\n${new Date()}`
  )
})

//ask mongoose for all documents, then send them as json
app.get('/api/persons', (request, response) => {
  //find: gets all documents from database
  Pbook.find({}).then(result => {
    //sends them to the browser/REST client
      response.json(result)
      // console.log(pbook.name, pbook.number)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const person = phonebook.find((p) => p.id === request.params.id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).json({ error: 'person not found' })
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = phonebook.find((p) => p.id === id)

  if (!person) {
    return response.status(404).json({ error: 'person not found' })
  }

  phonebook = phonebook.filter((p) => p.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if(body.name === null || undefined || '') {
    return response.status(400).json({ error: 'person not found' })
  }
  else if (body.number === null || undefined || '') {
    return response.status(400).json({ error: 'number not found' })
  }
  else if (phonebook.find(p=> p.name.toLowerCase() === body.name.toLowerCase())) {
    return response.status(400).json( {error: 'name already exists' })
  }
  else {
  const id = String(Math.floor(Math.random() * 100000))

  const person = {
    id,
    name: body.name,
    number: body.number,
  }

  phonebook = phonebook.concat(person)
  response.status(201).json(person)
}
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
