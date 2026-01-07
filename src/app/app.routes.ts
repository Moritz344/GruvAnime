import { Routes } from '@angular/router';
import { Home } from '../home/home';
import { Details } from '../details/details';
import { Search } from '../search/search';
import { Anime } from '../anime/anime';
import { Manga } from '../manga/manga';

export const routes: Routes = [
  { path: "", component: Home },
  { path: "search/:type", component: Search },

  { path: "anime/airing", component: Anime },
  { path: "anime/upcoming", component: Anime },
  { path: "anime/trending", component: Anime },

  { path: "manga/complete", component: Manga },
  { path: "manga/upcoming", component: Manga },
  { path: "manga/trending", component: Manga },

  { path: "manga/:id", component: Details },
  { path: "anime/:id", component: Details },

];
