import { Component, Input, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anime-block',
  imports: [CommonModule],
  templateUrl: './anime-block.html',
  styleUrl: './anime-block.css',
})
export class AnimeBlock implements OnInit, OnChanges {
  @Input() data: any;

  title: string = "";

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.setTitle();
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
