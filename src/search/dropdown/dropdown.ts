import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
})
export class Dropdown implements OnInit {
  @Input() header: string = "";
  @Input() multipleSelectable: boolean = false;
  @Input() data: { name: string, value: string }[] = [{ name: "", value: "" }];
  @Output() dropdownSelected = new EventEmitter<{ item: string, title: string }>();
  @Output() reset = new EventEmitter<any>();

  selected: string[] = [];
  selectedNormal: string = "";

  expand: boolean = false;

  constructor() { }

  onReset(type: any) {
    if (type == "normal") {
      this.selectedNormal = "";
      this.reset.emit(this.header);
    } else {
      this.selected.length = 0;
      this.reset.emit(this.header);
    }
  }

  onExpand() {
    this.expand = !this.expand;
  }

  setSelected(item: { name: string, value: string }) {
    if (this.multipleSelectable) {
      this.selected.push(item.name);
    } else {
      this.selectedNormal = item.name;
    }
    console.log(item);
    this.dropdownSelected.emit({ item: item.value, title: this.header });
    this.expand = false;
  }

  ngOnInit() { }

}
