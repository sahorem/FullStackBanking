const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('http://localhost:3000/login');
	await page.type('#email', 'dummy123@dummy.com');
	await page.type('#password', 'Dummy123!');
	await page.click('[name="login"]');
	await page.waitForNavigation();

	await page.screenshot({ path: 'badbank.png' });

	await browser.close();
})();
