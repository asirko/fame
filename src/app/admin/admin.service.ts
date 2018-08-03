import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import * as SocketIOClient from 'socket.io-client';
import {GameState, Question} from '../question';
import {skip} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _socket = SocketIOClient('/game');
  private _currentQuestion$ = new BehaviorSubject<Question>(null);

  // the first is skipped because behaviorSubject have an initial value;
  readonly currentQuestion$ = this._currentQuestion$.asObservable().pipe(skip(1));

  constructor() {
    this.initCurrentQuestion();
  }

  /**
   * get the current question of the game
   * null -> not started
   * undefined -> end of the quiz
   * @returns {Observable<any[]>}
   */
  initCurrentQuestion(): void {
    this._socket.on('currentQuestion', question => {
      if (question === GameState.NOT_STARTED) {
        this._currentQuestion$.next(null);
      } else if (question === GameState.FINISHED) {
        this._currentQuestion$.next(undefined);
      } else {
        this._currentQuestion$.next(question);
      }
    });
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
