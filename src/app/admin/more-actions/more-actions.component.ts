import { Component, Input } from '@angular/core';
import { AdminService } from '../admin.service';
import { Question } from '../../../../shared/models';

@Component({
  selector: 'fame-more-actions',
  templateUrl: './more-actions.component.html',
  styleUrls: ['./more-actions.component.scss']
})
export class MoreActionsComponent {

  @Input() question: Question;

  constructor(
    private adminService: AdminService,
  ) { }

  reset(): void {
    this.adminService.resetQuiz$().subscribe();
  }

  previous(): void {
    this.adminService.previousQuestion$().subscribe();
  }

  hide(): void {
    this.adminService.hideAnswer$().subscribe();
  }
}
