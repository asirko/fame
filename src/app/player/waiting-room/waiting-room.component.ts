import { AdminService } from '../../admin/admin.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, first, tap } from 'rxjs/operators';

@Component({
  selector: 'fame-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.scss']
})
export class WaitingRoomComponent implements OnInit {

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.currentQuestion$
      .pipe(
        filter(q => q !== null),
        first(),
        tap(() => this.router.navigate(['quiz']))
      )
      .subscribe();
  }

}
