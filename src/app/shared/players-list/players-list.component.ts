import { Component } from '@angular/core';
import { PlayerService } from '../../player/player.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'fame-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss']
})
export class PlayersListComponent {

  players$ = this.playerService.allPlayers$;

  constructor(
    private playerService: PlayerService,
  ) { }

}
