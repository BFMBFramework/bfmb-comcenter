var mongoose = require('mongoose');
var config = require('../../config.json');
var User = require('../../dist/schemas/user').User;
var Network = require('../../dist/schemas/network').Network;

mongoose.connect(config.db);

if (!process.env.TELEGRAM_TOKEN) throw new Error("No Telegram token defined.");

var test = new User({
	name: 'TEST',
	password: 'test'
});

test.save(function (err) {
	if (err) throw err;

	var network = new Network({
		name: 'Telegram',
		token: process.env.TELEGRAM_TOKEN
	});

	network.save(function (err) {
		if (err) throw err;
		console.log("Added network");
	});

	test.networks.push(network);
	test.save(function (err) {
		if (err) throw err;
		console.log("Added test user.");
	});
});

