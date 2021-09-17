const app = require('./server.js');
var authservice = require('./auth_service.js');
const flushPromises = require('flush-promises');
const utils = require('./utils.js');
const faker = require('faker');
const supertest = require('supertest');
const { getDBConnect, closeDBConnect } = require('./dbconnect.js');

const request = supertest(app);
const clientCount = 1;
const clientList = [];
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
for (let i = 0; i < clientCount; i++) {
	clientList[i] = client();
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
			for (let i = 0; i < clientCount; i++) {
				const data = await request
					.post('/client/create')
					.send({ name: clientList[i].name, email: clientList[i].email });
				if (utils.DEBUG) console.log('create client', data.body);
				expect(data.status).toBe(200);
				expect(data.body.clientname).toBe(clientList[i].name);
				expect(data.body.clientemail).toBe(clientList[i].email);
				//Save the closing balance for later validation
				clientList[i].closingbalance = data.body.closingbalance;
			}
		} catch (e) {
			if (utils.DEBUG) console.log('create client account - test error', e);
		}
	});
	if (utils.DEBUG) console.log(clientList);

	//Verify Client Accounts
	it('verify client accounts', async () => {
		await flushPromises();
		try {
			for (let i = 0; i < clientCount; i++) {
				const data = await request.get(
					`/client/findOne/${clientList[i].email}`
				);
				expect(data.status).toBe(200);
				if (utils.DEBUG) console.log('status', data.status);
				if (utils.DEBUG) console.log('status', data.body);
			}
		} catch (e) {
			if (utils.DEBUG) console.log('verify client accounts - test error', e);
		}
	});

	// Test Deposit and withdrawls
	it('depost - withdraw amounts ', async () => {
		await flushPromises();
		try {
			for (let i = 0; i < clientCount; i++) {
				//Let's first deposit amount
				let amt = utils.getRandomIntInclusive(25, 75);
				let data = await request
					.post('/client/update')
					.send({ email: clientList[i].email, amount: amt });
				let retClient = data.body.value;
				expect(data.status).toBe(200);
				expect(retClient.clientname).toBe(clientList[i].name);
				expect(retClient.clientemail).toBe(clientList[i].email);
				expect(retClient.closingbalance).toBe(
					clientList[i].closingbalance + amt
				);
				//Save the closing balance for later validation
				clientList[i].closingbalance = retClient.closingbalance;

				// Now withdraw amount
				amt = -1 * utils.getRandomIntInclusive(25, 75);
				data = await request
					.post('/client/update')
					.send({ email: clientList[i].email, amount: amt });
				retClient = data.body.value;
				expect(data.status).toBe(200);
				expect(retClient.clientname).toBe(clientList[i].name);
				expect(retClient.clientemail).toBe(clientList[i].email);
				expect(retClient.closingbalance).toBe(
					clientList[i].closingbalance + amt
				);
			}
		} catch (e) {
			console.log('depost - withdraw amounts - test error', e);
		}
	});
	if (utils.DEBUG) console.log(clientList);

	afterAll((done) => {
		// First close DB connections
		closeDBConnect();
		server.close();
		done();
	});
});
