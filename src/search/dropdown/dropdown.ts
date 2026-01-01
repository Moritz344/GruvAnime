import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
})
export class Dropdown {
  @Input() header: string = "";
  @Input() data: string[] = [];
  @Output() dropdownSelected = new EventEmitter<{ item: string, title: string }>;

  selected: string = "";

  expand: boolean = false;

  constructor() { }

  onExpand() {
    this.expand = !this.expand;
  }

  setSelected(item: string) {
    this.selected = item;
    this.dropdownSelected.emit({ item: item, title: this.header });
    this.expand = false;
  }

}
