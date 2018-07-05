import { LoginService } from './../login.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerGuard implements CanActivate {

  constructor(private route: Router, private loginService: LoginService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.loginService.getPlayer$().pipe(
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
