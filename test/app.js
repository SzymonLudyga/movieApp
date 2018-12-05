process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');

const nock = require('nock');

const server = require('../app.js');
require('dotenv').config();

chai.use(chaiHttp);

require('chai').expect;
chai.should();

const movieId = '5bfd87f68c04672971996b2c';
const commentId = 'very-good-movie';
const searchedPhrase = 'pirate';
const omdbApi = 'http://www.omdbapi.com';

describe('/GET / suite', function () {

	it('/GET/ / ### Should receive 200 status code (testing)', function(done) {
		chai.request(server)
			.get('/')
			.end(function (err, res) {
				res.should.have.status(200);
				done();
			});
	});

	it('/GET/ /movies ### Should receive 200 status code', function(done) {
		chai.request(server)
			.get('/movies')
			.end(function (err, res) {
				res.should.have.status(200);
				done();
			});
	});

	it('/GET/ /comments ### Should receive 200 status code', function(done) {
		chai.request(server)
			.get('/comments')
			.end(function (err, res) {
				res.should.have.status(200);
				done();
			});
	}); 

	it(`/GET/ /comments/:id ### Should receive 200 status code for movieId: ${movieId}`, function(done) {
		chai.request(server)
			.get('/comments/' + movieId)
			.end(function (err, res) {
				res.should.have.status(200);
				done();
			});
	});

});

describe('/POST / suite', function () {

	before(function () {

		nock(omdbApi)
			.get(`/?t=${searchedPhrase}&apikey=${process.env.API_KEY}`)
			.reply(200, { status : 'OK'})
			.get(`/?t=${searchedPhrase}&apikey=${process.env.API_KEY}`)
			.reply(409, { status : 'Conflict'})
			.get(`/?t=thismovietitledoesnotexist&apikey=${process.env.API_KEY}`)
			.reply(404, {status: 'Not Found'});			

	});

	it('/POST/ /movies ### Should receive 200 after passing correct movie title', function(done) {
		chai.request(server)
			.post('/movies')
			.send({item : 'pirate'})
			.end(function (err, res) {
				res.should.have.status(200);
				done();
			});
	});

	it('/POST/ /movies ### Should receive 409 after passing movie title that already exists', function(done) {
		chai.request(server)
			.post('/movies')
			.send({item : 'pirate'})
			.end(function (err, res) {
				res.should.have.status(409);
				done();
			});
	});

	it('/POST/ /movies ### Should receive 404 after passing movie title that does not exist', function(done) {
		chai.request(server)
			.post('/movies')
			.send({item : 'thismovietitledoesnotexist'})
			.end(function (err, res) {
				res.should.have.status(404);
				done();
			});
	});

	it('/POST/ /movies ### Should receive 422 after not passing any movie title', function(done) {
		chai.request(server)
			.post('/movies')
			.send()
			.end(function (err, res) {
				res.should.have.status(422);
				done();
			});
	});

	it('/POST/ /comments ### Should receive 200 after passing comment', function(done) {
		chai.request(server)
			.post('/comments')
			.send({item: 'comment', id: movieId})
			.end(function (err, res) {
				res.should.have.status(200);
				done();
			});
	});

	it('/POST/ /comments ### Should receive 422 after not passing any comment', function(done) {
		chai.request(server)
			.post('/comments')
			.send()
			.end(function (err, res) {
				res.should.have.status(422);
				done();
			});
	});
    
});

describe('/DELETE / suite', function () {

	it(`/DELETE/ /movies/:id ### Should receive 200 status code for movieId: ${movieId}`, function(done) {
		chai.request(server)
			.delete('/movies/' + movieId)
			.end(function (err, res) {
				res.should.have.status(200);
				done();
			});
	});

	it(`/DELETE/ /comments/:id ### Should receive 200 status code for commentId: ${commentId} and movieId: ${movieId}`, function(done) {
		chai.request(server)
			.delete('/comments/' + commentId + '&' + movieId)
			.end(function (err, res) {
				res.should.have.status(200);
				done();
			});
	});

});