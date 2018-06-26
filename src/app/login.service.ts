import {Injectable} from '@angular/core';
import * as SocketIOClient from 'socket.io-client';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private socket: SocketIOClient.Socket;
  private playerName$ = new BehaviorSubject<string>(null);

  constructor() {
    this.socket = SocketIOClient('/player');
  }

  addPlayer(playerName: any): Observable<boolean> {
    return new Observable(observer => {
      this.socket.emit('addPlayer', playerName, isOk => {
        if (isOk) {
          this.playerName$.next(playerName);
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

  getPlayerName$(): Observable<string> {
    return this.playerName$.asObservable();
  }

}
