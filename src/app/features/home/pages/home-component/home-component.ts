import { Component } from '@angular/core';
import { Footer } from "../../../../shared/footer/footer";
import { TicketButton } from "../../../../shared/ticket-button/ticket-button";
import { Header } from "../../../../shared/header/header";
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-home-component',
  imports: [Footer, TicketButton, Header, FormsModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  heroImg = './assets/Adan-guitarra-home.jpeg';
  guitarImg = './assets/Adan-aprender-musica.jpeg';
  portraitImg = './assets/Adan-Sobre-Voce.jpeg';

  upcomingShows = [
    { id: 1, date: 'JUL 12', venue: 'Teatro Rival', city: 'Rio de Janeiro, RJ' },
    { id: 2, date: 'AGO 03', venue: 'Audio Club', city: 'São Paulo, SP' },
    { id: 3, date: 'AGO 24', venue: 'Casa da Música', city: 'Curitiba, PR' },
  ];

  eventTypes = [
    { icon: '🏢', label: 'Corporate' },
    { icon: '🥂', label: 'Private' },
    { icon: '🎪', label: 'Festivals' },
    { icon: '🎓', label: 'Academic' },
  ];

  lessonBenefits = [
    'Tocar violão sem mistério',
    'Composição e teoria musical',
    'Leitura de partitura',
    'Arranjos para violão solo',
  
  ];

  formData = {
    name: '',
    email: '',
    eventType: '',
    date: ''
  };
  
  formSent = false;

  onSubmit() {
    this.formSent = true;
  }
}
