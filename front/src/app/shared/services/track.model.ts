export interface Track {
  id: string;
  title: string;
  type: 'album' | 'single' | 'ep' | 'musica';
  albumId: string;
  year: string;
  imageUrl: string;
  youtubeUrl: string;
  spotifyUrl: string;
}
