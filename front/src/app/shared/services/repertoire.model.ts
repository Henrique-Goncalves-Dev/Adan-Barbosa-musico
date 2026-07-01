export interface RepertoireSong {
  id: string;
  categoryId: string;
  title: string;
  artist: string;
  key: string;
  capo: string;
}

export interface RepertoireCategory {
  id: string;
  name: string;
  icon: string;
  songs: RepertoireSong[];
}
