import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminGuard } from './admin.guard';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fame-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  constructor(
    private adminGuard: AdminGuard,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.adminGuard.manageAdminRouting$(this.route).pipe(
      takeUntil(this.destroy$),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
