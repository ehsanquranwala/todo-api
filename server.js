// https://github.com/ehsanquranwala/todo-api

const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
// const Task = require('./api/models/todo-list-model'); // created model loading here

const firebase = require('firebase');
// require('firebase/auth');
// require('firebase/database');
// require('firebase/messaging');

const config = {
  apiKey: 'AIzaSyA_RVArV6FBSVQ_Aip36PwHVJXLLb4dvbI',
  authDomain: 'todoapi-9b540.firebaseapp.com',
  databaseURL: 'https://todoapi-9b540.firebaseio.com',
  projectId: 'todoapi-9b540',
  storageBucket: 'todoapi-9b540.appspot.com',
  messagingSenderId: '572701628623'
};

firebase.initializeApp(config);

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb', { useNewUrlParser: true });

const app = require('fastify')({ logger: true });
const routes = require('./api/routes/todo-list-routes');

routes(app);

// Run the server!
app.listen(port, err => {
  if (err) {
    app.log.error(err);
    throw new Error('Something bad happened!');
  }

  app.log.info(`server listening on ${app.server.address().port}`);
});

app.get('/', (request, reply) => {
  reply.send({ TODO: 'API' });
});

// TEST INFO FOR LOGIN ENDPOINT
// http://localhost:3000/login, POST request
// {
// "email":"ehsantemp@gmail.com",
// "password":"temp2341"
// }
// Content-Type = application/json
app.post('/login', (request, reply) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(request.body.email, request.body.password)
    .then(function(firebaseUser) {
      reply.send({ status: 'login_success', loggedUser: firebaseUser });
    })
    .catch(function(err) {
      reply.send({ status: 'login_failure', err });
    });
});

// TEST INFO FOR REGISTER ENDPOINT
// http://localhost:3000/register, POST request
// {
// "email":"your email",
// "password":"your pwd"
// }
// Content-Type = application/json
app.post('/register', (request, reply) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(request.body.email, request.body.password)
    .then(function(firebaseUser) {
      reply.send({ status: 'register_success', registeredUser: firebaseUser });
    })
    .catch(function(err) {
      reply.send({ status: 'register_failure', err });
    });
});

app.decorate('notFound', (request, reply) => {
  reply
    .code(404)
    .type('text/html')
    .send('Not Found');
});

app.setNotFoundHandler(app.notFound);
