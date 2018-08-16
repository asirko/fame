import * as express from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';
import { Apis } from './api';
import { logger } from './logger';
import { Injector } from './utils/di';

const server = new http.Server(express());

// the definition and calls to all namespaces are isolated in api.ts
const io = socketIO(server);

const apis = Injector.resolve<Apis>(Apis);
apis.initAllSocketsAPI(io);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  logger.info(`listening on: ${port}`);
});
