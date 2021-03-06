const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));

require('dotenv').config();

const ENV = require('./.env.json');
const movieController = require('./controllers/movieController');
const commentController = require('./controllers/commentController');
const errorController = require('./controllers/errorController');

let port = 8000;

if (process.env.NODE_ENV != 'test') {
	port = process.env.PORT || ENV.port;
}

// set up template engine

app.set('view engine', 'ejs');

// static files

app.use(express.static('./public'));

// controllers

movieController(app);
commentController(app);
errorController(app);

app.use((error, res) => {
	res.status(error.status || 500);
	res.render('failure', {err: error.status});
});

app.listen(port);

module.exports = app;