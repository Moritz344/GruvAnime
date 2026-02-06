import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Request {

  base_url = "https://api.jikan.moe/v4/";

  private topAnimeCache$: Observable<any> | null = null;
  private topMangaCache$: Observable<any> | null = null;
  private animeRecCache$: Observable<any> | null = null;
  private mangaRecCache$: Observable<any> | null = null;
  private completeMangaCache$: Observable<any> | null = null;
  private upcomingMangaCache$: Observable<any> | null = null;
  private spotlightCache$: Observable<any> | null = null;
  private animeAiring$: Observable<any> | null = null;
  private animeUpcoming$: Observable<any> | null = null;
  private scheduleCache$: { [key: string]: Observable<any> } = {};


  constructor(private http: HttpClient) { }

  clearAllCaches() {
    this.topAnimeCache$ = null;
    this.topMangaCache$ = null;
    this.animeRecCache$ = null;
    this.mangaRecCache$ = null;
    this.spotlightCache$ = null;
    this.scheduleCache$ = {};
  }


  getTopAnime(type: string, filter: string, limit: string, page?: number) {
    const params = new URLSearchParams();

    if (page) {
      params.append("page", page.toString());
    }

    params.append("filter", filter);
    params.append("limit", limit);

    const url = this.base_url + "top/anime?" + params;

    return this.http.get(url);
  }

  getTopAnimeCached(type: string, filter: string, limit: string, page?: number): Observable<any> {
    if (!this.topAnimeCache$) {
      this.topAnimeCache$ = this.getTopAnime(type, filter, limit, page).pipe(
        shareReplay(1)
      );
    }
    return this.topAnimeCache$;
  }

  getReviews(anime_id: string, page: number,) {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("spoiler", "false");
    const url = this.base_url + "anime/" + anime_id + "/reviews?" + params.toString();
    return this.http.get(url);

  }

  getSchedules(day: string, page: string) {
    const params = new URLSearchParams();

    if (page) {
      params.append("page", page);
    }

    params.append("limit", "25");
    params.append("filter", day);
    params.append("kids", "false");
    params.append("sfw", "false");

    const url = this.base_url + "schedules?" + params;


    return this.http.get(url);
  }


  getTopManga(limit: string, type?: string, filter?: string, page?: number) {
    const params = new URLSearchParams();

    if (filter) {
      params.append("filter", filter);
    }
    if (type) {
      params.append("type", type);
    }

    params.append("limit", limit);


    if (page) {
      params.append("page", page.toString());
      params.append("sfw", "true");
      params.append("limit", limit);
    }

    const url = this.base_url + "top/manga?" + params;

    return this.http.get(url);
  }

  getTopMangaCached(limit: string, type?: string, filter?: string, page?: number): Observable<any> {
    if (!this.topMangaCache$) {
      this.topMangaCache$ = this.getTopManga(limit, type, filter, page).pipe(
        shareReplay(1)
      );
    }
    return this.topMangaCache$;
  }

  getUpcomingMangaCache(limit: string, page: number) {
    if (!this.upcomingMangaCache$) {
      this.upcomingMangaCache$ = this.getUpcomingManga(limit, page).pipe(
        shareReplay(1)
      );
    }
    return this.upcomingMangaCache$;
  }

  getUpcomingManga(limit: string, page: number) {
    const params = new URLSearchParams();

    params.append("status", "upcoming");
    params.append("page", page.toString());
    params.append("order_by", "popularity");
    params.append("sfw", "true");
    params.append("limit", limit);

    const url = this.base_url + "manga?" + params;
    return this.http.get(url);
  }

  getCompleteMangaCache(limit: string, page: number) {
    if (!this.completeMangaCache$) {
      this.completeMangaCache$ = this.getCompleteManga(limit, page).pipe(
        shareReplay(1)
      );
    }
    return this.completeMangaCache$;
  }

  getCompleteManga(limit: string, page: number) {
    const params = new URLSearchParams();

    params.append("status", "complete");
    params.append("order_by", "popularity");
    params.append("page", page.toString());
    params.append("sfw", "true");
    params.append("limit", limit);

    const url = this.base_url + "manga?" + params;
    return this.http.get(url);
  }

  getMangaRec() {
    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("limit", "7");
    const url = this.base_url + "recommendations/manga?" + params;
    return this.http.get(url);
  }

  getMangaRecCached(): Observable<any> {
    if (!this.mangaRecCache$) {
      this.mangaRecCache$ = this.getMangaRec().pipe(
        shareReplay(1)
      );
    }
    return this.mangaRecCache$;
  }

  getAnimeRec() {
    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("limit", "7");
    const url = this.base_url + "recommendations/anime?" + params;
    return this.http.get(url);
  }

  getAnimeRecCached(): Observable<any> {
    if (!this.animeRecCache$) {
      this.animeRecCache$ = this.getAnimeRec().pipe(
        shareReplay(1)
      );
    }
    return this.animeRecCache$;
  }

  getRandomAnime() {
    const params = new URLSearchParams();
    params.append("sfw", "true");
    const url = this.base_url + "random/anime?" + params;
    return this.http.get(url);
  }

  getAnimeSpotlight() {
    const params = new URLSearchParams();
    params.append("status", "upcoming");
    params.append("order_by", "popularity");
    params.append("limit", "10");
    const url = this.base_url + "anime?" + params;
    return this.http.get(url);
  }

  getAnimeRelations(id: string) {
    const url = this.base_url + "anime/" + id + "/relations";
    return this.http.get(url);
  }

  getMangaRelations(id: string) {
    const url = this.base_url + "manga/" + id + "/relations";
    return this.http.get(url);
  }

  getAnimeSpotlightCached(): Observable<any> {
    if (!this.spotlightCache$) {
      this.spotlightCache$ = this.getAnimeSpotlight().pipe(
        shareReplay(1)
      );
    }
    return this.spotlightCache$;
  }

  searchManga(filter: { keyword: string, type: string, score: number, min_score: number, max_score: number, status: string, rating: string, sfw: boolean, genres: string[], genres_exclude: string[], order_by: string, sort: string, page: number }, limit: string) {
    const params = new URLSearchParams();
    if (filter.keyword) {
      params.append("q", filter.keyword);
    }

    if (filter.type) {
      params.append("type", filter.type);
    }

    if (filter.status) {
      params.append("status", filter.status);
    }

    if (filter.score) {
      params.append("score", filter.score.toString());
    }

    if (filter.rating) {
      params.append("rating", filter.rating);
    }

    if (filter.sfw) {
      params.append("sfw", filter.sfw.toString());
    }

    if (filter.genres[0] == "") {
      filter.genres.shift();
    }
    if (filter.genres_exclude[0] == "") {
      filter.genres_exclude.shift();
    }
    if (filter.genres.length > 0) {
      console.log(filter.genres.length);
      params.append("genres", filter.genres.join(","));
    }
    if (filter.genres_exclude.length > 0) {
      params.append("genres_exclude", filter.genres_exclude.join(","));
    }

    if (filter.sort) {
      params.append("sort", filter.sort);
    }

    if (filter.order_by) {
      params.append("order_by", filter.order_by);
    }



    params.append("limit", limit);
    params.append("page", filter.page.toString());
    const url = this.base_url + "manga?" + params;
    return this.http.get(url);

  }


  searchAnime(filter: { keyword: string, type: string, score: number, min_score: number, max_score: number, status: string, rating: string, sfw: boolean, genres: string[], genres_exclude: string[], order_by: string, sort: string, page: number }, limit: string) {
    const params = new URLSearchParams();
    if (filter.keyword) {
      params.append("q", filter.keyword);
    }

    if (filter.type) {
      params.append("type", filter.type);
    }

    if (filter.status) {
      params.append("status", filter.status);
    }

    if (filter.score) {
      params.append("score", filter.score.toString());
    }

    if (filter.rating) {
      params.append("rating", filter.rating);
    }

    if (filter.sfw) {
      params.append("sfw", filter.sfw.toString());
    }

    if (filter.genres[0] == "") {
      filter.genres.shift();
    }
    if (filter.genres_exclude[0] == "") {
      filter.genres_exclude.shift();
    }
    console.log(filter.genres_exclude);
    if (filter.genres.length > 0) {
      console.log(filter.genres.length);
      params.append("genres", filter.genres.join(","));
    }
    if (filter.genres_exclude.length > 0) {
      params.append("genres_exclude", filter.genres_exclude.join(","));
    }

    if (filter.sort) {
      params.append("sort", filter.sort);
    }

    if (filter.order_by) {
      params.append("order_by", filter.order_by);
    }



    params.append("limit", limit);
    params.append("page", filter.page.toString());
    const url = this.base_url + "anime?" + params;
    return this.http.get(url);

  }

  getUpcomingAnime(limit: string, page: number) {
    const params = new URLSearchParams();

    params.append("status", "upcoming");
    params.append("order_by", "popularity");
    params.append("page", page.toString());
    params.append("limit", limit);

    const url = this.base_url + "anime?" + params;
    return this.http.get(url);
  }

  getAnimeById(id: number) {
    const url = this.base_url + "anime/" + id;
    return this.http.get(url);
  }
  getMangaById(id: number) {
    const url = this.base_url + "manga/" + id;
    return this.http.get(url);
  }


  getAiringAnime(limit: string, page: number) {
    const params = new URLSearchParams();

    params.append("status", "airing");
    params.append("order_by", "popularity");
    params.append("page", page.toString());
    params.append("sfw", "true");
    params.append("limit", limit);

    const url = this.base_url + "anime?" + params;
    return this.http.get(url);
  }

  getAnimeCharacter(id: number) {
    const url = this.base_url + "anime/" + id + "/characters";
    return this.http.get(url);
  }

}
