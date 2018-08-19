import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';

@Component({
  selector: 'fame-player-home',
  templateUrl: './player-home.component.html',
  styleUrls: ['./player-home.component.scss']
})
export class PlayerHomeComponent implements OnInit {

  players$ = this.loginService.allPlayers$;
  player$ = this.loginService.myself$;

  constructor(
    private loginService: PlayerService,
  ) { }

  ngOnInit() {}

}
