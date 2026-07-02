import { Component, inject, computed } from '@angular/core';
import { Footer } from "../../../../shared/footer/footer";
import { Header } from "../../../../shared/header/header";
import { FormsModule } from '@angular/forms';
import { ShowsService } from "../../../../shared/services/shows.service";
import { Show } from "../../../../shared/services/show.model";

@Component({
  selector: 'app-home-component',
  imports: [Footer, Header, FormsModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  private showsService = inject(ShowsService);
  heroImg = './assets/Adan-guitarra-home.jpeg';
  guitarImg = './assets/Adan-aprender-musica.jpeg';
  portraitImg = './assets/Adan-Sobre-Voce.jpeg';

  private whatsappNumber = '5591981408622';
  private email = 'adanrbarbosa10@gmail.com';

  upcomingShows = computed(() => this.showsService.shows().filter(s => s.available).slice(0, 3));
  nextShow = computed(() => this.showsService.shows().find(s => s.available) ?? null);

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

  selectedShow: Show | null = null;
  showDetailsModal = false;

  openLessonModal() {
    this.showLessonModal = true;
    this.lessonData = { name: '', phone: '' };
  }

  closeLessonModal() {
    this.showLessonModal = false;
  }

  openShowDetails(show: Show) {
    this.selectedShow = show;
    this.showDetailsModal = true;
  }

  closeShowDetails() {
    this.showDetailsModal = false;
    this.selectedShow = null;
  }

  sendShowWhatsApp() {
    const message = encodeURIComponent('Olá! Gostaria de agendar um show com Adan Barbosa.');
    window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
  }

  sendShowEmail() {
    const subject = encodeURIComponent('Agendamento de Show - Adan Barbosa');
    const body = encodeURIComponent('Olá! Gostaria de agendar um show com Adan Barbosa.\n\nPor favor, entrem em contato para mais informações.');
    window.open(`mailto:${this.email}?subject=${subject}&body=${body}`, '_blank');
  }

  sendLessonWhatsApp() {
    const message = encodeURIComponent(
      `Olá! Meu nome é ${this.lessonData.name} e gostaria de agendar uma aula com Adan Barbosa.`
    );
    window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
    this.closeLessonModal();
  }
}
