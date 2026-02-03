import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Topbar } from '../topbar/topbar';
import { Request } from '../services/request';
import { AnimeBlock } from '../anime-block/anime-block';
import { Spotlight } from './spotlight/spotlight';
import { Hover } from '../hover/hover';
import { Subject, debounceTime } from 'rxjs';

// TODO: character page
// TODO: slice long names in anime-card 
// TODO: fix 404 Page not Found 

@Component({
  selector: 'app-home',
  imports: [Topbar, AnimeBlock, Spotlight, CommonModule, Hover],
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

  private autoPageInterval!: number;
  switchPagesAutomatically: boolean = true;

  hover: boolean = false;
  hoverBoxCords: { x: number; y: number } = { y: 0, x: 0 };
  hoverBoxData: any;
  isAnimeBlock: boolean = false;

  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  pageData: { page: number, limit: number } = { page: 0, limit: 8 };

  scrollRight: number = 0;

  constructor(
    private api: Request,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnDestroy() {
    clearInterval(this.autoPageInterval);
  }

  initTopAnimeData() {
    this.api.getTopAnimeCached('', 'bypopularity', '14').subscribe((response: any) => {
      this.topAnimeData = response.data;
      this.cdr.detectChanges();
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

  onNextSpotlight() {
    if (this.pageData.page < this.pageData.limit) {
      this.pageData.page += 1;
    }
  }

  onAnimeBlock(event: MouseEvent, data: any, isAnime: boolean, cooldown: boolean) {
    this.hover = true;
    if (event.pageX > 600) {
      this.hoverBoxCords = { y: event.pageY, x: event.pageX - 400 };
    } else {
      this.hoverBoxCords = { y: event.pageY, x: event.pageX - 100 };
    }
    this.hoverBoxData = data;
    this.isAnimeBlock = isAnime;
    this.cdr.detectChanges();
  }

  onAnimeBlockLeave() {
    setTimeout(() => {
      this.hover = false;
    }, 1000);
  }

  initTopMangaData() {
    this.api.getTopMangaCached('14', 'manga', 'bypopularity').subscribe((response: any) => {
      this.topMangaData = response.data;
      this.cdr.detectChanges();
    });
  }

  initMangaRec() {
    this.api.getMangaRecCached().subscribe((response: any) => {
      this.recMangaData = response.data;
      this.recMangaData = this.recMangaData.slice(0, 14);
      this.recMangaData = this.removeDuplicate(this.recMangaData);
      this.cdr.detectChanges();
    });
  }

  initAnimeRec() {
    this.api.getAnimeRecCached().subscribe((response: any) => {
      this.recAnimeData = response.data;
      this.recAnimeData = this.recAnimeData.slice(0, 14);
      this.recAnimeData = this.removeDuplicate(this.recAnimeData);
      this.cdr.detectChanges();
    });
  }

  removeDuplicate(array: any) {
    return array.filter(
      (item: any, index: number) =>
        array.findIndex((obj: any) => JSON.stringify(obj) === JSON.stringify(item)) === index,
    );
  }

  initSpotlightData() {
    this.api.getAnimeSpotlightCached().subscribe((response: any) => {
      this.spotlightData = response.data;
      this.spotlightData = this.removeDuplicate(this.spotlightData);
      console.log(response.data);
      this.cdr.detectChanges();
    });
  }

  startDrag(event: MouseEvent | TouchEvent, element: any) {
    this.isDragging = true;
    const grid = element;

    if (event instanceof MouseEvent) {
      this.startX = event.pageX - grid.offsetLeft;
      this.scrollLeft = grid.scrollLeft;
    }

    grid.style.cursor = 'grabbing';
    grid.style.userSelect = 'none';
  }

  drag(event: MouseEvent | TouchEvent, element: HTMLDivElement) {
    if (!this.isDragging) return;
    event.preventDefault();

    const grid = element;
    let x: number;

    if (event instanceof MouseEvent) {
      x = event.pageX - grid.offsetLeft;
    } else {
      return;
    }

    const walk = (x - this.startX) * 2;
    grid.scrollLeft = this.scrollLeft - walk;
  }

  endDrag(element: HTMLDivElement) {
    this.isDragging = false;
    const grid = element;
    grid.style.cursor = 'grab';
    grid.style.userSelect = 'auto';
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
      if (!this.switchPagesAutomatically) { return; }
      count++;
      this.pageData.page = count;
      this.cdr.detectChanges();

      if (count === times) {
        count = 0;
      }
    }, 3000);

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
