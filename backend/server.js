'use strict';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

require('./namespace')(io);

http.listen(3000, () => {
  console.log('Started on port 3000');
});
