import * as React from 'react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Spa } from './index';
import { render } from '@testing-library/react';

// writing our own render method
/* 
import * as ReactDOM from 'react-dom';
import { getQueriesForElement } from '@testing-library/dom';
function render( component ) {
	const root = document.createElement('div');
	root.id = 'root';
	//document.body.appendChild(root);
	ReactDOM.render(component, root);
	return getQueriesForElement(root);
} */

test('Spa app', () => {
	// Set up our document body
	const { getByText, getByLabelText, queryByText } = render(<Spa />);
	// look for text on the page
	getByText('Home');
	getByText('Login');
	getByText('CreateAccount');
	expect(queryByText('Deposit')).toBeNull();
	expect(queryByText('Withdraw')).toBeNull();
	expect(queryByText('AllData')).toBeNull();

	// Test Navigation bar by clicking some tabs
	//Home
	const barhome = getByText('Home');
	fireEvent.click(barhome);
	getByText('BadBank Landing Module');
	const baracct = getByText('CreateAccount');
	fireEvent.click(baracct);
});
