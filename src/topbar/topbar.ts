import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-topbar',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {

  searchValue: string = "";

  constructor(private router: Router) { }

  onSearch() {
    this.router.navigate(["search/anime"], { queryParams: { keyword: this.searchValue } });
  }

}
