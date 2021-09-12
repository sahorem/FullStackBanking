var express = require('express');
var cors = require('cors');
var dal = require('./dal.js');
const e = require('express');
const firebaseServerAuth = require('./auth_server.js');

var app = express();
// used to serve static files from public directory
app.use(express.static('public'));
app.use(cors());
// To control logging debugging messages
const debug = false;

// Function to Verify Token for Authorizaton
function verifyToken(req) {
	// first read token from header
	const idToken = req.headers.authorization;
	if (debug) console.log('header Token:', idToken);

	return new Promise((resolve, reject) => {
		firebaseServerAuth
			.auth()
			.verifyIdToken(idToken)
			.then((decodedToken) => {
				if (debug) console.log('Authentication Success!:', decodedToken);
				resolve(decodedToken);
			})
			.catch((err) => {
				if (debug) console.log('Authentication Failure!:', err);
				reject(err); // calling `reject` will cause the promise to fail with or without the error passed as an argument
				return; // and we don't want to go any further
			});
	});
}

// create client account
app.get('/client/create/:name/:email', function (req, res) {
	verifyToken(req)
		.then((token) => {
			// check if client exists
			dal.findClient(req.params.email).then((users) => {
				// if client exists, return error message
				if (users.length > 0) {
					//console.log('User account already exists');
					res.send({ error: 'User already exists' });
				} else {
					// else create client account
					//console.log('Creating User');
					dal
						.createClient(
							req.params.name,
							req.params.email,
							req.params.password
						)
						.then((user) => {
							//console.log(user);
							res.send(user);
						});
				}
			});
		})
		.catch((err) => {
			res.send({ error: 'Failed to verify Token' });
		});
});

// login user - Deprecated as now we use firebase api for authentication
app.get('/client/login/:email/:password', function (req, res) {
	if (debug) console.log(req.params.email);
	verifyToken(req)
		.then((token) => {
			dal.findClient(req.params.email).then((user) => {
				// if user exists, check password
				if (user.length > 0) {
					if (user[0].clientpasswd === req.params.password) {
						res.send(user[0]);
					} else {
						res.send({ error: 'wrong password' });
					}
				} else {
					res.send({ error: 'user not found' });
				}
			});
		})
		.catch((err) => {
			res.send({ error: 'Failed to verify Token' });
		});
});

// find client account
app.get('/client/find/:email', function (req, res) {
	verifyToken(req)
		.then((token) => {
			dal.findClient(req.params.email).then((user) => {
				//console.log(user);
				if (user) {
					res.send(user);
				} else {
					res.send({ error: 'Not Found' });
				}
			});
		})
		.catch((err) => {
			res.send({ error: 'Failed to verify Token' });
		});
});

// find one user by email - alternative to find
app.get('/client/findOne/:email', function (req, res) {
	if (debug) console.log(req.params.email);
	if (debug) console.log(req.headers.authorization);
	verifyToken(req)
		.then((token) => {
			dal.findClientOne(req.params.email).then((user) => {
				//console.log(user);
				if (user) {
					res.send(user);
				} else {
					res.send({ error: 'Not Found' });
				}
			});
		})
		.catch((err) => {
			res.send({ error: 'Failed to verify Token' });
		});
});

// update - deposit/withdraw amount
app.get('/client/update/:email/:amount', function (req, res) {
	var amount = Number(req.params.amount);
	verifyToken(req)
		.then((token) => {
			dal.updateClient(req.params.email, amount).then((response) => {
				//console.log(response);
				res.send(response);
			});
		})
		.catch((err) => {
			res.send({ error: 'Failed to verify Token' });
		});
});

// all accounts
app.get('/client/all', function (req, res) {
	verifyToken(req)
		.then((token) => {
			dal.allClients().then((docs) => {
				//console.log(docs);
				if (docs) {
					res.send(docs);
				} else {
					res.send({ error: 'Not Found' });
				}
			});
		})
		.catch((err) => {
			res.send({ error: 'Failed to verify Token' });
		});
});

// find client transactions
app.get('/client/transactions/:email', function (req, res) {
	if (debug) console.log('get transactions');
	verifyToken(req)
		.then((token) => {
			dal.allClientTxn(req.params.email).then((txn) => {
				//console.log(txn);
				if (txn) {
					res.send(txn);
				} else {
					res.send({ error: 'Not Found' });
				}
			});
		})
		.catch((err) => {
			res.send({ error: 'Failed to verify Token' });
		});
});

var port = 4000;
app.listen(port);
console.log('Running on port: ' + port);
