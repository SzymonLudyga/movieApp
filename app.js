const express = require('express');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const app = express();

const movieController = require('./controllers/movieController');
const commentController = require('./controllers/commentController');
const errorController = require('./controllers/errorController');
const ENV = require('./.env.json');

require('dotenv').config();

let port = 8000;

if (process.env.NODE_ENV != 'test') {
	port = ENV.port;
}

// set up template engine

app.set('view engine', 'ejs');

// static files

app.use(express.static('./public'));

// connect to database

mongoose.connect(process.env.DB_URL);

// defining a schema

const movieSchema = new mongoose.Schema({
	Title: { type: String, required: true, unique: true },
	Year: String,
	Rated: String,
	Released: String,
	Runtime: String,
	Genre: String,
	Director: String,
	Writer: String,
	Actors: String,
	Plot: String,
	Language: String,
	Country: String,
	Awards: String,
	Poster: String,
	Ratings: Array,
	Metascore: String,
	imdbRating: String,
	imdbVotes: String,
	imdbID: String,
	Type: String,
	DVD: String,
	BoxOffice: String,
	Production: String,
	Website: String,
	Comments: Array
});

movieSchema.plugin(uniqueValidator);

// defining a model

const Movie = mongoose.model('Movie', movieSchema);

// controller

movieController(app, Movie);
commentController(app, Movie);
errorController(app);

app.listen(port);

module.exports = app;