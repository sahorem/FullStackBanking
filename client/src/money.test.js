import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { Spa } from './index';
import { Money } from './money';
import { render } from '@testing-library/react';

// Withdrw amount Test - userEvent expresses testing intent better

test('Withdraw amount ...', () => {
	const { getByText, getByLabelText, getByPlaceholderText } = render(
		<Money
			location={{
				txntype: 'Withdraw',
			}}
		/>
	);

	getByText(/Withdraw Amount for/);
	getByText(/Current Balance :/);

	const button = getByText('Withdraw Amount');
	const amt = getByPlaceholderText('Enter withdrawl Amount');

	//Test input validation - withdraw more than current balance
	userEvent.clear(amt);
	userEvent.type(amt, '200');
	userEvent.click(button);
	getByText(/more than balance/);

	// withdraw right amount
	userEvent.clear(amt);
	userEvent.type(amt, '20');
	userEvent.click(button);
	getByText('Amount has been withdrawn successfully.');
});

test('Deposit amount ...', () => {
	const { getByText, getByLabelText, getByPlaceholderText } = render(
		<Money
			location={{
				txntype: 'Deposit',
			}}
		/>
	);

	getByText(/Deposit Amount for/);
	getByText(/Current Balance :/);

	const button = getByText('Deposit Amount');
	const amt = getByPlaceholderText('Enter Deposit Amount');

	// Deposit invalid amount
	userEvent.clear(amt);
	userEvent.type(amt, '-20');
	userEvent.click(button);
	getByText('Enter Deposit Amount');

	// Deposit amount
	userEvent.clear(amt);
	userEvent.type(amt, '20');
	userEvent.click(button);
	getByText('Amount has been deposited successfully.');
});
