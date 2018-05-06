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
				const errMes = new Error(JSON.stringify(response.error));
				done(errMes);
			} else {
				token = response.result;
				done();
			}
		});
	}).timeout(10000);

	it('Gives an error if client is logging with not valid user', function(done) {
		client.request('authenticate', {username: "NOTVALID", password: "notvalid"}, function(err, response) {
			if (!response.error) {
				const errMes = new Error("Not error message provided");
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
				const errMes = new Error("Not error message provided");
				done(errMes);
			} else {
				done();
			}
		});
	});
	it('Gives an error if non existent network is provided', function(done) {
		client.request('sendMessage', {token: token, network: 'Notexists'}, function(err, response) {
			if (!response.error) {
				const errMes = new Error("Not error message provided");
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
				const errMes = new Error("Not error provided");
				done(errMes);
			} else {
				done();
			}
		})
	});

	it('Sends a message to every person which sent a /testMessages command', function(done) {
		client.request('receiveMessage', {token: token, network: 'Telegram', options: {}}, function (err, response) {
			if (!response.result) {
				const errMes = new Error(JSON.stringify(response.error));
				done(errMes)
			} else {
				for (let i = response.result.length - 1; i >= 0; i--) {
					if (response.result[i].message.text === "/testMessages") {
						const username = response.result[i].message.from.username;
						const chatid = response.result[i].message.chat.id;
						const options = {
							chat_id: chatid,
							text: "Hello " + username + ". This is a programmed test."
						};

						client.request('sendMessage', {token: token, network: 'Telegram', options: options}, function (err, response) {
							if (!response.result) {
								const errMes = new Error(JSON.stringify(response.error));
								done(errMes);
							} else {
								done();
							}
						});
					}
				}
			}
		})
	}).timeout(10000);
});