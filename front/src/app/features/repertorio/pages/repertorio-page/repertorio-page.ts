import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from "../../../../shared/footer/footer";
import { Header } from "../../../../shared/header/header";
import { RepertoireService } from "../../../../shared/services/repertoire.service";

@Component({
  selector: 'app-repertorio-page',
  imports: [Footer, Header, RouterLink],
  templateUrl: './repertorio-page.html',
  styleUrl: './repertorio-page.scss',
})
export class RepertorioPage {
  repertoire = inject(RepertoireService);

  activeCategory = '';

  get currentCategory() {
    const cats = this.repertoire.categories();
    if (!this.activeCategory && cats.length > 0) {
      this.activeCategory = cats[0].id;
    }
    return cats.find(c => c.id === this.activeCategory) || null;
  }

  setCategory(id: string) {
    this.activeCategory = id;
  }
}
