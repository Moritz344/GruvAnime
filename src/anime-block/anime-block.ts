import { Component, Input, inject, Output, EventEmitter, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-anime-block',
  imports: [CommonModule],
  templateUrl: './anime-block.html',
  styleUrl: './anime-block.css',
})
export class AnimeBlock implements OnInit, OnChanges {
  @Input() data: any;
  @Input() isAnime: boolean = false;
  @Input() openDetailsOnHoverElement: boolean = false;

  isMobile: boolean = false;
  title: string = "";

  constructor(private cdr: ChangeDetectorRef, private router: Router, private detector: DeviceDetectorService) {
    this.isMobile = this.detector.isMobile();
  }

  ngOnInit() {
    this.setTitle();
  }

  onDetails() {
    if (this.openDetailsOnHoverElement) {
      return;
    }
    if (this.isAnime) {
      this.router.navigate(["/anime", + this.data.mal_id]);
    } else {
      this.router.navigate(["/manga", + this.data.mal_id]);
    }
  }

  ngOnChanges() {
    this.setTitle();
  }


  setTitle() {
    if (this.data.entry) {
      this.data = this.data.entry[0];
      this.title = this.data.title;
      if (this.title.length > 32) {
        this.title = this.title.slice(0, 32) + "..";
      }
    } else if (this.data.titles) {
      this.title = this.data.title_english || this.data.title;
      if (this.title.length > 32) {
        this.title = this.title.slice(0, 32) + "...";
      }
    }
  }

}
