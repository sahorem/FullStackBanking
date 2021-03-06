import React from 'react';
import { UserContext } from './context.js';
import { Transaction } from './transaction.js';

function Money(props) {
	const txntype = props.location.txntype;
	const [show, setShow] = React.useState(true);
	const [status, setStatus] = React.useState('');
	const [acttype, setAcctType] = React.useState('');
	const [cbalance, setCbalance] = React.useState(0);
	const [sbalance, setSbalance] = React.useState(0);
	const [amount, setAmount] = React.useState(0);
	const ctx = React.useContext(UserContext);
	const name = ctx.currentuser.name;
	const acctlist = ctx.currentuser.acctlist;

	// Similar to componentDidMount and componentDidUpdate:
	React.useEffect(() => {
		for (let i = 0; i < ctx.currentuser.accounts.length; i++) {
			if (ctx.currentuser.accounts[i].accounttype === 'checking') {
				setAcctType('checking');
				setCbalance(ctx.currentuser.accounts[i].closebalance);
			} else {
				setAcctType('savings');
				setSbalance(ctx.currentuser.accounts[i].closebalance);
			}
		}
	}, [ctx.currentuser.accounts]); // Empty arrary to ensure this is done only at the mount time , not again

	const validateTxn = (amt) => {
		if (!amt) {
			setStatus('Please enter valid amount');
			setTimeout(() => setStatus(''), 3000);
			return false;
		} else {
			// Check for amount
			if (amt <= 0) {
				setStatus('Please enter a positive amount ');
				setTimeout(() => setStatus(''), 3000);
				return false;
			}
		}
		setAmount(amt);
		return true;
	};

	const handleTxn = () => {
		if (!validateTxn(amount)) return;
		let txnamt = amount;
		let txnmsg = 'Amount has been deposited successfully,new closing balance: ';
		if (txntype === 'Withdraw') {
			// withdraw
			if (acttype === 'checking') {
				if (amount > cbalance) {
					setStatus("Amount withdrawn can't be more than balance.");
					return;
				}
			} else {
				if (amount > sbalance) {
					setStatus("Amount withdrawn can't be more than balance.");
					return;
				}
			}

			txnamt = -1 * amount;
			txnmsg = 'Amount has been withdrawn successfully, new closing balance: ';
		}

		const url = '/client/transaction/';
		// Leverage Access token for Authenticated Access i.e.
		// Call server with a token
		if (ctx.currentuser.firebaseuser) {
			ctx.currentuser.firebaseuser
				.getIdToken()
				.then((idToken) => {
					(async () => {
						/*const myHeaders = new Headers({
							'Content-Type': 'application/json',
							Authorization: idToken,
						}); */

						let res = await fetch(url, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json;charset=utf-8',
								Authorization: idToken,
							},
							body: JSON.stringify({
								clientid: ctx.currentuser.id,
								acttype: acttype,
								amount: txnamt,
							}),
						});

						let data = await res.json();
						//console.log(data);
						if (data) {
							if (data.error) {
								setStatus('Account not updated :' + data.error);
							} else {
								for (let i = 0; i < ctx.currentuser.accounts.length; i++) {
									if (ctx.currentuser.accounts[i].accounttype === acttype) {
										ctx.currentuser.accounts[i].closebalance =
											data.value.closingbalance;
										if (acttype === 'checking') {
											setCbalance(ctx.currentuser.accounts[i].closebalance);
										} else {
											setSbalance(ctx.currentuser.accounts[i].closebalance);
										}
									}
								}
								setStatus(txnmsg + data.value.closingbalance);
								setTimeout(() => setStatus(''), 3000);
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
		cbalance: cbalance,
		sbalance: sbalance,
		amount: amount,
		validate: validateTxn,
		txnSubmit: handleTxn,
		status: status,
		show: show,
		acttype: acttype,
		actlist: acctlist,
		setAcctType: setAcctType,
		clearForm: clearForm,
	};

	return (
		<div className='txntype'>
			<Transaction params={params}></Transaction>
		</div>
	);
}

export { Money };
