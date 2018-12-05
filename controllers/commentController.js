const Movie = require('../databaseConfig');

const bodyParser = require('body-parser');

// app.use(bodyParser.json());
const urlencodedParser = bodyParser.urlencoded({extended: true});

let commentAndId, id, error;

module.exports = function(app) {
     
	// 1. getting comments from mongodb database
	// 2. sorting by movie title
	// 3. passing result to the view
	// 4. filtering comments by the id of the movie

	app.get('/comments', function(req, res, next){

		Movie.find({}, null, {sort: {'item.Title': 1}}, function(error, data){
			try 
			{
				if(error) throw error;
				res.render('comment', {comments: data});
			}
			catch(error)
			{
				error.status = 500;
				next(error);
			}
		});		
		
	});

	app.get('/new_comment/:id', function(req, res, next) {

		if(req.params.id)
		{
			res.send(req.params.id);
		}
		else
		{
			error = new Error('Internal Server Error');
			error.status = 500;
			next(error);
		}
	});


	// 1. sending comment in request body of the post method along with movie id
	// 2. adding comment to mongodb database to correct movie object

	app.post('/comments', urlencodedParser, async function(req, res, next){

		if(req.body.item)
		{	
			Movie.findByIdAndUpdate(req.body.id, { $push: { Comments: {comment : req.body.item} }}, function(error, data) {
				try 
				{
					if (error) throw error;
					res.json(data);
				}
				catch(error)
				{
					error.status = 500;
					next(error);
				}
				
			});
		}
		else
		{
			error = new Error('Unprocessable Entity');
			error.status = 422;
			next(error);
		}

	});

	app.delete('/comments/:id', function(req, res, next) {

		// delete the comment of the movie from mongodb

		if(req.params.id)
		{
			commentAndId = req.params.id.match(/\b[\w ]{1,100}\b/g);
			id = commentAndId[commentAndId.length - 1];
			commentAndId.pop();

			Movie.findByIdAndUpdate(id, { $pull: {Comments : {comment : commentAndId.join(' ')}}}, function(error, data){
				try 
				{
					if (error) throw error;
					res.json(data);
				}
				catch(error)
				{
					error.status = 500;
					next(error);
				}
			});
		}
		else
		{
			error = new Error('Unprocessable Entity');
			error.status = 422;
			next(error);
		}
		

	});
};