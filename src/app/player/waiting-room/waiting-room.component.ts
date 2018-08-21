import { AdminService } from '../../admin/admin.service';
import { Component, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { filter, first, tap } from 'rxjs/operators';

@Component({
  selector: 'fame-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.scss']
})
export class WaitingRoomComponent implements OnInit {

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    let hadANull = false;
    const queryParams: Params = {};

    this.adminService.currentQuestion$.pipe(
      tap(q => {
        hadANull = hadANull || q === null;
        if (!hadANull && q !== null) {
          // there were already a question before joining the game
          queryParams.reloadTimer = true;
        }
      }),
      filter(q => q !== null),
      first(),
      tap(() => this.router.navigate(['quiz'], { queryParams }))
    ).subscribe();
  }

}
