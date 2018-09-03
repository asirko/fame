import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'fame-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Output() answer = new EventEmitter<boolean>();

  constructor() { }

  decide(b: boolean): void {
    this.answer.next(b);
  }
}
