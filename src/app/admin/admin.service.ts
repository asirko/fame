import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import * as SocketIOClient from 'socket.io-client';
import {GameState, Question} from '../question';
import {map, skip} from 'rxjs/operators';

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

    this.hasNotStarted$ = this._currentQuestion$.asObservable().pipe(
      skip(1),
      map(q => q === GameState.NOT_STARTED),
    );
    this.currentQuestion$ = this._currentQuestion$.asObservable().pipe(
      skip(1),
      map(q => q === GameState.NOT_STARTED || q === GameState.FINISHED ? null : q),
    );
    this.hasFinished$ = this._currentQuestion$.asObservable().pipe(
      skip(1),
      map(q => q === GameState.FINISHED),
    );
  }

  nextQuestion(): Observable<void> {
    return new Observable(observer => {
      this._socket.emit('nextQuestion', null, () => observer.next());
    });
  }

  showAnswer(): Observable<void> {
    return new Observable(observer => {
      if (this._currentQuestion$.getValue() !== undefined) {
        this._socket.emit('showAnswer', null, () => observer.next());
      } else {
        observer.next();
      }
    });
  }
}
