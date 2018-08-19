import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin/admin.service';
import { PlayerService } from '../player.service';
import { Choice, Question } from '../../../../shared/models';

@Component({
  selector: 'fame-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  readonly currentQuestion$ = this.adminService.currentQuestion$;
  choiceSelected: number = null;

  constructor(
    private adminService: AdminService,
    private playerService: PlayerService,
  ) { }

  ngOnInit() {}

  selectAnswer(question: Question, choice: Choice): void {
    if (!question.hasAnswer) {
      this.choiceSelected = choice.id;
      this.playerService.storeAnswer(this.choiceSelected);
    }
  }

}
