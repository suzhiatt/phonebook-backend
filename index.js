require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Pbook = require('./models/phonebook')

//POST data arrives as raw JSON, so express parses it and puts it in req.body
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

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

app.get('/api/persons/:id', (request, response, next) => {
  Pbook.findById(request.params.id).then(person => {
    if(person) {response.json(person)}
  else {
    response.status(404).json({ error: 'person not found' }).end()
  }})
  .catch(error => next(error))
})
  
app.post('/api/persons', (request, response) => {
  const body = request.body
    if(body.name === null || body.name ===undefined || body.name ==='') {
      return response.status(400).json({ error: 'person not found' })
    }
    else if (body.number === null || body.number ===undefined || body.number ==='') {
      return response.status(400).json({ error: 'number not found' })
    }
    Pbook.findOne({name: body.name}).then(existing => {
      if (existing) {
          existing.number = body.number, 
          existing.save().then((updated) => {
            response.json(updated)
          })
      }
      else { 

      
  const person = new Pbook({ 
    name: body.name, 
    number: body.number, 
  })
    person.save().then(savedPerson => {
      response.json(savedPerson)
        console.log(`added ${body.name} number ${body.number}`)
})}})
})

app.delete('/api/persons/:id', (request, response) => {
  Pbook.findByIdAndDelete(request.params.id).then(person => {
    if(person) {
      response.status(204).end()
    }
    else {
      response.status(404).json({ error: 'person not found' })
    }}
  )
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
