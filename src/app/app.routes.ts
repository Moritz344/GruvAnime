import { Routes } from '@angular/router';
import { Home } from '../home/home';
import { Details } from '../details/details';
import { Search } from '../search/search';

export const routes: Routes = [
  { path: "", component: Home },
  { path: "search/:type", component: Search },
  { path: "manga/:id", component: Details },
  { path: "anime/:id", component: Details },
];
