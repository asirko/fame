import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { GameState } from '../../../shared/models';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // todo quand on authentifiera l'admin
    return of(true);
  }

  manageAdminRouting$(route: ActivatedRoute): Observable<any> {
    return this.adminService.game$.pipe(
      map(g => g.state),
      distinctUntilChanged(),
      tap(gameState => {
        switch (gameState) {
          case GameState.NOT_STARTED:
            this.router.navigate(['before-start'], {relativeTo: route});
            break;
          case GameState.ON_GOING:
            this.router.navigate(['control-game'], {relativeTo: route});
            break;
          case GameState.FINISHED:
            this.router.navigate(['results'], {relativeTo: route});
            break;
        }
      }),
    );
  }
}
