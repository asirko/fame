import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { Player } from '../player';

@Component({
  selector: 'fame-player-home',
  templateUrl: './player-home.component.html',
  styleUrls: ['./player-home.component.scss']
})
export class PlayerHomeComponent implements OnInit {

  players: Player[];
  player: Player;

  constructor(private loginService: PlayerService) { }

  ngOnInit() {
    // TODO ne pas oublier les unsubscribe
    this.loginService.getPlayers$().subscribe(players => this.players = players);
    this.loginService.player$.subscribe(player => this.player = player);
  }

}
