const Router = require('express').Router;
const router = new Router();

const users = [
  {
    name: 'Harry Potter',
    best_subject: 'Defence Against the Dark Arts',
    best_spell: 'Expelliarmus',
    hobby: 'Quidditch',
    wand: 'Phoenix Feather core, 11',
    following: [
      {
        name: 'Ron Weasley',
        photo: 'https://idigitalcitizen.files.wordpress.com/2011/07/ron-weasley-it-all-ends-1600x1200-hp7.jpg?w=640',
      }, {
        name: 'Hermione Granger',
        photo: 'https://idigitalcitizen.files.wordpress.com/2009/09/hermione-granger-hp7-tree-320x480-iphone.jpg',
      },
    ],
    photo: 'http://vignette1.wikia.nocookie.net/harrypotterfanon/images/6/60/Character_Profile_image_Harry_Potter.jpg/revision/latest?cb=20151207104325',
  }, {
    name: 'Ron Weasley',
    best_subject: 'Charms',
    best_spell: 'Stupify',
    hobby: 'Quidditch',
    wand: 'Willow and Unicorn hair, 14',
    following: [
      {
        name: 'Harry Potter',
        photo: 'http://vignette1.wikia.nocookie.net/harrypotterfanon/images/6/60/Character_Profile_image_Harry_Potter.jpg/revision/latest?cb=20151207104325',
      }, {
        name: 'Hermione Granger',
        photo: 'https://idigitalcitizen.files.wordpress.com/2009/09/hermione-granger-hp7-tree-320x480-iphone.jpg',
      },
    ],
    photo: 'https://idigitalcitizen.files.wordpress.com/2011/07/ron-weasley-it-all-ends-1600x1200-hp7.jpg?w=640',
  }, {
    name: 'Hermione Granger',
    best_subject: 'every subject except for Defence Against the Dark Arts',
    best_spell: 'Expecto Patronum',
    hobby: 'Reading',
    wand: 'Vine Wood with a Dragon Heartstring Core',
    following: [
      {
        name: 'Harry Potter',
        photo: 'http://vignette1.wikia.nocookie.net/harrypotterfanon/images/6/60/Character_Profile_image_Harry_Potter.jpg/revision/latest?cb=20151207104325',
      }, {
        name: 'Ron Weasley',
        photo: 'https://idigitalcitizen.files.wordpress.com/2011/07/ron-weasley-it-all-ends-1600x1200-hp7.jpg?w=640',
      },
    ],
    photo: 'https://idigitalcitizen.files.wordpress.com/2009/09/hermione-granger-hp7-tree-320x480-iphone.jpg',
  },
];

router.get('/users/', (req, res) => {
  res.status(200);
  res.json(users);
});

router.get('/users/:username', (req, res, next) => {
  let found = false;
  for (let i = 0, length = users.length; i < length; ++i) {
    if (req.params.username === users[i].name) {
      res.status(200);
      res.json(users[i]);
      found = true;
    }
  }
  if (found === false) {
    const err = new Error();
    err.status = 404; // ?
    err.message = `No such user with username:, ${req.params.username}`;
    next(err);
  }
});

router.use((err, req, res) => {
  console.log('error occurs: ', err.message); // eslint-disable-line no-console
  res.status(err.status || 500);
  res.send(err);
});

module.exports = router;
