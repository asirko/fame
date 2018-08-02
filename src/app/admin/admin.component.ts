import { Component, OnInit } from '@angular/core';
import {AdminService} from './admin.service';

@Component({
  selector: 'fame-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  readonly currentQuestion$ = this.adminService.currentQuestion$;

  constructor(
    private adminService: AdminService,
  ) { }

  ngOnInit() {}

  next() {
    this.adminService.nextQuestion()
      .subscribe();
  }

}
