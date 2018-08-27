import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../admin/admin.service';
import { PlayerService } from '../player.service';
import { Choice, GameState, Question } from '../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, first, map, mergeMap, startWith, takeUntil, tap } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';

@Component({
  selector: 'fame-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  readonly game$ = this.adminService.game$;
  readonly currentQuestion$ = this.adminService.currentQuestion$;
  private readonly _answersRatio$ = this.playerService.allPlayers$.pipe(
    map(list => ({
      totalConnected: list.filter(p => p.isConnected).length,
      nbAnswers: list.filter(p => p.isConnected && p.currentAnswer).length
    })),
  );
  readonly answerRatioFormated$ = this._answersRatio$.pipe(
    map(ratio => `${ratio.nbAnswers}/${ratio.totalConnected}`),
  );
  readonly answerRatioNumber$ = this._answersRatio$.pipe(
    map(ratio => ratio.nbAnswers / ratio.totalConnected),
  );

  offset = 0;
  timer$ = this.currentQuestion$.pipe(
    filter(q => q && !q.hasAnswer),
    mergeMap(() => interval(1000).pipe(
      map(v => (v + 1) * 1000),
      startWith(0),
      takeUntil(this.currentQuestion$.pipe(filter(q => q.hasAnswer))),
    )),
    map(msTime => Math.round((msTime + this.offset) / 1000)),
    map(sTime => {
      const min = Math.floor(sTime / 60);
      const sec = `${sTime % 60}`.padStart(2, '0');
      return `${min}:${sec}`;
    }),
    takeUntil(this.destroy$),
  );

  choiceSelected: number = null;

  constructor(
    private adminService: AdminService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    console.log(this.route.snapshot.queryParams.reloadTimer, typeof this.route.snapshot.queryParams.reloadTimer);
    // load the offset if necessary (only if timer must be displayed)
    this.currentQuestion$.pipe(
      first(),
      filter(q => !q.hasAnswer && this.route.snapshot.queryParams.reloadTimer),
      mergeMap(() => this.adminService.timerOffset$()),
      tap(offset => this.offset = offset || 0),
    ).subscribe();

    // reset the timer offset after the first answer
    // (once the user is in the quiz he.she does not need to have an offset)
    this.currentQuestion$.pipe(
      filter(q => q.hasAnswer),
      first(),
      tap(() => this.offset = 0),
    ).subscribe();

    // reset choice at each new question
    this.currentQuestion$.pipe(
      filter(q => q && !q.hasAnswer),
      tap(() => this.choiceSelected = null),
      takeUntil(this.destroy$),
    ).subscribe();

    this.adminService.game$.pipe(
      tap(console.log),
      filter(g => g.state !== GameState.ON_GOING),
      tap(g => {
        if (g.state === GameState.NOT_STARTED) {
          this.router.navigate(['..', 'waitingroom'], { relativeTo: this.route });
        } else if (g.state === GameState.FINISHED) {
          this.router.navigate(['..', 'player-home'], { relativeTo: this.route });
        }
      }),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectAnswer(question: Question, choice: Choice): void {
    if (!question.hasAnswer) {
      this.choiceSelected = choice.id;
      this.playerService.storeAnswer(this.choiceSelected);
    }
  }

}
