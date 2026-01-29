import { Component, Input, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Request } from '../services/request';

@Component({
  selector: 'app-hover',
  imports: [CommonModule],
  templateUrl: './hover.html',
  styleUrl: './hover.css',
})
export class Hover implements OnInit, OnChanges {
  @Input() cords: { x: number, y: number } = { x: 0, y: 0 };
  @Input() data: any;
  @Input() isAnime: boolean = false;

  desc: string = "";

  constructor(private router: Router, private api: Request,
    private cdr: ChangeDetectorRef) { }

  onDetails() {
    if (this.isAnime) {
      this.router.navigate(["/anime", + this.data.mal_id]);
    } else {
      this.router.navigate(["/manga", + this.data.mal_id]);
    }
  }

  getAnimeDesc() {
    this.api.getAnimeById(this.data.mal_id).subscribe((response: any) => {
      this.desc = response.data.synopsis.slice(0, 200);
      this.cdr.detectChanges();
    });
  }

  getMangaDesc() {
    if (this.isAnime) {
      this.getAnimeDesc();
      return;
    }
    this.api.getMangaById(this.data.mal_id).subscribe((response: any) => {
      this.desc = response.data.synopsis.slice(0, 200);
      this.cdr.detectChanges();
    });
  }

  handleAnimeData() {
    if (this.data && this.data.synopsis) {
      this.desc = this.data.synopsis.slice(0, 200);
    } else {
      this.getAnimeDesc();
    }
  }

  handleMangaData() {
    if (this.data && this.data.synopsis) {
      this.desc = this.data.synopsis.slice(0, 200);
    } else {
      this.getMangaDesc();
    }

  }

  ngOnInit() {
    if (this.isAnime) {
      this.handleAnimeData();
    } else {
      this.handleMangaData();
    }
  }

  ngOnChanges() {
    if (this.data && this.data.entry) {
      this.data = this.data.entry[0];
    }
  }

}
