import React from 'react';
import { UserContext } from './context.js';
import { signOut } from 'firebase/auth';
import { firebaseClientAuth } from './auth_client.js';

function Logout(props) {
	const ctx = React.useContext(UserContext);

	signOut(firebaseClientAuth)
		.then(() => {
			// Sign-out successful.
			console.log('Logout Successfull');
			ctx.currentuser = {
				name: '',
				email: '',
				openbalance: 0,
				closebalance: 0,
			};
			props.location.toggleBar(false);
		})
		.catch((error) => {
			// An error happened.
			console.log('Unable to Log out');
		});

	return;
}

export { Logout };
