import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Topbar } from '../topbar/topbar';
import { Request } from '../services/request';
import { AnimeBlock } from '../anime-block/anime-block';
import { Spotlight } from './spotlight/spotlight';
import { Hover } from '../hover/hover';
import { Toast } from '../toast/toast';
import { Router } from '@angular/router';

// TODO: remove duplicate data

@Component({
  selector: 'app-home',
  imports: [Topbar, AnimeBlock, Spotlight, CommonModule, Hover, Toast],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  @ViewChild('spotlightGrid') spotlightGrid!: ElementRef;
  @ViewChild('popular') popular!: ElementRef;
  @ViewChild('rec') rec!: ElementRef;
  @ViewChild('rec_manga') rec_manga!: ElementRef;
  @ViewChild('manga') manga!: ElementRef;

  topAnimeData: any;
  recAnimeData: any;
  spotlightData: any[] = [];

  topMangaData: any;
  recMangaData: any;

  private autoPageInterval!: any;
  switchPagesAutomatically: boolean = true;

  showToast: boolean = false;

  hover: boolean = false;
  hoverBoxCords: { x: number; y: number } = { y: 0, x: 0 };
  hoverBoxData: any;
  isAnimeBlock: boolean = false;

  dragStartX = 0;
  dragStartY = 0;
  startX = 0;
  scrollLeft = 0;
  private readonly DRAG_THRESHOLD = 5;
  private draggingElement: HTMLElement | null = null;

  pageData: { page: number; limit: number } = { page: 0, limit: 7 };

  scrollRight: number = 0;

  loadingMangaRec: boolean = true;
  loadingAnimeRec: boolean = true;

  constructor(
    private api: Request,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnDestroy() {
    clearInterval(this.autoPageInterval);
  }

  onRemoveToast() {
    this.showToast = false;
    sessionStorage.setItem('toast-shown', 'true');
  }

  initTopAnimeData() {
    this.api.getTopAnimeCached('', 'bypopularity', '14').subscribe({
      next: (response: any) => {
        this.topAnimeData = response.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onPreviousSpotlight() {
    if (this.pageData.page > 0) {
      this.pageData.page -= 1;
    }
  }

  turnOffAutoSwitch() {
    this.switchPagesAutomatically = false;
    clearInterval(this.autoPageInterval);
  }
  turnOnAutoSwitch() {
    this.switchPagesAutomatically = true;
    this.autoPage(8);
  }

  onPageChange(page: number) {
    this.pageData.page = page;
  }

  onAnimeBlockLeave() {
    setTimeout(() => {
      this.hover = false;
    }, 1000);
  }

  initTopMangaData() {
    this.api.getTopMangaCached('14', 'manga', 'bypopularity').subscribe({
      next: (response: any) => {
        this.topMangaData = response.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  initMangaRec() {
    this.loadingMangaRec = true;
    this.api.getMangaRecCached().subscribe({
      next: (response: any) => {
        this.recMangaData = response.data;
        this.recMangaData = this.recMangaData.slice(0, 14);
        this.recMangaData = this.api.removeDuplicate(this.recMangaData);
        this.loadingMangaRec = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  initAnimeRec() {
    this.loadingAnimeRec = true;
    this.api.getAnimeRecCached().subscribe({
      next: (response: any) => {
        this.recAnimeData = response.data;
        this.recAnimeData = this.recAnimeData.slice(0, 14);
        this.recAnimeData = this.api.removeDuplicate(this.recAnimeData);
        this.loadingAnimeRec = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  initSpotlightData() {
    this.api.getAnimeSpotlightCached().subscribe({
      next: (response: any) => {
        this.spotlightData = response.data;
        this.spotlightData = this.api.removeDuplicate(this.spotlightData);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  onGridClick(event: MouseEvent) {
      event.preventDefault();
      event.stopPropagation();
  }

  scroll(direction: 'left' | 'right', element: HTMLDivElement) {
    const grid = element;
    const scrollAmount = 1000;

    if (direction === 'left') {
      grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  autoPage(times: number) {
    let count = this.pageData.page;
    this.autoPageInterval = setInterval(() => {
      if (!this.switchPagesAutomatically) {
        return;
      }
      count++;
      this.pageData.page = count;
      if (count >= times) {
        this.pageData.page = 0;
        count = 0;
      }
      this.cdr.detectChanges();
    }, 5000);
  }

  ngOnInit(): void {
    this.autoPage(8);
    setTimeout(() => {
      this.initTopAnimeData();
    }, 500);
    setTimeout(() => {
      this.initAnimeRec();
    }, 3000);
    setTimeout(() => {
      this.initSpotlightData();
    }, 500);
    setTimeout(() => {
      this.initTopMangaData();
    }, 500);
    setTimeout(() => {
      this.initMangaRec();
    }, 3000);
  }


}
