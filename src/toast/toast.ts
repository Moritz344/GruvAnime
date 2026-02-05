import { Component, Input, EventEmitter, Output, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast implements OnInit, AfterViewInit {
  @ViewChild('container') c!: ElementRef;

  @Input() header: string = "";
  @Input() message: string = "";
  @Input() time: number = 1000;
  @Input() height: string = "";
  @Input() width: string = "";
  @Output() kill = new EventEmitter<void>;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.c.nativeElement.style.height = this.height + "px";
    this.c.nativeElement.style.width = this.width + "px";
  }

  onRemoveToast() {
    this.kill.emit();
  }

}
