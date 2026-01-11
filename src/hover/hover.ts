import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  onDetails() {
    if (this.isAnime) {
      this.router.navigate(["/anime", + this.data.mal_id]);
    } else {
      this.router.navigate(["/manga", + this.data.mal_id]);
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.data && this.data.entry) {
      this.data = this.data.entry[0];
    }
  }

}
