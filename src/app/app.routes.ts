import { Routes } from '@angular/router';
import { Home } from '../home/home';
import { Details } from '../details/details';
import { Search } from '../search/search';
import { Anime } from '../anime/anime';
import { Calendar } from '../calendar/calendar';
import { NotFound } from '../notfound/notfound';

export const routes: Routes = [
  { path: "", component: Home },
  { path: "search/:type", component: Search },

  { path: "anime/airing", component: Anime },
  { path: "anime/upcoming", component: Anime },
  { path: "anime/trending", component: Anime },

  { path: "manga/complete", component: Anime },
  { path: "manga/upcoming", component: Anime },
  { path: "manga/trending", component: Anime },

  { path: "manga/:id", component: Details },
  { path: "anime/:id", component: Details },

  { path: "calendar", component: Calendar },

  { path: '**', component: NotFound }

];
