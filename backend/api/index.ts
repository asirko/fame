import { Server } from 'socket.io';
import { manageGame } from './game';
import { managePlayer } from './player';

export function initAllSocketsAPI (io: Server): void {

  console.log('create namespace player');
  io.of('/player').on('connection', managePlayer);

  console.log('create namespace game');
  io.of('/game').on('connection', manageGame);

}
