import { Routes } from '@angular/router';
import { Home } from '../home/home';
import { Details } from '../details/details';
import { Search } from '../search/search';
import { Anime } from '../anime/anime';
import { Manga } from '../manga/manga';

export const routes: Routes = [
  { path: "", component: Home },
  { path: "search/:type", component: Search },
  { path: "manga/:id", component: Details },
  { path: "anime/:id", component: Details },
  { path: "anime", component: Anime },
  { path: "manga", component: Manga },
];
