import { Server } from 'socket.io';
import { manageGame } from './game';
import { managePlayer } from './player';
import { logger } from '../logger';

export function initAllSocketsAPI (io: Server): void {

  logger.info('create namespace player');
  io.of('/player').on('connection', managePlayer);

  logger.info('create namespace game');
  io.of('/game').on('connection', manageGame);

}
