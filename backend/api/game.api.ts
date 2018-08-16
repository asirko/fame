import { Socket } from 'socket.io';
import { logger } from '../logger';
import { Api } from '../utils/di';
import { GameController } from '../controllers/game.controller';
import { GenericAPI } from './abstract-api';

@Api()
export class GameAPI extends GenericAPI {

  constructor(
    private gameController: GameController,
  ) {
    super();
  }

  manageSingleSocket(): (socket: Socket) => void {
    return socket => {

      // when anyone connect to the game the current question is send
      // for him/her to catch up
      logger.info('Connection on game namespace', {socketId: socket.id});
      socket.emit('currentQuestion', this.gameController.getCurrentQuestion());

      socket.on('nextQuestion', () => {
        logger.info('Request for the next question', {socketId: socket.id});
        socket.nsp.emit('currentQuestion', this.gameController.nextQuestion());
      });

      socket.on('showAnswer', () => {
        logger.info('Request for answer of the current question', {socketId: socket.id});
        socket.nsp.emit('currentQuestion', this.gameController.getQuestionWithAnswer());
      });

      socket.on('disconnect', () => {
        logger.info('Leaving game namespace', {socketId: socket.id});
      });

    };
  }
}
