import React from 'react';

const ctxValues = {
	currentuser: {
		name: '',
		email: '',
		openbalance: 0,
		closebalance: 0,
	},
	firebaseuser: '',
};

const UserContext = React.createContext(ctxValues);

export { UserContext, ctxValues };
