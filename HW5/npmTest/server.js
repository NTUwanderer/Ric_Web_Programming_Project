var express = require('express');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var path = require('path');

var app = express();
var router = express.Router();

var users = [
	{id: 1, name: "Joe", age: 18},
	{id: 2, name: "John", age: 22},
	{id: 3, name: "Harvey", age: 20},
	{id: 4, name: "Marvyn", age: 21}
];

function getUserById(id) {
	for (var i = 0, length = users.length; i < length; ++i)
		if (users[i].id === id)
			return	users[i];
	return null;
}
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/static', express.static('public'));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/query/', function(req, res) {
  res.json(req.query);
});

router.post('/api/body/', function(req, res) {
	res.send(JSON.stringify(req.body));
});
router.get('/api/user/:id', function (req, res) {
	var user = getUserById(Number(req.params.id));
	if (user === null)
		res.send("Cannot find the user with id: " + req.params.id);
	else
		res.json(user);
});

// router.use(function(req, res, next) {
// 	var err = new Error();
// 	err.status = 404;
// 	next(err);
// });

// router.use(function(err, req, res, next) {
// 	console.log("error occurs..." + err.message);
// 	res.status(err.status || 500);
// 	res.render('error', {
// 		message: "Error 404",
// 		error: "Error 404..."
// 	});
// });

app.use('/', router);

app.use(function(req, res, next) {
	console.log("First...");
	var err = new Error();
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	console.log("error occurs..." + err.message);
	//res.status(err.status || 500);
	res.render('error', {
		title: "Error",
		message: err.message,
		error: "Error:" + err.status
	});
});

app.listen(3000);

