import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  imports: [CommonModule],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review implements OnInit {
  @Input() data: any;

  reviewShortText: string = "";
  reviewText: string = "";
  showMoreText: boolean = false;
  currentSelectedReview: any;
  isMobile: boolean = false;

  constructor(private device: DeviceDetectorService) {
    this.isMobile = this.device.isMobile();
  }


  ngOnInit(): void {
    this.reviewText = this.data.review;
    this.reviewShortText = this.data.review.slice(0, 400);
  }

  onReadMore() {
    this.showMoreText = !this.showMoreText;
  }

}
