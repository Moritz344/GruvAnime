import { Component, OnInit, AfterContentInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AnimeBlock } from '../anime-block/anime-block';
import { Request } from '../services/request';
import { Topbar } from '../topbar/topbar';
import { CommonModule } from '@angular/common';

// TODO: implement trending,airing,upcoming for manga and anime use anime-block and pagination/ 

@Component({
  selector: 'app-anime',
  imports: [AnimeBlock, Topbar, CommonModule],
  templateUrl: './anime.html',
  styleUrl: './anime.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Anime implements OnInit, AfterContentInit {

  data: any;
  currentPath: string = "";
  paginationData: any;
  currentPage: number = 1;
  loading: boolean = false;


  constructor(private route: ActivatedRoute, private api: Request, private cdr: ChangeDetectorRef) {
    this.initRoutes();
  }

  onNextPage() {
    if (this.paginationData.last_visible_page > this.currentPage) {
      this.currentPage += 1;
      this.initAnimeData();
      this.cdr.detectChanges();
    }
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.initAnimeData();
      this.cdr.detectChanges();
    }
  }

  initAnimeData() {
    this.loading = true;
    if (this.currentPath == "trending") {
      this.api.getTopAnime("", "", "24", this.currentPage).subscribe((response: any) => {
        this.data = response.data;
        this.loading = false;
        this.paginationData = response.pagination;
        this.cdr.detectChanges();
      })

    } else if (this.currentPath == "airing") {
      this.api.getAiringAnime("24", this.currentPage).subscribe((response: any) => {
        this.data = response.data;
        this.loading = false;
        this.paginationData = response.pagination;
        this.cdr.detectChanges();
      });

    } else if (this.currentPath == "upcoming") {
      this.api.getUpcomingAnime("24", this.currentPage).subscribe((response: any) => {
        this.data = response.data;
        this.loading = false;
        this.paginationData = response.pagination;
        this.cdr.detectChanges();
      });
    }
  }

  initRoutes() {
    this.route.url.subscribe(segments => {
      const path = segments.map(s => s.path).join('/');
      let splittedPath = path.split("/");
      this.currentPath = splittedPath[1];

    });
  }


  ngOnInit() {
  }

  ngAfterContentInit() {
    this.initAnimeData();
  }

}
