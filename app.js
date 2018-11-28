const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const requisition = require('requisition');
const app = express();

const config = require('./config.js');

let port = 8000;

app.use(bodyParser.json());
const urlencodedParser = bodyParser.urlencoded({extended: true});

if (process.env.NODE_ENV != 'test') {
    port = config.port;
}

// set up template engine

app.set('view engine', 'ejs');

// static files

app.use(express.static('./public'));

// connect to database

mongoose.connect(config.movie_db);

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

// simple get for testing purposes

app.get('/', function (req, res){
    res.send('Movie api');
});


// 1. getting movies from mongodb database
// 2. sorting by movie title
// 3. passing result to the view

app.get('/movies', function(req, res){

    try 
    {
        Movie.find({}, null, {sort: {'item.Title': 1}}, function(err, data){
            if(err) throw err;
            res.render('movie', {movies: data});
        });
    }
    catch(err)
    {
        res.send(err.status)
    }
});


// 1. passing request body in post method (validating presence of req.body)
// 2. getting movie details from ombdApi based on request body
// 3. saving movie details to mongodb database

app.post('/movies', urlencodedParser, async function(req, res){

    if(req.body.item)
    {
        const subrequest = await requisition(`http://www.omdbapi.com/?t=${req.body.item}&apikey=${config.API_KEY}`);
        const movieObj = await subrequest.json();

        if(!movieObj.Error && movieObj.Title)
        {
            try 
            {

                Movie({
                    Title: movieObj.Title,
                    Year: movieObj.Year,
                    Rated: movieObj.Rated,
                    Released: movieObj.Released,
                    Runtime: movieObj.Runtime,
                    Genre: movieObj.Genre,
                    Director: movieObj.Director,
                    Writer: movieObj.Writer,
                    Actors: movieObj.Actors,
                    Plot: movieObj.Plot,
                    Language: movieObj.Language,
                    Country: movieObj.Country,
                    Awards: movieObj.Awards,
                    Poster: movieObj.Poster,
                    Ratings: movieObj.Ratings,
                    Metascore: movieObj.Metascore,
                    imdbRating: movieObj.imdbRating,
                    imdbVotes: movieObj.imdbVotes,
                    imdbID: movieObj.imdbID,
                    Type: movieObj.Type,
                    DVD: movieObj.DVD,
                    BoxOffice: movieObj.BoxOffice,
                    Production: movieObj.Production,
                    Website: movieObj.Website,
                    Comments: []
                }).save(function(err, data) {
                    if (err) throw err;
                    res.json(data);
                });

            }
            catch(err)
            {
                res.send(err.status);
            }

        }
        else
        {
            res.status(404).send(movieObj.Error);
        }
        
    }
    else
    {
        res.status(400).send('Movie title is not present');
    }

});


// 1. getting comments from mongodb database
// 2. sorting by movie title
// 3. passing result to the view
// 4. filtering comments by the id of the movie

app.get('/comments', function(req, res){

    try
    {
        Movie.find({}, null, {sort: {'item.Title': 1}}, function(err, data){
            if(err) throw err;
            res.render('comment', {comments: data});
        });
    }
    catch(err)
    {
        res.send(err.status)
    }
    
    
});

app.get('/comments/:id', function(req, res) {

    if(req.params.id)
    {
        res.send(req.params.id);
    }
    else
    {
        res.status(400).send('Not Found');
    }
    
});


// 1. sending comment in request body of the post method along with movie id
// 2. adding comment to mongodb database to correct movie object

app.post('/comments', urlencodedParser, async function(req, res){
    
    if(req.body.item)
    {
        Movie.findByIdAndUpdate(req.body.id, { $push: { Comments: req.body.item }}, function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    }
    else
    {
        res.status(400).send('Movie title is not present');
    }

});

app.listen(port);
console.log('You are listening to port ' + port);

module.exports = app;