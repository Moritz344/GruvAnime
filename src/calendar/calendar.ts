import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Request } from '../services/request';
import { AnimeBlock } from '../anime-block/anime-block';
import { Topbar } from '../topbar/topbar';
import { DeviceDetectorService } from 'ngx-device-detector';

// TODO: show sheduled anime like aniworld

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, AnimeBlock, Topbar],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar implements OnInit {
  calendarData: any;
  days: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  currentDay: string = "Monday";
  currentPage: number = 1;
  loading: boolean = false;
  cooldown: number = 10000;
  isMobile: boolean = false;

  time: number = 0;
  interval: any;

  initCalendarData(day: string) {
    this.loading = true;
    this.currentPage = 1;
    this.currentDay = day;
    this.calendarData = [];
    this.api.getSchedules(day, this.currentPage.toString()).subscribe((response: any) => {
      this.calendarData = response;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

    getLocalBroadcast(broadcast: any): { time: string; day: string } | null {
    if (!broadcast?.time) {
      return null;
    }

    const jstDateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());

    const localDate = new Date(`${jstDateStr}T${broadcast.time}:00+09:00`);

    return {
      time: localDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      day: localDate.toLocaleDateString('en-US', { weekday: 'long' })
    };
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

  constructor(private api: Request, private cdr: ChangeDetectorRef, private device: DeviceDetectorService) {
    this.isMobile = this.device.isMobile();
  }

  ngOnInit(): void {
    const today = new Date().getDay();
    this.initCalendarData(this.days[today]);
  }

}
