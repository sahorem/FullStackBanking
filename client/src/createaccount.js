import React from 'react';
import { Card } from './card.js';
import { UserContext } from './context.js';
import { firebaseClientAuth } from './auth_client.js';
import {
	signInWithPopup,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
} from 'firebase/auth';

function CreateAccount(props) {
	const [show, setShow] = React.useState(true);
	const [status, setStatus] = React.useState('');
	const [name, setName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const ctx = React.useContext(UserContext);

	//if user is logged in, it persists through refreshes, this eliminates that issue
	firebaseClientAuth.signOut();

	// Logout();
	// Function to validate input data
	function validate(field, label) {
		if (!field) {
			setStatus('Data Error : Please enter ' + label);
			setTimeout(() => setStatus(''), 6000);
			return false;
		}
		// Check for email format
		if (label === 'password') {
			//let regpswd = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/;
			let regpswd =
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
			/*
				/^
 				 (?=.*\d)          // should contain at least one digit
  				(?=.*[a-z])       // should contain at least one lower case
  				(?=.*[A-Z])       // should contain at least one upper case
				(?!.*\s)		// should contain one special character 
  				[a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
				$/
			*/
			if (!regpswd.test(field)) {
				console.log('Bad Password ', field);
				setStatus(
					'Password Format Error: Must contain One upper case, One lower case, one number, one special character and must be eight characeters or longer'
				);
				setTimeout(() => setStatus(''), 6000);
				return false;
			}
		}
		// Check for email format
		if (label === 'email') {
			let regemail = /\S+@\S+\.\S+/;
			if (!regemail.test(field)) {
				setStatus('Email Format Error: ');
				setTimeout(() => setStatus(''), 6000);
				return false;
			}
		}
		return true;
	}

	// Create client account in backend (mongodb)
	function createClient(email, name) {
		const url = '/client/create/';
		// Leverage Access token for Authenticated Access i.e.
		// Call server with a token
		if (firebaseClientAuth.currentUser) {
			firebaseClientAuth.currentUser
				.getIdToken()
				.then((idToken) => {
					(async () => {
						let res = await fetch(url, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json;charset=utf-8',
								Authorization: idToken,
							},
							body: JSON.stringify({
								name: name,
								email: email,
							}),
						});

						if (Number(res.status) >= 400) {
							setStatus('Server Error : ' + res.statusText);
							return;
						}

						let data = await res.json();
						console.log(data);
						if (data) {
							if (data.error) {
								setStatus('Failed to create the client account :' + data.error);
							} else {
								setStatus(
									'Account Successfully Created with opening balance of ' +
										data.openingbalance
								);
								ctx.currentuser = {
									name,
									email,
									openbalance: data.openingbalance,
									closebalance: data.closingbalance,
								};
								ctx.firebaseuser = firebaseClientAuth.currentUser;
								props.location.toggleBar(true);
								setShow(false);
							}
						} else {
							setStatus(
								'Failed to create the client account, please try again'
							);
						}
					})();
				})
				.catch((err) => console.log('Token Error:', err));
		} else {
			console.log(
				'There is currently no logged in user. Unable to call Auth Route.'
			);
		}
	}

	// Create email based account for firebase
	function signupEmail() {
		console.log(name, ',', email, ',', password);

		if (!validate(name, 'name')) return;
		if (!validate(email, 'email')) return;
		if (!validate(password, 'password')) return;

		createUserWithEmailAndPassword(firebaseClientAuth, email, password)
			.then((result) => {
				// Signed in
				console.log(
					`Signed in using the following email:
					${result.user}
					${result.user.email}`
				);
				// Call the function to create client in the backend
				createClient(result.user.email, name);
			})
			.catch((error) => {
				console.log(error.code);
				console.log(error.message);
				setStatus(
					`Failed to create the client account, please try again ${error.message}`
				);
			});
	}

	// Create email based account for firebase
	function signupGoogle() {
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
				// Call the function to create client in the backend
				createClient(result.user.email, result.user.displayName);
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

		createUserWithEmailAndPassword(firebaseClientAuth, email, password)
			.then((result) => {
				// Signed in
				console.log(
					`Signed in using the following email:
					${result.user}
					${result.user.email}`
				);
				// Call the function to create client in the backend
				createClient();
			})
			.catch((error) => {
				console.log(error.code);
				console.log(error.message);
				setStatus(
					`Failed to create the client account, please try again ${error.message}`
				);
			});
	}

	function clearForm() {
		setName('');
		setEmail('');
		setPassword('');
		setShow(true);
	}

	return (
		<Card
			bgcolor='primary'
			header='Create Bank Account'
			status={status}
			body={
				show ? (
					<>
						Name <br />
						<input
							type='input'
							className='form-control'
							id='name'
							placeholder='Enter name'
							value={name}
							onChange={(e) => setName(e.currentTarget.value)}
						/>
						<br />
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
							className='btn btn-light'
							style={{ backgroundColor: '#80ced6' }}
							onClick={signupEmail}>
							Sign-Up
						</button>
						<button
							type='Google Signup'
							className='btn btn-light'
							style={{ backgroundColor: '#fefbd8' }}
							onClick={signupGoogle}>
							Google Sign-Up
						</button>
					</>
				) : (
					<>
						<h5> Success </h5>
						<button type='submit' className='btn btn-light' onClick={clearForm}>
							Add another account
						</button>
					</>
				)
			}
		/>
	);
}

export { CreateAccount };
