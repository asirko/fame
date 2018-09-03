import { Observable } from 'rxjs';
import Socket = SocketIOClient.Socket;

export function emit$<T>(socket: Socket, event: string, requestVal?: any): Observable<T> {
  return new Observable(observer => {
    socket.emit(event, requestVal, responseVal => {
      observer.next(responseVal);
      observer.complete();
    });
  });
}
