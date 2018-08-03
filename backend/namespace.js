module.exports = function (io) {

  console.log('create namespace player');
  io.of('/player').on('connection', require('./namespaces/player'));

  console.log('create namespace game');
  io.of('/game').on('connection', require('./namespaces/game'));

};
