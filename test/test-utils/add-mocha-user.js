var mongoose = require('mongoose');
var config = require('../../config.json');
var User = require('../../dist/schemas/user').User;
var Network = require('../../dist/schemas/network').Network;

mongoose.connect(config.db.url, {useNewUrlParser: true});

if (!process.env.TG_TOKEN) throw new Error("No Telegram token defined.");
if (!process.env.TADO_USERNAME) throw new Error("No Tado login data defined.");
if (!process.env.TADO_PASSWORD) throw new Error("No Tado login data defined.");

var test = new User({
	username: 'TEST',
	password: 'test'
});

test.save(function (err) {
	if (err) throw err;

	var tgNetwork = new Network({
		name: 'Telegram',
		token: process.env.TG_TOKEN
	});

	tgNetwork.save(function (err) {
		if (err) throw err;
		console.log("Added Telegram network");
	});

	var tadoNetwork = new Network({
		name: 'Tado',
		username: process.env.TADO_USERNAME,
		password: process.env.TADO_PASSWORD
	});

	tadoNetwork.save(function (err) {
		if (err) throw err;
		console.log("Added Tado Network");
	})

	test.networks.push(tgNetwork);
	test.networks.push(tadoNetwork);
	test.save(function (err) {
		if (err) throw err;
		console.log("Added test user.");
	});
});

