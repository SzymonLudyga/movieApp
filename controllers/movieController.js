const bodyParser = require('body-parser');
const requisition = require('requisition');


const urlencodedParser = bodyParser.urlencoded({extended: true});

module.exports = function(app, Movie)
{

	app.use(bodyParser.json());

	// simple get for testing purposes

	app.get('/', function (req, res){
		res.send('Movie api');
	});

	// 1. getting movies from mongodb database
	// 2. sorting by movie title
	// 3. passing result to the view

	app.get('/movies', function(req, res){

		
		Movie.find({}, null, {sort: {'item.Title': 1}}, function(err, data){
			try 
			{
				if(err) throw err;
				res.render('movie', {movies: data});
			}
			catch(err)
			{
				res.status(500).send(err);
			}
		});
		
	});


	// 1. passing request body in post method (validating presence of req.body)
	// 2. getting movie details from ombdApi based on request body
	// 3. saving movie details to mongodb database

	app.post('/movies', urlencodedParser, async function(req, res){

		if(req.body.item)
		{
			const subrequest = await requisition(`http://www.omdbapi.com/?t=${req.body.item}&apikey=${process.env.API_KEY}`);
			const movieObj = await subrequest.json();

			if (process.env.NODE_ENV === 'test' && movieObj.status === 'OK') {
				res.status(200).send(movieObj);
			}
			else if (process.env.NODE_ENV === 'test' && movieObj.status !== 'OK') {
				res.status(404).send(movieObj);
			}
			else
			{
				if(!movieObj.Error && movieObj.Title)
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
						try 
						{
							if (err) throw err;
							res.json(data);
						}
						catch(err)
						{
							res.status(409).send(err);
						}
					});
				}
				else
				{
					res.status(404).send(movieObj.Error);
				}
			}
			
		}
		else
		{
			res.status(400).send('Movie title is not present');
		}

	});
   
};
