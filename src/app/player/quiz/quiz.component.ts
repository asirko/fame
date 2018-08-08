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
  choiceSelected: number = null;
  isCorrection = false;
  isRight = false;

  constructor(private adminService: AdminService, private playerService: PlayerService) { }

  ngOnInit() {
    this.adminService.currentQuestion$.subscribe(q => {
      this.isCorrection = q.hasAnswer;
      if (!this.currentQuestion || this.currentQuestion.id !== q.id) {
        this.currentQuestion = q;
      }

      if (this.currentQuestion.id === q.id && q.hasAnswer) {
        this.showAnswer(q.choices);
      }
    });
  }

  selectAnswer(choice): void {
    if (!this.isCorrection) {
      this.currentQuestion.choices.map(c => c.isSelected = false);
      choice.isSelected = !choice.isSelected;
      this.choiceSelected = choice.isSelected ? choice.id : null;
      this.playerService.storeAnswer(this.choiceSelected);
    }
  }

  showAnswer(choices): void {
    const choice = choices.filter(c => c.id === this.choiceSelected && c.isTrue);
    this.isRight = choice.length === 1;
  }

  // TODO: EFI - Mettre en valeurs la bonne réponse retournée par le serveur
  // TODO: EFI - Préparer l'affichage du score user

}
