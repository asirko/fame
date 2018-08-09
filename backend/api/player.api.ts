import { Namespace, Socket } from 'socket.io';
import { players } from '../controllers/player.controller';
import { logger } from '../logger';

export function initPlayerNamespace(nsp: Namespace) {

  players.playersScore$.subscribe(gameSummary => nsp.emit('allPlayers', gameSummary));

  nsp.on('connection', managePlayer);
}

function managePlayer (socket: Socket) {

  logger.info('connection on player namespace');

  socket.on('addPlayer', (playerName: string, response: (isAvailable: boolean) => void) => {
    logger.info('request for new player', { askedName: playerName, socketId: socket.id});
    const isAvailable = players.addPlayer(playerName, socket.id);
    logger.info(`Name '${playerName}' is ${isAvailable ? '' : 'NOT'} available`, {socketId: socket.id});
    response(isAvailable);
  });

  socket.on('disconnect', () => {
    const player = players.getPlayer(socket.id);
    logger.info(`${(player && player.name) || '-UNKNOWN-'} left the game`, {socketId: socket.id});
    players.disconnectPlayer(socket.id);
  });

  socket.on('storeAnswer', (choiceId: number) => {
    const player = players.getPlayer(socket.id);
    players.storeAnswer(player.id, choiceId);
  });

  // envoit une valeur initial de résumé du jeu lorsque l'utilisateur se connecte
  socket.on('allPlayers', () => players.playersScoreSnapshot);

  // TODO: Ajouter:
  // - répondre à la question (stocker réponse dans le service associé)

}
