import React from 'react';
import { Card } from './card.js';
import { AccountType } from './accounttype.js';

const Transaction = (props) => {
	let {
		name,
		txntype,
		cbalance,
		sbalance,
		amount,
		validate,
		txnSubmit,
		status,
		show,
		acttype,
		actlist,
		setAcctType,
		clearForm,
	} = props.params;

	const [btndisabled, setBtndisabled] = React.useState(true);
	let txnheader = 'Withdraw Amount for ' + name;
	let btntext = 'Withdraw Amount';
	let txninfo = 'Enter withdrawl Amount';
	if (txntype === 'Deposit') {
		txnheader = 'Deposit Amount for ' + name;
		btntext = 'Deposit Amount';
		txninfo = 'Enter Deposit Amount';
	}

	const amtChange = (e) => {
		if (e.currentTarget.value) {
			if (Number(e.currentTarget.value) > 0) {
				setBtndisabled(false);
				// Call the parent for
				if (validate(e.currentTarget.value)) {
					e.preventDefault();
				}
			}
		} else {
			clrForm();
		}
	};

	const clrForm = () => {
		//Call the clear form on the parent component
		setBtndisabled(true);
		clearForm();
	};
	const params = {
		actlist: actlist,
		acttype: acttype,
		actChange: setAcctType,
	};

	return (
		<Card
			bgcolor='primary'
			header={txnheader}
			status={status}
			body={
				show ? (
					<>
						<p>Current checking Balance : {cbalance} </p>
						<p>Current savings Balance : {sbalance} </p>
						<br />
						<div className='acttype'>
							<AccountType params={params}></AccountType>
						</div>
						<br />
						{txninfo} <br />
						<input
							type='number'
							className='transaction'
							id='amount'
							placeholder={txninfo}
							value={amount}
							onChange={amtChange}
						/>
						<br /> <br />
						<button
							type='submit'
							style={{ backgroundColor: 'gray' }}
							className='btn btn-light'
							disabled={btndisabled}
							onClick={txnSubmit}>
							{btntext}
						</button>
					</>
				) : (
					<>
						<h5> Success </h5>
						<button type='submit' className='btn btn-light' onClick={clrForm}>
							Perform another {txnheader}
						</button>
					</>
				)
			}
		/>
	);
};

export { Transaction };
