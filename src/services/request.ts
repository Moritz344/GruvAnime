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

  searchManga(filter: { keyword: string, type: string, score: number, min_score: number, max_score: number, status: string, rating: string, sfw: boolean, genres: string[], genres_exclude: string[], order_by: string, sort: string }, page: string, limit: string) {
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
    params.append("page", page);
    const url = this.base_url + "manga?" + params;
    return this.http.get(url);

  }


  searchAnime(filter: { keyword: string, type: string, score: number, min_score: number, max_score: number, status: string, rating: string, sfw: boolean, genres: string[], genres_exclude: string[], order_by: string, sort: string }, page: string, limit: string) {
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
    params.append("page", page);
    const url = this.base_url + "anime?" + params;
    return this.http.get(url);

  }

}
