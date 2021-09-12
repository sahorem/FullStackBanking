// To generate a private key file for firebase service account:
// In the Firebase console, open Settings > Service Accounts.
// Click Generate New Private Key, then confirm by clicking Generate Key.
// Securely store the JSON file containing the key.

// firebase service account private key
/*
const firebaseServerAuth = require('firebase-admin');

const type = 'service_account';
const project_id = 'test-ffe82';
const private_key_id = '4ce48b742772f8a004491abb13dcea19c4f256e2';
const private_key =
	'-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC3SLBTMGJhAcvb\nZjjOGdZytD4ARajkerqhPaM3+YHrYYRI/JH2PZ5aQe411mpFBfEjsaC88hCpG6FT\n8NuappouW4uu31aYYSc28yC7i8e47UnbMbvsFKtIYwRQ2V2MwSxIX0/xJK9qoQmX\nob0JAar6P2cFJ2LmJt3gMcFsbWIeint0cCqzVxUsplTyxYebgseuM3GlUfN/nTMV\nWc9IwLhPlg+XteeM94BhWWEGm/ZqdLj530xjZXUU4jTL1nMiAUuKAYlHDHgI8QNi\nxzm1MYdz82pNirggBs5mAkl9GsRDioJoYyDFd5/8Hr4NaFCKlZlV+dLS9kYAIYvI\nfJSlKF/rAgMBAAECggEASyRJaemxw6ydW7c2fcTZBxC/RJRKkFWCsz1Wb8niylIi\nDlxCKS6M/9r84uSjj+XGPYiC6kPhsbsKsqPSHL7GAlB03X5h/boC/kPCPTGq8bWS\n7IMg1MKKkHRL3iunb1/5HDi7SRVtt20LRjfAjPM6mjspLNM/eDUiDNrJPn8/1V3k\nKyONJAossjrVtg65bj8YZDopNhzH858DiOLs+aOk7cc04U+EeVx8prye915XDn78\nBd4acg+DYFwVc+gz8fVYKZ0z7Vv7ZiH9WhGob0flvvNr6lvX2AEuKlN+aiYfc4Wj\n4CVo7N4U7v5iycbB5NCSAqaqOhoggfR4ro7zpv4QQQKBgQD+FrfpE0htAg03ImuR\nYlrsudrbhpgExSmRS4ACPpzivYJzreFReRc99K+c9hIaFQWRsPylULCjssxfrPi+\nonl9koVEWtisR7SFVQr9Ey0x/Zmlz2aNfXO4bsY+1bvL1+wt0ofMeVhQlson1SyI\n02t33yJWq879tBFzEZv/3Sn2KwKBgQC4qaBWtG38ZNFl81VqyG5XXdViHAU8Tih3\nCuXl3Sheb0ZTECIsgoOiTmP1OBTCSAJOhGZs0WmAJRQfwKmPc8P7RbEMbmWhCkwU\nhbD4V6ObQqG2wXBkeISrImAS46iHjAH1sI5RyLuRwb90IdGYUX4rGEVislfMH8l4\nQ7UqVNodQQKBgDdfKBEI/L2UtuCPBbYXIw13qzQv7q0LcnWRaIIUtwfKmMUw3Wtt\n4hzEWAjyrxsz/ZS0Zzp3jSb/bf5jqYmRyrwM1DIDQji5H6P21oA0T6MXSwaRXh3z\neuZ0bYt/9H8FvRh3StTKlO5rDf8EO8JNoJvs6oTMyD0NosfazI5D2kMlAoGADHcm\n47N6WTdVC1TJx1OQX0VuShkqIVAFW0PZERNEzlsknCbSp76HtEUmaj9G53aE8Vfu\nshnQzV2zZhFTYOOnryadNQGeyqgvSpNbxufjm298CyIzvBSGoCbJ5XyIu92vpC4u\n7UZnowc5LVW7GFUn9zDEPk1br+PVbdDkQd9IegECgYBoQDGR3tJVm0K4DH2nSnbE\nsZsiw7xXXC7Gw9HeVRRhKTUdoF1Rd0+4Xi9IICfzwFtRKz+XS3vguU2wLBJixhTZ\nq8ilYXb5JLfB3FMvkaUorW7pdnlcUQWcaSwZfcA/CPlNIhu9pZtko0aXvTJoZFz1\noJ98yT1hqaPNDdRYJilH7w==\n-----END PRIVATE KEY-----\n';
const client_email =
	'firebase-adminsdk-q153s@test-ffe82.iam.gserviceaccount.com';
const client_id = '107777719157382918802';
const auth_uri = 'https://accounts.google.com/o/oauth2/auth';
const token_uri = 'https://oauth2.googleapis.com/token';
const auth_provider_x509_cert_url =
	'https://www.googleapis.com/oauth2/v1/certs';
const client_x509_cert_url =
	'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-q153s%40test-ffe82.iam.gserviceaccount.com';

// credential grants access to Firebase services
firebaseServerAuth.initializeApp({
	credential: firebaseServerAuth.credential.cert({
		type,
		project_id,
		private_key_id,
		private_key: private_key.replace(/\\n/g, '\n'),
		client_email,
		client_id,
		auth_uri,
		token_uri,
		auth_provider_x509_cert_url,
		client_x509_cert_url,
	}),
});

*/

const firebaseServerAuth = require('firebase-admin');

var serviceAccount = require('./badbankServiceAccountKey.json');

firebaseServerAuth.initializeApp({
	credential: firebaseServerAuth.credential.cert(serviceAccount),
});

module.exports = firebaseServerAuth;
