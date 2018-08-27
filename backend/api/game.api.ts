import { Server, Socket } from 'socket.io';
import { logger } from '../logger';
import { Api } from '../utils/di';
import { GameController } from '../controllers/game.controller';
import { GenericAPI } from './abstract-api';
import { GameEvent, GenericEvent } from '../../shared/api.const';

@Api()
export class GameAPI extends GenericAPI {

  constructor(
    private gameController: GameController,
  ) {
    super();
  }

  // Override
  initNamespace(io: Server, name: string) {
    super.initNamespace(io, name);
    this.gameController.game$
      .subscribe(g => this.nsp.emit(GameEvent.GAME, g));
    this.gameController.currentQuestion$
      .subscribe(cq => this.nsp.emit(GameEvent.CURRENT_QUESTION, cq));
  }

  manageSingleSocket(socket: Socket): void {
    // when anyone connect to the game the current question and the current state of the game is send
    // for him/her to catch up
    logger.info('Connection on game namespace', {socketId: socket.id});
    socket.emit(GameEvent.GAME, this.gameController.gameSnapshot);
    const currentQuestion = this.gameController.currentQuestionSnapshot;
    if (currentQuestion) {
      socket.emit(GameEvent.CURRENT_QUESTION, currentQuestion);
    }

    socket.on(GameEvent.NEXT_QUESTION, () => {
      logger.info('Request for the next question', {socketId: socket.id});
      this.gameController.nextQuestion();
    });

    socket.on(GameEvent.TIMER_OFFSET, (unused, response: (offset: number) => void) => {
      logger.info('Request to have timer offset', {socketId: socket.id});
      response(this.gameController.getTimerOffset());
    });

    socket.on(GameEvent.SHOW_ANSWER, () => {
      logger.info('Request for answer of the current question', {socketId: socket.id});
      this.gameController.showAnswer();
    });

    socket.on(GenericEvent.DISCONNECT, () => {
      logger.info('Leaving game namespace', {socketId: socket.id});
    });

  }
}
