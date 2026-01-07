import { Component, OnInit, AfterContentInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AnimeBlock } from '../anime-block/anime-block';
import { Request } from '../services/request';
import { Topbar } from '../topbar/topbar';
import { CommonModule } from '@angular/common';

// TODO: implement trending,airing,upcoming for manga and anime use anime-block and pagination/ 

@Component({
  selector: 'app-manga',
  imports: [AnimeBlock, Topbar, CommonModule],
  templateUrl: './manga.html',
  styleUrl: './manga.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Manga implements OnInit, AfterContentInit {

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
      this.initMangaData();
      this.cdr.detectChanges();
    }
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.initMangaData();
      this.cdr.detectChanges();
    }
  }

  initMangaData() {
    this.loading = true;
    if (this.currentPath == "trending") {
      this.api.getTopManga("24", "", "", this.currentPage).subscribe((response: any) => {
        this.data = response.data;
        this.loading = false;
        this.paginationData = response.pagination;
        console.log(this.data);
        this.cdr.detectChanges();
      })

    } else if (this.currentPath == "upcoming") {
      this.api.getUpcomingManga("24", this.currentPage).subscribe((response: any) => {
        this.data = response.data;
        this.loading = false;
        console.log(response);
        this.paginationData = response.pagination;
        this.cdr.detectChanges();
      });

    } else if (this.currentPath == "complete") {
      this.api.getCompleteManga("24", this.currentPage).subscribe((response: any) => {
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
      console.log(this.currentPath);

    });
  }


  ngOnInit() {
  }

  ngAfterContentInit() {
    this.initMangaData();
  }
}
