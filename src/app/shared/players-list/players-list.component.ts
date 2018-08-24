import { Component } from '@angular/core';
import { PlayerService } from '../../player/player.service';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'fame-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss']
})
export class PlayersListComponent {

  players$ = this.playerService.allPlayers$.pipe(
    map(list => list.sort((p1, p2) => {
      if (p1.isConnected && !p2.isConnected) {
        return -1;
      } else if (!p1.isConnected && p2.isConnected) {
        return 1;
      } else {
        return 0;
      }
    })),
  );

  constructor(
    private playerService: PlayerService,
  ) { }

}
