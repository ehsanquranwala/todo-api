/* // Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

// Declare a route
fastify.get('/', (request, reply) => {
  reply.send({ hello: 'world' })
})

fastify.get('/register', (request, reply) => {
  reply.send({ register: 'user' })
})

// Run the server!
fastify.listen(3000, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${fastify.server.address().port}`)
}) */

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const Task = require('./api/models/todo-list-model'); // created model loading here

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require('./api/routes/todo-list-routes');
// importing route
routes(app); // register the route

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

app.get('/', (request, reply) => {
  reply.send({ hello: 'world' });
});

app.use(function(req, res) {
  res.status(404).send('url: "' + req.originalUrl + '" not found');
});
