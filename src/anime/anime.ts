import { Component, OnInit, AfterContentInit, ChangeDetectorRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AnimeBlock } from '../anime-block/anime-block';
import { Request } from '../services/request';
import { Topbar } from '../topbar/topbar';
import { CommonModule } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-anime',
  imports: [AnimeBlock, Topbar, CommonModule],
  templateUrl: './anime.html',
  styleUrl: './anime.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Anime implements OnInit, AfterContentInit {

  isAnime: boolean = false;
  data: any;
  currentPath: string = "";
  paginationData: any;
  currentPage: number = 1;
  loading: boolean = true;
  isMobile: boolean = false;


  constructor(private route: ActivatedRoute, private api: Request, private cdr: ChangeDetectorRef, private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
    this.initRoutes();
  }

  onNextPage() {
    if (this.paginationData.last_visible_page > this.currentPage) {
      this.currentPage += 1;
      if (this.isAnime) {
        this.initAnimeData();
      } else {
        this.initMangaData();
      }
    }
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      if (this.isAnime) {
        this.initAnimeData();
      } else {
        this.initMangaData();
      }
    }
  }

  initData() {
    this.route.url.subscribe(segments => {
      const path = segments.map(s => s.path).join('/');
      if (path.split("/")[0] == "anime") {
        this.isAnime = true;
      } else if (path.split("")[0] == "manga") {
        this.isAnime = false;
      }
    });

    if (this.isAnime) {
      this.initAnimeData();
    } else {
      this.initMangaData();
    }
  }
  initMangaData() {
    this.loading = true;
    if (this.currentPath == "trending") {
      this.api.getTopManga("21", "manga", "bypopularity", this.currentPage).subscribe((response: any) => {
        this.data = response.data;
        this.loading = false;
        this.paginationData = response.pagination;
        console.log("data got:", this.data);
        this.cdr.detectChanges();
      })

    } else if (this.currentPath == "upcoming") {
      this.api.getUpcomingManga("21", this.currentPage).subscribe((response: any) => {
        this.data = response.data;
        this.loading = false;
        console.log(response);
        this.paginationData = response.pagination;
        this.cdr.detectChanges();
      });

    } else if (this.currentPath == "complete") {
      this.api.getCompleteManga("21", this.currentPage).subscribe((response: any) => {
        this.data = response.data;
        this.loading = false;
        this.paginationData = response.pagination;
        this.cdr.detectChanges();
      });
    }
  }

  initAnimeData() {
    this.loading = true;
    if (this.currentPath == "trending") {
      this.api.getTopAnime("", "bypopularity", "21", this.currentPage).subscribe((response: any) => {
        this.data = response.data;
        console.log("data trnding", this.data);
        this.loading = false;
        this.paginationData = response.pagination;
        this.cdr.detectChanges();
      })

    } else if (this.currentPath == "airing") {
      this.api.getAiringAnime("21", this.currentPage).subscribe((response: any) => {
        this.data = response.data;
        this.loading = false;
        this.paginationData = response.pagination;
        this.cdr.detectChanges();
      });

    } else if (this.currentPath == "upcoming") {
      this.api.getUpcomingAnime("21", this.currentPage).subscribe((response: any) => {
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
    this.initData();
  }

}
