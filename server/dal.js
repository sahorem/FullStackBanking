const utils = require('./utils.js');

// find client accounts
function clientFind(db, clientid) {
	return new Promise((resolve, reject) => {
		const customers = db
			.collection('clients')
			.find({ clientid: clientid })
			.toArray(function (err, docs) {
				err ? reject(err) : resolve(docs);
			});
	});
}

// find client account by Email
function clientFindEmail(db, email) {
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
function clientFindOne(db, clientid) {
	if (utils.DEBUG) console.log('in findClientOne ', clientid);
	return new Promise((resolve, reject) => {
		const customers = db
			.collection('clients')
			.findOne({ clientid: clientid })
			.then((doc) => resolve(doc))
			.catch((err) => reject(err));
	});
}

// find client profile
function clientFindProfile(db, clientid) {
	if (utils.DEBUG) console.log('in findClientProfile ', clientid);
	return new Promise((resolve, reject) => {
		const customers = db
			.collection('clientprofile')
			.findOne({ clientid: clientid })
			.then((doc) => resolve(doc))
			.catch((err) => reject(err));
	});
}

// create client account
function clientCreate(db, name, email, acttype) {
	if (utils.DEBUG) console.log('in create client', name, email);
	const openbalance = utils.getRandomIntInclusive(200, 1000);
	const closebalance = openbalance;
	return new Promise((resolve, reject) => {
		let actlist = acttype == 'both' ? ['checking', 'savings'] : [acttype];
		let doclist = [];
		let id = 0;
		for (let i = 0; i < actlist.length; i++) {
			// Generate the client id and check if it already exists
			while (id === 0) {
				id = utils.generateClientId(name);
				clientFindOne(db, id)
					.then((client) => {
						// if client exists, regenerate client ID
						if (client.length > 0) {
							id = 0; // run the loop again to find unique id
							if (utils.DEBUG) console.log('client ID already exists' + id);
						} else {
							// Found unique client ID
							if (utils.DEBUG) console.log('generated client ID ' + id);
						}
					})
					.catch((err) => {
						console.log('generate client error ' + err);
						//reject(err);
					});
			}
			doclist[i] = {
				clientid: id,
				clientname: name,
				clientemail: email,
				accounttype: actlist[i],
				openingbalance: openbalance,
				closingbalance: closebalance,
			};
		}
		const collection = db.collection('clients');
		if (doclist) {
			collection.insert(doclist, { w: 1 }, function (err, result) {
				err ? reject(err) : resolve(doclist);
			});
		}
	});
}

// update - deposit/withdraw amount
function clientUpdate(db, clientid, acttype, amount) {
	// First insert the record in transactions collection
	(async () => {
		const collection = db.collection('transactions');
		const doc = {
			clientid: clientid,
			accounttype: acttype,
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
				{ clientid: clientid, accounttype: acttype },
				{ $inc: { closingbalance: amount } },
				{ returnOriginal: false },
				function (err, documents) {
					//console.log(documents);
					err ? reject(err) : resolve(documents);
				}
			);
	});
}

// Update Client Profile
function clientProfileUpdate(
	db,
	clientid,
	address1,
	address2,
	city,
	state,
	zipcode
) {
	// Now update the closing balance and return the updated amount
	return new Promise((resolve, reject) => {
		const customers = db.collection('clientprofile').update(
			{ clientid: clientid },
			{
				clientid: clientid,
				address1: address1,
				address2: address2,
				city: city,
				state: state,
				zipcode: zipcode,
				upddt: utils.getCurrentDT(),
			},
			{ upsert: true, multi: false, returnOriginal: false },
			function (err, documents) {
				//console.log(documents);
				err ? reject(err) : resolve(documents);
			}
		);
	});
}

// all clients
function clientAll(db) {
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
function clientTxnAll(db, clientid) {
	return new Promise((resolve, reject) => {
		const customers = db
			.collection('transactions')
			.find({ clientid: clientid })
			.toArray(function (err, docs) {
				err ? reject(err) : resolve(docs);
			});
	});
}

module.exports = {
	clientCreate,
	clientFind,
	clientFindOne,
	clientFindEmail,
	clientFindProfile,
	clientUpdate,
	clientAll,
	clientTxnAll,
	clientProfileUpdate,
};
