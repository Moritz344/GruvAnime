import { Component, OnInit, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Request } from '../services/request';
import { Dropdown } from './dropdown/dropdown';
import { Topbar } from '../topbar/topbar';
import { AnimeBlock } from '../anime-block/anime-block';
import { Subject, debounceTime } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

// TODO: make changing filter search 

@Component({
  selector: 'app-search',
  imports: [RouterModule, CommonModule, FormsModule, Dropdown, Topbar, AnimeBlock],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit, AfterContentInit {

  searchFilter: { keyword: string, score: number, type: string, min_score: number, max_score: number, status: string, rating: string, sfw: boolean, genres: string[], genres_exclude: string[], order_by: string, sort: string } = { type: "", keyword: "", score: 0, min_score: 0, max_score: 0, status: "", rating: "", sfw: false, genres: [], genres_exclude: [], order_by: "", sort: "" };
  searchResult: any;
  lastSearchResult: any;

  searching: boolean = true;

  currentType: string = "";

  searchSubject = new Subject<void>;
  private searchCooldown = 300;

  statusManga: { name: string, value: string }[] = [{ name: "Publishing", value: "publishing" }, { name: "Complete", value: "complete" }, { name: "hiatus", value: "hiatus" }, { name: "Discontinued", value: "discontinued" }, { name: "Upcoming", value: "upcoming" }];

  types: { name: string, value: string }[] = [{ name: "Anime", value: "anime" }, { name: "Manga", value: "manga" }];
  status: { name: string, value: string }[] = [{ name: "Airing", value: "airing" }, { name: "Complete", value: "complete" }, { name: "Upcoming", value: "upcoming" }];
  ratings: { name: string, value: string }[] = [{ name: "G - All Ages", value: "g" }, { name: "PG- Children", value: "pg" }, { name: "PG-13 Teens 13 Or Older", value: "pg13" }, { name: "R - 17 (Violence & Profanity)", value: "r17" }, { name: "R+ - Mild Nudity", value: "r" }, { name: "Rx - Hentai", value: "rx" }];
  genres: { name: string, value: string }[] = [
    { name: "Action", value: "1" }, { name: "Adventure", value: "2" }, { name: "Avant Garde", value: "5" }, { name: "Award Winning", value: "46" },
    { name: "Boys Love", value: "28" }, { name: "Comedy", value: "4" }, { name: "Drama", value: "8" }, { name: "Fantasy", value: "10" },
    { name: "Girls Love", value: "26" }, { name: "Gourmet", value: "47" }, { name: "Horror", value: "14" }, { name: "Mystery", value: "7" },
    { name: "Romance", value: "22" }, { name: "Sci-Fi", value: "24" }, { name: "Slice of Life", value: "36" }, { name: "Sports", value: "30" },
    { name: "Supernatural", value: "37" }, { name: "Suspense", value: "41" }, { name: "Ecchi", value: "9" }, { name: "Erotica", value: "49" },
    { name: "Hentai", value: "12" }, { name: "Adult Cast", value: "50" }, { name: "Anthropomorphic", value: "51" }, { name: "CGDCT", value: "52" },
    { name: "Childcare", value: "53" }, { name: "Combat Sports", value: "54" }, { name: "Crossdressing", value: "81" }, { name: "Delinquents", value: "55" },
    { name: "Detective", value: "39" }, { name: "Educational", value: "56" }, { name: "Gag Humor", value: "57" }, { name: "Gore", value: "58" },
    { name: "Harem", value: "35" }, { name: "High Stakes Game", value: "59" }, { name: "Historical", value: "13" }, { name: "Idols (Female)", value: "60" },
    { name: "Idols (Male)", value: "61" }, { name: "Isekai", value: "62" }, { name: "Iyashikei", value: "63" }, { name: "Love Polygon", value: "64" },
    { name: "Magical Sex Shift", value: "65" }, { name: "Mahou Shoujo", value: "66" }, { name: "Martial Arts", value: "17" }, { name: "Mecha", value: "18" },
    { name: "Medical", value: "67" }, { name: "Military", value: "38" }, { name: "Music", value: "19" }, { name: "Mythology", value: "6" },
    { name: "Organized Crime", value: "68" }, { name: "Otaku Culture", value: "69" }, { name: "Parody", value: "20" }, { name: "Performing Arts", value: "70" },
    { name: "Pets", value: "71" }, { name: "Psychological", value: "40" }, { name: "Racing", value: "3" }, { name: "Reincarnation", value: "72" },
    { name: "Reverse Harem", value: "73" }, { name: "Love Status Quo", value: "74" }, { name: "Samurai", value: "21" }, { name: "School", value: "23" },
    { name: "Showbiz", value: "75" }, { name: "Space", value: "29" }, { name: "Strategy Game", value: "11" }, { name: "Super Power", value: "31" },
    { name: "Survival", value: "76" }, { name: "Team Sports", value: "77" }, { name: "Time Travel", value: "78" }, { name: "Vampire", value: "32" },
    { name: "Video Game", value: "79" }, { name: "Visual Arts", value: "80" }, { name: "Workplace", value: "48" }, { name: "Urban Fantasy", value: "82" },
    { name: "Villainess", value: "83" }, { name: "Josei", value: "43" }, { name: "Kids", value: "15" }, { name: "Seinen", value: "42" },
    { name: "Shoujo", value: "25" }, { name: "Shounen", value: "27" }
  ];
  excluded_genres: { name: string, value: string }[] = [
    { name: "Action", value: "1" }, { name: "Adventure", value: "2" }, { name: "Avant Garde", value: "5" }, { name: "Award Winning", value: "46" },
    { name: "Boys Love", value: "28" }, { name: "Comedy", value: "4" }, { name: "Drama", value: "8" }, { name: "Fantasy", value: "10" },
    { name: "Girls Love", value: "26" }, { name: "Gourmet", value: "47" }, { name: "Horror", value: "14" }, { name: "Mystery", value: "7" },
    { name: "Romance", value: "22" }, { name: "Sci-Fi", value: "24" }, { name: "Slice of Life", value: "36" }, { name: "Sports", value: "30" },
    { name: "Supernatural", value: "37" }, { name: "Suspense", value: "41" }, { name: "Ecchi", value: "9" }, { name: "Erotica", value: "49" },
    { name: "Hentai", value: "12" }, { name: "Adult Cast", value: "50" }, { name: "Anthropomorphic", value: "51" }, { name: "CGDCT", value: "52" },
    { name: "Childcare", value: "53" }, { name: "Combat Sports", value: "54" }, { name: "Crossdressing", value: "81" }, { name: "Delinquents", value: "55" },
    { name: "Detective", value: "39" }, { name: "Educational", value: "56" }, { name: "Gag Humor", value: "57" }, { name: "Gore", value: "58" },
    { name: "Harem", value: "35" }, { name: "High Stakes Game", value: "59" }, { name: "Historical", value: "13" }, { name: "Idols (Female)", value: "60" },
    { name: "Idols (Male)", value: "61" }, { name: "Isekai", value: "62" }, { name: "Iyashikei", value: "63" }, { name: "Love Polygon", value: "64" },
    { name: "Magical Sex Shift", value: "65" }, { name: "Mahou Shoujo", value: "66" }, { name: "Martial Arts", value: "17" }, { name: "Mecha", value: "18" },
    { name: "Medical", value: "67" }, { name: "Military", value: "38" }, { name: "Music", value: "19" }, { name: "Mythology", value: "6" },
    { name: "Organized Crime", value: "68" }, { name: "Otaku Culture", value: "69" }, { name: "Parody", value: "20" }, { name: "Performing Arts", value: "70" },
    { name: "Pets", value: "71" }, { name: "Psychological", value: "40" }, { name: "Racing", value: "3" }, { name: "Reincarnation", value: "72" },
    { name: "Reverse Harem", value: "73" }, { name: "Love Status Quo", value: "74" }, { name: "Samurai", value: "21" }, { name: "School", value: "23" },
    { name: "Showbiz", value: "75" }, { name: "Space", value: "29" }, { name: "Strategy Game", value: "11" }, { name: "Super Power", value: "31" },
    { name: "Survival", value: "76" }, { name: "Team Sports", value: "77" }, { name: "Time Travel", value: "78" }, { name: "Vampire", value: "32" },
    { name: "Video Game", value: "79" }, { name: "Visual Arts", value: "80" }, { name: "Workplace", value: "48" }, { name: "Urban Fantasy", value: "82" },
    { name: "Villainess", value: "83" }, { name: "Josei", value: "43" }, { name: "Kids", value: "15" }, { name: "Seinen", value: "42" },
    { name: "Shoujo", value: "25" }, { name: "Shounen", value: "27" }
  ];
  order_by: { name: string, value: string }[] = [{ name: "Title", value: "title" }, { name: "Start Date", value: "start_date" }, { name: "End Date", value: "end_date" }, { name: "Episodes", value: "episodes" }, { name: "Score", value: "score" }, { name: "Scored By", value: "scored_by" }, { name: "Rank", value: "rank" }, { name: "Popularity", value: "popularity" }];
  order_by_manga: { name: string, value: string }[] = [{ name: "Title", value: "title" }, { name: "Start Date", value: "start_date" }, { name: "End Date", value: "end_date" }, { name: "Score", value: "score" }, { name: "Scored By", value: "scored_by" }, { name: "Rank", value: "rank" }, { name: "Popularity", value: "popularity" }, { name: "Members", value: "members" }, { name: "Favourites", value: "favourties" }, { name: "Chapters", value: "chapters" }, { name: "Volumes", value: "volumes" }];
  sort: { name: string, value: string }[] = [{ name: "Descending", value: "desc" }, { name: "Ascending", value: "asc" }];

  currentPage: number = 1;
  searchLimit: string = "24";
  paginationData: any;
  isMobile: boolean = false;


  constructor(private route: ActivatedRoute, private api: Request, private cdr: ChangeDetectorRef, private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
    this.searchSubject.pipe(
      debounceTime(this.searchCooldown)
    ).subscribe(() => {
      this.performSearch();
    });
  }

  initRoutes() {
    let keyword = "";
    this.route.params.subscribe(params => {
      this.currentType = params['type'];
    });
    this.route.queryParams.subscribe(params => {
      keyword = params['keyword'];
    });


    this.searchFilter.keyword = keyword;
    console.log(this.searchFilter);

  }

  onSetType(item: any) {
    this.currentType = item.item;
    this.performSearch();
  }

  onFilter(element: { item: string, title: string }) {

    if (element.title == "Rating") {
      this.searchFilter.rating = element.item;
    }

    if (element.title == "Genres") {
      this.searchFilter.genres.push(element.item);
    }

    if (element.title == "Status") {
      this.searchFilter.status = element.item;
    }

    if (element.title == "Excluded Genres") {
      this.searchFilter.genres_exclude.push(element.item);
    }

    if (element.title == "Order By") {
      this.searchFilter.order_by = element.item;
    }

    if (element.title == "Sort") {
      this.searchFilter.sort = element.item;
    }


    console.log(element);
    console.log(this.searchFilter);
  }

  onReset(header: string) {
    if (header == "Genres") {
      this.searchFilter.genres = [];
    } else if (header == "Excluded Genres") {
      this.searchFilter.genres_exclude = [];
    } else if (header == "Rating") {
      this.searchFilter.rating = "";
    } else if (header == "Status") {
      this.searchFilter.status = "";
    } else if (header == "Order By") {
      this.searchFilter.order_by = "";
    } else if (header == "Min Score") {
      this.searchFilter.min_score = 0;
    } else if (header == "Max Score") {
      this.searchFilter.max_score = 0;
    } else if (header == "SFW") {
      this.searchFilter.sfw = false;
    } else if (header == "Sort") {
      this.searchFilter.sort = "";
    }
    this.cdr.detectChanges();
    console.log(this.searchFilter);
  }

  onResetFilter() {
    this.searchFilter = {
      type: "",
      keyword: this.searchFilter.keyword,
      score: 0,
      min_score: 0,
      max_score: 0,
      status: "",
      rating: "",
      sfw: false,
      genres: [],
      genres_exclude: [],
      order_by: "",
      sort: ""
    };
    console.log(this.searchFilter);
  }

  onNextPage() {
    if (this.paginationData.last_visible_page > this.currentPage) {
      this.currentPage += 1;
      this.search();
      this.cdr.detectChanges();
      console.log(this.currentPage);
    }
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.search();
      this.cdr.detectChanges();
    }
  }

  checkPage() {
    if (this.currentPage > this.paginationData.last_visible_page) {
      this.currentPage = 1;
      this.search();
    }
  }

  search() {
    this.searching = true;
    this.searchSubject.next();
  }

  performSearch() {
    this.searching = true;
    console.log("searching");
    if (this.currentType == "anime") {
      this.api.searchAnime(this.searchFilter, this.currentPage.toString(), this.searchLimit).subscribe((response: any) => {
        this.searchResult = response.data;
        this.searching = false;
        console.log(this.searchResult);
        console.log("not searching");
        this.paginationData = response.pagination;
        this.checkPage();
        console.log(this.paginationData);
        this.cdr.detectChanges();
      });
    } else if (this.currentType == "manga") {
      this.searchResult.length = 0;
      console.log("type: manga");
      this.api.searchManga(this.searchFilter, this.currentPage.toString(), this.searchLimit).subscribe((response: any) => {
        this.searchResult = response.data;
        this.searching = false;
        this.paginationData = response.pagination;
        this.checkPage();
        this.cdr.detectChanges();
        console.log(response);
      });
    }
  }

  ngOnInit() {
  }
  ngAfterContentInit() {
    this.initRoutes();
    this.performSearch();
  }
}
