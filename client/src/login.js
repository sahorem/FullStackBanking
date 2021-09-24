import React from 'react';
import { Card } from './card.js';
import { setUserContext } from './context.js';
import { firebaseClientAuth } from './auth_client.js';

import {
	signInWithPopup,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
} from 'firebase/auth';

function Login(props) {
	const [show, setShow] = React.useState(true);
	const [status, setStatus] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

	//if user is logged in, it persists through refreshes, this eliminates that issue
	firebaseClientAuth.signOut();
	// Logout();

	// Function to validate input values
	function validate(field, label) {
		if (!field) {
			setStatus('Data Error : Please enter ' + label);
			setTimeout(() => setStatus(''), 3000);
			return false;
		}
		return true;
	}
	// Get the client details from backend mongo db
	function getClientInfo(email) {
		const url = `/client/findemail/${email}`;
		// Leverage Access token for Authenticated Access i.e.
		// Call server with a token
		if (firebaseClientAuth.currentUser) {
			firebaseClientAuth.currentUser
				.getIdToken()
				.then((idToken) => {
					//console.log('idToken:', idToken);
					(async () => {
						const myHeaders = new Headers({
							'Content-Type': 'application/json',
							Authorization: idToken,
						});

						let res = await fetch(url, {
							method: 'GET',
							headers: myHeaders,
						});
						if (Number(res.status) >= 400) {
							setStatus('Server Error : ' + res.statusText);
							return;
						}

						let data = await res.json();
						//console.log(data);
						if (data) {
							if (data.error) {
								// Client not in backend database
								setStatus('Client Details  :' + data.error);
							} else {
								// now set the current context to point to the logged user
								setUserContext(firebaseClientAuth.currentUser, data);

								setStatus('Successfully Logged in');
								setShow(false);
								setTimeout(() => setStatus(''), 6000);
								props.location.toggleBar(true);
							}
						} else {
							setStatus('client details not found. Login Failed');
							setTimeout(() => setStatus(''), 6000);
						}
					})();
				})
				.catch((err) => console.log('Token Error:', err));
		} else {
			setStatus(
				'There is currently no logged in user. Unable to call Auth Route.'
			);
		}
	}

	// Function to loging using email and passowrd authenticated using firebase
	function emailLogin() {
		setEmail(email.trim());
		setPassword(password.trim());

		if (!validate(email, 'email')) return;
		if (!validate(password, 'password')) return;

		// validate  email and password using firbase API
		signInWithEmailAndPassword(firebaseClientAuth, email, password)
			.then((result) => {
				// The signed-in user info.
				console.log(
					`You are logged in using the following email:
					${result.user}
					${result.user.email}`
				);
				// Call the function to get client details from backend
				getClientInfo(result.user.email);
			})
			.catch((error) => {
				console.log(error.code);
				console.log(error.message);
				setStatus(`Login Failed ${error.message}`);
				setTimeout(() => setStatus(''), 6000);
			});
	}

	// Function to Login using Google login using firebase api
	function googleLogin() {
		//Google Login
		console.log('google clicked');

		const gprovider = new GoogleAuthProvider();

		signInWithPopup(firebaseClientAuth, gprovider)
			.then((result) => {
				// This gives a Google Access Token. we can use it to access the Google API.
				//const credential = GoogleAuthProvider.credentialFromResult(result);
				//const token = credential.accessToken;
				// The signed-in user info.
				console.log(
					`You are logged in using the following email:
					${result.user}
					${result.user.email}`
				);
				// Call the function to get client details from backend
				getClientInfo(result.user.email);
			})
			.catch((error) => {
				// Handle Errors
				console.log(error.code);
				console.log(error.message);
				console.log(error.email);
				// The AuthCredential type that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);
				console.log(credential);
				setStatus(`Login Failed ${error.message}`);
				setTimeout(() => setStatus(''), 6000);
			});
	}

	function clearForm() {
		setEmail('');
		setPassword('');
		setShow(true);
	}

	return (
		<Card
			bgcolor='primary'
			header='Login'
			status={status}
			body={
				show ? (
					<>
						Email address <br />
						<input
							type='input'
							className='form-control'
							id='email'
							placeholder='Enter email'
							value={email}
							onChange={(e) => setEmail(e.currentTarget.value)}
						/>
						<br />
						Password <br />
						<input
							type='password'
							className='form-control'
							id='password'
							placeholder='Enter password'
							value={password}
							onChange={(e) => setPassword(e.currentTarget.value)}
						/>
						<br />
						<button
							type='submit'
							name='login'
							className='btn btn-light'
							style={{ margin: '7px', backgroundColor: '#80ced6' }}
							onClick={emailLogin}>
							Login
						</button>
						<button
							type='submit'
							className='btn btn-light'
							style={{ margin: '7px', backgroundColor: '#fefbd8' }} //#92a8d1
							onClick={googleLogin}>
							Google Login
						</button>
					</>
				) : (
					<>
						<h5> Success </h5>
						<button type='submit' className='btn btn-light' onClick={clearForm}>
							Successfully Logged in
						</button>
					</>
				)
			}
		/>
	);
}

export { Login };
