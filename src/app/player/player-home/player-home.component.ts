import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../login.service';

@Component({
  selector: 'fame-player-home',
  templateUrl: './player-home.component.html',
  styleUrls: ['./player-home.component.scss']
})
export class PlayerHomeComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.addPlayer('test').subscribe(console.log);
    this.loginService.getPlayers$().subscribe(players => console.log('players', players));
  }

}
