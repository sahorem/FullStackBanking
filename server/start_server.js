const app = require('./server.js');
const PORT = process.env.PORT || 4000;

var port = PORT;
app.listen(port, () => {
	console.log('Running on port: ' + PORT);
});
