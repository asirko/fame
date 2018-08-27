import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { PlayerService } from '../../player/player.service';

@Component({
  selector: 'fame-control-game',
  templateUrl: './control-game.component.html',
  styleUrls: ['./control-game.component.scss']
})
export class ControlGameComponent implements OnInit {

  readonly game$ = this.adminService.game$;
  readonly currentQuestion$ = this.adminService.currentQuestion$;
  readonly allPlayers$ = this.playerService.allPlayers$;

  constructor(
    private adminService: AdminService,
    private playerService: PlayerService,
  ) { }

  ngOnInit() {}

  next() {
    this.adminService.nextQuestion$().subscribe();
  }

  showAnswer(): void {
    this.adminService.showAnswer$().subscribe();
  }

  reset(): void {
    this.adminService.resetQuiz$().subscribe();
  }

}
