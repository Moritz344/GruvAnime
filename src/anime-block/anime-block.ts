import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anime-block',
  imports: [CommonModule],
  templateUrl: './anime-block.html',
  styleUrl: './anime-block.css',
})
export class AnimeBlock implements OnInit {
  @Input() data: any;

  title: string = "";

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.data.entry) {
      this.data = this.data.entry[0];
      this.title = this.data.title;
    } else {
      this.title = this.data.titles[0].title;
    }
  }

}
