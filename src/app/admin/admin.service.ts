import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as SocketIOClient from 'socket.io-client';
import { filter } from 'rxjs/operators';
import { Game, Question } from '../../../shared/models';
import { GameEvent, gameNamespaceName } from '../../../shared/api.const';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _socket = SocketIOClient('/' + gameNamespaceName);
  private _currentQuestion$ = new BehaviorSubject<Question>(undefined);
  readonly currentQuestion$ = this._currentQuestion$.asObservable()
    .pipe(filter(q => q !== undefined));

  private _game$ = new BehaviorSubject<Game>(undefined);
  readonly game$ = this._game$.asObservable()
    .pipe(filter(g => g !== undefined));

  constructor() {
    this._socket.on(GameEvent.CURRENT_QUESTION, question => this._currentQuestion$.next(question));
    this._socket.on(GameEvent.GAME, game => this._game$.next(game));
  }

  nextQuestion$(): Observable<void> {
    return new Observable(observer => {
      this._socket.emit(GameEvent.NEXT_QUESTION, null, () => {
        observer.next();
        observer.complete();
      });
    });
  }

  showAnswer$(): Observable<void> {
    return new Observable(observer => {
      this._socket.emit(GameEvent.SHOW_ANSWER, null, () => {
        observer.next();
        observer.complete();
      });
    });
  }

  timerOffset$(): Observable<number> {
    return Observable.create(observer => {
      const requestTime = new Date().getTime();
      this._socket.emit(GameEvent.TIMER_OFFSET, null, (startedSince: number) => {
        const responseTime = new Date().getTime();
        const averageTimeToAnswer = (responseTime - requestTime) / 2;
        observer.next(startedSince + averageTimeToAnswer);
        observer.complete();
      });
    });
  }

}
