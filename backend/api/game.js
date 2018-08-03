const dataGame = require('../service/game');

module.exports = function (socket) {

  // when anyone connect to the game the current question is send
  // for him/her to catch up
  socket.emit('currentQuestion', dataGame.getCurrentQuestion());

  socket.on('nextQuestion', () => {
    socket.nsp.emit('currentQuestion', dataGame.nextQuestion());
  });

  socket.on('showAnswer', () => {
    socket.nsp.emit('currentQuestion', dataGame.getQuestionWithAnswer());
  });

  socket.on('disconnect', () => {/* nothing to do on disconnection */});

};
