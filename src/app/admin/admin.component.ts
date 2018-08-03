import { Component, OnInit } from '@angular/core';
import {AdminService} from './admin.service';
import {map, tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'fame-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  // TODO temporaire pour les tests
  readonly currentQuestion$ = this.adminService.currentQuestion$;

  readonly canGoNext$ = this.adminService.currentQuestion$.pipe(
    map(q => q === null || (q && q.hasAnswer)),
  );
  readonly canShowAnswer$ = this.adminService.currentQuestion$.pipe(
    map(q => q && !q.hasAnswer),
  );
  readonly thisIsTheEnd$ = combineLatest(this.canGoNext$, this.canShowAnswer$, (n, a) => !n && !a);

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
