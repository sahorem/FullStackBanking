// To generate a private key file for firebase service account:
// In the Firebase console, open Settings > Service Accounts.
// Click Generate New Private Key, then confirm by clicking Generate Key.
// Securely store the JSON file containing the key.
// Now authenticate using firebase service account private key
const utils = require('./utils.js');

const firebaseServerAuth = require('firebase-admin');

var serviceAccount = require('./badbankServiceAccountKey.json');

firebaseServerAuth.initializeApp({
	credential: firebaseServerAuth.credential.cert(serviceAccount),
});

// Function to Verify Token for Authorizaton
function authVerify(req) {
	// first read token from header
	const idToken = req.headers.authorization;
	if (utils.DEBUG) console.log('header Token: ', idToken);

	return new Promise((resolve, reject) => {
		firebaseServerAuth
			.auth()
			.verifyIdToken(idToken)
			.then((decodedToken) => {
				if (utils.DEBUG) console.log('Authentication Success!:', decodedToken);
				resolve(decodedToken);
			})
			.catch((err) => {
				if (utils.DEBUG) console.log('Authentication Failure!:', err);
				reject(err); // calling `reject` will cause the promise to fail with or without the error passed as an argument
			});
	});
}

module.exports = { authVerify };
