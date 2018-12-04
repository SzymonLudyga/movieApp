let message;

module.exports = function(app) {

	app.get('/failure/:id', function(req, res){

		if(req.params.id === '400')
		{
			message = 'Bad Request';
		}
		else if(req.params.id === '404')
		{
			message = 'Not Found';
		}
		else if(req.params.id === '409')
		{
			message = 'Conflict';
		}
		else if(req.params.id === '500')
		{
			message = 'Internal Server Error';
		}
		else
		{
			message = 'Unknown error';
		}
		res.render('failure', {err: req.params.id + ': '+ message});
	});

};