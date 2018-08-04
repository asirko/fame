import * as express from 'express';
import * as socketIO from 'socket.io';
import { initAllSocketsAPI } from './api';

const http = require('http').Server(express());

// the definition and calls to all namespaces are isolated in api.ts
const io = socketIO(http);
initAllSocketsAPI(io);

http.listen(3000, () => {
  console.log('listening on *:3000');
});
