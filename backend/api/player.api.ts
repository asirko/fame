import { Server, Socket } from 'socket.io';
import { logger } from '../logger';
import { PlayerSummary } from '../models';
import { Api } from '../utils/di';
import { PlayersController } from '../controllers/player.controller';
import { GenericAPI } from './abstract-api';

@Api()
export class PlayerAPI extends GenericAPI {

  constructor(
    private playersController: PlayersController,
  ) {
    super();
  }

  initNamespace(io: Server, name: string) {
    super.initNamespace(io, name);
    this.playersController.playersScore$
      .subscribe(gameSummary => this.nsp.emit('allPlayers', gameSummary));
  }

  manageSingleSocket(): (socket: Socket) => void {
    return (socket: Socket) => {
      logger.info('connection on player namespace');

      const myselfSub = this.playersController.getPlayerScore$(socket.id)
        .subscribe(myself => socket.emit('myself', myself));

      socket.on('addPlayer', (playerName: string, response: (isAvailable: boolean) => void) => {
        logger.info('request for new player', { askedName: playerName, socketId: socket.id});
        const isAvailable = this.playersController.addPlayer(playerName, socket.id);
        logger.info(`Name '${playerName}' is ${isAvailable ? '' : 'NOT'} available`, {socketId: socket.id});
        response(isAvailable);
      });

      socket.on('storeAnswer', (choiceId: number) => {
        const player = this.playersController.getPlayer(socket.id);
        this.playersController.storeAnswer(player.id, choiceId);
      });

      // envoit une valeur initial de résumé du jeu lorsque l'utilisateur se connecte
      socket.on('initAllPlayers', (unused, response: (isAvailable: PlayerSummary[]) => void) => {
        response(this.playersController.playersScoreSnapshot);
      });

      socket.on('disconnect', () => {
        const player = this.playersController.getPlayer(socket.id);
        logger.info(`${(player && player.name) || '-UNKNOWN-'} left the game`, {socketId: socket.id});
        this.playersController.disconnectPlayer(socket.id);
        myselfSub.unsubscribe();
      });
    };
  }

}
