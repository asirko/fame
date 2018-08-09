import { Socket } from 'socket.io';
import { logger } from '../logger';
import { game } from '../controllers/game.controller';

export function manageGame (socket: Socket) {

  // when anyone connect to the game the current question is send
  // for him/her to catch up
  logger.info('Connection on game namespace', {socketId: socket.id});
  socket.emit('currentQuestion', game.getCurrentQuestion());

  socket.on('nextQuestion', () => {
    logger.info('Request for the next question', {socketId: socket.id});
    socket.nsp.emit('currentQuestion', game.nextQuestion());
  });

  socket.on('showAnswer', () => {
    logger.info('Request for answer of the current question', {socketId: socket.id});
    socket.nsp.emit('currentQuestion', game.getQuestionWithAnswer());
  });

  socket.on('disconnect', () => {
    logger.info('Leaving game namespace', {socketId: socket.id});
  });
}
