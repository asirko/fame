import { Socket } from 'socket.io';
import { addPlayer, disconnectPlayer, getPlayer } from '../controlers/player';
import { logger } from '../logger';

export function managePlayer (socket: Socket) {

  logger.info('connection on player namespace');

  socket.on('addPlayer', (playerName: string, response: (isAvailable: boolean) => void) => {
    logger.info('request for new player : ', playerName);
    const isAvailable = addPlayer(playerName, socket.id);
    logger.info(`Name '${playerName}' is ${isAvailable ? '' : 'NOT'} available`);
    response(isAvailable);
    if (isAvailable) {
      updateAllPlayers(socket);
    }
  });

  socket.on('disconnect', () => {
    const player = getPlayer(socket.id);
    logger.info(`${(player && player.name) || '-UNKNOWN-'} left the game`);
    disconnectPlayer(socket.id);
    updateAllPlayers(socket);
  });

  // TODO: Ajouter:
  // - répondre à la question (stocker réponse dans le service associé)

}

function updateAllPlayers(socket: Socket): void {
  socket.nsp.emit('allPlayers', [/* liste des noms des joueurs */]);
}
