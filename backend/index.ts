import * as express from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';
import { initAllSocketsAPI } from './api';

const server = new http.Server(express());

// the definition and calls to all namespaces are isolated in api.ts
const io = socketIO(server);
initAllSocketsAPI(io);

server.listen(3000, () => {
  console.log('listening on *:3000');
});
