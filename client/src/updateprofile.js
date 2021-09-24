import React, { useEffect } from 'react';
import { Card } from './card.js';
import { UserContext } from './context.js';

function UpdateProfile(props) {
	const [show, setShow] = React.useState(true);
	const [status, setStatus] = React.useState('');
	const [address1, setAddress1] = React.useState('');
	const [address2, setAddress2] = React.useState('');
	const [city, setCity] = React.useState('');
	const [state, setState] = React.useState('');
	const [zipcode, setZipcode] = React.useState('');
	const ctx = React.useContext(UserContext);

	const txnheader = 'Update Client Profile for ' + ctx.currentuser.name;
	// Function to validate input data
	function validate(field, label) {
		if (!field) {
			setStatus('Data Error : Please enter ' + label);
			setTimeout(() => setStatus(''), 6000);
			return false;
		}
		return true;
	}

	//Get Client Profile
	function getClientProfile(email) {
		const url = `/client/findprofile/${ctx.currentuser.id}`;
		// Leverage Access token for Authenticated Access i.e.
		// Call server with a token
		if (ctx.currentuser.firebaseuser) {
			ctx.currentuser.firebaseuser
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
								// Client profile not in backend database
								setStatus('Client profile :' + data.error);
							} else {
								// now set the profile values
								setAddress1(data.address1);
								setAddress2(data.address2);
								setCity(data.city);
								setState(data.state);
								setZipcode(data.zipcode);
								setStatus('');
								setShow(true);
							}
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

	// Create client Profile  in backend (mongodb)
	function updateProfile(email, name) {
		setAddress1(address1.trim());
		setAddress2(address1.trim());
		setCity(city.trim());
		setState(state.trim());
		setZipcode(zipcode.trim());

		if (!validate(address1, 'address1')) return;

		if (!validate(address1, 'address1')) return;
		if (!validate(city, 'city')) return;
		if (!validate(state, 'state')) return;
		if (!validate(zipcode, 'state')) return;

		const url = '/client/updateprofile/';
		// Leverage Access token for Authenticated Access i.e.
		// Call server with a token
		if (ctx.currentuser.firebaseuser) {
			ctx.currentuser.firebaseuser
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
								clientid: ctx.currentuser.id,
								address1: address1,
								address2: address2,
								city: city,
								state: state,
								zipcode: zipcode,
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
								setStatus('Failed to update the client profile :' + data.error);
							} else {
								setStatus('Successfully updated the client profile ');
								setShow(false);
							}
						} else {
							setStatus(
								'Failed to update the client profile, please try again'
							);
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

	function clearForm() {
		setAddress1('');
		setAddress2('');
		setCity('');
		setState('');
		setZipcode('');
		getClientProfile();
		setStatus('');
		setShow(true);
	}

	React.useEffect(() => {
		getClientProfile();
	}, []);

	return (
		<Card
			bgcolor='primary'
			header={txnheader}
			status={status}
			body={
				show ? (
					<>
						Address 1 <br />
						<input
							type='input'
							className='form-control'
							id='address1'
							placeholder='Enter Address'
							value={address1}
							onChange={(e) => setAddress1(e.currentTarget.value)}
						/>
						<br />
						Address 2 <br />
						<input
							type='input'
							className='form-control'
							id='address2'
							placeholder='Enter Address'
							value={address2}
							onChange={(e) => setAddress2(e.currentTarget.value)}
						/>
						<br />
						City <br />
						<input
							type='input'
							className='form-control'
							id='city'
							placeholder='Enter City'
							value={city}
							onChange={(e) => setCity(e.currentTarget.value)}
						/>
						<br />
						State <br />
						<input
							type='input'
							className='form-control'
							id='state'
							placeholder='Enter State'
							value={state}
							onChange={(e) => setState(e.currentTarget.value)}
						/>
						<br />
						Zip Code <br />
						<input
							type='input'
							className='form-control'
							id='zipcode'
							placeholder='Enter Zipcode'
							value={zipcode}
							onChange={(e) => setZipcode(e.currentTarget.value)}
						/>
						<br />
						<br />
						<button
							type='submit'
							className='btn btn-light'
							style={{ margin: '7px', backgroundColor: '#80ced6' }}
							onClick={updateProfile}>
							Update Profile
						</button>
					</>
				) : (
					<>
						<h5> Success </h5>
						<button type='submit' className='btn btn-light' onClick={clearForm}>
							Make additional profile updates
						</button>
					</>
				)
			}
		/>
	);
}

export { UpdateProfile };
