import React from 'react';

function AccountType(props) {
	let { actlist, acttype, actChange } = props.params;

	let rstyle = {
		textAlign: 'right',
		margin: '9px',
		width: '1em',
		height: '1em',
		fontSize: '1.2em',
	};

	function handleChange(e) {
		//e.preventDefault();
		if (e.target.checked) {
			actChange(e.target.value);
		}
	}

	function Rbuttons(params) {
		const { rtype, triggerChange } = params.params;
		return (
			<input
				style={rstyle}
				id={rtype}
				value={rtype}
				name='accounttype'
				type='radio'
				checked={acttype === rtype}
				onChange={(e) => {
					triggerChange(e);
				}}
			/>
		);
	}

	return actlist === 'checking#' ? (
		<div className='radio-checking'>
			Checking
			<Rbuttons params={{ rtype: 'checking', triggerChange: handleChange }} />
		</div>
	) : actlist === 'savings#' ? (
		<div className='radio-savings'>
			Savings
			<Rbuttons params={{ rtype: 'savings', triggerChange: handleChange }} />
		</div>
	) : actlist === 'checking#savings#' ? (
		<div className='radio-buttons'>
			Checking
			<Rbuttons params={{ rtype: 'checking', triggerChange: handleChange }} />
			Savings
			<Rbuttons params={{ rtype: 'savings', triggerChange: handleChange }} />
		</div>
	) : (
		<div className='radio-buttons'>
			Checking
			<Rbuttons params={{ rtype: 'checking', triggerChange: handleChange }} />
			Savings
			<Rbuttons params={{ rtype: 'savings', triggerChange: handleChange }} />
			Both
			<Rbuttons params={{ rtype: 'both', triggerChange: handleChange }} />
		</div>
	);
}
export { AccountType };
