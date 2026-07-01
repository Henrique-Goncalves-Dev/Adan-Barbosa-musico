import { Component, inject, computed } from '@angular/core';
import { Footer } from "../../../../shared/footer/footer";
import { TicketButton } from "../../../../shared/ticket-button/ticket-button";
import { Header } from "../../../../shared/header/header";
import { FormsModule } from '@angular/forms';
import { ShowsService } from "../../../../shared/services/shows.service";

@Component({
  selector: 'app-home-component',
  imports: [Footer, TicketButton, Header, FormsModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  private showsService = inject(ShowsService);
  heroImg = './assets/Adan-guitarra-home.jpeg';
  guitarImg = './assets/Adan-aprender-musica.jpeg';
  portraitImg = './assets/Adan-Sobre-Voce.jpeg';

  private whatsappNumber = '5591981408622';

  upcomingShows = computed(() => this.showsService.shows().slice(0, 3));
  nextShow = computed(() => this.showsService.shows()[0] ?? null);

  eventTypes = [
    { icon: '🏢', label: 'Público' },
    { icon: '🥂', label: 'Privado' },
    { icon: '🎪', label: 'Eventos' },
    { icon: '🎓', label: 'Aniversários' },
  ];

  lessonBenefits = [
    'Tocar violão sem mistério',
    'Composição e teoria musical',
    'Leitura de partitura',
    'Arranjos para violão solo',
  ];

  showLessonModal = false;
  lessonData = { name: '', phone: '' };

  openLessonModal() {
    this.showLessonModal = true;
    this.lessonData = { name: '', phone: '' };
  }

  closeLessonModal() {
    this.showLessonModal = false;
  }

  sendShowWhatsApp() {
    const message = encodeURIComponent('Olá! Gostaria de agendar um show com Adan Barbosa.');
    window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
  }

  sendLessonWhatsApp() {
    const message = encodeURIComponent(
      `Olá! Meu nome é ${this.lessonData.name} e gostaria de agendar uma aula com Adan Barbosa.`
    );
    window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
    this.closeLessonModal();
  }
}
