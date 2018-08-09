import { PlayerService } from './player.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerGuard implements CanActivate {

  constructor(private route: Router, private loginService: PlayerService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.loginService.player$.pipe(
        map(p => !!p),
        tap((p) => {
          if (!p) {
            this.route.navigate(['login']);
            return false;
          }
        })
      );
  }
}
