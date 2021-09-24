var authservice = require('./auth_service.js');
var express = require('express');
var cors = require('cors');
var routes = require('./routes.js');
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

// Add middleware to Verify the Authorization Token.

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

// Add routes to the server
app.use(routes);

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
