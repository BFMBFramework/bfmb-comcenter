var mongoose = require('mongoose');
var config = require('../config.json');
var User = require('../dist/schemas/user').User;

mongoose.connect(config.db, {}, function (err) {
	console.log("Can't connect with mongodb.");
});

var test = new User({
	name: 'TEST',
	password: 'test'
});

test.save(function (err) {
	if (err) throw err;

	console.log("Added test user.");
});

