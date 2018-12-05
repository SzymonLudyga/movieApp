const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

require('dotenv').config();

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

module.exports = Movie;