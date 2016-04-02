var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', function(req, res) {
  res.json(req.body);
});

router.get('/user/:name/:id', function (req, res) {
  res.send(req.params.name + " welcome back!");
});	

router.get('/', function(req, res) {
  res.send('<h1>首頁</h1>');
});

router.get('/api/query/', function(req, res) {
  res.json(req.query);
});

app.use('/', router);

app.listen(3000);
