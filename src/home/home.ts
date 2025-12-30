import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Topbar } from '../topbar/topbar';
import { Request } from '../services/request';
import { Popular } from './popular/popular';
import { MangaRec } from './manga-rec/manga-rec';
import { AnimeRec } from './anime-rec/anime-rec';

@Component({
  selector: 'app-home',
  imports: [Topbar, Popular, MangaRec, AnimeRec],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

// TODO: show random anime => spotlight

export class Home implements OnInit {

  topAnimeData: any;
  recAnimeData: any;

  constructor(private api: Request, private cdr: ChangeDetectorRef) {
  }

  initTopAnimeData() {
    this.api.getTopAnime("", "bypopularity").subscribe((response: any) => {
      this.topAnimeData = response.data;
      this.cdr.detectChanges();
    });
  }

  initAnimeRec() {
    this.api.getAnimeRec().subscribe((response: any) => {
      this.recAnimeData = response.data;
      this.recAnimeData = this.recAnimeData.slice(0, 8);
      this.cdr.detectChanges();
    });

  }

  ngOnInit(): void {
    this.initTopAnimeData();
    this.initAnimeRec();
  }

}
