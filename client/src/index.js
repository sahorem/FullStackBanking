import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Home } from './home.js';
import { About } from './about.js';
import { CreateAccount } from './createaccount.js';
import { Money } from './money.js';
import { AllClients } from './allclients.js';
import { ClientSummary } from './clientsummary.js';
import { Login } from './login.js';
import { Logout } from './logout.js';
import { UserContext, ctxValues } from './context.js';
import { createBrowserHistory } from 'history';

function Spa() {
	const [logged, setLogged] = React.useState(false);
	const customHistory = createBrowserHistory();
	const toggleBar = (status) => {
		//logged === true ? setLogged(false) : setLogged(true);
		customHistory.push(`/Home`);
		//status ? customHistory.push(`/Deposit`) : customHistory.push(`/Login`);
		setLogged(status);
		(async () => {
			(await status)
				? customHistory.push(`/Deposit`)
				: customHistory.push(`/Login`);
		})();
	};

	return logged ? (
		<Router history={customHistory}>
			<UserContext.Provider value={ctxValues}>
				<Navbar bg='dark' expand='lg' variant='dark'>
					<Navbar.Toggle aria-controls='basic-navbar-nav' />
					<Navbar.Collapse id='basic-navbar-nav'>
						<Nav className='mr-auto'>
							<LinkContainer to='/Home'>
								<Nav.Link>Home</Nav.Link>
							</LinkContainer>
							<LinkContainer
								to={{
									pathname: '/Deposit',
									txntype: 'Deposit',
								}}>
								<Nav.Link>Deposit</Nav.Link>
							</LinkContainer>
							<LinkContainer
								to={{
									pathname: '/Withdraw',
									txntype: 'Withdraw',
								}}>
								<Nav.Link>Withdraw</Nav.Link>
							</LinkContainer>
							<LinkContainer to='/ClientList'>
								<Nav.Link>ClientList</Nav.Link>
							</LinkContainer>
							<LinkContainer to='/ClientSummary'>
								<Nav.Link>ClientSummary</Nav.Link>
							</LinkContainer>
							<LinkContainer to='/About'>
								<Nav.Link>About</Nav.Link>
							</LinkContainer>
							<LinkContainer
								to={{
									pathname: '/Logout',
									toggleBar: toggleBar,
								}}>
								<Nav.Link>Logout</Nav.Link>
							</LinkContainer>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Switch>
					<Route path='/Deposit' component={Money}></Route>
					<Route exact path='/Withdraw' component={Money}></Route>
					<Route exact path='/ClientList' component={AllClients}></Route>
					<Route exact path='/ClientSummary' component={ClientSummary}></Route>
					<Route path='/Logout' component={Logout}></Route>
					<Route path='/Home' component={Home}></Route>
					<Route path='/About' component={About}></Route>
					<Route exact path='/' component={Home}></Route>
					<Route component={Home} />
				</Switch>
			</UserContext.Provider>
		</Router>
	) : (
		<Router>
			<UserContext.Provider value={ctxValues}>
				<Navbar bg='dark' expand='lg' variant='dark'>
					<Navbar.Toggle aria-controls='basic-navbar-nav' />
					<Navbar.Collapse id='basic-navbar-nav'>
						<Nav className='mr-auto'>
							<LinkContainer to='/Home'>
								<Nav.Link>Home</Nav.Link>
							</LinkContainer>
							<LinkContainer
								to={{
									pathname: '/Login',
									toggleBar: toggleBar,
								}}>
								<Nav.Link>Login</Nav.Link>
							</LinkContainer>
							<LinkContainer
								to={{
									pathname: '/CreateAccount',
									toggleBar: toggleBar,
								}}>
								<Nav.Link>CreateAccount</Nav.Link>
							</LinkContainer>
							<LinkContainer to='/About'>
								<Nav.Link>About</Nav.Link>
							</LinkContainer>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Switch>
					<Route path='/Login' component={Login}></Route>
					<Route path='/CreateAccount' component={CreateAccount}></Route>
					<Route path='/Home' component={Home}></Route>
					<Route path='/About' component={About}></Route>
					<Route exact path='/' component={Home}></Route>
					<Route component={Home} />
				</Switch>
			</UserContext.Provider>
		</Router>
	);
}

ReactDOM.render(<Spa />, document.getElementById('root'));

export { Spa };
