import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  title: string = "";

  constructor(private cdr: ChangeDetectorRef, private router: Router) { }

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
    } else if (this.data.titles) {
      this.title = this.data.titles[0].title;
    }
  }

}
