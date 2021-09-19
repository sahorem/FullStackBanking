import { Card } from './card.js';
function About() {
	return (
		<div>
			<Card
				style={{ textAlign: 'center' }}
				txtcolor='black'
				header='Bad Bank Project Details'
				maxwidth='60rem'
				body={
					<img
						src='FullStackBanking-Authentication-Flows.png'
						className='img-fluid'
						alt='Welcome to Bad Bank'
					/>
				}
			/>
			<Card
				style={{ textAlign: 'center' }}
				txtcolor='black'
				maxwidth='60rem'
				body={
					<img
						src='Fullstackbanking-setup.png'
						className='img-fluid'
						alt='Welcome to Bad Bank'
					/>
				}
			/>
			<Card
				style={{ textAlign: 'center' }}
				txtcolor='black'
				maxwidth='60rem'
				body={
					<img
						src='Fullstackbanking-Testing.png'
						className='img-fluid'
						alt='Welcome to Bad Bank'
					/>
				}
			/>
		</div>
	);
}

export { About };
