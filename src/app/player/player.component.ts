import { Component, OnInit } from '@angular/core';
import { Player } from './player';

@Component({
  selector: 'fame-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  player: Player;

  constructor() { }

  ngOnInit() {
  }

}
