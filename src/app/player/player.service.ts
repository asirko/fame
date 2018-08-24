import { Injectable } from '@angular/core';
import * as SocketIOClient from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Player } from '../../../shared/models';
import { PlayerEvent, playerNamespaceName } from '../../../shared/api.const';
import { tap } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private _socket = SocketIOClient('/' + playerNamespaceName);
  private _allPlayers$ = new BehaviorSubject<Player[]>(null);
  readonly allPlayers$: Observable<Player[]> = this._allPlayers$.asObservable().pipe(filter(v => v !== null), tap(console.log));
  private _myself$ = new BehaviorSubject<Player>(null);
  readonly myself$: Observable<Player> = this._myself$.asObservable();

  constructor() {
    this._socket.emit(PlayerEvent.INIT_ALL_PLAYERS, null, playersSummary => this._allPlayers$.next(playersSummary));
    this._socket.on(PlayerEvent.ALL_PLAYERS, playersSummary => this._allPlayers$.next(playersSummary));
    this._socket.on(PlayerEvent.MYSELF, player => this._myself$.next(player));
  }

  addPlayer(playerName: string): Observable<boolean> {
    return new Observable(observer => {
      this._socket.emit(PlayerEvent.ADD_PLAYER, playerName, isOk => {
        observer.next(isOk);
        observer.complete();
      });
    });
  }

  storeAnswer(choiceId: number): void {
    this._socket.emit(PlayerEvent.STORE_ANSWER, choiceId);
  }

}
