import React from 'react';
import { UserContext } from './context.js';
import { Transaction } from './transaction.js';

function Money(props) {
	const txntype = props.location.txntype;
	const ctx = React.useContext(UserContext);
	const [show, setShow] = React.useState(true);
	const [status, setStatus] = React.useState('');
	const [balance, setBalance] = React.useState(ctx.currentuser.closebalance);
	const [amount, setAmount] = React.useState(0);
	const name = ctx.currentuser.name;

	const validateTxn = (amount) => {
		if (!amount) {
			setStatus('Please enter valid amount');
			setTimeout(() => setStatus(''), 3000);
			return false;
		} else {
			// Check for amount
			if (amount <= 0) {
				setStatus('Please enter a positive amount ');
				setTimeout(() => setStatus(''), 3000);
				return false;
			}
		}
		setAmount(amount);
		return true;
	};

	const handleTxn = () => {
		if (!validateTxn(amount)) return;
		let txnamt = amount;
		let txnmsg = 'Amount has been deposited successfully,new closing balance: ';
		if (txntype === 'Withdraw') {
			// withdraw
			if (amount > balance) {
				setStatus("Amount withdrawn can't be more than balance.");
				return;
			}
			txnamt = -1 * amount;
			txnmsg = 'Amount has been withdrawn successfully, new closing balance: ';
		}
		const url = `/client/update/${ctx.currentuser.email}/${txnamt}`;
		// Leverage Access token for Authenticated Access i.e.
		// Call server with a token
		if (ctx.firebaseuser) {
			ctx.firebaseuser
				.getIdToken()
				.then((idToken) => {
					(async () => {
						const myHeaders = new Headers({
							'Content-Type': 'application/json',
							Authorization: idToken,
						});

						let res = await fetch(url, {
							method: 'GET',
							headers: myHeaders,
						});

						let data = await res.json();
						console.log(data);
						if (data) {
							if (data.error) {
								setStatus('Account not updated :' + data.error);
							} else {
								ctx.currentuser = {
									name: data.value.clientname,
									email: data.value.clientemail,
									openbalance: data.value.openingbalance,
									closebalance: data.value.closingbalance,
								};
								setBalance(data.value.closingbalance);
								setStatus(txnmsg + data.value.closingbalance);
								setTimeout(() => setStatus(''), 6000);
								setShow(false);
							}
						} else {
							setStatus('Failed to update the account, please try again');
						}
					})();
				})
				.catch((err) => console.log('Token Error:', err));
		} else {
			console.log(
				'There is currently no logged in user. Unable to call Auth Route.'
			);
		}
	};

	const clearForm = () => {
		setAmount(0);
		setStatus('');
		setShow(true);
	};
	const params = {
		name: name,
		txntype: txntype,
		balance: balance,
		amount: amount,
		validate: validateTxn,
		txnSubmit: handleTxn,
		status: status,
		show: show,
		clearForm: clearForm,
	};

	return (
		<div className={txntype}>
			<Transaction params={params}></Transaction>
		</div>
	);
}

export { Money };
