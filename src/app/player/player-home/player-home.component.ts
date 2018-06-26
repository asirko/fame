import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../login.service';
import { Player } from '../player';

@Component({
  selector: 'fame-player-home',
  templateUrl: './player-home.component.html',
  styleUrls: ['./player-home.component.scss']
})
export class PlayerHomeComponent implements OnInit {

  players: Player[];

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.getPlayers$().subscribe(players => this.players = players);
  }

}
