import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'fame-before-start',
  templateUrl: './before-start.component.html',
  styleUrls: ['./before-start.component.scss']
})
export class BeforeStartComponent implements OnInit {

  constructor(
    private adminService: AdminService,
  ) { }

  ngOnInit() {
  }

  next() {
    this.adminService.nextQuestion$().subscribe();
  }

}
