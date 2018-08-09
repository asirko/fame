import { Namespace, Socket } from 'socket.io';
import { playersController } from '../controllers/player.controller';
import { logger } from '../logger';
import { PlayerSummary } from '../models';

export function initPlayerNamespace(nsp: Namespace) {
  playersController.playersScore$
    .subscribe(gameSummary => nsp.emit('allPlayers', gameSummary));
  nsp.on('connection', managePlayer);
}

function managePlayer (socket: Socket) {

  logger.info('connection on player namespace');

  const myselfSub = playersController.getPlayerScore$(socket.id)
    .subscribe(myself => socket.emit('myself', myself));

  socket.on('addPlayer', (playerName: string, response: (isAvailable: boolean) => void) => {
    logger.info('request for new player', { askedName: playerName, socketId: socket.id});
    const isAvailable = playersController.addPlayer(playerName, socket.id);
    logger.info(`Name '${playerName}' is ${isAvailable ? '' : 'NOT'} available`, {socketId: socket.id});
    response(isAvailable);
  });

  socket.on('storeAnswer', (choiceId: number) => {
    const player = playersController.getPlayer(socket.id);
    playersController.storeAnswer(player.id, choiceId);
  });

  // envoit une valeur initial de résumé du jeu lorsque l'utilisateur se connecte
  socket.on('initAllPlayers', (unused, response: (isAvailable: PlayerSummary[]) => void) => {
    response(playersController.playersScoreSnapshot);
  });

  socket.on('disconnect', () => {
    const player = playersController.getPlayer(socket.id);
    logger.info(`${(player && player.name) || '-UNKNOWN-'} left the game`, {socketId: socket.id});
    playersController.disconnectPlayer(socket.id);
    myselfSub.unsubscribe();
  });
}
