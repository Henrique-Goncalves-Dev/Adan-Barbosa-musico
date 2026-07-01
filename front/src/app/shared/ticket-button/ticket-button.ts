import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ticket-button',
  imports: [],
  templateUrl: './ticket-button.html',
  styleUrl: './ticket-button.scss',
})
export class TicketButton {
  @Input() outline = false;
  isHovered = false;
}
