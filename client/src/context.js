import React from 'react';

const ctxValues = {
	currentuser: {
		name: '',
		email: '',
		acctlist: '',
		accounts: [
			{
				accounttype: '',
				openbalance: 0,
				closebalance: 0,
			},
		],
		firebaseuser: '',
	},
};

const UserContext = React.createContext(ctxValues);

function setUserContext(firebaseClientAuth, data) {
	//Check if we got array (multiple accounts) or single object back (single account)
	if (Array.isArray(data)) {
		ctxValues.currentuser.name = data[0].clientname;
		ctxValues.currentuser.email = data[0].clientemail;
		ctxValues.currentuser.firebaseuser = firebaseClientAuth;
		let acctlist = '';
		for (let i = 0; i < data.length; i++) {
			ctxValues.currentuser.accounts[i] = {
				accounttype: data[i].accounttype,
				openbalance: data[i].openingbalance,
				closebalance: data[i].closingbalance,
			};
			acctlist = acctlist + data[i].accounttype + '#';
		}
		ctxValues.currentuser.acctlist = acctlist;
	} else {
		ctxValues.currentuser.name = data.clientname;
		ctxValues.currentuser.email = data.clientemail;
		ctxValues.currentuser.acctlist = data.accounttype + '#';
		ctxValues.currentuser.firebaseuser = firebaseClientAuth;
		ctxValues.currentuser.accounts[0] = {
			accounttype: data.accounttype,
			openbalance: data.openingbalance,
			closebalance: data.closingbalance,
		};
	}
}

export { UserContext, ctxValues, setUserContext };
