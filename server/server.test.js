const app = require('./server.js');
var authservice = require('./auth_service.js');
const flushPromises = require('flush-promises');
const utils = require('./utils.js');
const faker = require('faker');
const supertest = require('supertest');
const { getDBConnect, closeDBConnect } = require('./dbconnect.js');

const request = supertest(app);
const clientcount = 1;
const clientlist = [];
const acctlist = ['checking', 'savings'];
var server = null;

//beforeAll(async () => {
//});

server = app.listen(4000, function () {
	if (utils.DEBUG) console.log('Running on port 4000');
});

// returns a random client using faker
function client() {
	// random data
	const firstName = faker.name.firstName();
	const lastName = faker.name.lastName();
	const name = faker.name.findName(firstName, lastName);
	const email = faker.internet.email(firstName, lastName);

	// return new client object
	return {
		name,
		email,
	};
}

// create test clients
for (let i = 0; i < clientcount; i++) {
	clientlist[i] = client();
}

// Now time to run tests
describe('Bad Bank Backend - integration testing ', function () {
	beforeEach(() => {
		// mocked authVerify function
		const authSpy = jest.spyOn(authservice, 'authVerify');
		//authSpy.mockReturnValue('dummy token');
		authSpy.mockImplementation(() => {
			if (utils.DEBUG) console.log('in mocked auth verify');

			return new Promise((resolve, reject) => {
				resolve({ token: 'mocked' });
			});
		});
	});
	//First chect the root route
	jest.setTimeout(7000);
	it('check the root route', async () => {
		await flushPromises();
		const data = await request.get('/');
		if (utils.DEBUG) console.log('status', data.status);
		if (utils.DEBUG) console.log('status', data.body);
		expect(data.status).toBe(200);

		expect(data.body.title).toBe('Badbank Service');
	});

	// Test Client Account Creation
	it('create client accounts', async () => {
		await flushPromises();
		try {
			for (let i = 0; i < clientcount; i++) {
				const data = await request.post('/client/create').send({
					name: clientlist[i].name,
					email: clientlist[i].email,
					acttype: acctlist[i],
				});
				if (utils.DEBUG) console.log('created test client', data.body[0]);
				const newclient = data.body[0];
				expect(data.status).toBe(200);
				expect(newclient.clientname).toBe(clientlist[i].name);
				expect(newclient.clientemail).toBe(clientlist[i].email);
				expect(newclient.accounttype).toBe(acctlist[i]);
				//Save the closing balance for later validation
				clientlist[i].closingbalance = newclient.closingbalance;
				clientlist[i].clientid = newclient.clientid;
			}
		} catch (e) {
			if (utils.DEBUG) console.log('create client account - test error', e);
		}
	});
	if (utils.DEBUG) console.log(clientlist);

	//Verify Client Accounts
	it('verify client accounts', async () => {
		await flushPromises();
		try {
			for (let i = 0; i < clientcount; i++) {
				const data = await request.get(
					`/client/find/${clientlist[i].clientid}`
				);
				if (utils.DEBUG) console.log('status', data.status);
				if (utils.DEBUG) console.log('status', data.body);

				const newclient = data.body[0];
				expect(data.status).toBe(200);
				expect(newclient.clientname).toBe(clientlist[i].name);
				expect(newclient.clientemail).toBe(clientlist[i].email);
				expect(newclient.accounttype).toBe(acctlist[i]);
			}
		} catch (e) {
			if (utils.DEBUG) console.log('verify client accounts - test error', e);
		}
	});

	// Test Deposit and withdrawls
	it('depost - withdraw amounts ', async () => {
		await flushPromises();
		try {
			for (let i = 0; i < clientcount; i++) {
				//Let's first deposit amount
				let amt = utils.getRandomIntInclusive(25, 75);
				let data = await request.post('/client/update').send({
					clientid: clientlist[i].clientid,
					acttype: acctlist[i],
					amount: amt,
				});
				if (utils.DEBUG) console.log('Updated client', data.body.value);

				let retClient = data.body.value;
				if (utils.DEBUG)
					console.log(
						'Updated client',
						retClient.closingbalance,
						clientlist[i].closingbalance,
						amt
					);

				expect(data.status).toBe(200);
				expect(retClient.clientid).toBe(clientlist[i].clientid);
				expect(retClient.clientname).toBe(clientlist[i].name);
				expect(retClient.clientemail).toBe(clientlist[i].email);
				expect(retClient.closingbalance).toBe(
					clientlist[i].closingbalance + amt
				);
				//Save the closing balance for later validation
				clientlist[i].closingbalance = retClient.closingbalance;

				// Now withdraw amount
				amt = -1 * utils.getRandomIntInclusive(25, 75);
				data = await request.post('/client/transaction').send({
					clientid: clientlist[i].clientid,
					acttype: acctlist[i],
					amount: amt,
				});
				if (utils.DEBUG) console.log('Updated client', data.body.value);
				retClient = data.body.value;
				expect(data.status).toBe(200);
				expect(retClient.clientid).toBe(clientlist[i].clientid);
				expect(retClient.clientname).toBe(clientlist[i].name);
				expect(retClient.clientemail).toBe(clientlist[i].email);
				expect(retClient.closingbalance).toBe(
					clientlist[i].closingbalance + amt
				);
			}
		} catch (e) {
			console.log('deposit - withdraw amounts - test error', e);
		}
	});
	if (utils.DEBUG) console.log(clientlist);

	afterAll((done) => {
		// First close DB connections
		closeDBConnect();
		server.close();
		done();
	});
});
