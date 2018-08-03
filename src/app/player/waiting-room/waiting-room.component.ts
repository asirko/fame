import { AdminService } from './../../admin/admin.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fame-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.scss']
})
export class WaitingRoomComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.currentQuestion$.subscribe((res) => console.log(res));
  }

}
