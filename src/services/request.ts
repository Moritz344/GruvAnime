import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class Request {

  base_url = "https://api.jikan.moe/v4/";

  constructor(private http: HttpClient) { }

  getTopAnime(type: string, filter: string, limit: string) {
    const params = new URLSearchParams();

    params.append("filter", filter);
    params.append("limit", limit);

    const url = this.base_url + "top/anime?" + params;

    return this.http.get(url);

  }
  getTopManga(type: string, filter: string, limit: string) {
    const params = new URLSearchParams();

    params.append("filter", filter);
    params.append("limit", limit);

    const url = this.base_url + "top/manga?" + params;

    return this.http.get(url);

  }

  getMangaRec() {
    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("limit", "7");
    const url = this.base_url + "recommendations/manga?" + params;
    return this.http.get(url);

  }

  getAnimeRec() {
    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("limit", "7");
    const url = this.base_url + "recommendations/anime?" + params;
    return this.http.get(url);
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

  searchManga() {
    const url = this.base_url + "manga?";
    return this.http.get(url);

  }

  searchAnime(filter: { keyword: string, type: string, score: number, min_score: number, max_score: number, status: string, rating: string, sfw: boolean, genres: string[], genres_exclude: string[], order_by: string }, page: string, limit: string) {
    const params = new URLSearchParams();
    if (filter.keyword) {
      params.append("q", filter.keyword);
    }

    if (filter.type) {
      params.append("type", filter.type);
    }


    params.append("limit", limit);
    params.append("page", page);
    const url = this.base_url + "anime?" + params;
    return this.http.get(url);

  }

}
