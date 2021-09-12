import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyBaUlXRWv9PE7n0XqmVrsiZflTMkrZWrik',
	authDomain: 'badbank-1bf7b.firebaseapp.com',
	projectId: 'badbank-1bf7b',
	storageBucket: 'badbank-1bf7b.appspot.com',
	messagingSenderId: '1001854122651',
	appId: '1:1001854122651:web:309878d15744b1615e243e',
};

// Initialize Firebase
const fireapp = initializeApp(firebaseConfig);
const firebaseClientAuth = getAuth(fireapp);

export { firebaseClientAuth };
