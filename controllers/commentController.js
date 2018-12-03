const bodyParser = require('body-parser');

// app.use(bodyParser.json());
const urlencodedParser = bodyParser.urlencoded({extended: true});

module.exports = function(app, Movie) {
     
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
			res.send(err.status);
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
};