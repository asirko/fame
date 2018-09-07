import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { Player } from '../../../../shared/models';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

class DisplayedData {
  podium: Player[];
  isOnPodium: boolean;
  currentPlayer: Player;
}

@Component({
  selector: 'fame-player-home',
  templateUrl: './player-home.component.html',
  styleUrls: ['./player-home.component.scss']
})
export class PlayerHomeComponent implements OnInit {

  displayedData$: Observable<DisplayedData> = combineLatest(this.loginService.allPlayers$, this.loginService.myself$).pipe(
    map(([players, player]) => {
      const podium = players.filter(p => p.rank <= 3);
      console.log(podium);
      return {
        podium,
        isOnPodium: podium.some(p => p.name === player.name),
        currentPlayer: player,
      };
    }),
  );

  constructor(
    private loginService: PlayerService,
  ) { }

  ngOnInit() {}

}
