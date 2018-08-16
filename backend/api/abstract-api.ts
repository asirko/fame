import { Namespace, Server, Socket } from 'socket.io';
import { logger } from '../logger';

export abstract class GenericAPI {

  protected nsp: Namespace;

  abstract manageSingleSocket(): (socket: Socket) => void;

  initNamespace(io: Server, name: string) {
    logger.info(`create namespace ${name}`);
    this.nsp = io.of(`/${name}`);
    this.nsp.on('connection', this.manageSingleSocket());
  }

}
