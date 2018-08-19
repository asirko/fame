import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerService } from './player.service';
import { PlayerGuard } from './player.guard';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fame-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {

  player$ = this.playerService.myself$;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private playerService: PlayerService,
    private playerGuard: PlayerGuard,
  ) { }

  ngOnInit() {
    this.playerGuard.checkCredentials$().pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
