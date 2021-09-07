import * as React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AllClients } from './allclients';

// Load All data Test - userEvent expresses testing intent better
test('load all data  ...', () => {
	const { getByText, getAllByRole } = render(<AllData />);
	getByText('Load Data');

	const button = getByText('Load Data');

	//Test input validation - withdraw more than current balance
	userEvent.click(button);
	getAllByRole('link', { name: 'Next' });
});
