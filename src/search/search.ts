import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Request } from '../services/request';
import { Dropdown } from './dropdown/dropdown';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-search',
  imports: [RouterModule, CommonModule, FormsModule, Dropdown, Topbar],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {

  searchFilter: { keyword: string, type: string, score: number, min_score: number, max_score: number, status: string, rating: string, sfw: boolean, genres: string[], genres_exclude: string[], order_by: string } = { keyword: "", type: "", score: 0, min_score: 0, max_score: 0, status: "", rating: "", sfw: false, genres: [], genres_exclude: [], order_by: "" };

  types: string[] = ["Anime", "Manga"];
  status: string[] = ["Airing", "Complete", "Upcoming"];
  rating: string[] = ["G - All Ages", "PG- Children", "PG-13 Teens 13 Or Older", "R - 17 (Violence & Profanity)", "R+ - Mild Nudity", "Rx - Hentai"];
  genres: string[] = ["Action", "Adventure", "Avant Garde", "Award Winning"];
  exclude_genres: string[] = ["Action", "Adventure", "Avant Garde", "Award Winning"];
  order_by: string[] = ["Title", "Start Date", "End Date", "Episodes", "Score", "Scored By", "Rank", "Popularity"];
  sort: string[] = ["Descending", "Ascending"];

  // TODO: make own dropdown component

  constructor(private route: ActivatedRoute, private api: Request) { }

  initRoutes() {
    let type = "";
    let keyword = "";
    this.route.params.subscribe(params => {
      type = params['type'];
    });
    this.route.queryParams.subscribe(params => {
      keyword = params['keyword'];
    });

    this.searchFilter.keyword = keyword;
    this.searchFilter.type = type;
    console.log(this.searchFilter);

  }

  onFilter(element: { item: string, title: string }) {
    if (element.title == "Types") {
      this.searchFilter.type = element.item;
    }

    if (element.title == "Rating") {
      this.searchFilter.rating = element.item;
    }
    console.log(element);
    console.log(this.searchFilter);
  }

  search() {
    if (this.searchFilter.type == "anime") {
      this.api.searchAnime(this.searchFilter, "1", "10").subscribe((response: any) => {

      });
    } else if (this.searchFilter.type == "manga") {
      this.api.searchManga().subscribe((response: any) => {
        console.log(response);
      });
    }
  }

  ngOnInit() {
    this.initRoutes();
  }

}
