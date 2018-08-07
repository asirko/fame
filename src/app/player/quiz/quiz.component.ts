import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin/admin.service';
import { PlayerService } from './../player.service';

@Component({
  selector: 'fame-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  currentQuestion = null;

  constructor(private adminService: AdminService, private playerService: PlayerService) { }

  ngOnInit() {
    this.adminService.currentQuestion$.subscribe(q => this.currentQuestion = q);
  }

  selectAnswer(choice): void {
    if (!this.currentQuestion.hasAnswer) {
      this.currentQuestion.choices.map(c => c.isSelected = false);
      choice.isSelected = !choice.isSelected;
      const choiceId = choice.isSelected ? choice.id : null;
      this.playerService.storeAnswer(choiceId);
    }
  }

}
