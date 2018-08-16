import { Player } from './player';
import { Injectable } from '@angular/core';
import * as SocketIOClient from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private _socket = SocketIOClient('/player');
  private _player$ = new BehaviorSubject<Player>(null);
  readonly player$ = this._player$.asObservable();
  private _allPlayers$ = new BehaviorSubject<Player[]>(null);
  readonly allPlayers$: Observable<Player[]> = this._allPlayers$.asObservable().pipe(filter(v => v !== null));

  constructor() {
    this._socket.emit('initAllPlayers', null, playersSummary => this._allPlayers$.next(playersSummary));
    this._socket.on('allPlayers', playersSummary => this._allPlayers$.next(playersSummary));
  }

  addPlayer(playerName: string): Observable<boolean> {
    return new Observable(observer => {
      this._socket.emit('addPlayer', playerName, isOk => {
        console.log(isOk);
        if (isOk) {
          this._player$.next({name: playerName, score: 0, isConnected: true});
        }
        observer.next(isOk);
        observer.complete();
      });
    });
  }

  getPlayers$(): Observable<any[]> {
    return new Observable(observer => {
      this._socket.on('allPlayers', players => {
        players.forEach(p => p.date = p.date && new Date(p.date));
        observer.next(players);
      });
    });
  }

  storeAnswer(choiceId: number): void {
    this._socket.emit('storeAnswer', choiceId);
  }

}
