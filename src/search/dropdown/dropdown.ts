import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dropdown',
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
})
export class Dropdown implements OnInit, OnChanges {
  @Input() header: string = "";
  @Input() model: any;
  @Input() multipleSelectable: boolean = false;
  @Input() data: { name: string, value: string }[] = [{ name: "", value: "" }];
  @Output() dropdownSelected = new EventEmitter<{ item: string, title: string }>();
  @Output() reset = new EventEmitter<any>();
  @Output() modelChange = new EventEmitter<any>();
  @Input() default: string = "";

  selected: string[] = [];
  selectedNormal: string = "";

  expand: boolean = false;

  constructor(private cdr: ChangeDetectorRef) { }

  onReset(type: any) {
    if (type == "normal") {
      this.selectedNormal = "";
      this.model = "";
      this.modelChange.emit("");
      this.reset.emit(this.header);
    } else {
      this.selected.length = 0;
      this.model = [];
      this.modelChange.emit([]);
      this.reset.emit(this.header);
    }
  }

  initDefault() {
    this.selectedNormal = this.default;
  }

  onExpand() {
    this.expand = !this.expand;
  }

  setModel() {
    if (this.model && this.data && !this.multipleSelectable) {
      let modelValue = this.model;
      if (typeof this.model === 'object' && this.model.value) {
        modelValue = this.model.value;
      }
      const foundItem: any = this.data.find(item => item.value === modelValue);
      this.selectedNormal = foundItem ? foundItem.name : (modelValue || this.default);
    } else if (this.model && this.data && this.multipleSelectable && Array.isArray(this.model)) {
      this.selected = this.model.map(value => {
        const foundItem = this.data.find(item => item.value === value);
        return foundItem ? foundItem.name : value;
      });
    }
  }

  ngOnChanges() {
    this.setModel();
  }

  setSelected(item: { name: string, value: string }) {
    if (this.multipleSelectable) {
      this.selected.push(item.name);
      if (!this.model) this.model = [];
      this.model.push(item.value);
      this.modelChange.emit(this.model);
      this.dropdownSelected.emit({ item: item.value, title: item.name })
    } else {
      this.selectedNormal = item.name;
      this.model = { name: item.name, value: item.value };
      this.modelChange.emit(this.model.value);
      this.dropdownSelected.emit({ item: item.value, title: item.name })
    }
    this.expand = false;
  }

  ngOnInit() {
    this.setModel();
  }

  ngAfterContentInit() {
    this.initDefault();
  }

}
