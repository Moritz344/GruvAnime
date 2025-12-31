import { Component } from '@angular/core';

@Component({
  selector: 'app-anime-rec',
  imports: [],
  templateUrl: './anime-rec.html',
  styleUrl: './anime-rec.css',
})
export class AnimeRec {

}
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-anime-rec',
  imports: [],
  templateUrl: './anime-rec.html',
  styleUrl: './anime-rec.css',
})
export class implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
