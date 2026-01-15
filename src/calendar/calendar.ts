import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Request } from '../services/request';
import { AnimeBlock } from '../anime-block/anime-block';
import { Topbar } from '../topbar/topbar';

// TODO: show sheduled anime like aniworld

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, AnimeBlock, Topbar],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar implements OnInit {

  calendarData: any;
  days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  currentDay: string = "Monday";
  currentPage: number = 1;
  loading: boolean = false;

  initCalendarData(day: string) {
    this.loading = true;
    this.currentPage = 1;
    this.currentDay = day;
    this.calendarData = [];
    this.api.getSchedules(day, this.currentPage.toString()).subscribe((response: any) => {
      this.calendarData = response;
      this.loading = false;
      this.cdr.detectChanges();
      console.log(this.calendarData);
    });
  }

  loadMoreData() {
    let page = this.currentPage + 1;
    this.api.getSchedules(this.currentDay, page.toString()).subscribe((response: any) => {
      if (this.calendarData && Array.isArray(this.calendarData.data)) {
        this.calendarData.pagination = response.pagination;
        this.calendarData.data = this.calendarData.data.concat(response.data);
        this.currentPage = page;
        this.cdr.detectChanges();
      }
    })
  }

  constructor(private api: Request, private cdr: ChangeDetectorRef) {
    const today = new Date().getDay();
    this.initCalendarData(this.days[today - 1]);
  }

  ngOnInit(): void { }

}
