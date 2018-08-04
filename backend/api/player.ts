import { Socket } from 'socket.io';
import { addPlayer, disconnectPlayer, getPlayer } from '../service/player';

export function managePlayer (socket: Socket) {

  console.log('connection on player namespace');

  socket.on('addPlayer', (playerName: string, response: (isAvailable: boolean) => void) => {
    console.log('request for new player : ', playerName);
    const isAvailable = addPlayer(playerName, socket.id);
    console.log(`Name '${playerName}' is ${isAvailable ? '' : 'NOT'} available`);
    response(isAvailable);
    if (isAvailable) {
      updateAllPlayers(socket);
    }
  });

  socket.on('disconnect', () => {
    const player = getPlayer(socket.id);
    console.log(`${(player && player.name) || '-UNKNOWN-'} left the game`);
    disconnectPlayer(socket.id);
    updateAllPlayers(socket);
  });

  // TODO: Ajouter:
  // - répondre à la question (stocker réponse dans le service associé)

}

function updateAllPlayers(socket: Socket): void {
  socket.nsp.emit('allPlayers', [/* liste des noms des joueurs */]);
}
