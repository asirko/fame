import { Player } from './player';
import {Injectable} from '@angular/core';
import * as SocketIOClient from 'socket.io-client';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private socket: SocketIOClient.Socket;
  private player$ = new BehaviorSubject<Player>(null);

  constructor() {
    this.socket = SocketIOClient('/player');
  }

  addPlayer(playerName: string): Observable<boolean> {
    return new Observable(observer => {
      this.socket.emit('addPlayer', playerName, isOk => {
        if (isOk) {
          this.player$.next({name: playerName, score: 0});
        }
        observer.next(isOk);
        observer.complete();
      });
    });
  }

  getPlayers$(): Observable<any[]> {
    return new Observable(observer => {
      this.socket.on('allPlayers', players => {
        players.forEach(p => p.date = p.date && new Date(p.date));
        observer.next(players);
      });
    });
  }

  getPlayer$(): Observable<Player> {
    return this.player$.asObservable();
  }

}
