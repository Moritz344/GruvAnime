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

  getTopAnime(type: string, filter: string) {
    const params = new URLSearchParams();

    params.append("filter", filter);
    params.append("limit", "8");

    const url = this.base_url + "top/anime?" + params;

    return this.http.get(url);

  }

  getAnimeRec() {
    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("limit", "7");
    const url = this.base_url + "recommendations/anime?" + params;
    return this.http.get(url);
  }

}
