import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from "../../../../shared/footer/footer";
import { Header } from "../../../../shared/header/header";
import { ShowsService } from "../../../../shared/services/shows.service";
import { AlbumsService } from "../../../../shared/services/albums.service";
import { TracksService } from "../../../../shared/services/tracks.service";

@Component({
  selector: 'app-music-page',
  imports: [Footer, Header, RouterLink],
  templateUrl: './music-page.html',
  styleUrl: './music-page.scss',
})
export class MusicPage {
  private showsService = inject(ShowsService);
  private albumsService = inject(AlbumsService);
  private tracksService = inject(TracksService);

  allShows = this.showsService.shows;
  albums = this.albumsService.albums;
  tracks = this.tracksService.tracks;
}
