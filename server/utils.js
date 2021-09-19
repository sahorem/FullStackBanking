const DEBUG = process.env.DEBUG || false;

// function to generate random number for opening balance
function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

// Function to generate current date time
function getCurrentDT() {
	var today = new Date();
	var date =
		today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time =
		today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
	return date + ' ' + time;
}

module.exports = { getCurrentDT, getRandomIntInclusive, DEBUG };
