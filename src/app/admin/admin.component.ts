import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'fame-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  private isNotStarted$ = this.adminService.hasNotStarted$;
  private hasFinished$ = this.adminService.hasFinished$;
  private destroy$ = new Subject<void>();

  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    combineLatest(this.isNotStarted$, this.hasFinished$).pipe(
      takeUntil(this.destroy$),
      map(([before, after]) => (-before) + (+after)), // -1 before, 0 into, 1 after
      distinctUntilChanged(),
      tap(whereToGo => {
        switch (whereToGo) {
          case -1:
            this.router.navigate(['before-start'], { relativeTo: this.route});
            break;
          case 0:
            this.router.navigate(['control-game'], { relativeTo: this.route});
            break;
          case 1:
            this.router.navigate(['results'], { relativeTo: this.route});
            break;
        }
      }),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
