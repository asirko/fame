import { Socket } from 'socket.io';
import { getCurrentQuestion, getQuestionWithAnswer, nextQuestion } from '../controlers/game';
import { logger } from '../logger';

export function manageGame (socket: Socket) {

  // when anyone connect to the game the current question is send
  // for him/her to catch up
  logger.info('Connection on game namespace', {socketId: socket.id});
  socket.emit('currentQuestion', getCurrentQuestion());

  socket.on('nextQuestion', () => {
    logger.info('Request for the next question', {socketId: socket.id});
    socket.nsp.emit('currentQuestion', nextQuestion());
  });

  socket.on('showAnswer', () => {
    logger.info('Request for answer of the current question', {socketId: socket.id});
    socket.nsp.emit('currentQuestion', getQuestionWithAnswer());
  });

  socket.on('disconnect', () => {
    logger.info('Leaving game namespace', {socketId: socket.id});
  });
}
