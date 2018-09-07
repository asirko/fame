import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../player/player.service';

@Component({
  selector: 'fame-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  readonly allPlayers$ = this.playerService.allPlayers$;

  constructor(
    private playerService: PlayerService,
  ) { }

  ngOnInit() {
  }

}
