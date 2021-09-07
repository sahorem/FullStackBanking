function Card(props) {
	let divstyle = {
		textAlign: 'center',
		fontSize: '20px',
	};
	function classes() {
		const bg = props.bgcolor ? ' bg-' + props.bgcolor : ' ';
		const txt = props.txtcolor ? ' text-' + props.txtcolor : ' text-white';
		return 'card mb-3 ' + bg + txt;
	}
	return (
		<div className={classes()} style={{ maxWidth: '25rem' }}>
			<div className='card-header' style={divstyle}>
				{props.header}
			</div>
			<div className='card-body'>
				{props.title && <h5 className='card-title'> {props.title} </h5>}{' '}
				{props.text && <p className='card-text'> {props.text} </p>} {props.body}{' '}
				{props.status && <div id='createStatus'> {props.status} </div>}{' '}
			</div>
		</div>
	);
}

export { Card };
