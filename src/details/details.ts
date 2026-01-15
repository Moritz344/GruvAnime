import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Request } from '../services/request';
import { ActivatedRoute } from '@angular/router';
import { Topbar } from '../topbar/topbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [Topbar, CommonModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  path: string = "";
  id: string = "";
  data: any;
  animeCharData: any;
  loading: boolean = true;
  timeTookToLoad: number = 0;

  constructor(private api: Request, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    this.setPath();
    this.initData();
  }

  initAnimeCharacter() {
    this.api.getAnimeCharacter(Number(this.id)).subscribe((response: any) => {
      this.animeCharData = response.data;
      this.animeCharData = this.animeCharData.slice(0, 12);
      this.cdr.detectChanges();
      //console.log(response.data);
    });
  }

  initData() {
    this.loading = true;
    if (this.path == "anime") {
      this.api.getAnimeById(Number(this.id)).subscribe((response: any) => {
        this.initAnimeCharacter();
        this.data = response.data;
        this.loading = false;
        this.cdr.detectChanges();
        //console.log(this.data);
      });
    } else {
      this.api.getMangaById(Number(this.id)).subscribe((response: any) => {
        this.data = response.data;
        this.loading = false;
        this.cdr.detectChanges();
      });

    }
  }

  setPath() {
    this.route.url.subscribe(segments => {
      const path = segments.map(s => s.path).join('/');
      this.path = segments[0]["path"];
      this.id = segments[1]["path"];
      //console.log(this.path, this.id);
    });
  }


  ngOnInit(): void {

  }

}
