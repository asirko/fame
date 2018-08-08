import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { PlayerService } from '../../player/player.service';

@Component({
  selector: 'fame-before-start',
  templateUrl: './before-start.component.html',
  styleUrls: ['./before-start.component.scss']
})
export class BeforeStartComponent implements OnInit {

  players$ = this.playerService.allPlayers$;

  constructor(
    private adminService: AdminService,
    private playerService: PlayerService,
  ) { }

  ngOnInit() {
  }

  next() {
    this.adminService.nextQuestion$().subscribe();
  }

}
