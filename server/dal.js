const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let db = null;

// function to generate random number for opening balance
function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

// Function to generate current date time
function getCurrentDT() {
	var today = new Date();
	var date =
		today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time =
		today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
	return date + ' ' + time;
}
// connect to mongo
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
	console.log('Connected successfully to db server');

	// connect to myproject database
	db = client.db('myproject');
});

// create client account
function createClient(name, email, password) {
	const openbalance = getRandomIntInclusive(100, 1000);
	const closebalance = openbalance;
	return new Promise((resolve, reject) => {
		const collection = db.collection('clients');
		const doc = {
			clientname: name,
			clientemail: email,
			clientpasswd: password,
			openingbalance: openbalance,
			closingbalance: closebalance,
		};

		collection.insertOne(doc, { w: 1 }, function (err, result) {
			err ? reject(err) : resolve(doc);
		});
	});
}

// find client accounts
function findClient(email) {
	return new Promise((resolve, reject) => {
		const customers = db
			.collection('clients')
			.find({ clientemail: email })
			.toArray(function (err, docs) {
				err ? reject(err) : resolve(docs);
			});
	});
}

// find client account
function findClientOne(email) {
	return new Promise((resolve, reject) => {
		const customers = db
			.collection('clients')
			.findOne({ clientemail: email })
			.then((doc) => resolve(doc))
			.catch((err) => reject(err));
	});
}

// update - deposit/withdraw amount
function updateClient(email, amount) {
	// First insert the record in transactions collection
	(async () => {
		const collection = db.collection('transactions');
		const doc = {
			clientemail: email,
			txndate: getCurrentDT(),
			txnamount: amount,
		};

		await collection.insertOne(doc, { w: 1 }, function (err, res) {
			if (err) throw err;
			//console.log('transaction inserted successfully');
			//console.log(res);
		});
	})();

	// Now update the closing balance and return the updated amount
	return new Promise((resolve, reject) => {
		const customers = db
			.collection('clients')
			.findOneAndUpdate(
				{ clientemail: email },
				{ $inc: { closingbalance: amount } },
				{ returnOriginal: false },
				function (err, documents) {
					//console.log(documents);
					err ? reject(err) : resolve(documents);
				}
			);
	});
}

// all clients
function allClients() {
	return new Promise((resolve, reject) => {
		const customers = db
			.collection('clients')
			.find({})
			.toArray(function (err, docs) {
				err ? reject(err) : resolve(docs);
			});
	});
}

// find transactions for a client
function allClientTxn(email) {
	return new Promise((resolve, reject) => {
		const customers = db
			.collection('transactions')
			.find({ clientemail: email })
			.toArray(function (err, docs) {
				err ? reject(err) : resolve(docs);
			});
	});
}

module.exports = {
	createClient,
	findClientOne,
	findClient,
	updateClient,
	allClients,
	allClientTxn,
};
