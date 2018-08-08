import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as SocketIOClient from 'socket.io-client';
import { GameState, Question } from '../question';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _socket = SocketIOClient('/game');
  private _currentQuestion$ = new BehaviorSubject<Question | GameState>(null);

  // the first is skipped because behaviorSubject have an initial value;
  readonly hasNotStarted$: Observable<boolean>;
  readonly currentQuestion$: Observable<Question>;
  readonly hasFinished$: Observable<boolean>;

  constructor() {
    /**
     * get the current question of the game
     * before to start and after it ends its hold a GameState
     * and a question otherwise
     * those values are cleaned up for the public API
     */
    this._socket.on('currentQuestion', question => {
      this._currentQuestion$.next(question);
    });

    const onlyValues = this._currentQuestion$.asObservable().pipe(
      filter(v => v !== null),
    );
    this.hasNotStarted$ = onlyValues.pipe(
      map(q => q === GameState.NOT_STARTED),
    );
    this.currentQuestion$ = onlyValues.pipe(
      map(q => q === GameState.NOT_STARTED || q === GameState.FINISHED ? null : q),
    );
    this.hasFinished$ = onlyValues.pipe(
      map(q => q === GameState.FINISHED),
    );
  }

  nextQuestion$(): Observable<void> {
    return new Observable(observer => {
      this._socket.emit('nextQuestion', null, () => {
        observer.next();
        observer.complete();
      });
    });
  }

  showAnswer$(): Observable<void> {
    return new Observable(observer => {
      if (this._currentQuestion$.getValue() !== undefined) {
        this._socket.emit('showAnswer', null, () => {
          observer.next();
          observer.complete();
        });
      } else {
        observer.next();
        observer.complete();
      }
    });
  }

}
