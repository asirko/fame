import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../player/player.service';
import { GameState } from '../../../shared/models';

@Component({
  selector: 'fame-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  constructor(
    private adminService: AdminService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.adminService.game$.pipe(
      takeUntil(this.destroy$),
      map(g => g.state),
      distinctUntilChanged(),
      tap(gameState => {
        switch (gameState) {
          case GameState.NOT_STARTED:
            this.router.navigate(['before-start'], { relativeTo: this.route});
            break;
          case GameState.ON_GOING:
            this.router.navigate(['control-game'], { relativeTo: this.route});
            break;
          case GameState.FINISHED:
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
