import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spotlight',
  imports: [CommonModule],
  templateUrl: './spotlight.html',
  styleUrl: './spotlight.css',
})
export class Spotlight implements OnInit {
  @Input() data: any;

  trimmedDesc: string = "";
  trimmedTitel: string = "";

  constructor() { }

  ngOnInit(): void {
    if (this.data) {
      if (this.data.synopsis.length > 100) {
        this.trimmedDesc = this.data.synopsis ? this.data.synopsis.slice(0, 100) + "..." : '';
      } else {
        this.trimmedDesc = this.data.synopsis;
      }

      if (this.data.title.length > 20) {
        this.trimmedTitel = this.data.title ? this.data.title.slice(0, 20) + "..." : '';
      } else {
        this.trimmedTitel = this.data.title;
      }
      console.log(this.data);
    }
  }

}
