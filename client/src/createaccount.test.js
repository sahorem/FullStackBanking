import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { CreateAccount } from './createaccount';
import { render } from '@testing-library/react';

// CreatAccount Test - userEvent expresses testing intent better
test('Create Account ...', () => {
	const { getByText, getByLabelText, getByPlaceholderText } = render(
		<CreateAccount
			location={{
				toggleBar: () => true,
			}}
		/>
	);

	const button = getByText('Create Account');
	const name = getByPlaceholderText('Enter name');
	const email = getByPlaceholderText('Enter email');
	const pswd = getByPlaceholderText('Enter password');

	//Test one by one input validation ( when data is missing )
	// No data was entered
	userEvent.click(button);
	getByText(/Data Error : Please enter /);

	// Only Name was entered (missing email and password)
	userEvent.type(name, 'Dummy Name');
	userEvent.click(button);
	getByText(/Data Error : Please enter /);

	// Name was entered, email format incorrectly entered (and missing password)
	userEvent.type(name, 'Dummy Name');
	userEvent.type(email, 'dummy.com');
	userEvent.click(button);
	getByText(/Email Format Error/);

	// Name was entered, email format correctly entered
	// but missing password
	userEvent.type(name, 'Dummy Name');
	userEvent.type(email, 'dummy@dummy.com');
	userEvent.click(button);
	getByText(/Data Error : Please enter /);

	// Name was entered, email format correctly entered
	// but password incorrectly - missing correct length and casing requirements
	userEvent.type(name, 'Dummy Name');
	userEvent.type(email, 'dummy@dummy.com');
	userEvent.type(pswd, 'TestNam');
	userEvent.click(button);
	getByText(/Password Format Error:/);

	// Name, email and Password correctly entered
	userEvent.type(name, 'Dummy Name');
	userEvent.type(email, 'dummy@dummy.com');
	userEvent.type(pswd, 'TestName123');
	userEvent.click(button);

	getByText('Success');
	getByText('Add another account');
});
