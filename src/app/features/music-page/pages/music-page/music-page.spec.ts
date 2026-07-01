import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicPage } from './music-page';

describe('MusicPage', () => {
  let component: MusicPage;
  let fixture: ComponentFixture<MusicPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MusicPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
