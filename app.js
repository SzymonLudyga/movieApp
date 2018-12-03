const express = require('express');
const movieController = require('./controllers/movieController');
const commentController = require('./controllers/commentController');
const mongoose = require('mongoose');

const app = express();

require('dotenv').config();

const ENV = require('./.env.json');

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
	Title: String,
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

// defining a model

const Movie = mongoose.model('Movie', movieSchema);

// controller

movieController(app, Movie);
commentController(app, Movie);

app.listen(port);

module.exports = app;