import { Server } from 'socket.io';
import { Api } from '../utils/di';
import { PlayerAPI } from './player.api';
import { GameAPI } from './game.api';

@Api()
export class Apis {

  constructor (
    private playerAPI: PlayerAPI,
    private gameAPI: GameAPI,
  ) {}

  initAllSocketsAPI (io: Server): void {
    this.playerAPI.initNamespace(io, 'player');
    this.gameAPI.initNamespace(io, 'game');
  }
}
