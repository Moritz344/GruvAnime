import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';

// TODO: github icon smaller

@Component({
  selector: 'app-topbar',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar implements OnInit {

  searchValue: string = "";

  onAnimeHover: boolean = false;
  onMangaHover: boolean = false;
  isMobile: boolean = false;
  showMobileMenu: boolean = false;

  onAnime() {
    this.onMangaHover = false;
    this.onAnimeHover = true;
  }

  onManga() {
    this.onAnimeHover = false;
    this.onMangaHover = true;
  }

  onAnimeLeave() {
    this.onAnimeHover = false;
  }

  onMangaLeave() {
    this.onMangaHover = false;
  }

  onCalendar() {
    this.router.navigate(["/calendar"]);
  }

  onAnimeOption(option: string) {
    this.onAnimeHover = false;
    if (option == "trending") {
      this.router.navigate(["/anime/trending"]);
    } else if (option == "upcoming") {
      this.router.navigate(["/anime/upcoming"]);
    } else if (option == "airing") {
      this.router.navigate(["/anime/airing"]);

    }
  }
  onMangaOption(option: string) {
    this.onMangaHover = false;
    if (option == "upcoming") {
      this.router.navigate(["/manga/upcoming"]);
    } else if (option == "trending") {
      this.router.navigate(["/manga/trending"]);
    } else if (option == "complete") {
      this.router.navigate(["/manga/complete"]);

    }
  }

  onLeaveHoverElement() {
    this.onMangaHover = false;
    this.onAnimeHover = false;
  }

  onShowMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  constructor(private router: Router, private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit() { }


  onSearch() {
    this.router.navigate(["search/anime"], { queryParams: { keyword: this.searchValue } });
  }

}
