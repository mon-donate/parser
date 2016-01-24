request = require('request');

module.exports = {
	whoami: whoami
}
function parser(error, res, body){
	console.log(res.toJSON());
}
function whoami(){
	request.get('https://staging-api.getmondo.co.uk/ping/whoami', {
		'auth': {
			'bearer': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaSI6Im9hdXRoY2xpZW50XzAwMDA5NFB2SU5ER3pUM2s2dHo4anAiLCJleHAiOjE0NTM4Mzg5OTAsImlhdCI6MTQ1MzU3OTc5MCwianRpIjoidG9rXzAwMDA5NFNWclZlRGJrQVdmOVN0MlAiLCJ1aSI6InVzZXJfMDAwMDk0Um82eVl6ekIwbVhDbzNyRiIsInYiOiIxIn0.IN2GY9JABk8TYkF7bZX6mpJu1vlNX_EhO1Dn0M79e9U'
			}
		}, 
		parser
	)
}
