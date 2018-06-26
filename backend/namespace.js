module.exports = function (io) {

  console.log('create namespace player');
  io.of('/player').on('connection', require('./namespaces/player'));

};
