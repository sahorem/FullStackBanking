import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDtlWd9WQvjJvhtOs0VXEfOQL32aE2bfwo',
	authDomain: 'test-ffe82.firebaseapp.com',
	projectId: 'test-ffe82',
	storageBucket: 'test-ffe82.appspot.com',
	messagingSenderId: '795556499130',
	appId: '1:795556499130:web:417cfd2b21233a8f207c83',
};

// Initialize Firebase
const fireapp = initializeApp(firebaseConfig);
const firebaseClientAuth = getAuth(fireapp);

export { firebaseClientAuth };
