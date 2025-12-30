import { Routes } from '@angular/router';
import { Home } from '../home/home';
import { Manga } from '../manga/manga';
import { Anime } from '../anime/anime';

export const routes: Routes = [
  { path: "", component: Home },
  { path: "anime", component: Anime },
  { path: "manga", component: Manga }
];
