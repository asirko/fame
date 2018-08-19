import { Server, Socket } from 'socket.io';
import { logger } from '../logger';
import { Api } from '../utils/di';
import { PlayersController } from '../controllers/player.controller';
import { GenericAPI } from './abstract-api';
import { GenericEvent, PlayerEvent } from '../../shared/api.const';

@Api()
export class PlayerAPI extends GenericAPI {

  constructor(
    private playersController: PlayersController,
  ) {
    super();
  }

  // Override
  initNamespace(io: Server, name: string) {
    super.initNamespace(io, name);
    this.playersController.playersScore$
      .subscribe(gameSummary => this.nsp.emit(PlayerEvent.ALL_PLAYERS, gameSummary));
  }

  manageSingleSocket(): (socket: Socket) => void {
    return (socket: Socket) => {
      logger.info('connection on player namespace');

      socket.emit(PlayerEvent.ALL_PLAYERS, this.playersController.playersScoreSnapshot);
      const myselfSub = this.playersController.getPlayerScore$(socket.id)
        .subscribe(myself => socket.emit(PlayerEvent.MYSELF, myself));

      socket.on(PlayerEvent.ADD_PLAYER, (playerName: string, response: (isAvailable: boolean) => void) => {
        logger.info('request for new player', { askedName: playerName, socketId: socket.id});
        const isAvailable = this.playersController.addPlayer(playerName, socket.id);
        logger.info(`Name '${playerName}' is ${isAvailable ? '' : 'NOT'} available`, {socketId: socket.id});
        response(isAvailable);
      });

      socket.on(PlayerEvent.STORE_ANSWER, (choiceId: number) => {
        const player = this.playersController.getPlayer(socket.id);
        this.playersController.storeAnswer(player.id, choiceId);
      });

      socket.on(GenericEvent.DISCONNECT, () => {
        const player = this.playersController.getPlayer(socket.id);
        logger.info(`${(player && player.name) || '-UNKNOWN-'} left the game`, {socketId: socket.id});
        this.playersController.disconnectPlayer(socket.id);
        myselfSub.unsubscribe();
      });
    };
  }

}
