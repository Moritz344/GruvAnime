import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-manga-rec',
  imports: [],
  templateUrl: './manga-rec.html',
  styleUrl: './manga-rec.css',
})
export class MangaRec implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
