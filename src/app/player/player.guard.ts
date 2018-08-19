import { PlayerService } from './player.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerGuard implements CanActivate {

  constructor(
    private route: Router,
    private playerService: PlayerService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.playerService.myself$.pipe(
      map(p => !!p),
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          this.route.navigate([ 'login' ]);
        }
      })
    );
  }

  /**
   * if the user get log out, redirect him to the login screen
   */
  checkCredentials$(): Observable<any> {
    return this.playerService.myself$.pipe(
      filter(p => !p), // should log
      tap(() => this.route.navigate([ 'login' ])),
    );
  }
}
