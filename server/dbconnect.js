const MongoClient = require('mongodb').MongoClient;
const utils = require('./utils.js');

const DBNAME = process.env.DBNAME || 'badbank';
let DBURL = process.env.DBURL || 'mongodb://localhost:27017';

let DBConnection = null;
let mongoConnection = null;

// connect to mongo
function dbConnect() {
	if (utils.DEBUG) console.log('Connecting to DB ', DBURL);
	return new Promise((resolve, reject) => {
		try {
			MongoClient.connect(
				DBURL,
				{ useUnifiedTopology: true },
				function (err, client) {
					mongoConnection = client;

					console.log('Connected successfully to DB server', DBURL);
					DBConnection = client.db(DBNAME);
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
