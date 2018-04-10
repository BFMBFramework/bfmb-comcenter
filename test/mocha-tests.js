var assert = require('assert');
var jayson = require('jayson');

console.log('NOTE: You must start the server first when doing the tests.');

var client = new jayson.client.tcp({
	port: 3000
});

var token;

describe('Authentication', function() {
	it('Gives a result (jsonwebtoken) if client logged with valid user', function(done) {
		client.request('authenticate', {username: "TEST", password: "test"}, function(err, response) {
			if (!response.result) {
				var errMes = new Error(JSON.stringify(response.error));
				done(errMes);
			} else {
				token = response.result;
				done();
			}
		});
	});

	it('Gives an error if client is logging with not valid user', function(done) {
		client.request('authenticate', {username: "NOTVALID", password: "notvalid"}, function(err, response) {
			if (!response.error) {
				var errMes = new Error("Not error message provided");
				done(errMes);
			} else {
				done();
			}
		});
	});
});

describe('Sending messages', function() {
	it('Gives an error if no token and network are provided', function(done) {
		client.request('sendMessage', {}, function(err, response) {
			if (!response.error) {
				var errMes = new Error("Not error message provided");
				done(errMes);
			} else {
				done();
			}
		});
	});
	it('Gives an error if non existent network is provided', function(done) {
		client.request('sendMessage', {token: token, network: 'Notexists'}, function(err, response) {
			if (!response.error) {
				var errMes = new Error("Not error message provided");
				done(errMes);
			} else {
				done();
			}
		});
	});
});

describe('Telegram communication', function(done) {
	it('Gives an error if no API options are provided', function(done) {
		client.request('sendMessage', {token: token, network: 'Telegram', options: {}}, function (err, response) {
			if (!response.error) {
				var errMes = new Error("Not error provided");
				done(errMes);
			} else {
				done();
			}
		})
	})
});