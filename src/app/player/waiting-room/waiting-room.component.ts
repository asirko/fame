import { AdminService } from '../../admin/admin.service';
import { Component, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { filter, first, tap } from 'rxjs/operators';
import { map } from 'rxjs/internal/operators';
import { GameState } from '../../../../shared/models';

@Component({
  selector: 'fame-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.scss']
})
export class WaitingRoomComponent implements OnInit {

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    const queryParams: Params = {reloadTimer: true};

    this.adminService.game$.pipe(
      map(g => g.state),
      tap(state => {
        if (state === GameState.NOT_STARTED) {
          // user join the game from the beginning
          queryParams.reloadTimer = false;
        }
      }),
      tap(console.log),
      filter(state => state !== GameState.NOT_STARTED),
      first(),
      map(state => getRouteFromState(state)),
      tap(route => this.router.navigate([route], { queryParams }))
    ).subscribe();
  }
}

function getRouteFromState(state: GameState): string {
  if (state === GameState.ON_GOING) {
    return 'quiz';
  } else if (state === GameState.FINISHED) {
    return 'player-home';
  }
}
