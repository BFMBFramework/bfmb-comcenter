const assert = require('assert');
const jayson = require('jayson');
const util = require('util');

console.log('NOTE: You must start the server first when doing the tests.');

var client = new jayson.client.tcp({
	port: 3000
});

var token;

describe('Authentication', function() {
	it('Gives an error if client sends an incorrect password', function(done) {
		client.request('authenticate', {username: "TEST", password: "0000"}, function(err, response) {
			if (!response.error) {
				const errMes = new Error('No error was returned.');
				done(errMes);
			} else {
				done();
			}
		})
	})

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
	});

	it('Gives an error if client is logging with not valid user', function(done) {
		client.request('authenticate', {username: "NOTVALID", password: "notvalid"}, function(err, response) {
			if (!response.error) {
				const errMes = new Error('No error was returned.');
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
				const errMes = new Error('No error was returned.');
				done(errMes);
			} else {
				done();
			}
		});
	});
	it('Gives an error if non existent network is provided', function(done) {
		client.request('sendMessage', {token: token, network: 'Notexists'}, function(err, response) {
			if (!response.error) {
				const errMes = new Error('No error was returned.');
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
				const errMes = new Error('No error was returned.');
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
				done(errMes);
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
	});
});

describe('Tado communication', function(done) {
	it('GetMe has to return data as is.', function(done) {
		client.request('getMe', {token: token, network: 'Tado', options: {}}, function(err, response) {
			if (!response.result) {
				const errMes = new Error(JSON.stringify(response.error));
				done(errMes);
			} else {
				console.log(util.inspect(response, false, null, true));
				done();
			}
		});
	});

	it('ReceiveMessage must return error if no api_method was set.', function(done) {
		client.request('receiveMessage', {token: token, network: 'Tado', options: {}}, function (err, response) {
			if (!response.error) {
				const errMes = new Error('No error was returned.');
				done(errMes);
			} else {
				console.log(util.inspect(response, false, null, true));
				done();
			}
		});
	});

	it('ReceiveMessage GetHome must return error if no home_id was set.', function(done) {
		client.request('receiveMessage', {token: token, network: 'Tado', options: {api_method: "getHome"}}, function (err, response) {
			if (!response.error) {
				const errMes = new Error('No error was returned.');
				done(errMes);
			} else {
				console.log(util.inspect(err, false, null, true));
				done();
			}
		});
	});

	it('GetHome has to return data with home_id and api_method set.', function(done) {
		client.request('receiveMessage', {token: token, network: 'Tado', options: {api_method: "getHome", home_id: 181335}}, function (err, response) {
			if (!response.result) {
				const errMes = new Error(JSON.stringify(response.error));
				done(errMes);
			} else {
				console.log(util.inspect(err, false, null, true));
				done();
			}
		});
	});
});