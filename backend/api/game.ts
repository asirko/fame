import { Socket } from 'socket.io';
import { getCurrentQuestion, getQuestionWithAnswer, nextQuestion } from '../controlers/game';

export function manageGame (socket: Socket) {

  // when anyone connect to the game the current question is send
  // for him/her to catch up
  socket.emit('currentQuestion', getCurrentQuestion());

  socket.on('nextQuestion', () => {
    socket.nsp.emit('currentQuestion', nextQuestion());
  });

  socket.on('showAnswer', () => {
    socket.nsp.emit('currentQuestion', getQuestionWithAnswer());
  });

  socket.on('disconnect', () => {/* nothing to do on disconnection */});

}
