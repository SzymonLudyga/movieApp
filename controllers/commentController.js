const bodyParser = require('body-parser');

// app.use(bodyParser.json());
const urlencodedParser = bodyParser.urlencoded({extended: true});

let commentAndId, id;

module.exports = function(app, Movie) {
     
	// 1. getting comments from mongodb database
	// 2. sorting by movie title
	// 3. passing result to the view
	// 4. filtering comments by the id of the movie

	app.get('/comments', function(req, res){

		Movie.find({}, null, {sort: {'item.Title': 1}}, function(err, data){
			try 
			{
				if(err) throw err;
				res.render('comment', {comments: data});
			}
			catch(err)
			{
				res.status(500).send(err);
			}
		});		
		
	});

	app.get('/comments/:id', function(req, res) {

		if(req.params.id)
		{
			res.send(req.params.id);
		}
		else
		{
			res.status(400).send('Bad Request');
		}
		
	});


	// 1. sending comment in request body of the post method along with movie id
	// 2. adding comment to mongodb database to correct movie object

	app.post('/comments', urlencodedParser, async function(req, res){

		if(req.body.item)
		{	
			Movie.findByIdAndUpdate(req.body.id, { $push: { Comments: {comment : req.body.item} }}, function(err, data) {
				try 
				{
					if (err) throw err;
					res.json(data);
				}
				catch(err)
				{
					res.status(500).send('Internal Server Error');
				}
				
			});
		}
		else
		{
			res.status(400).send('Comment is empty');
		}

	});

	app.delete('/comments/:id', function(req, res) {

		// delete the item form mongodb

		if(req.params.id)
		{
			commentAndId = req.params.id.match(/\b[\w ]{1,100}\b/g);
			id = commentAndId[commentAndId.length - 1];
			commentAndId.pop();

			Movie.findByIdAndUpdate(id, { $pull: {Comments : {comment : commentAndId.join(' ')}}}, function(err, data){
				try 
				{
					if (err) throw err;
					res.json(data);
				}
				catch(err)
				{
					res.status(500).send('Internal Server Error');
				}
			});
		}
		else
		{
			res.status(404).send('Not Found');
		}
		

	});
};