import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-popular',
  imports: [],
  templateUrl: './popular.html',
  styleUrl: './popular.css',
})
export class Popular implements OnInit {
  @Input() data: any;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

}
