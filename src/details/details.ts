import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Request } from '../services/request';
import { ActivatedRoute, Params } from '@angular/router';
import { Topbar } from '../topbar/topbar';
import { Review } from './review/review';
import { CommonModule } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AnimeBlock } from '../anime-block/anime-block';
import { switchMap, forkJoin, of, delay, tap } from 'rxjs';
import { Subscription } from 'rxjs';

// TODO: Redesign Page
// TODO: make responsive for mobile
// TODO: handle too many requests/better error handling


@Component({
  selector: 'app-details',
  imports: [Topbar, CommonModule, Review, AnimeBlock],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  path: string = "";
  id: string = "";
  data: any;
  animeCharData: any;
  animeCharDataLimited: any;
  timeTookToLoad: number = 0;
  reviewData: any;
  relationsData: any;
  relationsDataMore: any[] = [];

  relationsDataManga: any;
  relationsDataMoreManga: any[] = [];

  loading: boolean = true;
  loadingRelations: boolean = true;

  currentSelectedReview: any;
  tagColor: string = "white";
  isMobile: boolean = false;

  popString: string = "";
  membersString: string = "";

  charNameString: string = "";

  private routeSub: Subscription | null = null;

  constructor(private api: Request, private route: ActivatedRoute, private cdr: ChangeDetectorRef,
    private device: DeviceDetectorService) {
    this.isMobile = this.device.isMobile();
  }

  initAnimeRelations() {
    this.api.getAnimeRelations(this.id).subscribe((response: any) => {
      this.relationsData = response.data;
      this.loadingRelations = false;
      this.initMoreDataForRelations(true);
      this.cdr.detectChanges();
    })
  }
  initMangaRelations() {
    this.api.getMangaRelations(this.id).subscribe((response: any) => {
      this.relationsData = response.data;
      this.initMoreDataForRelations(false);
      this.cdr.detectChanges();
    })
  }

  initMoreDataForRelations(isAnime: boolean) {
    this.relationsDataMore = [];
    this.loadingRelations = true;
    let delay = 0;
    this.relationsData.forEach((item: any) => {
      let id = item["entry"][0]["mal_id"];
      if (id) {
        setTimeout(() => {
          if (isAnime && item["entry"][0]["type"] == "anime") {
            this.api.getAnimeById(id).subscribe({
              next: (response: any) => {
                this.relationsDataMore.push(response.data);
                this.cdr.detectChanges();
                this.loadingRelations = false;
              },
              error: (err) => {
                console.error(`Failed to load anime ${id}:`, err);
              }
            });
          } else {
            this.api.getMangaById(id).subscribe({
              next: (response: any) => {
                this.relationsDataMore.push(response.data);
              },
              error: (err) => {
                console.error(`Failed to load anime ${id}:`, err);
              }
            });

          }
        }, delay);
        delay += 900;
      }
    });
  }

  initAnimeReviews() {
    this.api.getReviews(this.id, 1).subscribe((response: any) => {
      this.reviewData = response.data;
      this.cdr.detectChanges();
    });
  }

  initAnimeCharacter() {
    this.loading = true;
    this.api.getAnimeCharacter(Number(this.id)).subscribe((response: any) => {
      this.animeCharData = response.data;
      this.animeCharDataLimited = this.animeCharData.slice(0, 12);
      this.animeCharDataLimited.forEach((i: any) => {
        let name = i["character"]["name"];
        if (name.length >= 25) {
          i["character"]["name"] = i["character"]["name"].slice(0, 25) + "...";
          name = name.slice(0, 25) + ".."
        }
      });
      this.loading = false;
      this.cdr.detectChanges();

    });
  }


  initData() {
    this.loading = true;
    if (this.path == "anime") {
      this.api.getAnimeById(Number(this.id)).pipe(
        switchMap((response: any) => {
          this.data = response.data;
          this.loading = false;
          this.cdr.detectChanges();

          return of(null).pipe(
            tap(() => this.initAnimeRelations()),
            delay(1000),
            tap(() => this.initAnimeReviews()),
            delay(1000),
          );
        })
      ).subscribe();
    } else {
      this.api.getMangaById(Number(this.id)).subscribe((response: any) => {
        this.data = response.data;
        this.loading = false;
        this.initMangaRelations();
        this.cdr.detectChanges();
      });
    }
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params: Params) => {
      const urlSegments = this.route.snapshot.url;
      this.path = urlSegments[0].path;
      this.id = params['id'];
      this.initData();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
