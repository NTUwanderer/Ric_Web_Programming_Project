var fs = require('fs');

fs.writeFile('hello.txt', 'Hello World!', function(err) {
  if (err) return console.log(err);
  console.log('Hello World > helloworld.txt');
})