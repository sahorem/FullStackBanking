//npm install react-bootstrap-table-next --save --legacy-peer-deps
//npm install react-bootstrap-table2-paginator --save --legacy-peer-deps
//npm install react-bootstrap-table2-filter --save --legacy-peer-deps
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { UserContext } from './context.js';
import paginationFactory, {
	PaginationProvider,
	PaginationListStandalone,
} from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

function AllClients() {
	const [data, setData] = React.useState([]);
	const ctx = React.useContext(UserContext);
	const [status, setStatus] = React.useState('');

	const loadData = () => {
		// fetch all accounts from API
		const url = `/client/all`;
		// Leverage Access token for Authenticated Access i.e.
		// Call server with a token
		if (ctx.currentuser.firebaseuser) {
			ctx.currentuser.firebaseuser
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
						//console.log(data);
						if (data) {
							if (data.error) {
								setStatus('Data not found :' + data.error);
							} else {
								//console.log(JSON.parse(JSON.stringify(data)));
								setData(JSON.parse(JSON.stringify(data)));
								setStatus('- Records found : ' + data.length);
							}
						} else {
							setStatus('Data not found, please try again');
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
	const { SearchBar } = Search;
	const columns = [
		{
			dataField: 'clientid',
			text: 'Client ID',
		},
		{
			dataField: 'clientname',
			text: 'Name',
		},
		{
			dataField: 'accounttype',
			text: 'Account Type',
		},
		{
			dataField: 'openingbalance',
			text: 'Opening Balance',
		},
		{
			dataField: 'closingbalance',
			text: 'Closing Balance',
		},
	];

	const options = {
		custom: true,
		paginationSize: 4,
		pageStartIndex: 1,
		firstPageText: 'First',
		prePageText: 'Back',
		nextPageText: 'Next',
		lastPageText: 'Last',
		nextPageTitle: 'First page',
		prePageTitle: 'Pre page',
		firstPageTitle: 'Next page',
		lastPageTitle: 'Last page',
		showTotal: true,
		totalSize: data.length,
	};
	const contentTable = ({ paginationProps, paginationTableProps }) => (
		<div>
			<button className='btn btn-light' onClick={loadData}>
				Load Data {status}
			</button>
			<PaginationListStandalone {...paginationProps} />
			<ToolkitProvider keyField={'_id'} columns={columns} data={data} search>
				{(toolkitprops) => (
					<div>
						<SearchBar {...toolkitprops.searchProps} />
						<BootstrapTable
							striped
							hover
							{...toolkitprops.baseProps}
							{...paginationTableProps}
						/>
					</div>
				)}
			</ToolkitProvider>
			<PaginationListStandalone {...paginationProps} />
		</div>
	);
	let h2style = {
		textAlign: 'center',
		color: 'slateblue',
	};
	return (
		<div>
			<h3 style={h2style}>Full List of Clients</h3>
			<PaginationProvider pagination={paginationFactory(options)}>
				{contentTable}
			</PaginationProvider>
		</div>
	);
}

export { AllClients };
