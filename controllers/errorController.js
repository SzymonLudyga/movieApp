module.exports = function(app) {

	let message;

	app.get('/failure/:id', function(req, res){

		if(req.params.id == '400')
		{
			message = 'Bad request';
		}
		else if(req.params.id == '404')
		{
			message = 'Not Found';
		}
		else if(req.params.id == '409')
		{
			message = 'Conflict';
		}
		else
		{
			message = 'Unknown error';
		}
		res.render('failure', {err: req.params.id + ': '+ message});
	});

};