import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Topbar } from '../topbar/topbar';
import { Request } from '../services/request';
import { AnimeBlock } from './anime-block/anime-block';
import { Spotlight } from './spotlight/spotlight';

@Component({
  selector: 'app-home',
  imports: [Topbar, AnimeBlock, Spotlight, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

// TODO: show random anime => spotlight

export class Home implements OnInit {
  @ViewChild('spotlightGrid') spotlightGrid!: ElementRef;
  @ViewChild('popular') popular!: ElementRef;
  @ViewChild('rec') rec!: ElementRef;

  topAnimeData: any;
  recAnimeData: any;
  spotlightData: any[] = [];

  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  constructor(private api: Request, private cdr: ChangeDetectorRef) { }

  initTopAnimeData() {
    this.api.getTopAnime("", "bypopularity", "14").subscribe((response: any) => {
      this.topAnimeData = response.data;
      this.cdr.detectChanges();
    });
  }

  initAnimeRec() {
    this.api.getAnimeRec().subscribe((response: any) => {
      this.recAnimeData = response.data;
      this.recAnimeData = this.recAnimeData.slice(0, 14);
      this.cdr.detectChanges();
    });
  }

  initSpotlightData() {
    this.api.getAnimeSpotlight().subscribe((response: any) => {
      this.spotlightData = response.data;
      this.cdr.detectChanges();
      console.log(this.spotlightData);
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
    }
    else {
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



  ngOnInit(): void {
    this.initTopAnimeData();
    this.initAnimeRec();
    this.initSpotlightData();
  }

}
