import { Component } from '@angular/core';

@Component({
  selector: 'fame-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent {
  isOpen = false;
  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
