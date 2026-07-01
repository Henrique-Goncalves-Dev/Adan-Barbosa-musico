import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-footer',
  imports: [FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  navCol1 = ['Musicas', 'Shows', 'Aulas', 'Sobre'];
  navCol2 = ['Contato', 'Booking', 'Press Kit', 'EPK'];
  
  email = '';
  subscribed = false;

  handleSubscribe(): void {
    if (this.email) {
      this.subscribed = true;
    }
  }
}
