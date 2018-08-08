import { Player } from './player';
import { Injectable } from '@angular/core';
import * as SocketIOClient from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private socket = SocketIOClient('/player');
  private player$ = new BehaviorSubject<Player>(null);
  private _allPlayers$ = new BehaviorSubject<Player[]>(null);
  readonly allPlayers$: Observable<Player[]>;

  constructor() {
    this.socket.on('allPlayers', playersSummary => {
      this._allPlayers$.next(playersSummary);
    });
    this.allPlayers$ = this._allPlayers$.asObservable().pipe(
      filter(v => v !== null),
    );
  }

  addPlayer(playerName: string): Observable<boolean> {
    return new Observable(observer => {
      this.socket.emit('addPlayer', playerName, isOk => {
        if (isOk) {
          this.player$.next({name: playerName, score: 0, isConnected: true});
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

  storeAnswer(choiceId: number): void {
    this.socket.emit('storeAnswer', choiceId);
  }

}
