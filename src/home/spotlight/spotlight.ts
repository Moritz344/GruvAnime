import { Component, OnInit, Input, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// TODO: switch pages automatically 

@Component({
  selector: 'app-spotlight',
  imports: [CommonModule],
  templateUrl: './spotlight.html',
  styleUrl: './spotlight.css',
})

export class Spotlight implements OnInit {
  @Input() data: any;
  @Input() pageData: any;
  @Output() pageChange = new EventEmitter<number>;


  aired: any;
  trimmedDesc: string = '';
  trimmedTitel: string = '';

  router = inject(Router);

  constructor() {
  }


  ngOnInit(): void {
    if (this.data) {
      if (this.data.synopsis && this.data.synopsis.length > 100) {
        this.trimmedDesc = this.data.synopsis ? this.data.synopsis.slice(0, 100) + '...' : '';
      } else {
        this.trimmedDesc = this.data.synopsis;
      }

      if (this.data.title && this.data.title.length > 20) {
        this.trimmedTitel = this.data.title ? this.data.title.slice(0, 20) + '...' : '';
      } else {
        this.trimmedTitel = this.data.title;
      }


    }
  }

  onNextPage() {
    if (this.pageData.page < this.pageData.limit) {
      this.pageChange.emit(this.pageData.page + 1);
    }
  }

  onPrevPage() {
    if (this.pageData.page > 0) {
      this.pageChange.emit(this.pageData.page - 1);
    }
  }

  onDetails() {
    this.router.navigate(["anime/" + this.data.mal_id]);
  }
}
