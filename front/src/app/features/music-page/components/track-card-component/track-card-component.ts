import { Component, Input } from '@angular/core';

interface Track {
  id: number;
  title: string;
  year: string;
  img: string;
  type: string;
}


@Component({
  selector: 'app-track-card-component',
  imports: [],
  templateUrl: './track-card-component.html',
  styleUrl: './track-card-component.scss',
})
export class TrackCardComponent {
  @Input({ required: true }) track!: Track;
}
