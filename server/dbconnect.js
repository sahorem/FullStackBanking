const MongoClient = require('mongodb').MongoClient;
const { MongoMemoryServer } = require('mongodb-memory-server-global');
let dbURL = 'mongodb://localhost:27017';
const utils = require('./utils.js');

const dbname = 'badbank';
let DBConnection = null;
let mongoConnection = null;

// connect to mongo
function dbConnect() {
	if (utils.DEBUG) console.log('Connecting to DB ', dbURL);
	return new Promise((resolve, reject) => {
		try {
			MongoClient.connect(
				dbURL,
				{ useUnifiedTopology: true },
				function (err, client) {
					mongoConnection = client;

					console.log('Connected successfully to DB server', dbURL);
					DBConnection = client.db(dbname);
					resolve(DBConnection);
				}
			);
		} catch (err) {
			if (utils.DEBUG) console.log('DB connection error', err);
			reject(err);
		}
	});
}

async function getDBConnect() {
	if (utils.DEBUG)
		console.log('Running server in environment', process.env.NODE_ENV);
	return await dbConnect();
}

async function closeDBConnect() {
	// Close the connection
	if (mongoConnection) {
		await mongoConnection.close();
	}
}

module.exports = { getDBConnect, closeDBConnect };
