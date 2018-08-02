const dataGame = require('../data/game');

module.exports = function (socket) {

  console.log('connection on game namespace');
  socket.emit('currentQuestion', dataGame.getCurrentQuestion());

  socket.on('nextQuestion', () => {
    console.log('request to go to next question');
    socket.nsp.emit('currentQuestion', dataGame.nextQuestion());
  });

  socket.on('disconnect', () => {
    // nothing to do on disconnection
  });

};
