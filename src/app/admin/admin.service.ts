import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import * as SocketIOClient from 'socket.io-client';
import {Question} from '../question';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _socket = SocketIOClient('/game');
  private _currentQuestion$ = new BehaviorSubject<Question>(null);

  readonly currentQuestion$ = this._currentQuestion$.asObservable();

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
      console.log(question);
      if (question !== this._currentQuestion$.getValue()) {
        this._currentQuestion$.next(question);
      }
    });
  }

  nextQuestion(): Observable<void> {
    return new Observable(observer => {
      if (this._currentQuestion$.getValue() !== undefined) {
        this._socket.emit('nextQuestion', null, () => observer.next());
      } else {
        observer.next();
      }
    });
  }
}
