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
var firebase = require('firebase');
require('firebase/auth');
require('firebase/database');
require('firebase/messaging');
  // Initialize Firebase for the application
var config = {
    apiKey: "AIzaSyA_RVArV6FBSVQ_Aip36PwHVJXLLb4dvbI",
    authDomain: "todoapi-9b540.firebaseapp.com",
    databaseURL: "https://todoapi-9b540.firebaseio.com",
    projectId: "todoapi-9b540",
    storageBucket: "todoapi-9b540.appspot.com",
    messagingSenderId: "572701628623"
};

firebase.initializeApp(config);

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require('./api/routes/todo-list-routes');
routes(app); // register the route

app.listen(port);
console.log('todo list RESTful API server started on: ' + port);

app.get('/', (request, reply) => {
  reply.send({ TODO: 'API' });
});


//TEST INFO FOR LOGIN ENDPOINT
//http://localhost:3000/login, POST request
//email='ehsantemp@gmail.com', password='temp2341'
//Content-Type = application/x-www-form-urlencoded
app.post('/login', (request, reply) => {

firebase.auth().signInWithEmailAndPassword(request.body.email, request.body.password)
.then(function(firebaseUser) {
//  console.log(firebaseUser);
  reply.send({ status: 'login_success', loggedUser: firebaseUser });
})
.catch(function(error){
//  console.log(error);
  reply.send({ status: 'login_failure', error: error });
})
});

//TEST INFO FOR REGISTER ENDPOINT
//http://localhost:3000/register, POST request
//email=any, password=any
//Content-Type = application/x-www-form-urlencoded
app.post('/register', (request, reply) => {
firebase.auth().createUserWithEmailAndPassword('signup@gmail.com', 'register123')
.then(function(firebaseUser) {
//  console.log(firebaseUser);
reply.send({ status: 'register_success', registeredUser: firebaseUser });
})
.catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  //  console.log(errorMessage);
  reply.send({ status: 'register_failure', error: error });
});
});

app.use(function(req, res) {
  res.status(404).send('url: "' + req.originalUrl + '" not found');
});
