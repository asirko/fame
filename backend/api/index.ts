import { Server } from 'socket.io';
import { manageGame } from './game';
import { initPlayerNamespace } from './player';
import { logger } from '../logger';

export function initAllSocketsAPI (io: Server): void {

  logger.info('create namespace player');
  initPlayerNamespace(io.of('/player'));

  logger.info('create namespace game');
  io.of('/game').on('connection', manageGame);

}
