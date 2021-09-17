const app = require('./server.js');

var port = 4000;
app.listen(port, () => {
	console.log('Running on port: ' + port);
});
