import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'fame-control-game',
  templateUrl: './control-game.component.html',
  styleUrls: ['./control-game.component.scss']
})
export class ControlGameComponent implements OnInit {

  readonly currentQuestion$ = this.adminService.currentQuestion$;

  constructor(
    private adminService: AdminService,
  ) { }

  ngOnInit() {}

  next() {
    this.adminService.nextQuestion().subscribe();
  }

  showAnswer(): void {
    this.adminService.showAnswer().subscribe();
  }

}
