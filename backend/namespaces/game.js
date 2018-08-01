const dataGame = require('../data/game');

module.exports = function (socket) {

  console.log('connection on player namespace');

  socket.on('currentQuestion', (unused, response) => {
    console.log('request to listen current question');
    response(dataGame.getCurrentQuestion());
  });

  socket.on('nextQuestion', () => {
    console.log('request to go to next question');
    socket.nsp.emit('currentQuestion', dataGame.nextQuestion());
  });

  socket.on('disconnect', () => {
    // nothing to do on disconnection
  });

};
