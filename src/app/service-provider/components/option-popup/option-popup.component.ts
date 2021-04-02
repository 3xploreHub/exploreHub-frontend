import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-option-popup',
  templateUrl: './option-popup.component.html',
  styleUrls: ['./option-popup.component.scss'],
})
export class OptionPopupComponent implements OnInit {
  @Input() show: boolean = false;
  @Output() clickOpt: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  clickOption(e, type) {
    e.stopPropagation()
    setTimeout(() => {
      
      if (type == "delete") {
        this.clickOpt.emit("delete")
      }
      else if (type == "edit") {
        this.clickOpt.emit("edit")
      }else {
        this.show = false
        this.clickOpt.emit("close")
      }
    }, 100);
  }

  clickBox(e) {
    e.stopPropagation();
    this.clickOpt.emit("close")
    this.show = false;
  }

}
