var jayson = require('jayson');

// create a client
var client = jayson.client.tcp({
  port: 3000
});

// invoke "add"
client.request('authenticate', {username: "TEST", password: "test"}, function(err, response) {
  if(err) throw err;
  console.log(response);
  client.request('sendMessage', {token: response.result, network: "Noexists"}, function(err, response) {
  	console.log(response);
  })
});

