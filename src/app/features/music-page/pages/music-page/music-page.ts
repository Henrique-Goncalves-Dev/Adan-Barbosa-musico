import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from "../../../../shared/footer/footer";
import { TrackCardComponent } from "../../components/track-card-component/track-card-component";
import { Header } from "../../../../shared/header/header";

@Component({
  selector: 'app-music-page',
  imports: [Footer, TrackCardComponent, Header, RouterLink],
  templateUrl: './music-page.html',
  styleUrl: './music-page.scss',
})
export class MusicPage {
  allShows = [
    { id: 1, month: 'JUL', day: '12', city: 'Rio de Janeiro', venue: 'Teatro Rival', available: true },
    { id: 2, month: 'JUL', day: '20', city: 'Belo Horizonte', venue: 'Clube da Esquina', available: true },
    { id: 3, month: 'AGO', day: '03', city: 'São Paulo', venue: 'Audio Club', available: true },
    { id: 4, month: 'AGO', day: '10', city: 'Campinas', venue: 'Estação Cultural', available: false },
    { id: 5, month: 'AGO', day: '17', city: 'Porto Alegre', venue: 'Opinião', available: true },
    { id: 6, month: 'AGO', day: '24', city: 'Curitiba', venue: 'Casa da Música', available: false },
    { id: 7, month: 'SET', day: '07', city: 'Salvador', venue: 'Teatro Castro Alves', available: true },
    { id: 8, month: 'SET', day: '14', city: 'Fortaleza', venue: 'Centro Dragão do Mar', available: true },
    { id: 9, month: 'SET', day: '21', city: 'Recife', venue: 'Cais do Porto', available: true },
    { id: 10, month: 'OUT', day: '05', city: 'Brasília', venue: 'Arena BsB', available: false },
    { id: 11, month: 'OUT', day: '12', city: 'Florianópolis', venue: 'Pedro Henrique Hall', available: true },
    { id: 12, month: 'NOV', day: '02', city: 'Manaus', venue: 'Teatro Amazonas', available: true },
    { id: 13, month: 'NOV', day: '16', city: 'Belém', venue: 'Palácio das Artes', available: true },
    { id: 14, month: 'DEZ', day: '07', city: 'Rio de Janeiro', venue: 'Circo Voador', available: true },
    { id: 15, month: 'DEZ', day: '21', city: 'São Paulo', venue: 'Espaço das Américas', available: true },
  ];

  tracks = [
    { id: 1, title: 'Deriva', year: '2024', img: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', type: 'Álbum' },
    { id: 2, title: 'Lua Cheia', year: '2023', img: 'https://images.unsplash.com/photo-1528643609128-c50fdc20cc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', type: 'Single' },
    { id: 3, title: 'Silêncio', year: '2023', img: 'https://images.unsplash.com/photo-1608761676701-9c6c3c0b3b24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', type: 'Álbum' },
    { id: 4, title: 'Noite Funda', year: '2022', img: 'https://images.unsplash.com/photo-1726480192181-83ad4f2310ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', type: 'Single' },
    { id: 5, title: 'Cores do Vento', year: '2022', img: 'https://images.unsplash.com/photo-1691067987444-8135ac1bbef3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', type: 'EP' },
  ];
}
