var dal = require('./dal.js');
var authservice = require('./auth_service.js');
var express = require('express');
var cors = require('cors');
const utils = require('./utils.js');
const { getDBConnect, closeDBConnect } = require('./dbconnect.js');

//const env = process.env.NODE_ENV;

let db = null;

var app = express();
// used to serve static files from public directory
app.use(express.static('public'));

// For Cross Origin Requests
app.use(cors());

// For getting the Database connection
(async () => {
	await getDBConnect()
		.then((dbc) => {
			// Success
			if (utils.DEBUG) console.log('Got the DB Connection ', dbc);
			db = dbc;
		})
		.catch((err) => console.log('DB connection Failure', err));
})();

// Verify the Authorization Token.

app.use(async (req, res, next) => {
	try {
		await authservice.authVerify(req).then((res) => {
			// Success
			if (utils.DEBUG) console.log('Verified the Token ', res);
			next();
		});
	} catch (err) {
		if (utils.DEBUG) console.log('Request Token Authorization Failed ', err);
		next(err);
	}
});

//Here we are configuring express as parser middle-ware.
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

// now use the Database Connection and pass that as part of request
app.use((req, res, next) => {
	if (db) {
		if (utils.DEBUG) console.log('successful in attaching DB connection');
		req.db = db;
	} else {
		if (utils.DEBUG) console.log('Unsuccessful in attaching DB connection');
		return res.status(400).json({ DBError: "Can't find DB connection" });
	}
	next();
});

// Root Route
app.get('/', function (req, res) {
	if (utils.DEBUG) console.log('root route');
	res.status(200).json({ title: 'Badbank Service' });
});

// find client by email
app.get('/client/find/:email', function (req, res) {
	const { db, body } = req;
	if (utils.DEBUG) console.log(req.params.email);
	dal
		.findClient(db, req.params.email)
		.then((client) => {
			if (utils.DEBUG) console.log('client', client);
			if (client) {
				res.send(client);
			} else {
				res.send({ error: ' client account not Found' });
			}
		})
		.catch((err) => {
			res.send({ error: 'client account not found' + err });
		});

	if (utils.DEBUG) console.log('exiting findone');
});

// all accounts
app.get('/client/all', function (req, res) {
	const { db, body } = req;
	dal
		.allClients(db)
		.then((docs) => {
			//console.log(docs);
			if (docs) {
				res.send(docs);
			} else {
				res.send({ error: 'client accounts not found' });
			}
		})
		.catch((err) => {
			res.send({ error: 'client accounts not found' + err });
		});
});

// find client transactions
app.get('/client/transactions/:email', function (req, res) {
	const { db, body } = req;
	if (utils.DEBUG) console.log('get transactions', req.params.email);

	dal
		.allClientTxn(db, req.params.email)
		.then((txn) => {
			if (utils.DEBUG) console.log(txn);
			if (txn) {
				res.send(txn);
			} else {
				res.send({ error: 'client transactions not found' });
			}
		})
		.catch((err) => {
			res.send({ error: 'client transactions not found ' + err });
		});
});

// create client account
app.post('/client/create', function (req, res) {
	const { db, body } = req;
	if (utils.DEBUG) console.log('client create', body.name);
	if (utils.DEBUG) console.log('client create', body.email);
	if (utils.DEBUG) console.log('client create', body.acttype);

	// check if client exists
	dal
		.findClient(db, body.email)
		.then((client) => {
			// if client exists, return error message
			if (client.length > 0) {
				if (utils.DEBUG) console.log('client account already exists');
				res.send({ error: 'client already exists' });
			} else {
				// else create client account
				//console.log('Creating client');
				dal
					.createClient(db, body.name, body.email, body.acttype)
					.then((client) => {
						if (utils.DEBUG) console.log('client account created ', client);
						res.send(client);
					});
			}
		})
		.catch((err) => {
			res.send({ error: 'client account not created ' + err });
		});
});

// update - deposit/withdraw amount
app.post('/client/update/', function (req, res) {
	const { db, body } = req;
	dal
		.updateClient(db, body.email, body.acttype, Number(body.amount))
		.then((response) => {
			if (utils.DEBUG) console.log('updated client record', response);
			res.send(response);
		})
		.catch((err) => {
			res.send({ error: 'client accounts not updated ' + err });
		});
});

//Final error handling
app.use((err, req, res, next) => {
	if (utils.DEBUG) console.log('Caught error :', err);
	//delegate to the default Express error handler,
	//when the headers have already been sent to the client:
	if (res.headersSent) {
		return next(err);
	}
	return res.status(400).json({ error: err });
});

// export app for testing
module.exports = app;
