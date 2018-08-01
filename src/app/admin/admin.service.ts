import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import * as SocketIOClient from 'socket.io-client';
import {Question} from '../question';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _socket = SocketIOClient('/game');
  private _currentQuestion$ = new BehaviorSubject<Question>(null);

  readonly currentQuestion$ = this._currentQuestion$.asObservable();

  constructor() {}

  /**
   * get the current question of the game
   * null -> not started
   * undefined -> end of the quiz
   * @returns {Observable<any[]>}
   */
  getCurrentQuestion$(): Observable<any[]> {
    return new Observable(observer => {
      this._socket.on('currentQuestion', question => {
        observer.next(question);
      });
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
