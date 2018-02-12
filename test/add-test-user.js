var mongoose = require('mongoose');
var config = require('../config.json');
var User = require('../dist/schemas/user').User;
var Network = require('../dist/schemas/network').Network;

mongoose.connect(config.db, {}, function (err) {
	console.log("Can't connect with mongodb.");
});

var test = new User({
	name: 'TEST',
	password: 'test'
});

test.save(function (err) {
	if (err) throw err;

	var network = new Network({
		name: 'Telegram',
		token: '521610674:AAEJA6es-CkKtaAJWIdQwNP_M-vA5TL6kdA'
	});

	network.save(function (err) {
		if (err) throw err;
		console.log("Added network");
	});

	test.networks.push(network);
	test.save(function (err) {
		console.log("Added test user.");
	});
});

