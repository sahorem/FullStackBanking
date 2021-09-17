const utils = require('./utils.js');

// create client account
function createClient(db, name, email) {
	if (utils.DEBUG) console.log('in create client', name, email);
	const openbalance = utils.getRandomIntInclusive(200, 1000);
	const closebalance = openbalance;
	return new Promise((resolve, reject) => {
		const collection = db.collection('clients');
		const doc = {
			clientname: name,
			clientemail: email,
			openingbalance: openbalance,
			closingbalance: closebalance,
		};

		collection.insertOne(doc, { w: 1 }, function (err, result) {
			err ? reject(err) : resolve(doc);
		});
	});
}

// find client accounts
function findClient(db, email) {
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
function findClientOne(db, email) {
	if (utils.DEBUG) console.log('in findClientOne ', email);
	return new Promise((resolve, reject) => {
		const customers = db
			.collection('clients')
			.findOne({ clientemail: email })
			.then((doc) => resolve(doc))
			.catch((err) => reject(err));
	});
}

// update - deposit/withdraw amount
function updateClient(db, email, amount) {
	// First insert the record in transactions collection
	(async () => {
		const collection = db.collection('transactions');
		const doc = {
			clientemail: email,
			txndate: utils.getCurrentDT(),
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
function allClients(db) {
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
function allClientTxn(db, email) {
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
	findClient,
	findClientOne,
	updateClient,
	allClients,
	allClientTxn,
};
