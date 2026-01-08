import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Request } from '../services/request';
import { ActivatedRoute } from '@angular/router';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-details',
  imports: [Topbar],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {

  path: string = "";
  id: string = "";
  data: any;

  constructor(private api: Request, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    this.setPath();
    this.initData();
  }

  initData() {
    if (this.path == "anime") {
      this.api.getAnimeById(Number(this.id)).subscribe((response: any) => {
        this.data = response.data;
        this.cdr.detectChanges();
        console.log(this.data);
      });
    } else {
      this.api.getMangaById(Number(this.id)).subscribe((response: any) => {
        this.data = response.data;
        this.cdr.detectChanges();
      });

    }
  }

  setPath() {
    this.route.url.subscribe(segments => {
      const path = segments.map(s => s.path).join('/');
      this.path = segments[0]["path"];
      this.id = segments[1]["path"];
      console.log(this.path, this.id);
    });
  }


  ngOnInit(): void {

  }

}
