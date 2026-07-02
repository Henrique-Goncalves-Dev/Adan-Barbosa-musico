import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../../shared/header/header';
import { Footer } from '../../../../shared/footer/footer';
import { AuthService } from '../../../../shared/services/auth.service';
import { ShowsService } from '../../../../shared/services/shows.service';
import { AlbumsService } from '../../../../shared/services/albums.service';
import { TracksService } from '../../../../shared/services/tracks.service';
import { RepertoireService } from '../../../../shared/services/repertoire.service';
import { SearchService, SearchResult } from '../../../../shared/services/search.service';
import { Show } from '../../../../shared/services/show.model';
import { Album } from '../../../../shared/services/album.model';
import { Track } from '../../../../shared/services/track.model';
import { RepertoireCategory } from '../../../../shared/services/repertoire.model';

@Component({
  selector: 'app-admin-page',
  imports: [FormsModule, Header, Footer],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage {
  auth = inject(AuthService);
  shows = inject(ShowsService);
  albums = inject(AlbumsService);
  tracks = inject(TracksService);
  repertoire = inject(RepertoireService);
  search = inject(SearchService);

  activeTab = 'shows';
  username = '';
  password = '';

  // Shows
  showFormVisible = false;
  editingShowId: string | null = null;
  showForm = { month: '', day: '', year: '2026', city: '', street: '', venue: '', time: '', available: true };
  confirmDeleteShowId: string | null = null;

  months = [
    { value: 'JAN', label: 'Janeiro' }, { value: 'FEV', label: 'Fevereiro' },
    { value: 'MAR', label: 'Março' }, { value: 'ABR', label: 'Abril' },
    { value: 'MAI', label: 'Maio' }, { value: 'JUN', label: 'Junho' },
    { value: 'JUL', label: 'Julho' }, { value: 'AGO', label: 'Agosto' },
    { value: 'SET', label: 'Setembro' }, { value: 'OUT', label: 'Outubro' },
    { value: 'NOV', label: 'Novembro' }, { value: 'DEZ', label: 'Dezembro' },
  ];

  // Albums
  albumFormVisible = false;
  editingAlbumId: string | null = null;
  albumForm = { name: '', year: '2026', imageUrl: '', youtubeUrl: '', spotifyUrl: '' };
  confirmDeleteAlbumId: string | null = null;

  // Tracks
  trackFormVisible = false;
  editingTrackId: string | null = null;
  trackForm = { title: '', type: 'musica' as 'album' | 'single' | 'ep' | 'musica', albumId: '', year: '2026', imageUrl: '', youtubeUrl: '', spotifyUrl: '' };
  confirmDeleteTrackId: string | null = null;

  // Repertoire
  categoryFormVisible = false;
  editingCategoryId: string | null = null;
  categoryForm = { name: '', icon: '🎵' };
  songFormVisible = false;
  selectedCategoryId: string | null = null;
  songForm = { title: '', artist: '', key: '', capo: '' };
  confirmDeleteCategoryId: string | null = null;
  confirmDeleteSongId: string | null = null;
  searchQuery = '';
  expandedCategories: Record<string, boolean> = {};
  movingSongId: string | null = null;
  movingFromCategoryId: string | null = null;

  toggleCategory(id: string) {
    this.expandedCategories[id] = !this.expandedCategories[id];
  }

  isCategoryExpanded(id: string): boolean {
    return this.expandedCategories[id] ?? false;
  }

  get isShowFormValid(): boolean {
    const f = this.showForm;
    return !!(f.month && f.day && f.year && f.city && f.venue && f.time);
  }

  async login() {
    await this.auth.login(this.username, this.password);
    if (this.auth.isLoggedIn()) { this.username = ''; this.password = ''; }
  }

  logout() { this.auth.logout(); }

  // ── SHOWS ──
  openAddShow() {
    this.editingShowId = null;
    this.showForm = { month: '', day: '', year: '2026', city: '', street: '', venue: '', time: '', available: true };
    this.showFormVisible = true;
  }

  openEditShow(show: Show) {
    this.editingShowId = show.id;
    this.showForm = { month: show.month, day: show.day, year: show.year, city: show.city, street: show.street, venue: show.venue, time: show.time, available: show.available };
    this.showFormVisible = true;
  }

  closeShowForm() { this.showFormVisible = false; this.editingShowId = null; }

  async saveShow() {
    if (!this.isShowFormValid) return;
    if (this.editingShowId) {
      await this.shows.update(this.editingShowId, this.showForm);
    } else {
      await this.shows.add(this.showForm);
    }
    this.closeShowForm();
  }

  askDeleteShow(id: string) { this.confirmDeleteShowId = id; }
  cancelDeleteShow() { this.confirmDeleteShowId = null; }
  async confirmDeleteShow() {
    if (this.confirmDeleteShowId) { await this.shows.remove(this.confirmDeleteShowId); this.confirmDeleteShowId = null; }
  }

  // ── ALBUMS ──
  openAddAlbum() {
    this.editingAlbumId = null;
    this.albumForm = { name: '', year: '2026', imageUrl: '', youtubeUrl: '', spotifyUrl: '' };
    this.albumFormVisible = true;
  }

  openEditAlbum(album: Album) {
    this.editingAlbumId = album.id;
    this.albumForm = { name: album.name, year: album.year, imageUrl: album.imageUrl, youtubeUrl: album.youtubeUrl, spotifyUrl: album.spotifyUrl };
    this.albumFormVisible = true;
  }

  closeAlbumForm() { this.albumFormVisible = false; this.editingAlbumId = null; }

  async saveAlbum() {
    if (this.editingAlbumId) {
      await this.albums.update(this.editingAlbumId, this.albumForm);
    } else {
      await this.albums.add(this.albumForm);
    }
    this.closeAlbumForm();
  }

  askDeleteAlbum(id: string) { this.confirmDeleteAlbumId = id; }
  cancelDeleteAlbum() { this.confirmDeleteAlbumId = null; }
  async confirmDeleteAlbum() {
    if (this.confirmDeleteAlbumId) { await this.albums.remove(this.confirmDeleteAlbumId); this.confirmDeleteAlbumId = null; }
  }

  // ── TRACKS ──
  openAddTrack() {
    this.editingTrackId = null;
    this.trackForm = { title: '', type: 'musica', albumId: '', year: '2026', imageUrl: '', youtubeUrl: '', spotifyUrl: '' };
    this.trackFormVisible = true;
  }

  openEditTrack(track: Track) {
    this.editingTrackId = track.id;
    this.trackForm = { title: track.title, type: track.type, albumId: track.albumId, year: track.year, imageUrl: track.imageUrl, youtubeUrl: track.youtubeUrl, spotifyUrl: track.spotifyUrl };
    this.trackFormVisible = true;
  }

  closeTrackForm() { this.trackFormVisible = false; this.editingTrackId = null; }

  async saveTrack() {
    if (this.editingTrackId) {
      await this.tracks.update(this.editingTrackId, this.trackForm);
    } else {
      await this.tracks.add(this.trackForm);
    }
    this.closeTrackForm();
  }

  askDeleteTrack(id: string) { this.confirmDeleteTrackId = id; }
  cancelDeleteTrack() { this.confirmDeleteTrackId = null; }
  async confirmDeleteTrack() {
    if (this.confirmDeleteTrackId) { await this.tracks.remove(this.confirmDeleteTrackId); this.confirmDeleteTrackId = null; }
  }

  getAlbumName(id: string): string {
    return this.albums.albums().find(a => a.id === id)?.name || 'Sem álbum';
  }

  // ── REPERTOIRE ──
  openAddCategory() {
    this.editingCategoryId = null;
    this.categoryForm = { name: '', icon: '🎵' };
    this.categoryFormVisible = true;
  }

  openEditCategory(cat: RepertoireCategory) {
    this.editingCategoryId = cat.id;
    this.categoryForm = { name: cat.name, icon: cat.icon };
    this.categoryFormVisible = true;
  }

  closeCategoryForm() { this.categoryFormVisible = false; this.editingCategoryId = null; }

  async saveCategory() {
    if (this.editingCategoryId) {
      await this.repertoire.updateCategory(this.editingCategoryId, this.categoryForm);
    } else {
      await this.repertoire.addCategory(this.categoryForm.name, this.categoryForm.icon);
    }
    this.closeCategoryForm();
  }

  askDeleteCategory(id: string) { this.confirmDeleteCategoryId = id; }
  cancelDeleteCategory() { this.confirmDeleteCategoryId = null; }
  async confirmDeleteCategory() {
    if (this.confirmDeleteCategoryId) { await this.repertoire.removeCategory(this.confirmDeleteCategoryId); this.confirmDeleteCategoryId = null; }
  }

  openAddSong(categoryId: string) {
    this.selectedCategoryId = categoryId;
    this.songForm = { title: '', artist: '', key: '', capo: '' };
    this.searchQuery = '';
    this.search.clear();
    this.songFormVisible = true;
  }

  closeSongForm() { this.songFormVisible = false; this.selectedCategoryId = null; this.search.clear(); this.searchQuery = ''; }

  onSearch() { this.search.search(this.searchQuery); }

  selectSearchResult(result: SearchResult) {
    this.songForm.title = result.title;
    this.songForm.artist = result.artist;
    this.search.clear();
    this.searchQuery = '';
  }

  async saveSong() {
    if (this.selectedCategoryId) {
      await this.repertoire.addSong({ ...this.songForm, categoryId: this.selectedCategoryId });
    }
    this.closeSongForm();
  }

  askDeleteSong(categoryId: string, songId: string) { this.confirmDeleteCategoryId = categoryId; this.confirmDeleteSongId = songId; }
  cancelDeleteSong() { this.confirmDeleteCategoryId = null; this.confirmDeleteSongId = null; }
  async confirmDeleteSong() {
    if (this.confirmDeleteCategoryId && this.confirmDeleteSongId) {
      await this.repertoire.removeSong(this.confirmDeleteCategoryId, this.confirmDeleteSongId);
      this.confirmDeleteCategoryId = null;
      this.confirmDeleteSongId = null;
    }
  }

  startMoveSong(categoryId: string, songId: string) {
    this.movingFromCategoryId = categoryId;
    this.movingSongId = songId;
  }

  cancelMoveSong() {
    this.movingFromCategoryId = null;
    this.movingSongId = null;
  }

  async moveSong(toCategoryId: string) {
    if (this.movingFromCategoryId && this.movingSongId && toCategoryId) {
      await this.repertoire.moveSong(this.movingFromCategoryId, toCategoryId, this.movingSongId);
      this.movingFromCategoryId = null;
      this.movingSongId = null;
    }
  }

  getOtherCategories(currentId: string): RepertoireCategory[] {
    return this.repertoire.categories().filter(c => c.id !== currentId);
  }
}
