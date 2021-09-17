const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function getCurrentDT() {
	//return date as 2021-9-5 11:44:10
	var today = new Date();
	var date =
		today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time =
		today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
	return date + ' ' + time;
}

const dbclient = new MongoClient(url, { useUnifiedTopology: true });

// connect to mongo
async function run() {
	try {
		await dbclient.connect();

		// database Name
		const dbName = 'badbank';
		const db = dbclient.db(dbName);

		// insert into clients collection
		var collection = db.collection('clients');

		// add a test client
		var name = 'testuser';
		var email = name + '@mit.edu';
		var openbalance = getRandomIntInclusive(100, 1000);
		var closebalance = openbalance - 100;

		// Query for a client that has the clientemail as email
		const query = { clientemail: email };
		const client = await collection.findOne(query);
		// Check if record exists if not insert it
		if (client) {
			console.log('found');
		} else {
			console.log('Not there');
			var doc = {
				clientname: name,
				clientemail: email,
				openingbalance: openbalance,
				closingbalance: closebalance,
			};
			const result = await collection.insertOne(doc, { w: 1 });
			console.log(
				`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`
			);
		}

		const cursor = collection.find({});
		// print a message if no documents were found
		if ((await cursor.count()) === 0) {
			console.log('No clients found!');
		}
		// print the clients that were found.
		await cursor.forEach(function (myDoc) {
			console.log('client: ' + myDoc.clientname);
		});

		// Now do the same for transactions
		// insert into transtions collection
		var collection = db.collection('transactions');

		// add a test transaction
		var name = 'testuser';
		var email = name + '@mit.edu';
		var tamount = 100;
		var tdate = getCurrentDT();

		// Query for a transaction that has the clientemail as email
		const tquery = { clientemail: email };
		const txn = await collection.findOne(tquery);
		// Check if record exists if not insert it
		if (txn) {
			console.log('transaction found');
		} else {
			console.log('transaction does not exist, enter it');
			var doc = {
				clientemail: email,
				txndate: tdate,
				txnamount: tamount,
			};
			const tresult = await collection.insertOne(doc, { w: 1 });
			console.log(
				`${tresult.insertedCount} documents were inserted with the _id: ${tresult.insertedId}`
			);
		}

		const tcursor = collection.find({});
		// print a message if no documents were found
		if ((await tcursor.count()) === 0) {
			console.log('No clients found!');
		}
		// print the clients that were found.
		await tcursor.forEach(function (myDoc) {
			console.log('client: ' + myDoc.clientemail);
		});
	} finally {
		await dbclient.close();
	}
}
run().catch(console.dir);
