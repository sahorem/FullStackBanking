import { Card } from './card.js';
function Home() {
	return (
		<Card
			style={{ textAlign: 'center' }}
			txtcolor='black'
			header='BadBank Landing Module'
			title='Welcome to the bank'
			text='You can move around using the navigation bar.'
			body={
				<img src='bank.png' className='img-fluid' alt='Welcome to Bad Bank' />
			}
		/>
	);
}

export { Home };
