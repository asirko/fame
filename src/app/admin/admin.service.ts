import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as SocketIOClient from 'socket.io-client';
import { filter, map } from 'rxjs/operators';
import { Game, Question } from '../../../shared/models';
import { GameEvent, gameNamespaceName } from '../../../shared/api.const';
import { emit$ } from '../shared/utils/socket-utils';

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
    return emit$<void>(this._socket, GameEvent.NEXT_QUESTION);
  }

  showAnswer$(): Observable<void> {
    return emit$<void>(this._socket, GameEvent.SHOW_ANSWER);
  }

  timerOffset$(): Observable<number> {
    const requestTime = new Date().getTime();
    return emit$<number>(this._socket, GameEvent.TIMER_OFFSET).pipe(
      map(startedSince => {
        const responseTime = new Date().getTime();
        const averageTimeToAnswer = (responseTime - requestTime) / 2;
        return startedSince + averageTimeToAnswer;
      }),
    );
  }

  resetQuiz$(): Observable<void> {
    return emit$<void>(this._socket, GameEvent.RESET);
  }

}
